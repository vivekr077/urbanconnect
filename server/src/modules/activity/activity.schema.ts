import { z } from 'zod';
import { ActivityType, SkillLevel, ActivityStatus } from '../../generated/prisma/client.js';

export const ActivityIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid activity ID format'),
  }),
});

export const CreateActivitySchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters long'),
    description: z.string().trim().optional(),
    activityType: z.nativeEnum(ActivityType, { message: 'Invalid activity type' }),
    venueName: z.string().trim().min(2, 'Venue name must be at least 2 characters long'),
    venueAddress: z.string().trim().optional(),
    latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO datetime string' }),
    endsAt: z.string().datetime({ message: 'endsAt must be a valid ISO datetime string' }),
    maxParticipants: z.number().int().min(2, 'Maximum participants must be at least 2'),
    minimumSkillLevel: z.nativeEnum(SkillLevel).optional(),
    notes: z.string().trim().optional(),
    isPrivate: z.boolean().optional(),
    joinApprovalRequired: z.boolean().optional(),
  }),
});

export const UpdateActivitySchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters long').optional(),
    description: z.string().trim().optional(),
    activityType: z.nativeEnum(ActivityType).optional(),
    venueName: z.string().trim().min(2, 'Venue name must be at least 2 characters long').optional(),
    venueAddress: z.string().trim().optional(),
    latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional(),
    longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional(),
    startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO datetime string' }).optional(),
    endsAt: z.string().datetime({ message: 'endsAt must be a valid ISO datetime string' }).optional(),
    maxParticipants: z.number().int().min(2, 'Maximum participants must be at least 2').optional(),
    minimumSkillLevel: z.nativeEnum(SkillLevel).optional(),
    notes: z.string().trim().optional(),
    isPrivate: z.boolean().optional(),
    joinApprovalRequired: z.boolean().optional(),
  }),
});

export const ListActivitiesSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().min(1).optional()),
    limit: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().min(1).optional()),
    activityType: z.nativeEnum(ActivityType).optional(),
    status: z.nativeEnum(ActivityStatus).optional(),
    minimumSkillLevel: z.nativeEnum(SkillLevel).optional(),
    city: z.string().trim().optional(),
    date: z.string().trim().optional(),
    organizerId: z.string().uuid('Invalid organizer ID format').optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(['newest', 'startsSoon', 'nearest']).optional(),
    latitude: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-90).max(90).optional()),
    longitude: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-180).max(180).optional()),
  }),
});

export const NearbyActivitySchema = z.object({
  query: z.object({
    latitude: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional()),
    lat: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional()),
    longitude: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional()),
    lng: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional()),
    radius: z.preprocess(
      (val) => (val === undefined ? 5000 : Number(val)),
      z.number().min(0, 'Radius must be non-negative').max(50000, 'Radius cannot exceed 50,000 meters (50 km)')
    ).optional(),
  }).refine((data) => {
    return (data.latitude !== undefined || data.lat !== undefined) &&
           (data.longitude !== undefined || data.lng !== undefined);
  }, {
    message: 'Latitude and Longitude (or lat and lng) are required parameters',
    path: ['latitude'],
  }),
});
