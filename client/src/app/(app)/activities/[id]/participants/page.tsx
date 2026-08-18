'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useParticipants } from '@/features/activity/hooks/useParticipants';
import { 
  useAcceptParticipant, 
  useRejectParticipant, 
  useRemoveParticipant 
} from '@/features/activity/hooks/useParticipation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { ArrowLeft, UserCheck, UserMinus, ShieldAlert, Check, X, AlertCircle } from 'lucide-react';

export default function ActivityParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading } = useActivity(id);
  const { data: participants, isLoading: isParticipantsLoading, error: participantsError, refetch } = useParticipants(id);

  const acceptMutation = useAcceptParticipant();
  const rejectMutation = useRejectParticipant();
  const removeMutation = useRemoveParticipant();

  const [operationError, setOperationError] = useState<string | null>(null);

  if (isActivityLoading || isParticipantsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (participantsError || !activity) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Activity not found</h3>
        <Link href="/activities/my" className="inline-block mt-5">
          <Button size="sm">Back to My Games</Button>
        </Link>
      </div>
    );
  }

  // Ensure only the organizer can access this management screen
  const isOrganizer = currentUser?.id === activity.organizer.id;
  if (!isOrganizer) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="text-slate-500">Only the host of this activity is allowed to manage participants.</p>
        <Link href="/activities" className="inline-block mt-2">
          <Button size="sm">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  // Separate participants by status
  const pendingRequests = participants?.filter(p => p.status === 'PENDING' && p.role !== 'ORGANIZER') || [];
  const joinedPlayers = participants?.filter(p => p.status === 'ACCEPTED') || [];

  const handleAccept = async (userId: string) => {
    try {
      setOperationError(null);
      await acceptMutation.mutateAsync({ activityId: activity.id, userId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to accept participant.');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setOperationError(null);
      await rejectMutation.mutateAsync({ activityId: activity.id, userId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to reject participant.');
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      setOperationError(null);
      await removeMutation.mutateAsync({ activityId: activity.id, userId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to remove participant.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <Link
          href={`/activities/${activity.id}`}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Manage Players
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Approve requests or manage the roster for "{activity.title}".
          </p>
        </div>
      </div>

      {operationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-955/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      {/* Pending requests section */}
      <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Pending Join Requests</CardTitle>
              <CardDescription>Players waiting for your approval to join the game.</CardDescription>
            </div>
            <Badge variant={pendingRequests.length > 0 ? 'default' : 'secondary'}>
              {pendingRequests.length} pending
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {pendingRequests.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-550 dark:text-slate-500">
              No pending join requests at the moment.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {pendingRequests.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <Avatar src={participant.user.profileImageUrl} fallback={participant.user.name} />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {participant.user.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {participant.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReject(participant.userId)}
                      disabled={rejectMutation.isPending}
                      className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <X className="h-4.5 w-4.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(participant.userId)}
                      disabled={acceptMutation.isPending}
                      className="h-8 px-3 rounded-lg flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Accept</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Joined players section */}
      <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Joined Players</CardTitle>
              <CardDescription>Roster of players currently signed up for the match.</CardDescription>
            </div>
            <Badge variant="success">
              {joinedPlayers.length} / {activity.maxParticipants} slots filled
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {joinedPlayers.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-450">No players have joined this activity yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {joinedPlayers.map((participant) => {
                const isUserOrganizer = participant.role === 'ORGANIZER';

                return (
                  <div key={participant.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <Avatar src={participant.user.profileImageUrl} fallback={participant.user.name} />
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {participant.user.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {participant.user.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isUserOrganizer ? (
                        <Badge variant="default">Host</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(participant.userId)}
                          disabled={removeMutation.isPending}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg flex items-center space-x-1 px-2.5 h-8"
                        >
                          <UserMinus className="h-4 w-4" />
                          <span className="text-xs font-bold">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
