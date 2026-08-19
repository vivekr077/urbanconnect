import { useMutation, useQueryClient } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function useJoinActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await participantService.joinActivity(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to join activity');
      }
      return response.data;
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.me(activityId) });
    },
  });
}

export default useJoinActivity;
