'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useTheme } from '@/providers/theme-provider';
import { appNavigation } from '@/config/navigation';
import Avatar from '@/components/ui/Avatar';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  Bell,
  User,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Calendar,
  Mail,
  Bell,
  User,
  Settings,
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-955 text-slate-905 dark:text-slate-100 transition-colors duration-300">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link href="/dashboard" className="flex items-center space-x-2 text-emerald-500 font-extrabold text-xl tracking-tight">
            <Activity className="h-6 w-6" />
            <span className="text-slate-900 dark:text-white">Urban<span className="text-emerald-500">Connect</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {appNavigation.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-205'
                )}
              >
                {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col space-y-4">
            <div className="flex items-center space-x-3.5 px-2">
              <Avatar fallback={user.name} src={user.profileImageUrl} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-6 z-10 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 capitalize">
              {pathname.split('/')[1] || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
