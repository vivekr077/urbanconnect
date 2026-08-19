import React from 'react';
import InvitationCard from './InvitationCard';
import { Invitation } from '../types';

interface InvitationListProps {
  invitations: Invitation[];
  onAcceptInvitation: (id: string) => void;
  onRejectInvitation: (id: string) => void;
  processingId?: string | null;
}

export function InvitationList({
  invitations,
  onAcceptInvitation,
  onRejectInvitation,
  processingId,
}: InvitationListProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-205/60 dark:border-slate-800/80 rounded-2xl p-6 text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-base mb-1">No invitations</p>
        <p className="text-xs">You haven't received any game invitations recently.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onAccept={onAcceptInvitation}
          onReject={onRejectInvitation}
          isProcessing={processingId === invitation.id}
        />
      ))}
    </div>
  );
}

export default InvitationList;
