import { User } from '@/types/user';

export type ParticipantStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'LEFT';

export interface Participant {
  id: string;
  activityId: string;
  userId: string;
  role: 'ORGANIZER' | 'PARTICIPANT';
  status: ParticipantStatus;
  requestedAt: string;
  approvedAt?: string | null;
  approvedById?: string | null;
  updatedAt: string;
  user?: User;
}

export interface MyParticipationStatus {
  status: ParticipantStatus | null;
  role: 'ORGANIZER' | 'PARTICIPANT' | null;
}

export type Participation = Participant;
export type PendingParticipant = Participant;
