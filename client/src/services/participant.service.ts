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

  async acceptJoinRequest(activityId: string, userId: string): Promise<ApiResponse<Participant>> {
    const response = await api.patch<ApiResponse<Participant>>(`/activities/${activityId}/participants/${userId}/accept`);
    return response.data;
  },

  async rejectJoinRequest(activityId: string, userId: string): Promise<ApiResponse<Participant>> {
    const response = await api.patch<ApiResponse<Participant>>(`/activities/${activityId}/participants/${userId}/reject`);
    return response.data;
  },

  async removeParticipant(activityId: string, userId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/activities/${activityId}/participants/${userId}`);
    return response.data;
  },

  async listParticipants(activityId: string): Promise<ApiResponse<Participant[]>> {
    const response = await api.get<ApiResponse<Participant[]>>(`/activities/${activityId}/participants`);
    return response.data;
  },

  async listPendingRequests(activityId: string): Promise<ApiResponse<Participant[]>> {
    const response = await api.get<ApiResponse<Participant[]>>(`/activities/${activityId}/participants/pending`);
    return response.data;
  },

  async getMyParticipation(activityId: string): Promise<ApiResponse<Participant>> {
    const response = await api.get<ApiResponse<Participant>>(`/activities/${activityId}/participants/me`);
    return response.data;
  },
};
export default participantService;
