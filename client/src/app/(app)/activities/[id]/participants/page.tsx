'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useParticipants } from '@/features/participant/hooks/useParticipants';
import { useRemoveParticipant } from '@/features/participant/hooks/useRemoveParticipant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, ShieldAlert, AlertCircle, Clock } from 'lucide-react';
import ParticipantList from '@/features/participant/components/ParticipantList';

export default function ActivityParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading } = useActivity(id);
  const { data: participants, isLoading: isParticipantsLoading, error: participantsError } = useParticipants(id);

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
        <Link href="/activities" className="inline-block mt-5">
          <Button size="sm">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const isOrganizer = currentUser?.id === activity.organizer.id;
  const joinedPlayers = participants?.filter(p => p.status === 'ACCEPTED') || [];

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      setOperationError(null);
      await removeMutation.mutateAsync({ activityId: activity.id, participantId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to remove player.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <Link
            href={`/activities/${activity.id}`}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Players List
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Roster of players signed up for "{activity.title}".
            </p>
          </div>
        </div>

        {isOrganizer && (
          <Link href={`/activities/${activity.id}/participants/pending`}>
            <Button variant="outline" className="flex items-center space-x-1.5 rounded-xl" size="sm">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Pending Requests</span>
            </Button>
          </Link>
        )}
      </div>

      {operationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      {/* Roster list */}
      <Card className="border border-slate-205/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Roster</CardTitle>
            <CardDescription>Players registered and confirmed for this match.</CardDescription>
          </div>
          <Badge variant="success">
            {joinedPlayers.length} / {activity.maxParticipants} Filled
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          <ParticipantList
            participants={joinedPlayers}
            isCurrentUserOrganizer={isOrganizer}
            onRemoveParticipant={handleRemoveParticipant}
            removingId={removeMutation.isPending ? removeMutation.variables?.participantId : null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
