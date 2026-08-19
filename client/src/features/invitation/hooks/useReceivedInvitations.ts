import { useQuery } from '@tanstack/react-query';
import invitationService from '@/services/invitation.service';
import { queryKeys } from '@/lib/queryKeys';

export function useReceivedInvitations() {
  return useQuery({
    queryKey: queryKeys.invitation.received,
    queryFn: async () => {
      const response = await invitationService.getReceivedInvitations();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch received invitations');
      }
      return response.data;
    },
  });
}

export default useReceivedInvitations;
