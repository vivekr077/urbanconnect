import React from 'react';
import ParticipantCard from './ParticipantCard';
import { Participant } from '../types';

interface ParticipantListProps {
  participants: Participant[];
  isCurrentUserOrganizer: boolean;
  onRemoveParticipant?: (participantId: string) => void;
  removingId?: string | null;
}

export function ParticipantList({
  participants,
  isCurrentUserOrganizer,
  onRemoveParticipant,
  removingId,
}: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No participants found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          isCurrentUserOrganizer={isCurrentUserOrganizer}
          onRemove={onRemoveParticipant}
          isRemoving={removingId === participant.id}
        />
      ))}
    </div>
  );
}

export default ParticipantList;
