'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivities } from '@/features/activity/hooks/useActivities';
import { useJoinActivity } from '@/features/activity/hooks/useParticipation';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  ChevronRight, 
  Filter, 
  AlertCircle 
} from 'lucide-react';
import { ActivityType, SkillLevel } from '@/types/user';

export default function ActivitiesPage() {
  const { user: currentUser } = useCurrentUser();
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('startsSoon');
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [joinError, setJoinError] = useState<string | null>(null);

  // Try to retrieve location for "nearest" sorting and distance calculations
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Geolocation rejected or failed, fallback to none
        }
      );
    }
  }, []);

  const filters = {
    search: search || undefined,
    activityType: activityType ? (activityType as ActivityType) : undefined,
    minimumSkillLevel: skillLevel ? (skillLevel as SkillLevel) : undefined,
    sortBy: sortBy as any,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };

  const { data, isLoading, error, refetch } = useActivities(filters);
  const joinMutation = useJoinActivity();

  const handleJoin = async (activityId: string) => {
    try {
      setJoinError(null);
      await joinMutation.mutateAsync(activityId);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join activity. Please try again.');
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
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Discover</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
            Sports Activities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Find games, workouts, and sports groups near you.
          </p>
        </div>
        <Link href="/activities/create">
          <Button className="shadow-lg shadow-emerald-500/10">Create Activity</Button>
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold mb-1">
          <Filter className="h-4.5 w-4.5 text-emerald-500" />
          <span>Filters & Search</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search title, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
          >
            <option value="">All Sports</option>
            <option value="FOOTBALL">Football</option>
            <option value="BASKETBALL">Basketball</option>
            <option value="TENNIS">Tennis</option>
            <option value="BADMINTON">Badminton</option>
            <option value="RUNNING">Running</option>
            <option value="CYCLING">Cycling</option>
            <option value="YOGA">Yoga</option>
            <option value="GYM">Gym</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
          >
            <option value="">All Skill Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="PROFESSIONAL">Professional</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
          >
            <option value="startsSoon">Starts Soon</option>
            <option value="newest">Newest Created</option>
            {coords.latitude !== undefined && (
              <option value="nearest">Nearest to Me</option>
            )}
          </select>
        </div>
      </div>

      {/* Error alert */}
      {joinError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{joinError}</span>
        </div>
      )}

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse border border-slate-200/50 dark:border-slate-800/50">
              <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-t-2xl" />
              <CardContent className="space-y-3 p-5">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Failed to load activities</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please try refreshing the page.</p>
          <Button onClick={() => refetch()} className="mt-4" size="sm">Retry</Button>
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <AlertCircle className="h-12 w-12 text-slate-350 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-250">No activities found</h3>
          <p className="text-slate-500 dark:text-slate-450 mt-1 max-w-sm mx-auto text-sm">
            Try adjusting your search query, choosing a different sport filter, or create a brand new one yourself!
          </p>
          <Link href="/activities/create" className="inline-block mt-5">
            <Button size="sm">Create First Activity</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((activity) => {
            const isOrganizer = currentUser?.id === activity.organizer.id;
            const { date, time } = formatDateTime(activity.startsAt);
            const isFull = activity.remainingSlots === 0;

            return (
              <Card key={activity.id} className="hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group border border-slate-200/60 dark:border-slate-800/80">
                <CardHeader className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="default" className="capitalize">
                      {activity.activityType.toLowerCase()}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {activity.distance && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.distance}</span>
                        </Badge>
                      )}
                      <Badge variant={activity.isPrivate ? 'outline' : 'success'}>
                        {activity.isPrivate ? 'Private' : 'Public'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-emerald-500 transition-colors line-clamp-1">
                    {activity.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="line-clamp-1">{activity.venueName}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
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
                        {activity.participantCount}/{activity.maxParticipants} slots
                      </span>
                    </div>
                    {activity.minimumSkillLevel && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-emerald-500" />
                        <span className="capitalize text-xs font-bold bg-slate-100 dark:bg-slate-800 py-0.5 px-2 rounded-md">
                          {activity.minimumSkillLevel.toLowerCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar src={activity.organizer.profileImageUrl} fallback={activity.organizer.name} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Organizer</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                          {activity.organizer.name}
                        </p>
                      </div>
                    </div>
                    {isFull && <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Full</span>}
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-3">
                  <Link href={`/activities/${activity.id}`} className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-1" size="sm">
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  {isOrganizer ? (
                    <Button disabled variant="secondary" size="sm" className="w-full">
                      Organizer
                    </Button>
                  ) : (
                    <Button
                      variant={isFull ? 'secondary' : 'primary'}
                      disabled={isFull || joinMutation.isPending}
                      onClick={() => handleJoin(activity.id)}
                      size="sm"
                      className="w-full"
                    >
                      {joinMutation.isPending ? 'Joining...' : 'Join Game'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
