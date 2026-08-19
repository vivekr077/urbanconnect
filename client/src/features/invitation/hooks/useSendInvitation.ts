import { useMutation, useQueryClient } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';
import { SendInvitationPayload } from '../types';

export function useSendInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, payload }: { activityId: string; payload: SendInvitationPayload }) => {
      const response = await invitationService.sendInvitation(activityId, payload);
      if (!response.success) {
        throw new Error(response.message || 'Failed to send invitation');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitation.sent(variables.activityId) });
    },
  });
}

export default useSendInvitation;
