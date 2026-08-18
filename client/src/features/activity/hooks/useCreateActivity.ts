import { useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';
import { CreateActivityPayload } from '@/types/activity';

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateActivityPayload) => {
      const response = await activityService.createActivity(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create activity');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
    },
  });
}

export default useCreateActivity;
