import { ActivityType, SkillLevel } from './user';

export interface Organizer {
  id: string;
  name: string;
  profileImageUrl: string | null;
}

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  activityType: ActivityType;
  venueName: string;
  venueAddress: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
  startsAt: string;
  endsAt: string;
  maxParticipants: number;
  status: 'OPEN' | 'FULL' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  minimumSkillLevel: SkillLevel | null;
  notes: string | null;
  isPrivate: boolean;
  joinApprovalRequired: boolean;
  organizer: Organizer;
  participantCount: number;
  remainingSlots: number;
  distance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  activityId: string;
  userId: string;
  role: 'ORGANIZER' | 'PARTICIPANT';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'LEFT';
  requestedAt: string;
  approvedAt: string | null;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
    gender: string | null;
    trustScore: number;
  };
}

export interface CreateActivityPayload {
  title: string;
  description?: string;
  activityType: ActivityType;
  venueName: string;
  venueAddress?: string;
  latitude: number;
  longitude: number;
  startsAt: string; // ISO datetime string
  endsAt: string;   // ISO datetime string
  maxParticipants: number;
  minimumSkillLevel?: SkillLevel;
  notes?: string;
  isPrivate?: boolean;
  joinApprovalRequired?: boolean;
}

export interface UpdateActivityPayload {
  title?: string;
  description?: string;
  activityType?: ActivityType;
  venueName?: string;
  venueAddress?: string;
  latitude?: number;
  longitude?: number;
  startsAt?: string;
  endsAt?: string;
  maxParticipants?: number;
  minimumSkillLevel?: SkillLevel;
  notes?: string;
  status?: 'OPEN' | 'FULL' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isPrivate?: boolean;
  joinApprovalRequired?: boolean;
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
  activityType?: ActivityType;
  status?: string;
  minimumSkillLevel?: SkillLevel;
  city?: string;
  date?: string;
  organizerId?: string;
  search?: string;
  sortBy?: 'newest' | 'startsSoon' | 'nearest';
  latitude?: number;
  longitude?: number;
}
