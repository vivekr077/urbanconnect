'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { usePendingParticipants } from '@/features/participant/hooks/usePendingParticipants';
import { useAcceptParticipant } from '@/features/participant/hooks/useAcceptParticipant';
import { useRejectParticipant } from '@/features/participant/hooks/useRejectParticipant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, ShieldAlert, AlertCircle } from 'lucide-react';
import PendingRequestCard from '@/features/participant/components/PendingRequestCard';

export default function PendingRequestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading } = useActivity(id);
  const { data: pendingRequests, isLoading: isRequestsLoading, error: requestsError } = usePendingParticipants(id);

  const acceptMutation = useAcceptParticipant();
  const rejectMutation = useRejectParticipant();
  const [operationError, setOperationError] = useState<string | null>(null);

  if (isActivityLoading || isRequestsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (requestsError || !activity) {
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

  // Ensure only the organizer can access this management screen
  const isOrganizer = currentUser?.id === activity.organizer.id;
  if (!isOrganizer) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="text-slate-500">Only the host of this activity is allowed to manage pending requests.</p>
        <Link href={`/activities/${activity.id}`} className="inline-block mt-2">
          <Button size="sm">Back to Details</Button>
        </Link>
      </div>
    );
  }

  const handleAccept = async (participantId: string) => {
    try {
      setOperationError(null);
      await acceptMutation.mutateAsync({ activityId: activity.id, participantId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to accept participant.');
    }
  };

  const handleReject = async (participantId: string) => {
    try {
      setOperationError(null);
      await rejectMutation.mutateAsync({ activityId: activity.id, participantId });
    } catch (err: any) {
      setOperationError(err.message || 'Failed to reject participant.');
    }
  };

  const activeRequests = pendingRequests || [];

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
            Pending Join Requests
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and approve players requesting to join "{activity.title}".
          </p>
        </div>
      </div>

      {operationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      {/* Pending requests list */}
      <Card className="border border-slate-205/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Review Requests</CardTitle>
            <CardDescription>Accepting requests adds players to the activity roster.</CardDescription>
          </div>
          <Badge variant={activeRequests.length > 0 ? 'default' : 'secondary'}>
            {activeRequests.length} Pending
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          {activeRequests.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-base mb-1">All caught up!</p>
              <p className="text-xs">No pending join requests for this activity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeRequests.map((req) => (
                <PendingRequestCard
                  key={req.id}
                  participant={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  isProcessing={acceptMutation.isPending || rejectMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
