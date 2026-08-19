import { useMutation, useQueryClient } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function useRejectParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, participantId }: { activityId: string; participantId: string }) => {
      const response = await participantService.rejectParticipant(activityId, participantId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reject participant');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.pending(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.me(variables.activityId) });
    },
  });
}

export default useRejectParticipant;
