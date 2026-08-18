import { useQuery } from '@tanstack/react-query';
import activityService from '@/services/activity.service';
import { queryKeys } from '@/lib/queryKeys';

export function useNearbyActivities(coords: { latitude: number; longitude: number; radius?: number }) {
  return useQuery({
    queryKey: [...queryKeys.activity.nearby, coords],
    queryFn: async () => {
      const response = await activityService.getNearbyActivities(coords);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch nearby activities');
      }
      return response.data;
    },
    enabled: !!coords.latitude && !!coords.longitude,
  });
}

export default useNearbyActivities;
