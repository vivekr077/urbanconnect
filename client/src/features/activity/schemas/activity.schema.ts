import { z } from 'zod';

export const activityFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long'),
  description: z.string().trim().optional(),
  activityType: z.enum([
    'BADMINTON',
    'CRICKET',
    'FOOTBALL',
    'VOLLEYBALL',
    'TENNIS',
    'RUNNING',
    'CYCLING',
    'TREKKING',
    'CAB_SHARE',
    'OTHER',
  ]),
  venueName: z.string().trim().min(2, 'Venue name must be at least 2 characters long'),
  venueAddress: z.string().trim().optional(),
  latitude: z.coerce.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.coerce.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  startsAt: z.string().min(1, 'Start date and time is required'),
  endsAt: z.string().min(1, 'End date and time is required'),
  maxParticipants: z.coerce.number().int().min(2, 'Maximum participants must be at least 2'),
  minimumSkillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']).optional(),
  notes: z.string().trim().optional(),
  isPrivate: z.boolean().default(false),
  joinApprovalRequired: z.boolean().default(false),
}).refine((data) => {
  const start = new Date(data.startsAt);
  const end = new Date(data.endsAt);
  return start < end;
}, {
  message: 'End date and time must be after the start date and time',
  path: ['endsAt'],
}).refine((data) => {
  const start = new Date(data.startsAt);
  return start > new Date();
}, {
  message: 'Start date and time must be in the future',
  path: ['startsAt'],
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
