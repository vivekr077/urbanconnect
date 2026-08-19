import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2, Shield } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  isCurrentUserOrganizer: boolean;
  onRemove?: (participantId: string) => void;
  isRemoving?: boolean;
}

export function ParticipantCard({
  participant,
  isCurrentUserOrganizer,
  onRemove,
  isRemoving = false,
}: ParticipantCardProps) {
  // If the user relation isn't preloaded, use defaults
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
  const isOrganizer = participant.role === 'ORGANIZER';

  const handleRemove = () => {
    if (onRemove) {
      onRemove(participant.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-200/60 dark:border-slate-800/80">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user.profileImageUrl || undefined} 
            fallback={user.name} 
            size="md" 
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-250 text-sm">
                {user.name}
              </span>
              {isOrganizer && (
                <Badge variant="success" className="flex items-center space-x-0.5 text-[10px] py-0.5 px-1 bg-emerald-500 text-white">
                  <Shield className="h-2.5 w-2.5" />
                  <span>Host</span>
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              {user.sports && user.sports.length > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user.sports[0].skillLevel.toLowerCase()}
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                Score: {user.trustScore ?? 100}
              </span>
            </div>
          </div>
        </div>

        {isCurrentUserOrganizer && !isOrganizer && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 w-9 p-0 rounded-xl"
            title="Remove Participant"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ParticipantCard;
