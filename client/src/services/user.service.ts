import api from './api';
import { ApiResponse } from '../types/api';
import { User } from '../types/user';

export const userService = {
  async updateProfile(data: any): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  async getUserProfile(id: string): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
};
export default userService;
