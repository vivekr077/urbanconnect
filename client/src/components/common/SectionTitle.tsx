import React from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ className, title, subtitle, align = 'center', ...props }: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-3 mb-10 md:mb-12',
        align === 'center' ? 'text-center items-center' : 'text-left items-start',
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:max-w-xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
export default SectionTitle;
