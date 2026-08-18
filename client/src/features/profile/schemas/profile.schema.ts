import * as z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional().or(z.literal('')),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  homeCity: z.string().min(1, 'Home city is required'),
  homeState: z.string().optional().or(z.literal('')),
  homeCountry: z.string().min(1, 'Home country is required'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
