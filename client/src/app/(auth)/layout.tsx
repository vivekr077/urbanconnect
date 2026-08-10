import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        
        <Link href="/" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-tight z-10">
          <Activity className="h-7 w-7 text-emerald-300" />
          <span>UrbanConnect</span>
        </Link>

        <div className="space-y-6 z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Discover active groups in your neighborhood.
          </h2>
          <p className="text-emerald-100 text-base leading-relaxed">
            Rebuild connections through sports, fitness activities, and group gatherings. Track attendance, coordinate rosters, and keep score.
          </p>
        </div>

        <div className="z-10 text-xs text-emerald-200/70">
          © {new Date().getFullYear()} UrbanConnect. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center lg:hidden mb-4">
            <Link href="/" className="flex items-center space-x-2 text-emerald-500 font-extrabold text-2xl tracking-tight">
              <Activity className="h-7 w-7" />
              <span className="text-slate-900 dark:text-white">UrbanConnect</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
