import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/authContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/Dashboard';
import { ClientesPage } from './pages/Clientes';
import { ProspeccaoPage } from './pages/Prospeccao';
import { ContratosPage } from './pages/Contratos';
import { FinanceiroPage } from './pages/Financeiro';
import { DistribuicaoLucrosPage } from './pages/DistribuicaoLucros';
import { ProjetosPage } from './pages/Projetos';
import { TreinamentosPage } from './pages/Treinamentos';
import { SuportePage } from './pages/Suporte';
import { ConfiguracoesPage } from './pages/Configuracoes';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="prospeccao" element={<ProspeccaoPage />} />
            <Route path="contratos" element={<ContratosPage />} />
            <Route path="financeiro" element={<FinanceiroPage />} />
            <Route path="distribuicao-lucros" element={<DistribuicaoLucrosPage />} />
            <Route path="projetos" element={<ProjetosPage />} />
            <Route path="treinamentos" element={<TreinamentosPage />} />
            <Route path="suporte" element={<SuportePage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
