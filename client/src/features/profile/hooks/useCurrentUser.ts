import { useQuery } from '@tanstack/react-query';
import userService from '@/services/user.service';
import { queryKeys } from '@/lib/queryKeys';
import Cookies from 'js-cookie';

export function useCurrentUser() {
  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
      return response.data;
    },
    enabled: typeof window !== 'undefined' && !!Cookies.get('token'),
    retry: false,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    loading: query.isLoading,
    error: query.error,
    isAuthenticated: !!query.data,
    authenticated: !!query.data,
    refetch: query.refetch,
  };
}

export default useCurrentUser;
