export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  homeCity?: string | null;
  homeState?: string | null;
  homeCountry?: string | null;
  trustScore: number;
  isVerified: boolean;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
