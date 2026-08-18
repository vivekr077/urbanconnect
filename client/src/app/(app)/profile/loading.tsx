import React from 'react';

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-4">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4.5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-4">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
        <div className="flex flex-wrap gap-2.5">
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
