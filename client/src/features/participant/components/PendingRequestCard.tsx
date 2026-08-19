import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Check, X, Calendar } from 'lucide-react';
import { Participant } from '../types';

interface PendingRequestCardProps {
  participant: Participant;
  onAccept: (participantId: string) => void;
  onReject: (participantId: string) => void;
  isProcessing?: boolean;
}

export function PendingRequestCard({
  participant,
  onAccept,
  onReject,
  isProcessing = false,
}: PendingRequestCardProps) {
  const user = participant.user || {
    id: '',
    name: 'Unknown User',
    email: '',
    trustScore: 100,
    isVerified: false,
    accountStatus: 'ACTIVE' as const,
    createdAt: '',
    updatedAt: '',
    profileImageUrl: null,
  };
  const requestedDate = new Date(participant.requestedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-200/60 dark:border-slate-800/80">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user.profileImageUrl || undefined} 
            fallback={user.name} 
            size="md" 
          />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-250 text-sm block">
              {user.name}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-500" />
              <span>Requested {requestedDate}</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 py-0.5 px-1.5 rounded-md font-semibold text-slate-600 dark:text-slate-350">
                Score: {user.trustScore ?? 100}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(participant.id)}
            disabled={isProcessing}
            className="text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 flex items-center space-x-1 rounded-xl"
          >
            <X className="h-4 w-4" />
            <span>Reject</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAccept(participant.id)}
            disabled={isProcessing}
            className="flex items-center space-x-1 rounded-xl"
          >
            <Check className="h-4 w-4" />
            <span>Accept</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PendingRequestCard;
