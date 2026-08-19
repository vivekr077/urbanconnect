import React from 'react';
import Button from '@/components/ui/Button';
import { UserPlus, UserMinus, Clock } from 'lucide-react';
import { ParticipantStatus } from '../types';

interface JoinLeaveButtonProps {
  status: ParticipantStatus | null;
  onJoin: () => void;
  onLeave: () => void;
  isLoading?: boolean;
  isFull?: boolean;
  className?: string;
}

export function JoinLeaveButton({
  status,
  onJoin,
  onLeave,
  isLoading = false,
  isFull = false,
  className = '',
}: JoinLeaveButtonProps) {
  // If the request was rejected, they can try to join again. If LEFT, they can also re-join.
  const isJoined = status === 'ACCEPTED';
  const isPending = status === 'PENDING';

  if (isJoined) {
    return (
      <Button
        variant="destructive"
        onClick={onLeave}
        disabled={isLoading}
        className={`flex items-center justify-center space-x-2 rounded-xl ${className}`}
      >
        <UserMinus className="h-4.5 w-4.5" />
        <span>{isLoading ? 'Leaving...' : 'Leave Activity'}</span>
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button
        variant="outline"
        disabled
        className={`flex items-center justify-center space-x-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-205 dark:border-slate-800 ${className}`}
      >
        <Clock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
        <span className="text-slate-500 dark:text-slate-400 font-semibold">Pending Approval</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isFull ? 'secondary' : 'primary'}
      onClick={onJoin}
      disabled={isLoading || isFull}
      className={`flex items-center justify-center space-x-2 rounded-xl ${className}`}
    >
      <UserPlus className="h-4.5 w-4.5" />
      <span>
        {isLoading
          ? 'Joining...'
          : isFull
          ? 'Activity Full'
          : 'Join Activity'}
      </span>
    </Button>
  );
}

export default JoinLeaveButton;
