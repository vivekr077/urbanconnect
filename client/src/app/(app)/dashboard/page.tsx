'use client';

import React from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useMyActivities } from '@/features/activity/hooks/useMyActivities';
import { useReceivedInvitations } from '@/features/invitation/hooks/useReceivedInvitations';
import { useNearbyActivities } from '@/features/activity/hooks/useNearbyActivities';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Trophy,
  Calendar,
  Mail,
  MapPin,
  Users,
  Compass,
  ArrowUpRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const { data: myActivitiesRes } = useMyActivities();
  const { data: invitations } = useReceivedInvitations();
  const { data: nearbyActivities } = useNearbyActivities(
    user?.currentLocation && user.currentLocation.latitude != null && user.currentLocation.longitude != null
      ? { latitude: user.currentLocation.latitude, longitude: user.currentLocation.longitude }
      : { latitude: 0, longitude: 0 }
  );

  const activeMyActivitiesCount = myActivitiesRes?.data?.length || 0;
  const pendingInvitesCount = invitations?.filter((i) => i.status === 'PENDING').length || 0;

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 md:p-8 text-white shadow-xl shadow-emerald-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Welcome back</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hello, {user?.name || 'Player'}!
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Discover nearby matches, track your ongoing invitations, and manage your team participants seamlessly.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trust Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">{user?.trustScore || 100} / 100</h3>
            </div>
          </CardContent>
        </Card>

        <Link href="/activities/my">
          <Card className="hover:shadow-md hover:border-emerald-500/20 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Activities</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">{activeMyActivitiesCount} Active</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/invitations">
          <Card className="hover:shadow-md hover:border-emerald-500/20 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invitations</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">{pendingInvitesCount} Pending</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">
                <Badge variant={user?.accountStatus === 'ACTIVE' ? 'success' : 'destructive'}>
                  {user?.accountStatus || 'ACTIVE'}
                </Badge>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Nearby Activities</h3>
            <Link href="/activities" className="text-xs font-semibold text-emerald-500 flex items-center hover:underline">
              View All <ArrowUpRight className="h-4 w-4 ml-0.5" />
            </Link>
          </div>

          {nearbyActivities && nearbyActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyActivities.slice(0, 4).map((activity) => (
                <Link href={`/activities/${activity.id}`} key={activity.id}>
                  <Card className="hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 border border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4 flex items-center space-x-3.5">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-lg">
                        {(() => {
                          const map: Record<string, string> = {
                            FOOTBALL: '⚽',
                            BASKETBALL: '🏀',
                            TENNIS: '🎾',
                            BADMINTON: '🏸',
                            RUNNING: '🏃',
                            CYCLING: '🚴',
                            YOGA: '🧘',
                            GYM: '🏋️',
                          };
                          return map[activity.activityType as string] || '🏆';
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{activity.title}</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {new Date(activity.startsAt).toLocaleDateString()} • {activity.venueName}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col justify-center items-center py-16 text-center border-dashed border-2">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
                <Compass className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-base font-bold mb-1">No activities found nearby</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Try setting or updating your home location coordinates in your Profile page to view matching nearby activities.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-55">Location Preview</h3>
          <Card className="overflow-hidden">
            <CardHeader className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
              <CardTitle className="text-sm font-bold flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Geospatial Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="text-center z-10 px-4 space-y-1">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {user?.homeCity ? `${user.homeCity}, ${user.homeCountry || 'ES'}` : 'Location Not Set'}
                </p>
                <p className="text-[10px] text-slate-405">
                  {user?.currentLocation && user.currentLocation.latitude != null && user.currentLocation.longitude != null
                    ? `${user.currentLocation.latitude.toFixed(4)}, ${user.currentLocation.longitude.toFixed(4)}`
                    : 'Set your location in profile'}
                </p>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recommended Matches</h3>
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-sm">
                🏀
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate">Basketball Pick-up</h4>
                <p className="text-xs text-slate-400 truncate">Saturdays, 9:00 AM • Intermediate</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-sm">
                ⚽
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate">5v5 Football Friendly</h4>
                <p className="text-xs text-slate-400 truncate">Thursdays, 7:00 PM • All levels</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
