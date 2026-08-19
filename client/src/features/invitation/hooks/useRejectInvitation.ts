import { useMutation, useQueryClient } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';

export function useRejectInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await invitationService.rejectInvitation(invitationId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reject invitation');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitation.received });
      if (data && data.activityId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.invitation.sent(data.activityId) });
      }
    },
  });
}

export default useRejectInvitation;
