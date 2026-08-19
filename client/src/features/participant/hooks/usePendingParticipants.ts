import { useQuery } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function usePendingParticipants(activityId: string) {
  return useQuery({
    queryKey: queryKeys.participant.pending(activityId),
    queryFn: async () => {
      const response = await participantService.getPendingRequests(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch pending requests');
      }
      return response.data;
    },
    enabled: !!activityId,
  });
}

export default usePendingParticipants;
