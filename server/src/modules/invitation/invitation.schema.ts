import { z } from 'zod';
import { InvitationStatus } from '../../generated/prisma/client.js';

export const SendInvitationSchema = z.object({
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
  }),
  body: z.object({
    invitedUserId: z.string().uuid('Invalid user ID format').optional().nullable(),
    email: z.string().email('Invalid email address format').optional().nullable(),
    message: z.string().max(300, 'Message cannot exceed 300 characters').optional().nullable(),
    expiresAt: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().min(new Date(), 'Expiration date must be in the future').optional().nullable()
    ).optional().nullable(),
  }).refine((data) => data.invitedUserId || data.email, {
    message: 'Either email or invitedUserId must be provided',
    path: ['email'],
  }),
});

export const GetActivityInvitationsSchema = z.object({
  params: z.object({
    activityId: z.string().uuid('Invalid activity ID format'),
  }),
});

export const InvitationIdParamSchema = z.object({
  params: z.object({
    invitationId: z.string().uuid('Invalid invitation ID format'),
  }),
});

export const ListReceivedInvitationsSchema = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (val === undefined ? 1 : Number(val)),
      z.number().int().positive('Page number must be positive').optional()
    ).optional(),
    limit: z.preprocess(
      (val) => (val === undefined ? 20 : Number(val)),
      z.number().int().positive('Limit must be positive').optional()
    ).optional(),
    status: z.nativeEnum(InvitationStatus).optional(),
  }),
});
