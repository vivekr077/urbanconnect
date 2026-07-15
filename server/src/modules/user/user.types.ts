import { Gender, ActivityType, SkillLevel } from '../../generated/prisma/client.js';

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  homeCity?: string;
  homeState?: string;
  homeCountry?: string;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  gender: Gender | null;
  dateOfBirth: Date | null;
  homeCity: string;
  homeState: string | null;
  homeCountry: string;
  trustScore: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  sports: {
    id: string;
    activityType: ActivityType;
    skillLevel: SkillLevel;
    createdAt: Date;
  }[];
  currentLocation: LocationInput | null;
}

export interface SportInput {
  activityType: ActivityType;
  skillLevel: SkillLevel;
}
