import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  FileText,
  DollarSign,
  PieChart,
  Kanban,
  GraduationCap,
  HeadphonesIcon,
  Settings,
  X,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { MakerPixelLogo } from '../visual/MakerPixelLogo';
import { useAuth } from '../../store/authContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  badgeContagens?: {
    chamadosAbertos: number;
    leadsSemana: number;
    contratosReajuste: number;
    distribuicaoPendente: boolean;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, badgeContagens }) => {
  const { usuario, isSocio } = useAuth();

  const menuItems = [
    {
      to: '/',
      label: 'Início',
      icon: LayoutDashboard,
      badge: null,
      socioOnly: false,
    },
    {
      to: '/clientes',
      label: 'Clientes',
      icon: Users,
      badge: null,
      socioOnly: false,
    },
    {
      to: '/prospeccao',
      label: 'Prospecção',
      icon: Target,
      badge: badgeContagens?.leadsSemana ? `${badgeContagens.leadsSemana} fila` : null,
      badgeColor: 'bg-maker-primary text-white',
      socioOnly: false,
    },
    {
      to: '/contratos',
      label: 'Contratos',
      icon: FileText,
      badge: badgeContagens?.contratosReajuste ? 'Avisos' : null,
      badgeColor: 'bg-amber-500 text-white',
      socioOnly: false,
    },
    {
      to: '/financeiro',
      label: 'Financeiro',
      icon: DollarSign,
      badge: null,
      socioOnly: true, // Oculto para COLABORADOR
    },
    {
      to: '/distribuicao-lucros',
      label: 'Distribuição de Lucros',
      icon: PieChart,
      badge: badgeContagens?.distribuicaoPendente ? 'Pendente' : null,
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
      socioOnly: true, // Oculto para COLABORADOR
    },
    {
      to: '/projetos',
      label: 'Implantações',
      icon: Kanban,
      badge: null,
      socioOnly: false,
    },
    {
      to: '/treinamentos',
      label: 'Treinamentos',
      icon: GraduationCap,
      badge: null,
      socioOnly: false,
    },
    {
      to: '/suporte',
      label: 'Suporte',
      icon: HeadphonesIcon,
      badge: badgeContagens?.chamadosAbertos ? String(badgeContagens.chamadosAbertos) : null,
      badgeColor: 'bg-rose-500 text-white',
      socioOnly: false,
    },
    {
      to: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
      badge: null,
      socioOnly: true,
    },
  ];

  const itensVisiveis = menuItems.filter(item => !item.socioOnly || isSocio);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Escuro (#0E1726) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-maker-sidebar text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header do Menu */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <MakerPixelLogo light />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge do Perfil Ativo */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSocio ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <UserCheck className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">
              {isSocio ? 'Perfil Sócio' : 'Colaborador'}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-900 text-slate-400">
            {isSocio ? '50%' : 'Limitado'}
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {itensVisiveis.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group min-h-[44px] ${
                    isActive
                      ? 'bg-maker-primary text-white shadow-md shadow-maker-primary/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0 transition-colors" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Rodapé do Sidebar: Identificação do Usuário */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-maker-primary/20 text-maker-primary border border-maker-primary/30 flex items-center justify-center font-bold text-sm">
              {usuario.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{usuario.nome}</p>
              <p className="text-[11px] text-slate-400 truncate">{usuario.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
