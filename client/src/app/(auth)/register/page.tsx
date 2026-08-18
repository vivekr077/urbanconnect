'use client';

import React from 'react';
import Link from 'next/link';
import AuthCard from '@/components/ui/AuthCard';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Get started by entering your details below"
      footer={
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
