import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/user.service';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateLocationPayload } from '@/types/user';

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLocationPayload) => {
      const response = await userService.updateLocation(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update location');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export default useUpdateLocation;
