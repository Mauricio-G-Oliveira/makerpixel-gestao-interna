import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  titulo: string;
  valor: string;
  subtexto?: string;
  subtextoDestaque?: string;
  icone: LucideIcon;
  iconeCor?: 'primary' | 'success' | 'danger' | 'warning';
  badgeTexto?: string;
  badgeTipo?: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  titulo,
  valor,
  subtexto,
  subtextoDestaque,
  icone: Icone,
  iconeCor = 'primary',
  badgeTexto,
  badgeTipo = 'neutral',
  onClick,
  className = '',
}) => {
  const iconColorClasses = {
    primary: 'bg-blue-50 text-maker-primary dark:bg-blue-950/50 dark:text-blue-400',
    success: 'bg-emerald-50 text-maker-success dark:bg-emerald-950/50 dark:text-emerald-400',
    danger: 'bg-rose-50 text-maker-danger dark:bg-rose-950/50 dark:text-rose-400',
    warning: 'bg-amber-50 text-maker-warning dark:bg-amber-950/50 dark:text-amber-400',
  };

  const badgeColorClasses = {
    primary: 'bg-blue-50 text-maker-primary border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
    success: 'bg-emerald-50 text-maker-success border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
    danger: 'bg-rose-50 text-maker-danger border-rose-200 dark:bg-rose-950/50 dark:border-rose-800',
    warning: 'bg-amber-50 text-maker-warning border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{titulo}</span>
        <div className={`p-2.5 rounded-xl ${iconColorClasses[iconeCor]}`}>
          <Icone className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {valor}
        </h3>
        {badgeTexto && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeColorClasses[badgeTipo]}`}
          >
            {badgeTexto}
          </span>
        )}
      </div>

      {(subtexto || subtextoDestaque) && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {subtextoDestaque && (
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {subtextoDestaque}
            </span>
          )}
          <span>{subtexto}</span>
        </p>
      )}
    </div>
  );
};
