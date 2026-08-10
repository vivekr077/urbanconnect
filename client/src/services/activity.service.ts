import api from './api';
import { ApiResponse } from '../types/api';
import { Activity } from '../types/activity';

export const activityService = {
  async getActivities(params?: any): Promise<ApiResponse<Activity[]>> {
    const response = await api.get<ApiResponse<Activity[]>>('/activities', { params });
    return response.data;
  },

  async getActivity(id: string): Promise<ApiResponse<Activity>> {
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

  async cancelActivity(id: string, cancelReason?: string): Promise<ApiResponse<Activity>> {
    const response = await api.delete<ApiResponse<Activity>>(`/activities/${id}`, { data: { cancelReason } });
    return response.data;
  },
};
export default activityService;
