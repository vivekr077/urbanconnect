import { useQuery } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function useParticipants(activityId: string) {
  return useQuery({
    queryKey: queryKeys.participant.list(activityId),
    queryFn: async () => {
      const response = await participantService.getParticipants(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch participants');
      }
      return response.data;
    },
    enabled: !!activityId,
  });
}

export default useParticipants;
