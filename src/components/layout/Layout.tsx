import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppData } from '../../store/storage';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chamados, leads, contratos, fechamentos, resetarParaPadrao } = useAppData();

  const chamadosAbertos = chamados.filter(c => c.situacao === 'ABERTO' || c.situacao === 'EM_ATENDIMENTO').length;
  const leadsSemana = leads.filter(l => l.etapa === 'NOVO' || l.etapa === 'CONTATADO').length;
  const contratosReajuste = contratos.filter(c => c.situacao === 'ATIVO').length;

  // Fechamento pendente de aprovação
  const fechamentoAtual = fechamentos.find(f => f.competencia === '2026-11');
  const distribuicaoPendente = Boolean(
    fechamentoAtual && (!fechamentoAtual.distribuicaoAprovadaSocio1 || !fechamentoAtual.distribuicaoAprovadaSocio2)
  );

  return (
    <div className="min-h-screen bg-maker-bg dark:bg-maker-darkBg text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Fixo / Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        badgeContagens={{
          chamadosAbertos,
          leadsSemana,
          contratosReajuste,
          distribuicaoPendente,
        }}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onResetData={resetarParaPadrao}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Rodapé institucional */}
        <footer className="py-4 px-6 border-t border-maker-border dark:border-maker-darkBorder text-center text-xs text-slate-400">
          MakerPixel Gestão Interna &copy; {new Date().getFullYear()} • Sistema Operacional e Societário • Software Comercial: MakerPixel Contábil
        </footer>
      </div>
    </div>
  );
};
