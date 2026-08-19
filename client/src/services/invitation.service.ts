import api from './api';
import { ApiResponse } from '../types/api';
import { Invitation } from '../types/invitation';

export const invitationService = {
  async sendInvitation(
    activityId: string, 
    payload: { invitedUserId?: string; email?: string; message?: string; expiresAt?: string }
  ): Promise<ApiResponse<Invitation>> {
    const response = await api.post<ApiResponse<Invitation>>(`/activities/${activityId}/invitations`, payload);
    return response.data;
  },

  async getSentInvitations(activityId: string): Promise<ApiResponse<Invitation[]>> {
    const response = await api.get<ApiResponse<Invitation[]>>(`/activities/${activityId}/invitations`);
    return response.data;
  },

  async getReceivedInvitations(): Promise<ApiResponse<Invitation[]>> {
    const response = await api.get<ApiResponse<Invitation[]>>('/users/me/invitations');
    return response.data;
  },

  async acceptInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
    const response = await api.patch<ApiResponse<Invitation>>(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  async rejectInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
    const response = await api.patch<ApiResponse<Invitation>>(`/invitations/${invitationId}/reject`);
    return response.data;
  },

  async cancelInvitation(invitationId: string): Promise<ApiResponse<Invitation>> {
    const response = await api.delete<ApiResponse<Invitation>>(`/invitations/${invitationId}`);
    return response.data;
  },

  // Aliases for compatibility
  listSentInvitations(activityId: string): Promise<ApiResponse<Invitation[]>> {
    return this.getSentInvitations(activityId);
  },
  listReceivedInvitations(): Promise<ApiResponse<Invitation[]>> {
    return this.getReceivedInvitations();
  },
};

export default invitationService;
