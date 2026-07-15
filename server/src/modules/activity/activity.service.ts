import prisma from '../../lib/prisma.js';
import { activityRepository } from './activity.repository.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../errors/customErrors.js';
import { ErrorMessages } from '../../constants/messages.js';
import { Prisma, ActivityStatus } from '../../generated/prisma/client.js';
import type {
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilterQuery,
  ActivityResponse,
} from './activity.types.js';

export class ActivityService {
  /**
   * Helper to map raw database activity and location into ActivityResponse DTO.
   */
  private mapToResponse(
    activity: any,
    location: { latitude: number; longitude: number } | null,
    distanceInMeters?: number
  ): ActivityResponse {
    const participantCount = activity.participants.length;
    const remainingSlots = Math.max(0, activity.maxParticipants - participantCount);

    let distanceStr: string | undefined;
    if (distanceInMeters !== undefined) {
      if (distanceInMeters < 1000) {
        distanceStr = `${Math.round(distanceInMeters)} m`;
      } else {
        distanceStr = `${(distanceInMeters / 1000).toFixed(1)} km`;
      }
    }

    const response: ActivityResponse = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      activityType: activity.activityType,
      venueName: activity.venueName,
      venueAddress: activity.venueAddress,
      location: {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
      },
      startsAt: activity.startsAt,
      endsAt: activity.endsAt,
      maxParticipants: activity.maxParticipants,
      status: activity.status,
      minimumSkillLevel: activity.minimumSkillLevel,
      notes: activity.notes,
      isPrivate: activity.isPrivate,
      joinApprovalRequired: activity.joinApprovalRequired,
      organizer: {
        id: activity.organizer.id,
        name: activity.organizer.name,
        profileImageUrl: activity.organizer.profileImageUrl,
      },
      participantCount,
      remainingSlots,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };

    if (distanceStr !== undefined) {
      response.distance = distanceStr;
    }

