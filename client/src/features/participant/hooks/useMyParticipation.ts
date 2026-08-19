import { useQuery } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';
import { MyParticipationStatus } from '../types';

export function useMyParticipation(activityId: string) {
  return useQuery({
    queryKey: queryKeys.participant.me(activityId),
    queryFn: async (): Promise<MyParticipationStatus> => {
      const response = await participantService.getMyParticipation(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch participation status');
      }
      return response.data as any; // Cast as it matches MyParticipationStatus shape
    },
    enabled: !!activityId,
  });
}

export default useMyParticipation;
