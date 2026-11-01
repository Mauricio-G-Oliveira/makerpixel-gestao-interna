import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, History } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Contrato } from '../../types';
import { formatarMoeda, formatarData } from '../../lib/utils';
import { useAuth } from '../../store/authContext';

interface ReajusteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contrato: Contrato;
  onAplicarReajuste: (
    contratoId: string,
    percentual: number,
    novoValor: number,
    socioAprovador: string,
    indice: string
  ) => void;
}

export const ReajusteModal: React.FC<ReajusteModalProps> = ({
  isOpen,
  onClose,
  contrato,
  onAplicarReajuste,
}) => {
  const { usuario } = useAuth();
  const [percentual, setPercentual] = useState<number>(4.8); // IPCA médio sugerido
  const [indice, setIndice] = useState(contrato.indiceReajuste || 'IPCA');

  const valorAtual = contrato.valorTotal;
  const acrescimo = (valorAtual * (percentual || 0)) / 100;
  const novoValor = Math.round((valorAtual + acrescimo) * 100) / 100;

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (percentual <= 0) {
      alert('Informe um percentual válido para o reajuste.');
      return;
    }
    onAplicarReajuste(contrato.id, percentual, novoValor, usuario.nome, indice);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reajuste Anual de Contrato"
      subtitle={`Contrato ${contrato.numero} • Aniversário de Vigência`}
      maxWidth="md"
    >
      <form onSubmit={handleConfirmar} className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-300">
          O reajuste atualiza o valor da mensalidade para as próximas faturas geradas e registra o valor anterior no histórico para auditoria.
        </p>

        {/* Inputs de Percentual e Índice */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Índice Acordado
            </label>
            <input
              type="text"
              value={indice}
              onChange={e => setIndice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Percentual (%) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={percentual}
              onChange={e => setPercentual(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            />
          </div>
        </div>

        {/* Prévia Comparativa de Valores */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Valor Atual da Mensalidade:</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {formatarMoeda(valorAtual)}
            </span>
          </div>

          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Acréscimo ({percentual}%):</span>
            <span>+ {formatarMoeda(acrescimo)}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Novo Valor Reajustado:</span>
            <span className="font-extrabold text-maker-primary text-base">
              {formatarMoeda(novoValor)}
            </span>
          </div>
        </div>

        {/* Histórico Anterior */}
        {contrato.historicoReajustes && contrato.historicoReajustes.length > 0 && (
          <div className="text-xs pt-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Reajustes Anteriores
            </span>
            <div className="space-y-1">
              {contrato.historicoReajustes.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[11px] p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  <span>
                    {formatarData(h.data)} ({h.percentual}% {h.indice})
                  </span>
                  <span>
                    {formatarMoeda(h.valorAnterior)} ➔ <strong>{formatarMoeda(h.valorNovo)}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-maker-primary hover:bg-maker-primaryHover text-white shadow-md shadow-maker-primary/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirmar Reajuste como {usuario.nome}
          </button>
        </div>
      </form>
    </Modal>
  );
};
