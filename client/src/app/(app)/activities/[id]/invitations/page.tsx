'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useSentInvitations } from '@/features/invitation/hooks/useSentInvitations';
import { useCancelInvitation } from '@/features/invitation/hooks/useCancelInvitation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, ShieldAlert, AlertCircle, Send } from 'lucide-react';
import SentInvitationCard from '@/features/invitation/components/SentInvitationCard';
import InviteUserDialog from '@/features/invitation/components/InviteUserDialog';
import { useSendInvitation } from '@/features/invitation/hooks/useSendInvitation';

export default function SentInvitationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading } = useActivity(id);
  const { data: invitations, isLoading: isInvitationsLoading, error: invitationsError } = useSentInvitations(id);

  const cancelMutation = useCancelInvitation();
  const sendMutation = useSendInvitation();

  const [operationError, setOperationError] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (isActivityLoading || isInvitationsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (invitationsError || !activity) {
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

  // Check organizer permission
  const isOrganizer = currentUser?.id === activity.organizer.id;
  if (!isOrganizer) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="text-slate-500">Only the host of this activity is allowed to view sent invitations.</p>
        <Link href={`/activities/${activity.id}`} className="inline-block mt-2">
          <Button size="sm">Back to Details</Button>
        </Link>
      </div>
    );
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setOperationError(null);
      await cancelMutation.mutateAsync(invitationId);
    } catch (err: any) {
      setOperationError(err.message || 'Failed to cancel invitation.');
    }
  };

  const handleSendInvitation = async (payload: { invitedUserId?: string; email?: string; message?: string; expiresAt?: string }) => {
    await sendMutation.mutateAsync({ activityId: activity.id, payload });
  };

  const activeInvitations = invitations || [];
  const pendingCount = activeInvitations.filter(i => i.status === 'PENDING').length;

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
              Sent Invitations
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage sent invitations and invite new players to "{activity.title}".
            </p>
          </div>
        </div>

        <Button 
          variant="primary" 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl self-start sm:self-auto"
        >
          <Send className="h-4 w-4" />
          <span>Invite Player</span>
        </Button>
      </div>

      {operationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      {/* Invitations list */}
      <Card className="border border-slate-205/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Invitations Tracker</CardTitle>
            <CardDescription>Track the status of invitations sent to players.</CardDescription>
          </div>
          <Badge variant={pendingCount > 0 ? 'default' : 'secondary'}>
            {pendingCount} Pending Response
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          {activeInvitations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-base mb-1">No invitations sent</p>
              <p className="text-xs">Click "Invite Player" to send out your first game invitation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvitations.map((inv) => (
                <SentInvitationCard
                  key={inv.id}
                  invitation={inv}
                  onCancel={handleCancelInvitation}
                  isProcessing={cancelMutation.isPending && cancelMutation.variables === inv.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteUserDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSend={handleSendInvitation}
        isSending={sendMutation.isPending}
      />
    </div>
  );
}
