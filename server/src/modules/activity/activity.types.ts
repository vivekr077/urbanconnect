import { ActivityType, SkillLevel, ActivityStatus } from '../../generated/prisma/client.js';

export interface CreateActivityInput {
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

export interface UpdateActivityInput {
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
  status?: ActivityStatus;
  isPrivate?: boolean;
  joinApprovalRequired?: boolean;
}

export interface ActivityFilterQuery {
  activityType?: ActivityType;
  status?: ActivityStatus;
  minimumSkillLevel?: SkillLevel;
  city?: string;
  date?: string;
  organizerId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'startsSoon' | 'nearest';
  latitude?: number;
  longitude?: number;
}

export interface NearbyActivityQuery {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface ActivityResponse {
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
  startsAt: Date;
  endsAt: Date;
  maxParticipants: number;
  status: ActivityStatus;
  minimumSkillLevel: SkillLevel | null;
  notes: string | null;
  isPrivate: boolean;
  joinApprovalRequired: boolean;
  organizer: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
  participantCount: number;
  remainingSlots: number;
  distance?: string;
  createdAt: Date;
  updatedAt: Date;
}
