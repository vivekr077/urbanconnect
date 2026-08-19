import api from './api';
import { ApiResponse } from '../types/api';
import { Participant } from '../types/participant';

export const participantService = {
  async joinActivity(activityId: string): Promise<ApiResponse<Participant>> {
    const response = await api.post<ApiResponse<Participant>>(`/activities/${activityId}/join`);
    return response.data;
  },

  async leaveActivity(activityId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/activities/${activityId}/leave`);
    return response.data;
  },

  async acceptParticipant(activityId: string, participantId: string): Promise<ApiResponse<Participant>> {
    const response = await api.patch<ApiResponse<Participant>>(`/activities/${activityId}/participants/${participantId}/accept`);
    return response.data;
  },

  async rejectParticipant(activityId: string, participantId: string): Promise<ApiResponse<Participant>> {
    const response = await api.patch<ApiResponse<Participant>>(`/activities/${activityId}/participants/${participantId}/reject`);
    return response.data;
  },

  async removeParticipant(activityId: string, participantId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/activities/${activityId}/participants/${participantId}`);
    return response.data;
  },

  async getParticipants(activityId: string): Promise<ApiResponse<Participant[]>> {
    const response = await api.get<ApiResponse<Participant[]>>(`/activities/${activityId}/participants`);
    return response.data;
  },

  async getPendingRequests(activityId: string): Promise<ApiResponse<Participant[]>> {
    const response = await api.get<ApiResponse<Participant[]>>(`/activities/${activityId}/participants/pending`);
    return response.data;
  },

  async getMyParticipation(activityId: string): Promise<ApiResponse<Participant>> {
    const response = await api.get<ApiResponse<Participant>>(`/activities/${activityId}/participants/me`);
    return response.data;
  },

  // Aliases for compatibility
  acceptJoinRequest(activityId: string, userId: string): Promise<ApiResponse<Participant>> {
    return this.acceptParticipant(activityId, userId);
  },
  rejectJoinRequest(activityId: string, userId: string): Promise<ApiResponse<Participant>> {
    return this.rejectParticipant(activityId, userId);
  },
  listParticipants(activityId: string): Promise<ApiResponse<Participant[]>> {
    return this.getParticipants(activityId);
  },
  listPendingRequests(activityId: string): Promise<ApiResponse<Participant[]>> {
    return this.getPendingRequests(activityId);
  },
};

export default participantService;
