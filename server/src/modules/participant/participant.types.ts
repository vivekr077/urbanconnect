import { ParticipantRole, ParticipantStatus } from '../../generated/prisma/client.js';

export interface ParticipantResponse {
  id: string;
  activityId: string;
  userId: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  requestedAt: Date;
  approvedAt?: Date | null;
  approvedById?: string | null;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    profileImageUrl: string | null;
    trustScore: number;
  };
}

export interface ParticipantMeResponse {
  status: ParticipantStatus | null;
  role: ParticipantRole | null;
}
