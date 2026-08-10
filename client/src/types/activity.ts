import { User } from './user';

export interface Activity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  venueName: string;
  venueAddress: string;
  startsAt: string;
  endsAt: string;
  maxParticipants: number;
  status: 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED';
  minimumSkillLevel: string;
  notes?: string | null;
  joinApprovalRequired: boolean;
  organizerId: string;
  organizer?: User;
  createdAt: string;
  updatedAt: string;
}
