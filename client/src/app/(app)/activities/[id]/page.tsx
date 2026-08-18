'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useParticipants } from '@/features/activity/hooks/useParticipants';
import { useJoinActivity, useLeaveActivity } from '@/features/activity/hooks/useParticipation';
import { useDeleteActivity } from '@/features/activity/hooks/useDeleteActivity';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  Share2, 
  UserPlus, 
  Edit, 
  Trash2, 
  UsersRound, 
  AlertCircle, 
  ChevronRight,
  Info 
} from 'lucide-react';

const sportThemes: Record<string, { gradient: string; emoji: string }> = {
  FOOTBALL: { gradient: 'from-green-600 to-emerald-800', emoji: '⚽' },
  BASKETBALL: { gradient: 'from-orange-500 to-amber-700', emoji: '🏀' },
  TENNIS: { gradient: 'from-lime-400 to-green-600', emoji: '🎾' },
  BADMINTON: { gradient: 'from-sky-400 to-indigo-650', emoji: '🏸' },
  RUNNING: { gradient: 'from-rose-500 to-red-700', emoji: '🏃' },
  CYCLING: { gradient: 'from-cyan-500 to-blue-600', emoji: '🚴' },
  YOGA: { gradient: 'from-purple-500 to-indigo-600', emoji: '🧘' },
  GYM: { gradient: 'from-slate-600 to-slate-800', emoji: '🏋️' },
  OTHER: { gradient: 'from-emerald-500 to-teal-700', emoji: '🏆' },
};

