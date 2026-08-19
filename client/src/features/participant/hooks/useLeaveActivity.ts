import { useMutation, useQueryClient } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function useLeaveActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await participantService.leaveActivity(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to leave activity');
      }
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.me(activityId) });
    },
  });
}

export default useLeaveActivity;
