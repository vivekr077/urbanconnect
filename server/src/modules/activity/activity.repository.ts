import prisma from '../../lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import { v4 as uuidv4 } from 'uuid';
import type { CreateActivityInput, UpdateActivityInput } from './activity.types.js';

export class ActivityRepository {
  /**
   * Creates an activity and registers the organizer inside a transaction.
   * @param organizerId User UUID of the organizer
   * @param data Validated create input data
   */
  public async create(organizerId: string, data: CreateActivityInput): Promise<string> {
    const activityId = uuidv4();

    await prisma.$transaction(async (tx) => {
      // 1. Insert activity using raw insert because location is Unsupported geog point
      await tx.$executeRaw`
        INSERT INTO "Activity" (
          id, title, description, "activityType", "venueName", "venueAddress",
          location, "startsAt", "endsAt", "maxParticipants", status,
          "minimumSkillLevel", notes, "isPrivate", "joinApprovalRequired",
          "organizerId", "createdAt", "updatedAt"
        ) VALUES (
          ${activityId}::uuid,
          ${data.title},
          ${data.description ?? null},
          ${data.activityType}::"ActivityType",
          ${data.venueName},
          ${data.venueAddress ?? null},
          ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)::geography,
          ${new Date(data.startsAt)}::timestamp,
          ${new Date(data.endsAt)}::timestamp,
          ${data.maxParticipants}::integer,
          'OPEN'::"ActivityStatus",
          ${data.minimumSkillLevel ?? null}::"SkillLevel",
          ${data.notes ?? null},
          ${data.isPrivate ?? false}::boolean,
          ${data.joinApprovalRequired ?? true}::boolean,
          ${organizerId}::uuid,
          NOW(),
          NOW()
        )
      `;

      // 2. Insert organizer as the first accepted participant
      await tx.activityParticipant.create({
        data: {
          activityId,
          userId: organizerId,
          role: 'ORGANIZER',
          status: 'ACCEPTED',
        },
      });
    });

    return activityId;
  }

  /**
   * Finds an active activity by ID.
   * @param id Activity UUID
   */
  public async findById(id: string) {
    return prisma.activity.findFirst({
      where: {
        id,
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
  }

  /**
   * Fetches coordinate parameters from PostGIS for a specific activity.
   * @param id Activity UUID
   */
  public async getActivityLocation(id: string): Promise<{ latitude: number; longitude: number } | null> {
    const result = await prisma.$queryRaw<{ latitude: number; longitude: number }[]>`
      SELECT ST_Y("location"::geometry) as latitude, ST_X("location"::geometry) as longitude
      FROM "Activity"
      WHERE id = ${id}::uuid
    `;
    return result[0] || null;
  }

  /**
   * Fetches multiple activities matching search parameters and filters.
   */
  public async findMany(params: {
    where: Prisma.ActivityWhereInput;
    orderBy: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[];
    skip: number;
    take: number;
  }) {
    return prisma.activity.findMany({
      where: {
        ...params.where,
        deletedAt: null,
      },
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
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
  }

  /**
   * Returns count of activities matching filters.
   */
  public async countMany(where: Prisma.ActivityWhereInput): Promise<number> {
    return prisma.activity.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  /**
   * Updates coordinates and/or prisma fields for an activity.
   */
  public async update(id: string, data: Partial<UpdateActivityInput>): Promise<void> {
    const { latitude, longitude, ...prismaData } = data;

    await prisma.$transaction(async (tx) => {
      if (Object.keys(prismaData).length > 0) {
        await tx.activity.update({
          where: { id },
          data: prismaData,
        });
      }

      if (latitude !== undefined && longitude !== undefined) {
        await tx.$executeRaw`
          UPDATE "Activity"
          SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
              "updatedAt" = NOW()
          WHERE id = ${id}::uuid
        `;
      }
    });
  }

  /**
   * Soft deletes an activity by setting deletedAt.
   */
  public async softDelete(id: string): Promise<void> {
    await prisma.activity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Finds all participants for an activity.
   * @param activityId Activity UUID
   */
  public async findParticipants(activityId: string) {
    return prisma.activityParticipant.findMany({
      where: { activityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'asc',
      },
    });
  }

  /**
   * Retrieves active activity IDs and calculated distances within radius limit.
   */
  public async findNearby(
    latitude: number,
    longitude: number,
    radiusInMeters: number
  ): Promise<{ id: string; latitude: number; longitude: number; distance: number }[]> {
    return prisma.$queryRaw<{ id: string; latitude: number; longitude: number; distance: number }[]>`
      SELECT
        id,
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude,
        ST_Distance(location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) as distance
      FROM "Activity"
      WHERE "deletedAt" IS NULL
        AND ST_DWithin(location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${radiusInMeters})
      ORDER BY distance ASC
    `;
  }
}

export const activityRepository = new ActivityRepository();
export default activityRepository;
