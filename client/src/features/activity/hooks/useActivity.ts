import { useQuery } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';

export function useActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.activity.detail(id),
    queryFn: async () => {
      const response = await activityService.getActivityById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch activity');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export default useActivity;
