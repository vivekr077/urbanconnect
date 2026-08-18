export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';

export type ActivityType =
  | 'BADMINTON'
  | 'CRICKET'
  | 'FOOTBALL'
  | 'VOLLEYBALL'
  | 'TENNIS'
  | 'RUNNING'
  | 'CYCLING'
  | 'TREKKING'
  | 'CAB_SHARE'
  | 'OTHER';

export interface UserSport {
  id: string;
  userId: string;
  activityType: ActivityType;
  skillLevel: SkillLevel;
  createdAt: string;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  homeCity?: string | null;
  homeState?: string | null;
  homeCountry?: string | null;
  trustScore: number;
  isVerified: boolean;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  sports?: UserSport[];
  currentLocation?: LocationInput | null;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;
  homeCity?: string;
  homeState?: string;
  homeCountry?: string;
}

export interface UpdateSportsPayload {
  sports: {
    activityType: ActivityType;
    skillLevel: SkillLevel;
  }[];
}

export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}
