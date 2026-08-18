'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMyActivities } from '@/features/activity/hooks/useMyActivities';
import { useDeleteActivity } from '@/features/activity/hooks/useDeleteActivity';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Eye, 
  Edit2, 
  Trash2, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

export default function MyActivitiesPage() {
  const { data, isLoading, error, refetch } = useMyActivities();
  const deleteMutation = useDeleteActivity();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeletingId(null);
    } catch (err) {
      // Error is stored in mutation state
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Dashboard</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
            My Organized Games
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage events, participants, and edit game schedules.
          </p>
        </div>
        <Link href="/activities/create">
          <Button className="shadow-lg shadow-emerald-500/10 flex items-center space-x-1">
            <Plus className="h-4.5 w-4.5" />
            <span>Create New Game</span>
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold">Delete Activity?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this activity? This will cancel the game and remove all joined participants. This action cannot be undone.
            </p>
            {deleteMutation.isError && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg">
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Deletion failed'}
              </p>
            )}
            <div className="flex justify-end space-x-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setDeletingId(null)}
                disabled={deleteMutation.isPending}
              >
                Keep Game
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(deletingId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border border-slate-200/50 dark:border-slate-800/50">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-t-2xl" />
              <CardContent className="space-y-3 p-5">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Failed to load games</h3>
          <Button onClick={() => refetch()} className="mt-4" size="sm">Retry</Button>
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-650 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-250">No organized activities yet</h3>
          <p className="text-slate-500 dark:text-slate-450 mt-1 max-w-sm mx-auto text-sm">
            Host your first game match or training event to get started.
          </p>
          <Link href="/activities/create" className="inline-block mt-5">
            <Button size="sm">Host a Match</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((activity) => {
            const { date, time } = formatDateTime(activity.startsAt);
            const isFull = activity.remainingSlots === 0;

            return (
              <Card key={activity.id} className="hover:shadow-md transition-all duration-350 border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between h-full">
                <CardHeader className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="default" className="capitalize">
                      {activity.activityType.toLowerCase()}
                    </Badge>
                    <div className="flex space-x-1.5">
                      <Badge variant={activity.isPrivate ? 'outline' : 'success'}>
                        {activity.isPrivate ? 'Private' : 'Public'}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {activity.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-1">
                    {activity.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="line-clamp-1">{activity.venueName}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-3 flex-grow">
                  <div className="space-y-2 text-sm text-slate-650 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      <span>
                        {activity.participantCount}/{activity.maxParticipants} slots filled
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 pt-4 flex flex-col space-y-3">
                  {/* Action row 1 */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Link href={`/activities/${activity.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </Link>

                    <Link href={`/activities/${activity.id}/participants`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Players</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Action row 2 */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Link href={`/activities/${activity.id}/edit`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1 border-slate-200 dark:border-slate-850 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20 dark:hover:text-amber-400">
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </Link>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDeletingId(activity.id)}
                      className="w-full flex items-center justify-center space-x-1 border-slate-200 dark:border-slate-850 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