export default function ActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading, error: activityError } = useActivity(id);
  const { data: participants, isLoading: isParticipantsLoading } = useParticipants(id);

  const joinMutation = useJoinActivity();
  const leaveMutation = useLeaveActivity();
  const deleteMutation = useDeleteActivity();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (isActivityLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      </div>
    );
  }

  if (activityError || !activity) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Activity not found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          The activity you are looking for does not exist or has been deleted.
        </p>
        <Link href="/activities" className="inline-block mt-5">
          <Button size="sm">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const theme = sportThemes[activity.activityType] || sportThemes.OTHER;
  const isOrganizer = currentUser?.id === activity.organizer.id;
  
  // Determine user participation status
  const myParticipant = participants?.find(p => p.userId === currentUser?.id);
  const isJoined = myParticipant?.status === 'ACCEPTED';
  const isPending = myParticipant?.status === 'PENDING';
  const isFull = activity.remainingSlots === 0;

  const handleJoinLeave = async () => {
    try {
      setActionError(null);
      if (isJoined || isPending) {
        await leaveMutation.mutateAsync(activity.id);
      } else {
        await joinMutation.mutateAsync(activity.id);
      }
    } catch (err: any) {
      setActionError(err.message || 'Operation failed. Please try again.');
    }
  };

  const handleDeleteActivity = async () => {
    try {
      setActionError(null);
      await deleteMutation.mutateAsync(activity.id);
      router.push('/activities/my');
    } catch (err: any) {
      setActionError(err.message || 'Deletion failed.');
      setShowDeleteConfirm(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/activities"
          className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Activities</span>
        </Link>

        {showShareToast && (
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg animate-fade-in border border-emerald-100 dark:border-emerald-900/30">
            Link copied to clipboard!
          </span>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold">Delete this activity?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to permanently delete "{activity.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteActivity} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{actionError}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className={`relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-br ${theme.gradient} shadow-md flex flex-col justify-end p-6 md:p-8`}>
        <div className="absolute top-6 right-6 text-5xl md:text-7xl opacity-30 select-none">
          {theme.emoji}
        </div>
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white dark:bg-white/10 hover:bg-white/30 border-0 capitalize">
              {activity.activityType.toLowerCase()}
            </Badge>
            {activity.minimumSkillLevel && (
              <Badge variant="secondary" className="bg-white/20 text-white dark:bg-white/10 hover:bg-white/30 border-0 capitalize">
                {activity.minimumSkillLevel.toLowerCase()}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/20 text-white dark:bg-white/10 hover:bg-white/30 border-0">
              {activity.isPrivate ? 'Private' : 'Public'}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {activity.title}
          </h1>
          <p className="text-white/80 text-sm font-semibold flex items-center">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{activity.venueName}</span>
          </p>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Description</h3>
                <p className="text-slate-700 dark:text-slate-350 mt-2 leading-relaxed whitespace-pre-wrap">
                  {activity.description || 'No description provided.'}
                </p>
              </div>

              {/* Time & Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-slate-100 dark:border-slate-800/60 py-6">
                <div className="space-y-3.5">
                  <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">Date & Time</span>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate(activity.startsAt)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatTime(activity.startsAt)} - {formatTime(activity.endsAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">Venue</span>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.venueName}</p>
                      {activity.venueAddress && (
                        <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">{activity.venueAddress}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1 bg-slate-50 dark:bg-slate-950 py-0.5 px-2 rounded w-fit border border-slate-200/30 dark:border-slate-800/40">
                        {activity.location.latitude.toFixed(5)}, {activity.location.longitude.toFixed(5)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {activity.notes && (
                <div className="bg-slate-50 dark:bg-slate-955 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex items-start space-x-3">
                  <Info className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Host Notes</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-350 mt-1">{activity.notes}</p>
                  </div>
                </div>
              )}

              {/* Organizer Card */}
              <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center space-x-3.5">
                  <Avatar src={activity.organizer.profileImageUrl} fallback={activity.organizer.name} size="md" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Hosted by</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.organizer.name}</p>
                  </div>
                </div>
                {!isOrganizer && (
                  <Link href={`/profile`}>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-500">
                      View Profile
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side widgets */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Game Capacity</span>
                <div className="flex items-baseline justify-center space-x-1.5">
                  <span className="text-4xl font-extrabold text-emerald-500">{activity.participantCount}</span>
                  <span className="text-slate-400 dark:text-slate-500">/</span>
                  <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{activity.maxParticipants}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.remainingSlots} slots remaining
                </p>
              </div>

              {/* Main Join Trigger */}
              <div className="space-y-3.5">
                {isOrganizer ? (
                  <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-xl p-3.5 text-center text-sm font-bold">
                    You are hosting this activity
                  </div>
                ) : (
                  <Button
                    onClick={handleJoinLeave}
                    disabled={joinMutation.isPending || leaveMutation.isPending || (isFull && !isJoined && !isPending)}
                    className="w-full h-11"
                    variant={isJoined ? 'destructive' : isPending ? 'outline' : 'primary'}
                  >
                    {joinMutation.isPending || leaveMutation.isPending
                      ? 'Processing...'
                      : isJoined
                      ? 'Leave Activity'
                      : isPending
                      ? 'Cancel Join Request'
                      : isFull
                      ? 'Game Full'
                      : activity.joinApprovalRequired
                      ? 'Request to Join'
                      : 'Join Activity'}
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3.5">
                  <Button variant="outline" onClick={handleShare} className="w-full flex items-center justify-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Invite</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Panel */}
          {isOrganizer && (
            <Card className="border border-red-100 dark:border-red-950/30 bg-red-50/10 dark:bg-red-950/5 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Organizer Admin Panel
                </h4>
                <div className="space-y-2">
                  <Link href={`/activities/${activity.id}/edit`} className="block w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2" size="sm">
                      <Edit className="h-4 w-4" />
                      <span>Edit Details</span>
                    </Button>
                  </Link>

                  <Link href={`/activities/${activity.id}/participants`} className="block w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2" size="sm">
                      <UsersRound className="h-4 w-4" />
                      <span>Manage Players</span>
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center space-x-2 text-red-650 dark:text-red-400 border-red-100 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/20"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Activity</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
