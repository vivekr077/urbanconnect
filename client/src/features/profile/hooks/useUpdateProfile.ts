import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/user.service';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateProfilePayload } from '@/types/user';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await userService.updateProfile(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export default useUpdateProfile;
