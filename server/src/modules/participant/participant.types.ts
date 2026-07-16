import { ParticipantRole, ParticipantStatus } from '../../generated/prisma/client.js';

export interface ParticipantResponse {
  id: string; // The participant record ID (used for accept/reject/remove actions)
  userId: string; // The associated user's ID
  name: string;
  profileImageUrl: string | null;
  trustScore: number;
  role: ParticipantRole;
  status: ParticipantStatus;
}

export interface ParticipantMeResponse {
  status: ParticipantStatus | null;
  role: ParticipantRole | null;
}
