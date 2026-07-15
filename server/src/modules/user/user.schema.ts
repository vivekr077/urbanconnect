import { z } from 'zod';
import { Gender, ActivityType, SkillLevel } from '../../generated/prisma/client.js';

export const UpdateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters long').optional(),
    bio: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
    profileImageUrl: z.string().url('Invalid profile image URL').optional(),
    gender: z.nativeEnum(Gender).optional(),
    dateOfBirth: z.preprocess((val) => {
      if (typeof val === 'string' && val.trim() !== '') {
        return new Date(val);
      }
      return val;
    }, z.date().optional()),
    homeCity: z.string().trim().min(1, 'Home city cannot be empty').optional(),
    homeState: z.string().trim().optional(),
    homeCountry: z.string().trim().min(1, 'Home country cannot be empty').optional(),
  }),
});

export const UpdateLocationSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  }),
});

export const UpdateSportsSchema = z.object({
  body: z.object({
    sports: z.array(
      z.object({
        activityType: z.nativeEnum(ActivityType),
        skillLevel: z.nativeEnum(SkillLevel),
      })
    ),
  }),
});
