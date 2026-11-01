import React from 'react';
import { Menu, Sun, Moon, RotateCcw, User, Users } from 'lucide-react';
import { useAuth } from '../../store/authContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onResetData }) => {
  const { usuario, alternarSocio, alternarPerfil, temaEscuro, alternarTema } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-maker-darkCard/90 backdrop-blur-md border-b border-maker-border dark:border-maker-darkBorder px-4 sm:px-6 flex items-center justify-between">
      {/* Esquerda: Botão Menu Mobile + Localidade */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            📍 Tubarão / SC
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Gestão Interna • Software: <strong>MakerPixel Contábil</strong>
          </span>
        </div>
      </div>

      {/* Direita: Alternador Rápido de Sócio / Perfil (para testes rápidos das regras) + Ações */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Seletor Rápido de Simulação de Usuário */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="hidden md:inline-flex text-[11px] font-semibold text-slate-500 px-2">
            Simular:
          </span>
          <button
            onClick={() => alternarSocio(1)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              usuario.nome.includes('Maurício')
                ? 'bg-maker-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Logar como Maurício (Sócio 1 - 50%)"
          >
            Sócio 1 (Maurício)
          </button>
          <button
            onClick={() => alternarSocio(2)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              usuario.nome.includes('Felipe')
                ? 'bg-maker-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Logar como Felipe (Sócio 2 - 50%)"
          >
            Sócio 2 (Felipe)
          </button>
          <button
            onClick={() => alternarPerfil(usuario.perfil === 'SOCIO' ? 'COLABORADOR' : 'SOCIO')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              usuario.perfil === 'COLABORADOR'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Alternar para perfil de Colaborador (sem acesso financeiro)"
          >
            Colaborador
          </button>
        </div>

        {/* Alternar Tema Escuro */}
        <button
          onClick={alternarTema}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={temaEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {temaEscuro ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Resetar Dados */}
        <button
          onClick={onResetData}
          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Restaurar dados iniciais de demonstração"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
