import { useQuery } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';
import { ActivityFilters } from '@/types/activity';

export function useActivities(filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...queryKeys.activity.all, filters],
    queryFn: async () => {
      const response = await activityService.getActivities(filters);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch activities');
      }
      return response;
    },
  });
}

export default useActivities;
