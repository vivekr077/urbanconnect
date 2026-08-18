import { useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await activityService.deleteActivity(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete activity');
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(id) });
    },
  });
}

export default useDeleteActivity;
