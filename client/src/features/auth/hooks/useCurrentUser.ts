import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { queryKeys } from '@/lib/queryKeys';
import Cookies from 'js-cookie';

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await authService.me();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      return response.data;
    },
    enabled: typeof window !== 'undefined' && !!Cookies.get('token'),
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    loading: query.isLoading,
    isAuthenticated: !!query.data,
    authenticated: !!query.data,
    error: query.error,
    refetch: query.refetch,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
export default useCurrentUser;
