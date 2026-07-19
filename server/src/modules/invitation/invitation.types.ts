export interface SendInvitationInput {
  invitedUserId: string;
  message?: string | null | undefined;
  expiresAt?: Date | null | undefined;
}

export interface InvitationDTO {
  id: string;
  status: string;
  message: string | null;
  expiresAt: Date | string | null;
  respondedAt: Date | string | null;
  createdAt: Date | string;
  activity: {
    id: string;
    title: string;
    startsAt: Date | string;
  };
  invitedBy: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
  invitedUser?: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  } | undefined;
}

export interface ListInvitationQuery {
  page?: number | undefined;
  limit?: number | undefined;
  status?: string | undefined;
}
