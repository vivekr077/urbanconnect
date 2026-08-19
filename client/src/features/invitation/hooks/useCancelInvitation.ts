import { useMutation, useQueryClient } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';

export function useCancelInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await invitationService.cancelInvitation(invitationId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel invitation');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data && data.activityId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.invitation.sent(data.activityId) });
      }
    },
  });
}

export default useCancelInvitation;
