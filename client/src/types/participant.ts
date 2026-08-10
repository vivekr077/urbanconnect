import { User } from './user';

export interface Participant {
  id: string;
  activityId: string;
  userId: string;
  role: 'ORGANIZER' | 'PARTICIPANT';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'LEFT';
  requestedAt: string;
  approvedAt?: string | null;
  approvedById?: string | null;
  updatedAt: string;
  user?: User;
}
