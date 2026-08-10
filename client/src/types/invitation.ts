export interface Invitation {
  id: string;
  activityId: string;
  invitedUserId: string;
  invitedById: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';
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
  };
}
