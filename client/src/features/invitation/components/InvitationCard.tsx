import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Calendar, User, MessageSquare, Check, X, Clock } from 'lucide-react';
import { Invitation } from '../types';

interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  isProcessing?: boolean;
}

export function InvitationCard({
  invitation,
  onAccept,
  onReject,
  isProcessing = false,
}: InvitationCardProps) {
  const activity = invitation.activity;
  const organizerName = invitation.invitedBy?.name || 'Organizer';
  const message = invitation.message;
  const expiresAt = invitation.expiresAt;

  const eventDate = new Date(activity.startsAt).toLocaleDateString(undefined, {
    weekday: 'short',
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
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-200/60 dark:border-slate-800/80">
      <CardContent className="p-5 space-y-4">
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-slate-850 dark:text-slate-100 line-clamp-1">
              {activity.title}
            </h4>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-500" />
              <span>{eventDate}</span>
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

        {/* Sender details */}
        <div className="flex items-center space-x-2 text-xs text-slate-655 dark:text-slate-400">
          <User className="h-4 w-4 text-emerald-500" />
          <span>Invited by <strong className="font-bold text-slate-800 dark:text-slate-200">{organizerName}</strong></span>
        </div>

        {/* Custom message if provided */}
        {message && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-slate-405 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-350 italic">
              "{message}"
            </p>
          </div>
        )}

        {/* Expiration date warning */}
        {invitation.status === 'PENDING' && expiryText && (
          <div className="flex items-center space-x-1.5 text-[10px] text-amber-500 font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <span>Expires: {expiryText}</span>
          </div>
        )}

        {/* Action buttons if status is PENDING */}
        {invitation.status === 'PENDING' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(invitation.id)}
              disabled={isProcessing}
              className="text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 flex items-center justify-center space-x-1 rounded-xl"
            >
              <X className="h-4 w-4" />
              <span>Decline</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAccept(invitation.id)}
              disabled={isProcessing}
              className="flex items-center justify-center space-x-1 rounded-xl"
            >
              <Check className="h-4 w-4" />
              <span>Accept</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InvitationCard;
