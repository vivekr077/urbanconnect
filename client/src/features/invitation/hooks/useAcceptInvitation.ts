import { useMutation, useQueryClient } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await invitationService.acceptInvitation(invitationId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to accept invitation');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitation.received });
      if (data && data.activityId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(data.activityId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(data.activityId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.participant.me(data.activityId) });
      }
    },
  });
}

export default useAcceptInvitation;
