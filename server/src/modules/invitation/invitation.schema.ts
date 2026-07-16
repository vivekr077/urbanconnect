import { z } from 'zod';

export const SendInvitationSchema = z.object({
  body: z.object({
    invitedUserId: z.string().uuid('Invalid invited user ID format'),
    message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
    expiresAt: z.string().datetime({ message: 'Invalid expiry date format' }).optional(),
  }),
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
  }),
});

export const InvitationIdParamSchema = z.object({
  params: z.object({
    invitationId: z.string().uuid('Invalid invitation ID format'),
  }),
});

export const ActivityIdParamSchema = z.object({
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
  }),
});
