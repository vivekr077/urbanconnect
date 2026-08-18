'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateActivity } from '@/features/activity/hooks/useCreateActivity';
import { activityFormSchema, ActivityFormValues } from '@/features/activity/schemas/activity.schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { ArrowLeft, MapPin, Calendar, Users, Award, Shield, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function CreateActivityPage() {
  const router = useRouter();
  const createMutation = useCreateActivity();
  const [coordsError, setCoordsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema) as any,
    defaultValues: {
      isPrivate: false,
      joinApprovalRequired: false,
      latitude: 0,
      longitude: 0,
      maxParticipants: 10,
    },
  });

  // Try to pre-fill coordinates from browser geolocation on mount
  useEffect(() => {
    setIsLocating(true);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          setCoordsError('Could not auto-detect location. Please enter coordinates manually.');
          setIsLocating(false);
        }
      );
    } else {
      setCoordsError('Geolocation is not supported by your browser. Please enter coordinates manually.');
      setIsLocating(false);
    }
  }, [setValue]);

  const handleGetLocation = () => {
    setIsLocating(true);
    setCoordsError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          setCoordsError('Location access denied or unavailable.');
          setIsLocating(false);
        }
      );
    }
  };

  const onSubmit = async (values: ActivityFormValues) => {
    try {
      // Convert dates to standard ISO strings for backend DTO format compatibility
      const payload = {
        ...values,
        startsAt: new Date(values.startsAt).toISOString(),
        endsAt: new Date(values.endsAt).toISOString(),
      };
      await createMutation.mutateAsync(payload);
      router.push('/activities/my');
    } catch (err) {
      // Error handled by mutation state, shown below
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-2.5">
        <Link
          href="/activities"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Create Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Host a new sports game, training session or match.
          </p>
        </div>
      </div>

      <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <CardTitle className="text-xl font-bold">Activity Information</CardTitle>
          <CardDescription>Specify the details for the sport event you want to host.</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {createMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-955/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-4 text-sm font-semibold">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create activity'}
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
                placeholder="Give a summary of what to expect, who can join, equipment needed..."
                {...register('description')}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 resize-none"
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
                placeholder="e.g. 5th Ave & 79th St, New York"
                {...register('venueAddress')}
                error={errors.venueAddress?.message}
              />
            </div>

            {/* Location Coordinates */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <MapPin className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Geo-Coordinates</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs text-emerald-500 font-bold"
                >
                  {isLocating ? 'Locating...' : 'Get Current Coordinates'}
                </Button>
              </div>

              {coordsError && <p className="text-xs text-amber-600 dark:text-amber-400">{coordsError}</p>}

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
                    Only players with a direct invite or link can view this match.
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
                    Players must request to join, and you must accept them.
                  </span>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Additional Notes</label>
              <textarea
                placeholder="e.g. Bring black shirts, clean studs. Meet at 17:45 near the entrance gate."
                {...register('notes')}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 resize-none"
              />
              {errors.notes && (
                <p className="text-xs text-red-500 font-semibold">{errors.notes.message}</p>
              )}
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Link href="/activities">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating Activity...' : 'Create Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
