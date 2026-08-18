'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useUpdateSports } from '@/features/profile/hooks/useUpdateSports';
import { updateProfileSchema, UpdateProfileInput } from '@/features/profile/schemas/profile.schema';
import FormInput from '@/components/ui/FormInput';
import SubmitButton from '@/components/ui/SubmitButton';
import { Card } from '@/components/ui/Card';
import ProfileLoading from '../loading';
import { ActivityType, SkillLevel } from '@/types/user';
import { ArrowLeft, Trash2, Plus, Save } from 'lucide-react';

const ACTIVITY_TYPES: ActivityType[] = [
  'BADMINTON',
  'CRICKET',
  'FOOTBALL',
  'VOLLEYBALL',
  'TENNIS',
  'RUNNING',
  'CYCLING',
  'TREKKING',
  'CAB_SHARE',
  'OTHER',
];

const SKILL_LEVELS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading, error } = useCurrentUser();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updateSports, isPending: isUpdatingSports } = useUpdateSports();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [sportsList, setSportsList] = useState<{ activityType: ActivityType; skillLevel: SkillLevel }[]>([]);
  const [newSport, setNewSport] = useState<ActivityType>('FOOTBALL');
  const [newSkill, setNewSkill] = useState<SkillLevel>('BEGINNER');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      bio: '',
      gender: 'PREFER_NOT_TO_SAY',
      dateOfBirth: '',
      homeCity: '',
      homeState: '',
      homeCountry: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('phoneNumber', user.phoneNumber || '');
      setValue('bio', user.bio || '');
      setValue('gender', user.gender || 'PREFER_NOT_TO_SAY');
      setValue(
        'dateOfBirth',
        user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      );
      setValue('homeCity', user.homeCity || '');
      setValue('homeState', user.homeState || '');
      setValue('homeCountry', user.homeCountry || '');

      if (user.sports) {
        setSportsList(
          user.sports.map((s) => ({
            activityType: s.activityType,
            skillLevel: s.skillLevel,
          }))
        );
      }
    }
  }, [user, setValue]);

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

  const handleProfileSubmit = (data: UpdateProfileInput) => {
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
    };

    updateProfile(formattedData, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Profile details saved successfully!' });
        setTimeout(() => {
          setNotification(null);
          router.push('/profile');
        }, 2000);
      },
      onError: (err: any) => {
        setNotification({ type: 'error', message: err.message || 'Failed to update profile details.' });
        setTimeout(() => setNotification(null), 4000);
      },
    });
  };

  const handleAddSport = () => {
    const exists = sportsList.some((s) => s.activityType === newSport);
    if (exists) {
      setSportsList(
        sportsList.map((s) =>
          s.activityType === newSport ? { ...s, skillLevel: newSkill } : s
        )
      );
    } else {
      setSportsList([...sportsList, { activityType: newSport, skillLevel: newSkill }]);
    }
  };

  const handleRemoveSport = (activityType: ActivityType) => {
    setSportsList(sportsList.filter((s) => s.activityType !== activityType));
  };

  const handleSaveSports = () => {
    updateSports(
      { sports: sportsList },
      {
        onSuccess: () => {
          setNotification({ type: 'success', message: 'Sports preferences updated successfully!' });
          setTimeout(() => setNotification(null), 3000);
        },
        onError: (err: any) => {
          setNotification({ type: 'error', message: err.message || 'Failed to save sports preferences.' });
          setTimeout(() => setNotification(null), 4000);
        },
      }
    );
  };

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

      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => router.push('/profile')}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Edit Profile Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                disabled={isUpdatingProfile}
                {...register('name')}
              />

              <FormInput
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                error={errors.phoneNumber?.message}
                disabled={isUpdatingProfile}
                {...register('phoneNumber')}
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Gender
                </label>
                <select
                  disabled={isUpdatingProfile}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  {...register('gender')}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non-Binary</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              <FormInput
                label="Date of Birth"
                type="date"
                error={errors.dateOfBirth?.message}
                disabled={isUpdatingProfile}
                {...register('dateOfBirth')}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Bio / About Me
              </label>
              <textarea
                placeholder="Tell us a little bit about yourself, your sports background, etc."
                disabled={isUpdatingProfile}
                rows={3}
                className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                {...register('bio')}
              />
              {errors.bio && (
                <span className="text-xs font-medium text-red-500">{errors.bio.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Home City"
                placeholder="Madrid"
                error={errors.homeCity?.message}
                disabled={isUpdatingProfile}
                {...register('homeCity')}
              />

              <FormInput
                label="Home State"
                placeholder="Madrid"
                error={errors.homeState?.message}
                disabled={isUpdatingProfile}
                {...register('homeState')}
              />

              <FormInput
                label="Home Country"
                placeholder="Spain"
                error={errors.homeCountry?.message}
                disabled={isUpdatingProfile}
                {...register('homeCountry')}
              />
            </div>

            <SubmitButton isLoading={isUpdatingProfile} className="w-full">
              Save Profile Details
            </SubmitButton>
          </form>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Manage My Sports</h3>

          <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Select Sport
              </label>
              <select
                value={newSport}
                onChange={(e) => setNewSport(e.target.value as ActivityType)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ').toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Skill Level
              </label>
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value as SkillLevel)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {SKILL_LEVELS.map((s) => (
                  <option key={s} value={s}>
                    {s.toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddSport}
              className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap w-full sm:w-auto"
            >
              <Plus className="h-4.5 w-4.5" />
              Add / Update
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Configured Sports ({sportsList.length})</h4>
            {sportsList.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                {sportsList.map((sport) => (
                  <div
                    key={sport.activityType}
                    className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-250 capitalize">
                        {sport.activityType.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        Level: {sport.skillLevel.toLowerCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSport(sport.activityType)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">No sports added yet. Choose a sport and level above.</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveSports}
            disabled={isUpdatingSports}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none gap-2 shadow-md shadow-emerald-500/10"
          >
            <Save className="h-4.5 w-4.5" />
            {isUpdatingSports ? 'Saving Sports Preferences...' : 'Save Sports Preferences'}
          </button>
        </Card>
      </div>
    </div>
  );
}
