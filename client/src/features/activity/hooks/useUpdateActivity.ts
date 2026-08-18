import { useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateActivityPayload } from '@/types/activity';

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateActivityPayload }) => {
      const response = await activityService.updateActivity(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update activity');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(variables.id) });
    },
  });
}

export default useUpdateActivity;
