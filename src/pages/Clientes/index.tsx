import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ClienteFormModal } from './ClienteFormModal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { Cliente, SituacaoCliente } from '../../types';
import { formatarDocumento, formatarTelefone, formatarData } from '../../lib/utils';

export const ClientesPage: React.FC = () => {
  const { usuario } = useAuth();
  const { clientes, contratos, salvarCliente, adicionarInteracaoCliente } = useAppData();

  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('TODAS');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);

  // Modal de Nova Interação
  const [modalInteracaoAberto, setModalInteracaoAberto] = useState(false);
  const [interacaoCanal, setInteracaoCanal] = useState<'WHATSAPP' | 'EMAIL' | 'REUNIAO' | 'TELEFONE'>('WHATSAPP');
  const [interacaoResumo, setInteracaoResumo] = useState('');

  // Filtragem dos clientes
  const clientesFiltrados = clientes.filter(c => {
    const textoMatch =
      c.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
      c.nomeFantasia.toLowerCase().includes(busca.toLowerCase()) ||
      c.documento.includes(busca) ||
      c.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      c.contato.toLowerCase().includes(busca.toLowerCase());

    const situacaoMatch = filtroSituacao === 'TODAS' || c.situacao === filtroSituacao;
    return textoMatch && situacaoMatch;
  });

  const getBadgeSituacao = (situacao: SituacaoCliente): { variant: BadgeVariant; label: string } => {
    switch (situacao) {
      case 'CLIENTE':
        return { variant: 'success', label: 'Cliente Ativo' };
      case 'PROPOSTA':
        return { variant: 'warning', label: 'Proposta' };
      case 'LEAD':
        return { variant: 'primary', label: 'Lead (Prospecção)' };
      case 'EX_CLIENTE':
        return { variant: 'danger', label: 'Ex-Cliente' };
    }
  };

  const handleSalvarInteracao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || !interacaoResumo.trim()) return;

    adicionarInteracaoCliente(clienteSelecionado.id, interacaoCanal, interacaoResumo, usuario.nome);

    // Atualiza estado local do selecionado
    setClienteSelecionado(prev =>
      prev
        ? {
            ...prev,
            historicoInteracoes: [
              {
                id: `int-${Date.now()}`,
                data: new Date().toISOString().substring(0, 10),
                canal: interacaoCanal,
                resumo: interacaoResumo,
                autor: usuario.nome,
              },
              ...(prev.historicoInteracoes || []),
            ],
          }
        : null
    );

    setInteracaoResumo('');
    setModalInteracaoAberto(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-maker-primary" /> Clientes e Escritórios Contábeis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão unificada de leads, propostas e escritórios clientes da MakerPixel.
          </p>
        </div>

        <button
          onClick={() => {
            setClienteParaEditar(null);
            setModalNovoAberto(true);
          }}
          className="min-h-[44px] px-5 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-maker-primary/20 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Novo Cliente / Lead
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, razão social, CNPJ, cidade ou contato..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filtroSituacao}
            onChange={e => setFiltroSituacao(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-700 dark:text-slate-300 focus:outline-none min-h-[44px]"
          >
            <option value="TODAS">Todas as Situações</option>
            <option value="CLIENTE">Clientes Ativos</option>
            <option value="PROPOSTA">Em Proposta</option>
            <option value="LEAD">Leads (Prospecção)</option>
            <option value="EX_CLIENTE">Ex-Clientes</option>
          </select>
        </div>
      </div>

      {/* Grid de Lista de Clientes e Painel Lateral de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela / Cards de Clientes */}
        <div className={`space-y-3 ${clienteSelecionado ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Escritório Contábil</th>
                    <th className="py-3.5 px-4">Localidade</th>
                    <th className="py-3.5 px-4">Contato / Telefone</th>
                    <th className="py-3.5 px-4">Situação</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum escritório contábil encontrado para o filtro.
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map(cli => {
                      const badge = getBadgeSituacao(cli.situacao);
                      const isSelected = clienteSelecionado?.id === cli.id;
                      return (
                        <tr
                          key={cli.id}
                          onClick={() => setClienteSelecionado(cli)}
                          className={`cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                            isSelected ? 'bg-blue-50/60 dark:bg-blue-950/30' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {cli.nomeFantasia}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {formatarDocumento(cli.documento)}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            {cli.cidade} / {cli.uf}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-slate-700 dark:text-slate-200">{cli.contato || '-'}</p>
                            <p className="text-[11px] text-slate-400">
                              {formatarTelefone(cli.telefone)}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={badge.variant} size="sm" dot>
                              {badge.label}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setClienteParaEditar(cli);
                                setModalNovoAberto(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-maker-primary hover:underline"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detalhes do Cliente Selecionado e Histórico de Interações */}
        {clienteSelecionado && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-maker-border dark:border-maker-darkBorder">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {clienteSelecionado.nomeFantasia}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {clienteSelecionado.razaoSocial}
                  </p>
                </div>
                <button
                  onClick={() => setClienteSelecionado(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Informações Básicas */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>CNPJ: {formatarDocumento(clienteSelecionado.documento)}</span>
                  {clienteSelecionado.situacaoReceita && (
                    <Badge variant="neutral" size="sm">
                      Receita: {clienteSelecionado.situacaoReceita}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    {clienteSelecionado.endereco || `${clienteSelecionado.cidade}/${clienteSelecionado.uf}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{formatarTelefone(clienteSelecionado.telefone)}</span>
                  <a
                    href={`https://wa.me/55${clienteSelecionado.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-emerald-600 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    WhatsApp <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{clienteSelecionado.email || 'Não informado'}</span>
                </div>
              </div>

              {/* Contratos Vinculados */}
              <div className="mt-4 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Contratos Vinculados
                </h4>
                {(() => {
                  const ctrs = contratos.filter(c => c.clienteId === clienteSelecionado.id);
                  if (ctrs.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 italic">
                        Nenhum contrato ativo. O escritório está como{' '}
                        <strong>{clienteSelecionado.situacao}</strong>.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      {ctrs.map(c => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white">
                              {c.numero}
                            </span>
                            <span className="text-[11px] text-slate-400 block">{c.tipo}</span>
                          </div>
                          <Badge variant={c.situacao === 'ATIVO' ? 'success' : 'warning'} size="sm">
                            {c.situacao}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Linha do Tempo / Histórico de Interações */}
              <div className="mt-4 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Histórico de Interações
                  </h4>
                  <button
                    onClick={() => setModalInteracaoAberto(true)}
                    className="text-xs font-bold text-maker-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Interação
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {(!clienteSelecionado.historicoInteracoes ||
                    clienteSelecionado.historicoInteracoes.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">
                      Nenhuma interação registrada até o momento.
                    </p>
                  ) : (
                    clienteSelecionado.historicoInteracoes.map(int => (
                      <div
                        key={int.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {int.canal} • {int.autor}
                          </span>
                          <span>{formatarData(int.data)}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200">{int.resumo}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <ClienteFormModal
        isOpen={modalNovoAberto}
        onClose={() => setModalNovoAberto(false)}
        clienteParaEditar={clienteParaEditar}
        onSalvar={salvarCliente}
      />

      {/* MODAL DE REGISTRO DE INTERAÇÃO */}
      <Modal
        isOpen={modalInteracaoAberto}
        onClose={() => setModalInteracaoAberto(false)}
        title="Nova Interação com o Cliente"
        subtitle={clienteSelecionado?.nomeFantasia}
        maxWidth="md"
      >
        <form onSubmit={handleSalvarInteracao} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Canal de Contato
            </label>
            <select
              value={interacaoCanal}
              onChange={e => setInteracaoCanal(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none min-h-[44px]"
            >
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">E-mail</option>
              <option value="REUNIAO">Reunião Presencial / Online</option>
              <option value="TELEFONE">Ligação Telefônica</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resumo da Conversa / Alinhamento *
            </label>
            <textarea
              required
              rows={4}
              value={interacaoResumo}
              onChange={e => setInteracaoResumo(e.target.value)}
              placeholder="Descreva o que foi tratado, dúvidas sanadas ou próximos passos acordados..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalInteracaoAberto(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 text-xs font-bold rounded-xl bg-maker-primary text-white hover:bg-maker-primaryHover shadow-sm"
            >
              Gravar Interação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
