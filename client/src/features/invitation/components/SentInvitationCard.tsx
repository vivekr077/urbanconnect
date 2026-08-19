import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Calendar, MessageSquare, X, Clock } from 'lucide-react';
import { Invitation } from '../types';

interface SentInvitationCardProps {
  invitation: Invitation;
  onCancel: (invitationId: string) => void;
  isProcessing?: boolean;
}

export function SentInvitationCard({
  invitation,
  onCancel,
  isProcessing = false,
}: SentInvitationCardProps) {
  const invitedUser = invitation.invitedUser || { id: '', name: 'Unknown User', profileImageUrl: null };
  const message = invitation.message;
  const expiresAt = invitation.expiresAt;

  const sentDate = new Date(invitation.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const expiryText = expiresAt 
    ? new Date(expiresAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-205/60 dark:border-slate-800/80">
      <CardContent className="p-5 space-y-4">
        {/* Header: Invited User and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={invitedUser.profileImageUrl || undefined}
              fallback={invitedUser.name}
              size="md"
            />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-250 text-sm block">
                {invitedUser.name}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Sent {sentDate}</span>
              </div>
            </div>
          </div>

          <Badge
            variant={
              invitation.status === 'PENDING'
                ? 'default'
                : invitation.status === 'ACCEPTED'
                ? 'success'
                : 'destructive'
            }
            className="capitalize text-xs font-semibold"
          >
            {invitation.status.toLowerCase()}
          </Badge>
        </div>

        {/* Message */}
        {message && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-350 italic">
              "{message}"
            </p>
          </div>
        )}

        {/* Expiration date */}
        {expiryText && (
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <span>Expires: {expiryText}</span>
          </div>
        )}

        {/* Actions */}
        {invitation.status === 'PENDING' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(invitation.id)}
            disabled={isProcessing}
            className="w-full text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 flex items-center justify-center space-x-1.5 rounded-xl"
          >
            <X className="h-4 w-4" />
            <span>Cancel Invitation</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default SentInvitationCard;
