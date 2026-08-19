import { useQuery } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';

export function useSentInvitations(activityId: string) {
  return useQuery({
    queryKey: queryKeys.invitation.sent(activityId),
    queryFn: async () => {
      const response = await invitationService.getSentInvitations(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sent invitations');
      }
      return response.data;
    },
    enabled: !!activityId,
  });
}

export default useSentInvitations;
