'use client';

import React from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
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

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Activities</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">0 Active</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invitations</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-55">0 Pending</h3>
            </div>
          </CardContent>
        </Card>

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
            <span className="text-xs font-semibold text-emerald-500 flex items-center cursor-pointer hover:underline">
              View All <ArrowUpRight className="h-4 w-4 ml-0.5" />
            </span>
          </div>

          <Card className="flex flex-col justify-center items-center py-16 text-center border-dashed border-2">
            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
              <Compass className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-base font-bold mb-1">No activities found nearby</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Try adjusting your search radius or create a new sports activity to invite players nearby.
            </p>
          </Card>
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
                <p className="text-[10px] text-slate-400">
                  Radius coverage set to 10km.
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
