import React, { useState } from 'react';
import {
  HeadphonesIcon,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { ChamadoSuporte, PrioridadeSuporte, SituacaoSuporte } from '../../types';
import { formatarDataHora } from '../../lib/utils';

export const SuportePage: React.FC = () => {
  const { usuario } = useAuth();
  const { chamados, clientes, contratos, abrirChamado, encerrarChamado } = useAppData();

  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('TODAS');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [chamadoParaEncerrar, setChamadoParaEncerrar] = useState<ChamadoSuporte | null>(null);
  const [solucaoTexto, setSolucaoTexto] = useState('');

  // Form Novo Chamado
  const [clienteId, setClienteId] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<PrioridadeSuporte>('NORMAL');

  // Filtros
  const chamadosFiltrados = chamados.filter(ch => {
    const cli = clientes.find(c => c.id === ch.clienteId);
    const matchTexto =
      ch.numero.toLowerCase().includes(busca.toLowerCase()) ||
      ch.assunto.toLowerCase().includes(busca.toLowerCase()) ||
      (cli?.nomeFantasia || '').toLowerCase().includes(busca.toLowerCase());

    const matchPrioridade = filtroPrioridade === 'TODAS' || ch.prioridade === filtroPrioridade;
    return matchTexto && matchPrioridade;
  });

  const getBadgePrioridade = (p: PrioridadeSuporte): { variant: BadgeVariant; label: string } => {
    switch (p) {
      case 'ALTA':
        return { variant: 'danger', label: 'Alta (SLA 4h)' };
      case 'NORMAL':
        return { variant: 'warning', label: 'Normal (SLA 24h)' };
      case 'BAIXA':
        return { variant: 'neutral', label: 'Baixa (SLA 48h)' };
    }
  };

  const handleCriarChamado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !assunto.trim() || !descricao.trim()) {
      alert('Preencha os campos obrigatórios do chamado.');
      return;
    }
    abrirChamado({
      clienteId,
      assunto,
      descricao,
      prioridade,
      situacao: 'ABERTO',
      slaHorasUteis: prioridade === 'ALTA' ? 4 : prioridade === 'BAIXA' ? 48 : 24,
      atendente: usuario.nome,
    });
    setModalNovoAberto(false);
    setAssunto('');
    setDescricao('');
  };

  const handleConfirmarEncerramento = () => {
    if (!chamadoParaEncerrar || !solucaoTexto.trim()) {
      alert('Informe a solução aplicada para encerrar o chamado.');
      return;
    }
    encerrarChamado(chamadoParaEncerrar.id, solucaoTexto, usuario.nome);
    setChamadoParaEncerrar(null);
    setSolucaoTexto('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeadphonesIcon className="w-6 h-6 text-maker-primary" /> Suporte Técnico ao Cliente
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de chamados com prazos de SLA (Alta 4h, Normal 24h, Baixa 48h) restrito a clientes com contrato ativo.
          </p>
        </div>

        <button
          onClick={() => {
            setClienteId(clientes[0]?.id || '');
            setModalNovoAberto(true);
          }}
          className="min-h-[44px] px-5 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-maker-primary/20 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Abrir Chamado
        </button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por protocolo, assunto ou cliente..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filtroPrioridade}
            onChange={e => setFiltroPrioridade(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-700 dark:text-slate-300 focus:outline-none min-h-[44px]"
          >
            <option value="TODAS">Todas as Prioridades</option>
            <option value="ALTA">Alta (4h úteis)</option>
            <option value="NORMAL">Normal (24h)</option>
            <option value="BAIXA">Baixa (48h)</option>
          </select>
        </div>
      </div>

      {/* Tabela de Chamados */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Protocolo</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Assunto / Descrição</th>
                <th className="py-3.5 px-4">Prioridade (SLA)</th>
                <th className="py-3.5 px-4">Prazo Limite</th>
                <th className="py-3.5 px-4">Situação</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
              {chamadosFiltrados.map(ch => {
                const cli = clientes.find(c => c.id === ch.clienteId);
                const badgePrio = getBadgePrioridade(ch.prioridade);

                return (
                  <tr key={ch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 dark:text-white">
                      {ch.numero}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {cli?.nomeFantasia || cli?.razaoSocial}
                      </p>
                      <p className="text-[11px] text-slate-400">{cli?.cidade} / {cli?.uf}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {ch.assunto}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{ch.descricao}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={badgePrio.variant} size="sm">
                        {badgePrio.label}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {formatarDataHora(ch.prazoLimite)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          ch.situacao === 'ENCERRADO'
                            ? 'success'
                            : ch.situacao === 'EM_ATENDIMENTO'
                            ? 'primary'
                            : 'warning'
                        }
                        size="sm"
                        dot
                      >
                        {ch.situacao}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {ch.situacao !== 'ENCERRADO' ? (
                        <button
                          onClick={() => setChamadoParaEncerrar(ch)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolver
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Resolvido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO CHAMADO */}
      <Modal
        isOpen={modalNovoAberto}
        onClose={() => setModalNovoAberto(false)}
        title="Abrir Chamado de Suporte"
        subtitle="Regra: restrito a escritórios com contrato ATIVO"
        maxWidth="md"
      >
        <form onSubmit={handleCriarChamado} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cliente Solicitante *
            </label>
            <select
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            >
              <option value="">Selecione um cliente com contrato ativo...</option>
              {clientes.map(c => {
                const temContratoAtivo = contratos.some(
                  ct => ct.clienteId === c.id && ct.situacao === 'ATIVO'
                );
                return (
                  <option key={c.id} value={c.id}>
                    {c.nomeFantasia} {temContratoAtivo ? '(Ativo)' : '(Sem contrato ativo)'}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Prioridade / Nível de SLA *
            </label>
            <select
              value={prioridade}
              onChange={e => setPrioridade(e.target.value as PrioridadeSuporte)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            >
              <option value="ALTA">ALTA - Prazo máximo de 4 horas úteis (Sistema parado)</option>
              <option value="NORMAL">NORMAL - Prazo máximo de 24 horas (Dúvidas de parametrização)</option>
              <option value="BAIXA">BAIXA - Prazo máximo de 48 horas (Melhorias e sugestões)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assunto Resumido *
            </label>
            <input
              type="text"
              required
              value={assunto}
              onChange={e => setAssunto(e.target.value)}
              placeholder="Ex: Erro ao importar extrato OFX no módulo SCI..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Detalhada do Problema *
            </label>
            <textarea
              required
              rows={4}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Explique o que aconteceu, mensagens exibidas na tela, etc..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalNovoAberto(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-maker-primary text-white shadow-sm"
            >
              Abrir Chamado
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL RESOLVER CHAMADO */}
      <Modal
        isOpen={Boolean(chamadoParaEncerrar)}
        onClose={() => setChamadoParaEncerrar(null)}
        title="Registrar Solução do Chamado"
        subtitle={`Protocolo ${chamadoParaEncerrar?.numero}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Descreva a solução prestada ao cliente para alimentar a base de conhecimento e encerrar o ticket.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Solução Aplicada *
            </label>
            <textarea
              required
              rows={4}
              value={solucaoTexto}
              onChange={e => setSolucaoTexto(e.target.value)}
              placeholder="Ex: Parametrização corrigida no de/para de contas bancárias. Cliente orientado e importação concluída com sucesso."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setChamadoParaEncerrar(null)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarEncerramento}
              className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-sm"
            >
              Encerrar Chamado
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
