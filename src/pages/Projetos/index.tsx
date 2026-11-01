import React, { useState } from 'react';
import {
  Kanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Plus,
  Play,
  Calendar,
  DollarSign,
  BarChart2,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { Projeto, EtapaProjeto } from '../../types';
import { formatarData, formatarMoeda } from '../../lib/utils';

export const ProjetosPage: React.FC = () => {
  const { usuario } = useAuth();
  const { projetos, clientes, contratos, concluirEtapaProjeto, apontarHorasProjeto } = useAppData();

  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto>(projetos[0]);
  const [modalHorasAberto, setModalHorasAberto] = useState(false);
  const [etapaParaHoras, setEtapaParaHoras] = useState<EtapaProjeto | null>(null);
  const [horasInput, setHorasInput] = useState<number>(2);

  const projetoAtual = projetos.find(p => p.id === (projetoSelecionado?.id || projetos[0]?.id)) || projetos[0];
  const clienteProjeto = clientes.find(c => c.id === projetoAtual?.clienteId);
  const contratoProjeto = contratos.find(c => c.id === projetoAtual?.contratoId);

  const handleConcluirEtapa = (ordem: number) => {
    concluirEtapaProjeto(projetoAtual.id, ordem, usuario.nome);
  };

  const handleSalvarHoras = (e: React.FormEvent) => {
    e.preventDefault();
    if (!etapaParaHoras || horasInput <= 0) return;
    apontarHorasProjeto(projetoAtual.id, etapaParaHoras.ordem, horasInput);
    setModalHorasAberto(false);
    setEtapaParaHoras(null);
  };

  const valorPorHoraCalculado =
    projetoAtual?.horasTotais > 0 && contratoProjeto?.valorTotal
      ? contratoProjeto.valorTotal / projetoAtual.horasTotais
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-maker-primary" /> Implantação MakerPixel Contábil
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle das 5 etapas sequenciais de implantação do software <strong>MakerPixel Contábil</strong>, horas por sócio e faturamento por entrega.
          </p>
        </div>

        {/* Seletor de Projeto */}
        <div className="flex items-center gap-2">
          <select
            value={projetoAtual?.id}
            onChange={e => {
              const p = projetos.find(proj => proj.id === e.target.value);
              if (p) setProjetoSelecionado(p);
            }}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white min-h-[44px]"
          >
            {projetos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de Métricas do Projeto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Horas Gastas pelos Sócios</span>
          <span className="text-2xl font-bold text-maker-primary mt-1 block">
            {projetoAtual?.horasTotais} horas
          </span>
          <span className="text-[11px] text-slate-400">Tempo investido nas rotinas</span>
        </div>

        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Valor do Contrato de Implantação</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {formatarMoeda(contratoProjeto?.valorTotal || 2400)}
          </span>
          <span className="text-[11px] text-slate-400">Total contratado pelo cliente</span>
        </div>

        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Rentabilidade Real (Hora Sócio)</span>
          <span className="text-2xl font-extrabold text-maker-success mt-1 block">
            {formatarMoeda(valorPorHoraCalculado)} / hora
          </span>
          <span className="text-[11px] text-slate-400">Valor do contrato ÷ horas dedicadas</span>
        </div>
      </div>

      {/* AS 5 ETAPAS PADRÃO DO PROJETO COM TRAVA SEQUENCIAL */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Etapas Padrão da Implantação MakerPixel
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Regra de qualidade: uma etapa só pode ser concluída se a etapa anterior estiver 100% finalizada.
            </p>
          </div>
          <Badge variant={projetoAtual?.status === 'CONCLUIDO' ? 'success' : 'primary'}>
            {projetoAtual?.status}
          </Badge>
        </div>

        <div className="space-y-3">
          {projetoAtual?.etapas.map((etapa, idx) => {
            const etapaAnterior = idx > 0 ? projetoAtual.etapas[idx - 1] : null;
            const bloqueada = etapaAnterior ? !etapaAnterior.concluida : false;

            return (
              <div
                key={etapa.ordem}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  etapa.concluida
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : bloqueada
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-maker-darkCard border-maker-primary/30 shadow-sm ring-1 ring-maker-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      etapa.concluida
                        ? 'bg-emerald-600 text-white'
                        : bloqueada
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-maker-primary text-white'
                    }`}
                  >
                    {etapa.concluida ? <CheckCircle2 className="w-5 h-5" /> : etapa.ordem}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                      {etapa.nome}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {etapa.descricao}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                      {etapa.concluida && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          ✓ Concluído em {formatarData(etapa.dataConclusao)} por {etapa.responsavel}
                        </span>
                      )}
                      <span>Horas apontadas: <strong>{etapa.horasRegistradas || 0}h</strong></span>
                      {etapa.prazoEstimado && <span>Prazo: {etapa.prazoEstimado}</span>}
                    </div>
                  </div>
                </div>

                {/* Ações da Etapa */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEtapaParaHoras(etapa);
                      setModalHorasAberto(true);
                    }}
                    className="min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                    title="Apontar horas gastas nesta etapa"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> + Horas
                  </button>

                  {!etapa.concluida && (
                    <button
                      onClick={() => handleConcluirEtapa(etapa.ordem)}
                      disabled={bloqueada}
                      className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        bloqueada
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Concluir Etapa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL APONTAMENTO DE HORAS */}
      {modalHorasAberto && etapaParaHoras && (
        <Modal
          isOpen={modalHorasAberto}
          onClose={() => setModalHorasAberto(false)}
          title="Apontar Horas de Trabalho"
          subtitle={`${etapaParaHoras.nome} • Sócio: ${usuario.nome}`}
          maxWidth="sm"
        >
          <form onSubmit={handleSalvarHoras} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quantidade de Horas Dedicadas *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={horasInput}
                onChange={e => setHorasInput(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalHorasAberto(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-maker-primary text-white shadow-sm"
              >
                Gravar Horas
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
