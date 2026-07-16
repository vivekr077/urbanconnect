import { z } from 'zod';

export const ActivityIdParamSchema = z.object({
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
  }),
});

export const ParticipantManageParamSchema = z.object({
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
    participantId: z.string().uuid('Invalid participant ID format'),
  }),
});
