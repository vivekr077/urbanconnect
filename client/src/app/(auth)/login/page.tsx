'use client';

import React from 'react';
import Link from 'next/link';
import AuthCard from '@/components/ui/AuthCard';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your dashboard"
      footer={
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
