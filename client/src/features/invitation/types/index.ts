export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface Invitation {
  id: string;
  activityId: string;
  invitedUserId: string;
  invitedById: string;
  status: InvitationStatus;
  message?: string | null;
  expiresAt?: string | null;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  activity: {
    id: string;
    title: string;
    startsAt: string;
  };
  invitedBy?: {
    id: string;
    name: string;
    profileImageUrl?: string | null;
  };
  invitedUser?: {
    id: string;
    name: string;
    profileImageUrl?: string | null;
  };
}

export interface SendInvitationPayload {
  invitedUserId?: string;
  email?: string;
  message?: string;
  expiresAt?: string;
}
