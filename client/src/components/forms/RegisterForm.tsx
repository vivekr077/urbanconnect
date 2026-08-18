'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterInput } from '@/features/auth/schemas/auth.schema';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import SubmitButton from '@/components/ui/SubmitButton';
import authService from '@/services/auth.service';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      homeCity: '',
      homeCountry: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const { confirmPassword, ...payload } = data;
      const response = await authService.register(payload);
      if (response.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(response.message || 'Registration failed. Please check details.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Unable to register. This email might already be registered.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <FormInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        disabled={isLoading}
        {...register('name')}
      />

      <FormInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />

      <FormInput
        label="Home City"
        type="text"
        placeholder="Madrid"
        error={errors.homeCity?.message}
        disabled={isLoading}
        {...register('homeCity')}
      />

      <FormInput
        label="Home Country"
        type="text"
        placeholder="Spain"
        error={errors.homeCountry?.message}
        disabled={isLoading}
        {...register('homeCountry')}
      />

      <FormInput
        label="Phone Number (Optional)"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phoneNumber?.message}
        disabled={isLoading}
        {...register('phoneNumber')}
      />

      <PasswordInput
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword')}
      />

      <SubmitButton isLoading={isLoading} className="mt-2">
        Create Account
      </SubmitButton>
    </form>
  );
};

export default RegisterForm;
