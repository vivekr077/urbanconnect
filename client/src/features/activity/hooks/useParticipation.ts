import { useMutation, useQueryClient } from '@tanstack/react-query';
import participantService from '@/services/participant.service';
import { queryKeys } from '@/lib/queryKeys';

export function useJoinActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await participantService.joinActivity(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to join activity');
      }
      return response.data;
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(activityId) });
    },
  });
}

export function useLeaveActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await participantService.leaveActivity(activityId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to leave activity');
      }
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(activityId) });
    },
  });
}

export function useAcceptParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, userId }: { activityId: string; userId: string }) => {
      const response = await participantService.acceptJoinRequest(activityId, userId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to accept participant');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(variables.activityId) });
    },
  });
}

export function useRejectParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, userId }: { activityId: string; userId: string }) => {
      const response = await participantService.rejectJoinRequest(activityId, userId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reject participant');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(variables.activityId) });
    },
  });
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, userId }: { activityId: string; userId: string }) => {
      const response = await participantService.removeParticipant(activityId, userId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove participant');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant.list(variables.activityId) });
    },
  });
}
