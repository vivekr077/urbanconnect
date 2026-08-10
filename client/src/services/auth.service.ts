import api from './api';
import Cookies from 'js-cookie';
import { ApiResponse } from '../types/api';
import { AuthSuccessPayload } from '../types/auth';
import { User } from '../types/user';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<AuthSuccessPayload>> {
    const response = await api.post<ApiResponse<AuthSuccessPayload>>('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      Cookies.set('token', response.data.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    }
    return response.data;
  },

  async register(data: any): Promise<ApiResponse<AuthSuccessPayload>> {
    const response = await api.post<ApiResponse<AuthSuccessPayload>>('/auth/register', data);
    if (response.data.success && response.data.data.token) {
      Cookies.set('token', response.data.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    }
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>('/auth/logout');
      return response.data;
    } finally {
      Cookies.remove('token');
    }
  },

  async me(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
export default authService;
