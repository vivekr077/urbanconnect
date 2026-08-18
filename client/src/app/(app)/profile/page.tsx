'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import { useUpdateLocation } from '@/features/profile/hooks/useUpdateLocation';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import ProfileLoading from './loading';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  ShieldCheck,
  Compass,
  Navigation,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading, error } = useCurrentUser();
  const { mutate: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-red-500">Error Loading Profile</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {error?.message || 'Unable to retrieve user information.'}
        </p>
      </div>
    );
  }

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setNotification({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(
          { latitude, longitude },
          {
            onSuccess: () => {
              setNotification({ type: 'success', message: 'Current location updated successfully!' });
              setTimeout(() => setNotification(null), 4000);
            },
            onError: (err: any) => {
              setNotification({ type: 'error', message: err.message || 'Failed to update location.' });
              setTimeout(() => setNotification(null), 4000);
            },
          }
        );
      },
      (err) => {
        let msg = 'Failed to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied.';
        }
        setNotification({ type: 'error', message: msg });
        setTimeout(() => setNotification(null), 4000);
      }
    );
  };

  const formattedDOB = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
          }`}
        >
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 dark:from-emerald-950/20 dark:to-emerald-900/10" />
        <CardContent className="relative p-6 pt-0 text-center flex flex-col items-center">
          <div className="absolute -top-16">
            <div className="relative p-1 bg-white dark:bg-slate-900 rounded-full border-4 border-white dark:border-slate-900 shadow-md">
              <Avatar
                src={user.profileImageUrl || undefined}
                fallback={user.name}
                className="h-28 w-28 rounded-full"
              />
            </div>
          </div>

          <div className="mt-16 space-y-1">
            <div className="flex items-center justify-center space-x-1.5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h2>
              {user.isVerified && (
                <ShieldCheck className="h-5.5 w-5.5 text-emerald-500 fill-emerald-500/10" />
              )}
            </div>
            {user.bio ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">{user.bio}</p>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm italic">No bio written yet</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-805 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Trust Score
              </span>
              <span className="text-lg font-bold text-emerald-500">{user.trustScore}%</span>
            </div>
            {user.isVerified && (
              <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-805 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Verification
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Verified</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Profile Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3.5">
            <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Phone
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {user.phoneNumber || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Award className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Gender
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                {user.gender?.replace(/_/g, ' ').toLowerCase() || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Date of Birth
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {formattedDOB}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Home Location
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {[user.homeCity, user.homeState, user.homeCountry].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Compass className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Current Location Coordinates
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {user.currentLocation
                  ? `${user.currentLocation.latitude.toFixed(5)}, ${user.currentLocation.longitude.toFixed(5)}`
                  : 'Not registered'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">My Sports</h3>
        {user.sports && user.sports.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {user.sports.map((sport) => (
              <div
                key={sport.id}
                className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm"
              >
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {sport.activityType.replace(/_/g, ' ').toLowerCase()}
                </span>
                <Badge
                  variant={
                    sport.skillLevel === 'PROFESSIONAL' || sport.skillLevel === 'ADVANCED'
                      ? 'success'
                      : sport.skillLevel === 'INTERMEDIATE'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-[10px] py-0.5 px-1.5 uppercase font-bold"
                >
                  {sport.skillLevel.toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">No sports preferences configured yet.</p>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row gap-3.5">
        <Link href="/profile/edit" className="flex-1">
          <button className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.99] gap-2 border border-transparent dark:border-slate-800">
            <Edit className="h-4 w-4" />
            Edit Profile & Sports
          </button>
        </Link>

        <button
          onClick={handleUpdateLocation}
          disabled={isUpdatingLocation}
          className="flex-1 flex h-11 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none gap-2"
        >
          <Navigation className={`h-4 w-4 ${isUpdatingLocation ? 'animate-bounce' : ''}`} />
          {isUpdatingLocation ? 'Updating location...' : 'Update Current Location'}
        </button>
      </div>
    </div>
  );
}
