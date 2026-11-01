import React from 'react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'primary' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-[#0F7A4A] dark:text-emerald-400',
      border: 'border-emerald-200/80 dark:border-emerald-800/40',
      dotColor: 'bg-[#0F7A4A]',
    },
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-[#B42318] dark:text-rose-400',
      border: 'border-rose-200/80 dark:border-rose-800/40',
      dotColor: 'bg-[#B42318]',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-[#B45309] dark:text-amber-400',
      border: 'border-amber-200/80 dark:border-amber-800/40',
      dotColor: 'bg-[#B45309]',
    },
    primary: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-[#2F5BEA] dark:text-blue-400',
      border: 'border-blue-200/80 dark:border-blue-800/40',
      dotColor: 'bg-[#2F5BEA]',
    },
    neutral: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
      dotColor: 'bg-slate-400',
    },
  };

  const current = variantStyles[variant];
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
};
