'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { useUpdateActivity } from '@/features/activity/hooks/useUpdateActivity';
import { activityFormSchema, ActivityFormValues } from '@/features/activity/schemas/activity.schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { ArrowLeft, MapPin, Shield, CheckSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const { user: currentUser } = useCurrentUser();
  const { data: activity, isLoading: isActivityLoading, error: activityError } = useActivity(id);
  const updateMutation = useUpdateActivity();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema) as any,
  });

  // Pre-fill the form once activity details are fetched
  useEffect(() => {
    if (activity) {
      // Helper to format ISO datetime for HTML datetime-local inputs
      const formatToDatetimeLocal = (isoStr: string) => {
        const d = new Date(isoStr);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      reset({
        title: activity.title,
        description: activity.description || '',
        activityType: activity.activityType,
        venueName: activity.venueName,
        venueAddress: activity.venueAddress || '',
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
        startsAt: formatToDatetimeLocal(activity.startsAt),
        endsAt: formatToDatetimeLocal(activity.endsAt),
        maxParticipants: activity.maxParticipants,
        minimumSkillLevel: activity.minimumSkillLevel || undefined,
        notes: activity.notes || '',
        isPrivate: activity.isPrivate,
        joinApprovalRequired: activity.joinApprovalRequired,
      });
    }
  }, [activity, reset]);

  if (isActivityLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (activityError || !activity) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Activity not found</h3>
        <Link href="/activities/my" className="inline-block mt-5">
          <Button size="sm">Back to My Games</Button>
        </Link>
      </div>
    );
  }

  // Ensure only organizer can edit
  const isOrganizer = currentUser?.id === activity.organizer.id;
  if (!isOrganizer) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="text-slate-500 mt-1">Only the host of this activity is allowed to edit it.</p>
        <Link href="/activities" className="inline-block mt-5">
          <Button size="sm">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: ActivityFormValues) => {
    try {
      const payload = {
        ...values,
        startsAt: new Date(values.startsAt).toISOString(),
        endsAt: new Date(values.endsAt).toISOString(),
      };
      await updateMutation.mutateAsync({ id: activity.id, data: payload });
      router.push(`/activities/${activity.id}`);
    } catch (err) {
      // Error handles by mutation state
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-2.5">
        <Link
          href={`/activities/${activity.id}`}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Edit Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update match schedule, venue location, or settings.
          </p>
        </div>
      </div>

      <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <CardTitle className="text-xl font-bold">Modify Details</CardTitle>
          <CardDescription>Adjust any details below. Joined players will be updated.</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {updateMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-955/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 text-sm font-semibold">
                {updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to update activity'}
              </div>
            )}

            {/* Title & Sport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Activity Title"
                placeholder="e.g. Friendly Sunday Football Match"
                {...register('title')}
                error={errors.title?.message}
              />

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sport Type</label>
                <select
                  {...register('activityType')}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="">Select a sport...</option>
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
                {errors.activityType && (
                  <p className="text-xs text-red-500 font-semibold">{errors.activityType.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                placeholder="Give a summary of what to expect..."
                {...register('description')}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
              )}
            </div>

            {/* Venue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Venue Name"
                placeholder="e.g. Central Park Pitch 3"
                {...register('venueName')}
                error={errors.venueName?.message}
              />

              <FormInput
                label="Venue Address"
                placeholder="e.g. 5th Ave & 79th St"
                {...register('venueAddress')}
                error={errors.venueAddress?.message}
              />
            </div>

            {/* Location Coordinates */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-500" />
                <span>Geo-Coordinates</span>
              </span>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Latitude"
                  type="number"
                  step="any"
                  {...register('latitude')}
                  error={errors.latitude?.message}
                />

                <FormInput
                  label="Longitude"
                  type="number"
                  step="any"
                  {...register('longitude')}
                  error={errors.longitude?.message}
                />
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Starts At"
                type="datetime-local"
                {...register('startsAt')}
                error={errors.startsAt?.message}
              />

              <FormInput
                label="Ends At"
                type="datetime-local"
                {...register('endsAt')}
                error={errors.endsAt?.message}
              />
            </div>

            {/* Limits & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Maximum Participants"
                type="number"
                {...register('maxParticipants')}
                error={errors.maxParticipants?.message}
              />

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Minimum Skill Level</label>
                <select
                  {...register('minimumSkillLevel')}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="">Any skill level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
                {errors.minimumSkillLevel && (
                  <p className="text-xs text-red-500 font-semibold">{errors.minimumSkillLevel.message}</p>
                )}
              </div>
            </div>

            {/* Settings (Private / Approval) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <label className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  {...register('isPrivate')}
                  className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Private Activity</span>
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Only invited players can find this match.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  {...register('joinApprovalRequired')}
                  className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4 text-emerald-500" />
                    <span>Organizer Approval Required</span>
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Require approval before allowing players to join.
                  </span>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Additional Notes</label>
              <textarea
                placeholder="e.g. Bring black shirts..."
                {...register('notes')}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 resize-none"
              />
              {errors.notes && (
                <p className="text-xs text-red-500 font-semibold">{errors.notes.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Link href={`/activities/${activity.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
