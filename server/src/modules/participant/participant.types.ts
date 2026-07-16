import { ParticipantRole, ParticipantStatus } from '../../generated/prisma/client.js';

export interface ParticipantResponse {
  id: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  requestedAt: Date;
  approvedAt: Date | null;
  user: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
}
