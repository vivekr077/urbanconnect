import { InvitationStatus } from '../../generated/prisma/client.js';

export interface SendInvitationInput {
  invitedUserId: string;
  message?: string;
  expiresAt?: string;
}

export interface InvitationDTO {
  id: string;
  activity: {
    id: string;
    title: string;
    startsAt: Date;
  };
  invitedBy?: {
    id: string;
    name: string;
  } | undefined;
  status: InvitationStatus;
  message: string | null;
  expiresAt: Date | null;
  respondedAt: Date | null;
  distance: number | null;
}
