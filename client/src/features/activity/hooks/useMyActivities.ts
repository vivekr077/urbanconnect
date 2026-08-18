import { useQuery } from '@tanstack/react-query';
import activityService from '@/services/activity.service';

export function useMyActivities(params?: any) {
  return useQuery({
    queryKey: ['activities', 'my', params],
    queryFn: async () => {
      const response = await activityService.getMyActivities(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch my activities');
      }
      return response;
    },
  });
}

export default useMyActivities;
