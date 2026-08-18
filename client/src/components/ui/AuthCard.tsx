import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  footer,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>

      {footer && (
        <div className="px-6 py-4 md:px-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 text-center">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AuthCard;
