import api from './api';
import { ApiResponse, ApiPaginatedResponse } from '../types/api';
import { Activity, Participant } from '../types/activity';

export const activityService = {
  async getActivities(params?: any): Promise<ApiPaginatedResponse<Activity[]>> {
    const response = await api.get<ApiPaginatedResponse<Activity[]>>('/activities', { params });
    return response.data;
  },

  async getActivityById(id: string): Promise<ApiResponse<Activity>> {
    const response = await api.get<ApiResponse<Activity>>(`/activities/${id}`);
    return response.data;
  },

  async createActivity(data: any): Promise<ApiResponse<Activity>> {
    const response = await api.post<ApiResponse<Activity>>('/activities', data);
    return response.data;
  },

  async updateActivity(id: string, data: any): Promise<ApiResponse<Activity>> {
    const response = await api.patch<ApiResponse<Activity>>(`/activities/${id}`, data);
    return response.data;
  },

  async deleteActivity(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/activities/${id}`);
    return response.data;
  },

  async getNearbyActivities(params: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<ApiResponse<Activity[]>> {
    const response = await api.get<ApiResponse<Activity[]>>('/activities/nearby', { params });
    return response.data;
  },

  async getMyActivities(params?: any): Promise<ApiPaginatedResponse<Activity[]>> {
    const response = await api.get<ApiPaginatedResponse<Activity[]>>('/activities/my', { params });
    return response.data;
  },

  async getParticipants(activityId: string): Promise<ApiResponse<Participant[]>> {
    const response = await api.get<ApiResponse<Participant[]>>(`/activities/${activityId}/participants`);
    return response.data;
  },
};

export default activityService;
