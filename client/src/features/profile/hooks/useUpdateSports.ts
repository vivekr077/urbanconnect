import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/user.service';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateSportsPayload } from '@/types/user';

export function useUpdateSports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSportsPayload) => {
      const response = await userService.updateSports(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update sports');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export default useUpdateSports;
