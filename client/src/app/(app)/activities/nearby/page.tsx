'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useNearbyActivities } from '@/features/activity/hooks/useNearbyActivities';
import { useJoinActivity } from '@/features/activity/hooks/useParticipation';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Navigation, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

export default function NearbyActivitiesPage() {
  const { user: currentUser } = useCurrentUser();
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [radius, setRadius] = useState<number>(5000); // Default to 5km radius
  const [locatingState, setLocatingState] = useState<'prompt' | 'locating' | 'success' | 'error'>('prompt');
  const [locatingError, setLocatingError] = useState<string | null>(null);

  const getBrowserLocation = () => {
    setLocatingState('locating');
    setLocatingError(null);

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocatingState('success');
        },
        (error) => {
          let msg = 'Could not access location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please allow location access in your browser settings to see nearby sports events.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Request to acquire coordinates timed out.';
          }
          setLocatingError(msg);
          setLocatingState('error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocatingError('Geolocation API is not supported by this browser.');
      setLocatingState('error');
    }
  };

  useEffect(() => {
    getBrowserLocation();
  }, []);

  const hasCoords = coords.latitude !== undefined && coords.longitude !== undefined;
  const { data: activities, isLoading: isQueryLoading, error: queryError, refetch } = useNearbyActivities({
    latitude: coords.latitude || 0,
    longitude: coords.longitude || 0,
    radius,
  });

  const joinMutation = useJoinActivity();
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoin = async (activityId: string) => {
    try {
      setJoinError(null);
      await joinMutation.mutateAsync(activityId);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join activity.');
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const isLoading = locatingState === 'locating' || (hasCoords && isQueryLoading);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Map Search</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
            Nearby Sports Activities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Games occurring in your proximity. Sorted by nearest first.
          </p>
        </div>

        {hasCoords && (
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-xs font-bold text-slate-550 dark:text-slate-400">Search Radius:</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={25000}>25 km</option>
              <option value={50000}>50 km</option>
            </select>
          </div>
        )}
      </div>

      {/* Error alert */}
      {joinError && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{joinError}</span>
        </div>
      )}

      {/* Geolocating Error or Prompt */}
      {locatingState === 'error' && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl max-w-xl mx-auto p-6 space-y-4 shadow-sm">
          <Navigation className="h-10 w-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Location Access Required</h3>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
            {locatingError}
          </p>
          <Button onClick={getBrowserLocation} size="sm">
            Try Again
          </Button>
        </div>
      )}

      {/* Activities Feed */}
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
      ) : queryError ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold">Failed to query nearby activities</h3>
          <Button onClick={() => refetch()} className="mt-4" size="sm">Retry</Button>
        </div>
      ) : locatingState === 'success' && (!activities || activities.length === 0) ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          <Navigation className="h-12 w-12 text-slate-300 dark:text-slate-655 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-250">No activities nearby</h3>
          <p className="text-slate-500 dark:text-slate-450 mt-1 max-w-sm mx-auto text-sm">
            We couldn't find any games within {radius / 1000} km of your location. Try raising the search radius!
          </p>
        </div>
      ) : locatingState === 'success' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities?.map((activity) => {
            const isOrganizer = currentUser?.id === activity.organizer.id;
            const { date, time } = formatDateTime(activity.startsAt);
            const isFull = activity.remainingSlots === 0;

            return (
              <Card key={activity.id} className="hover:shadow-md transition-all duration-350 flex flex-col justify-between h-full group border border-slate-200/60 dark:border-slate-800/80">
                <CardHeader className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="default" className="capitalize">
                      {activity.activityType.toLowerCase()}
                    </Badge>
                    <div className="flex items-center space-x-1.5">
                      {activity.distance && (
                        <Badge variant="success" className="flex items-center space-x-1 border-0 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25">
                          <MapPin className="h-3 w-3" />
                          <span className="font-bold">{activity.distance}</span>
                        </Badge>
                      )}
                      <Badge variant={activity.isPrivate ? 'outline' : 'outline'}>
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
                  </div>

                  <div className="border-t border-slate-105 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar src={activity.organizer.profileImageUrl} fallback={activity.organizer.name} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400">Host</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                          {activity.organizer.name}
                        </p>
                      </div>
                    </div>
                    {isFull && <span className="text-xs text-red-500 font-bold uppercase">Full</span>}
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
                      Host
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
      ) : null}
    </div>
  );
}