    return response;
  }

  /**
   * Business validation for dates and participants constraints.
   */
  private validateActivityDates(startsAtStr: string, endsAtStr: string) {
    const startsAt = new Date(startsAtStr);
    const endsAt = new Date(endsAtStr);
    const now = new Date();

    if (startsAt <= now) {
      throw new BadRequestError('Activity startsAt date must be in the future');
    }

    if (startsAt >= endsAt) {
      throw new BadRequestError('Activity startsAt date must be before endsAt date');
    }
  }

  /**
   * Creates an activity inside transaction and returns response DTO.
   */
  public async createActivity(organizerId: string, data: CreateActivityInput): Promise<ActivityResponse> {
    // 1. Business validations
    this.validateActivityDates(data.startsAt, data.endsAt);

    if (data.maxParticipants < 2) {
      throw new BadRequestError('Maximum participants must be at least 2');
    }

    // 2. Perform transactional database insertion
    const activityId = await activityRepository.create(organizerId, data);

    // 3. Return full sanitized DTO profile
    return this.getActivityDetails(activityId);
  }

  /**
   * Retrieves detail object for specific activity.
   */
  public async getActivityDetails(id: string): Promise<ActivityResponse> {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }

    const location = await activityRepository.getActivityLocation(id);
    return this.mapToResponse(activity, location);
  }

  /**
   * Lists all activities with filtering and pagination.
   */
  public async listActivities(filters: ActivityFilterQuery) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = { deletedAt: null };

    if (filters.activityType) {
      where.activityType = filters.activityType;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.minimumSkillLevel) {
      where.minimumSkillLevel = filters.minimumSkillLevel;
    }
    if (filters.organizerId) {
      where.organizerId = filters.organizerId;
    }

    if (filters.city) {
      const cityFilter = { contains: filters.city, mode: 'insensitive' as Prisma.QueryMode };
      where.OR = [
        { venueName: cityFilter },
        { venueAddress: cityFilter },
      ];
    }

    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode };
      where.OR = [
        ...(where.OR || []),
        { title: searchFilter },
        { venueName: searchFilter },
      ];
    }

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.startsAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    let orderBy: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[] = { startsAt: 'asc' }; // Default is startsSoon (startsAt ASC)
    if (filters.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (filters.sortBy === 'startsSoon') {
      orderBy = { startsAt: 'asc' };
    }

    // Retrieve lists
    const activities = await activityRepository.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await activityRepository.countMany(where);
    const totalPages = Math.ceil(total / limit);

    // Map elements in list including PostGIS coordinates fetch
    const data = await Promise.all(
      activities.map(async (activity) => {
        const location = await activityRepository.getActivityLocation(activity.id);
        return this.mapToResponse(activity, location);
      })
    );

    // If sorting by nearest and user coordinates are available
    if (filters.sortBy === 'nearest' && filters.latitude !== undefined && filters.longitude !== undefined) {
      // Typically, nearest sorting is done via nearby search API. However, if requested here, sort list in memory:
      const lat = Number(filters.latitude);
      const lng = Number(filters.longitude);
      // Rough sort based on Euclidean distance for small page results
      data.sort((a, b) => {
        const distA = Math.pow(a.location.latitude - lat, 2) + Math.pow(a.location.longitude - lng, 2);
        const distB = Math.pow(b.location.latitude - lat, 2) + Math.pow(b.location.longitude - lng, 2);
        return distA - distB;
      });
    }

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Updates activity details, validating organizer rights.
   */
  public async updateActivity(userId: string, id: string, data: UpdateActivityInput): Promise<ActivityResponse> {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }

    if (activity.organizerId !== userId) {
      throw new ForbiddenError('Only the activity organizer can update this activity');
    }

    // Validate dates if they are being updated
    const finalStartsAt = data.startsAt ?? activity.startsAt.toISOString();
    const finalEndsAt = data.endsAt ?? activity.endsAt.toISOString();
    if (data.startsAt || data.endsAt) {
      this.validateActivityDates(finalStartsAt, finalEndsAt);
    }

    if (data.maxParticipants !== undefined && data.maxParticipants < 2) {
      throw new BadRequestError('Maximum participants must be at least 2');
    }

    await activityRepository.update(id, data);
    return this.getActivityDetails(id);
  }

  /**
   * Soft deletes activity, validating organizer rights.
   */
  public async deleteActivity(userId: string, id: string): Promise<void> {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }

    if (activity.organizerId !== userId) {
      throw new ForbiddenError('Only the activity organizer can delete this activity');
    }

    await activityRepository.softDelete(id);
  }

  /**
   * Nearby activity finder using PostGIS ST_Distance calculation.
   */
  public async getNearbyActivities(
    latitude: number,
    longitude: number,
    radiusInMeters = 5000
  ): Promise<ActivityResponse[]> {
    // 1. Cap radius to 50 km max to limit load
    const actualRadius = Math.min(radiusInMeters, 50000);

    // 2. Perform raw distance lookup
    const nearbyResults = await activityRepository.findNearby(latitude, longitude, actualRadius);
    if (nearbyResults.length === 0) {
      return [];
    }

    // 3. Extract IDs and query full relations using Prisma
    const ids = nearbyResults.map((r) => r.id);
    const activities = await prisma.activity.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        participants: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            id: true,
            userId: true,
            role: true,
            status: true,
          },
        },
      },
    });

    // 4. Map back elements, attaching calculated distance, and maintaining distance sort order
    const mapped = activities.map((activity) => {
      const match = nearbyResults.find((r) => r.id === activity.id);
      const distance = match ? match.distance : undefined;
      const coords = match ? { latitude: match.latitude, longitude: match.longitude } : null;
      return this.mapToResponse(activity, coords, distance);
    });

    // Sort matching order of nearbyResults
    return mapped.sort((a, b) => {
      const indexA = ids.indexOf(a.id);
      const indexB = ids.indexOf(b.id);
      return indexA - indexB;
    });
  }

  /**
   * Retrieves all participants of an activity.
   * @param activityId Activity UUID
   */
  public async getActivityParticipants(activityId: string) {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }

    const participants = await activityRepository.findParticipants(activityId);
    return participants.map((p) => ({
      id: p.id,
      role: p.role,
      status: p.status,
      requestedAt: p.requestedAt,
      approvedAt: p.approvedAt,
      user: {
        id: p.user.id,
        name: p.user.name,
        profileImageUrl: p.user.profileImageUrl,
      },
    }));
  }
}

export const activityService = new ActivityService();
export default activityService;
