'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginInput } from '@/features/auth/schemas/auth.schema';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import SubmitButton from '@/components/ui/SubmitButton';
import authService from '@/services/auth.service';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Unable to log in. Please verify your connection or credentials.'
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
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />

      <PasswordInput
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <SubmitButton isLoading={isLoading} className="mt-2">
        Sign In
      </SubmitButton>
    </form>
  );
};

export default LoginForm;
