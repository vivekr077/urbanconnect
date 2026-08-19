'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReceivedInvitations } from '@/features/invitation/hooks/useReceivedInvitations';
import { useAcceptInvitation } from '@/features/invitation/hooks/useAcceptInvitation';
import { useRejectInvitation } from '@/features/invitation/hooks/useRejectInvitation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, AlertCircle, Inbox } from 'lucide-react';
import InvitationList from '@/features/invitation/components/InvitationList';

export default function MyInvitationsPage() {
  const { data: invitations, isLoading, error } = useReceivedInvitations();

  const acceptMutation = useAcceptInvitation();
  const rejectMutation = useRejectInvitation();
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleAccept = async (invitationId: string) => {
    try {
      setOperationError(null);
      await acceptMutation.mutateAsync(invitationId);
    } catch (err: any) {
      setOperationError(err.message || 'Failed to accept invitation.');
    }
  };

  const handleReject = async (invitationId: string) => {
    try {
      setOperationError(null);
      await rejectMutation.mutateAsync(invitationId);
    } catch (err: any) {
      setOperationError(err.message || 'Failed to decline invitation.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Failed to load invitations</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Please try again later.</p>
        <Link href="/dashboard" className="inline-block mt-5">
          <Button size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const activeInvitations = invitations || [];
  const pendingInvitations = activeInvitations.filter(i => i.status === 'PENDING');
  const pastInvitations = activeInvitations.filter(i => i.status !== 'PENDING');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            My Game Invitations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and respond to matches you've been invited to.
          </p>
        </div>
      </div>

      {operationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      {/* Pending Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-805 dark:text-slate-100 flex items-center space-x-2">
            <Inbox className="h-5 w-5 text-emerald-500" />
            <span>Active Invites</span>
          </h3>
          <Badge variant={pendingInvitations.length > 0 ? 'default' : 'secondary'} className="px-2.5 py-0.5">
            {pendingInvitations.length} Pending
          </Badge>
        </div>

        <InvitationList
          invitations={pendingInvitations}
          onAcceptInvitation={handleAccept}
          onRejectInvitation={handleReject}
          processingId={
            acceptMutation.isPending
              ? acceptMutation.variables
              : rejectMutation.isPending
              ? rejectMutation.variables
              : null
          }
        />
      </div>

      {/* Past Section */}
      {pastInvitations.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              History
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastInvitations.map((inv) => (
              <Card key={inv.id} className="opacity-70 hover:opacity-100 transition-opacity border border-slate-201 dark:border-slate-850">
                <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{inv.activity.title}</h5>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(inv.activity.startsAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge
                    variant={inv.status === 'ACCEPTED' ? 'success' : 'secondary'}
                    className="capitalize text-[10px] font-semibold"
                  >
                    {inv.status.toLowerCase()}
                  </Badge>
                </CardHeader>
                {inv.invitedBy && (
                  <CardContent className="p-4 pt-0 text-xs text-slate-500 dark:text-slate-400">
                    Invited by {inv.invitedBy.name}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
