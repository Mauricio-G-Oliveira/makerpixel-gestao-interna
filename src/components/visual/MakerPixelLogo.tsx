import React from 'react';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
  light?: boolean;
}

export const MakerPixelLogo: React.FC<LogoProps> = ({ className = '', collapsed = false, light = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Ícone Pixel Tech */}
      <div className="relative w-9 h-9 flex-shrink-0 bg-slate-900 rounded-lg p-1.5 border border-slate-700/60 shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid de Pixels estilizados formando um M / P */}
          <rect x="2" y="3" width="5" height="5" rx="1.2" fill="#2F5BEA" />
          <rect x="9.5" y="3" width="5" height="5" rx="1.2" fill="#0F7A4A" />
          <rect x="17" y="3" width="5" height="5" rx="1.2" fill="#2F5BEA" />
          <rect x="2" y="10" width="5" height="5" rx="1.2" fill="#2F5BEA" />
          <rect x="9.5" y="10" width="5" height="5" rx="1.2" fill="#3B82F6" />
          <rect x="17" y="10" width="5" height="5" rx="1.2" fill="#2F5BEA" />
          <rect x="2" y="17" width="5" height="5" rx="1.2" fill="#2F5BEA" />
          <rect x="17" y="17" width="5" height="5" rx="1.2" fill="#B45309" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-extrabold text-lg leading-tight">
            <span className={light ? 'text-white' : 'text-slate-900 dark:text-white'}>Maker</span>
            <span className="text-maker-primary ml-0.5">Pixel</span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Gestão Interna
          </span>
        </div>
      )}
    </div>
  );
};
