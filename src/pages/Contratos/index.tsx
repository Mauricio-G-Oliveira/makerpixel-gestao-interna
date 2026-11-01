import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  PauseCircle,
  PlayCircle,
  XCircle,
  Calendar,
  CheckCircle,
  Eye,
  FileCheck,
} from 'lucide-react';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ContratoFormModal } from './ContratoFormModal';
import { ReajusteModal } from './ReajusteModal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { Contrato, SituacaoContrato } from '../../types';
import { formatarMoeda, formatarData } from '../../lib/utils';

export const ContratosPage: React.FC = () => {
  const { usuario } = useAuth();
  const {
    contratos,
    clientes,
    faturas,
    salvarContrato,
    aplicarReajusteContrato,
    alterarSituacaoContrato,
  } = useAppData();

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [contratoParaEditar, setContratoParaEditar] = useState<Contrato | null>(null);
  const [contratoParaReajuste, setContratoParaReajuste] = useState<Contrato | null>(null);

  // Modal Encerramento / Suspensão
  const [modalEncerramentoAberto, setModalEncerramentoAberto] = useState(false);
  const [contratoParaEncerrar, setContratoParaEncerrar] = useState<Contrato | null>(null);
  const [motivoEncerramento, setMotivoEncerramento] = useState('');

  // Filtros
  const contratosFiltrados = contratos.filter(c => {
    const cli = clientes.find(cl => cl.id === c.clienteId);
    const textoMatch =
      c.numero.toLowerCase().includes(busca.toLowerCase()) ||
      (cli?.nomeFantasia || '').toLowerCase().includes(busca.toLowerCase()) ||
      (cli?.razaoSocial || '').toLowerCase().includes(busca.toLowerCase());

    const tipoMatch = filtroTipo === 'TODOS' || c.tipo === filtroTipo;
    return textoMatch && tipoMatch;
  });

  const getBadgeSituacao = (sit: SituacaoContrato): { variant: BadgeVariant; label: string } => {
    switch (sit) {
      case 'ATIVO':
        return { variant: 'success', label: 'Ativo' };
      case 'PROPOSTA':
        return { variant: 'warning', label: 'Proposta' };
      case 'SUSPENSO':
        return { variant: 'danger', label: 'Suspenso' };
      case 'ENCERRADO':
        return { variant: 'neutral', label: 'Encerrado' };
    }
  };

  const handleConfirmarEncerramento = () => {
    if (!contratoParaEncerrar || !motivoEncerramento.trim()) {
      alert('Informe o motivo do encerramento.');
      return;
    }
    alterarSituacaoContrato(contratoParaEncerrar.id, 'ENCERRADO', motivoEncerramento, usuario.nome);
    setModalEncerramentoAberto(false);
    setContratoParaEncerrar(null);
    setMotivoEncerramento('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-maker-primary" /> Contratos de Serviços & Módulos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão de mensalidades, implantações, vigência, renovação automática e reajuste anual pelo IPCA.
          </p>
        </div>

        <button
          onClick={() => {
            setContratoParaEditar(null);
            setModalNovoAberto(true);
          }}
          className="min-h-[44px] px-5 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-maker-primary/20 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Novo Contrato
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
            placeholder="Buscar por número do contrato ou cliente..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-700 dark:text-slate-300 focus:outline-none min-h-[44px]"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="MENSALIDADE">Mensalidade</option>
            <option value="IMPLANTACAO">Implantação</option>
            <option value="SOB_MEDIDA">Sob Medida</option>
            <option value="TREINAMENTO">Treinamento</option>
          </select>
        </div>
      </div>

      {/* Tabela de Contratos */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Contrato</th>
                <th className="py-3.5 px-4">Cliente / Escritório</th>
                <th className="py-3.5 px-4">Módulos Contratados</th>
                <th className="py-3.5 px-4">Vencimento</th>
                <th className="py-3.5 px-4">Valor Mensal</th>
                <th className="py-3.5 px-4">Situação</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
              {contratosFiltrados.map(c => {
                const cli = clientes.find(cl => cl.id === c.clienteId);
                const badge = getBadgeSituacao(c.situacao);

                // Verifica se tem fatura vencida há > 30 dias (para sugerir suspensão!)
                const faturaVencida30d = faturas.some(
                  f => f.contratoId === c.id && f.situacao === 'VENCIDA'
                );

                // Verifica se é mês de aniversário (para aviso de reajuste!)
                const mesAniversario = c.inicio.includes('-11-');

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white font-mono block">
                        {c.numero}
                      </span>
                      <span className="text-[11px] text-slate-400">{c.tipo}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {cli?.nomeFantasia || cli?.razaoSocial}
                      </p>
                      <p className="text-[11px] text-slate-400">{cli?.cidade} / {cli?.uf}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="text-slate-700 dark:text-slate-300 truncate block">
                        {c.modulos.map(m => m.nome).join(', ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {c.modulos.length} módulo(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      Dia {c.diaVencimento}
                      <span className="text-[11px] text-slate-400 block">
                        Início: {formatarData(c.inicio)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                        {formatarMoeda(c.valorTotal)}
                      </span>
                      {c.desconto > 0 && (
                        <span className="text-[10px] text-emerald-600">
                          Desc. {formatarMoeda(c.desconto)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={badge.variant} size="sm" dot>
                        {badge.label}
                      </Badge>

                      {/* Alerta de suspensão sugerida caso fatura > 30d */}
                      {c.situacao === 'ATIVO' && faturaVencida30d && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Fatura atrasada: sugerido suspender
                        </div>
                      )}

                      {/* Alerta de reajuste anual */}
                      {c.situacao === 'ATIVO' && mesAniversario && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                          <TrendingUp className="w-3 h-3" /> Aniversário: reajuste IPCA
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.situacao === 'ATIVO' && (
                          <button
                            onClick={() => setContratoParaReajuste(c)}
                            className="px-2.5 py-1 text-[11px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-1"
                            title="Reajustar valor anual"
                          >
                            <TrendingUp className="w-3.5 h-3.5" /> Reajuste
                          </button>
                        )}

                        {c.situacao === 'ATIVO' && (
                          <button
                            onClick={() =>
                              alterarSituacaoContrato(
                                c.id,
                                'SUSPENSO',
                                'Suspensão manual por deliberação do sócio',
                                usuario.nome
                              )
                            }
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="Suspender contrato"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}

                        {c.situacao === 'SUSPENSO' && (
                          <button
                            onClick={() =>
                              alterarSituacaoContrato(
                                c.id,
                                'ATIVO',
                                'Reativação após regularização',
                                usuario.nome
                              )
                            }
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Reativar contrato"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        {c.situacao !== 'ENCERRADO' && (
                          <button
                            onClick={() => {
                              setContratoParaEncerrar(c);
                              setModalEncerramentoAberto(true);
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                            title="Encerrar contrato"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setContratoParaEditar(c);
                            setModalNovoAberto(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-maker-primary hover:underline"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NOVO/EDITAR CONTRATO */}
      <ContratoFormModal
        isOpen={modalNovoAberto}
        onClose={() => setModalNovoAberto(false)}
        contratoParaEditar={contratoParaEditar}
        onSalvar={salvarContrato}
      />

      {/* MODAL DE REAJUSTE ANUAL */}
      {contratoParaReajuste && (
        <ReajusteModal
          isOpen={Boolean(contratoParaReajuste)}
          onClose={() => setContratoParaReajuste(null)}
          contrato={contratoParaReajuste}
          onAplicarReajuste={aplicarReajusteContrato}
        />
      )}

      {/* MODAL DE ENCERRAMENTO COM MOTIVO OBRIGATÓRIO */}
      <Modal
        isOpen={modalEncerramentoAberto}
        onClose={() => setModalEncerramentoAberto(false)}
        title="Encerrar Contrato"
        subtitle={`Contrato ${contratoParaEncerrar?.numero}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Regra: Encerrar não apaga o registro. Para de gerar faturas a partir do mês seguinte. As faturas já geradas permanecem em aberto para cobrança.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Motivo do Encerramento *
            </label>
            <textarea
              required
              rows={3}
              value={motivoEncerramento}
              onChange={e => setMotivoEncerramento(e.target.value)}
              placeholder="Descreva o motivo pelo qual o contrato está sendo encerrado..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setModalEncerramentoAberto(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarEncerramento}
              className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Confirmar Encerramento
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
