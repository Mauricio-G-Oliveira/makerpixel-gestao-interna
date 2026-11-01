import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Contrato, TipoContrato, SituacaoContrato, ModuloContratado } from '../../types';
import { MODULOS_DISPONIVEIS } from '../../store/mockData';
import { formatarMoeda } from '../../lib/utils';
import { useAppData } from '../../store/storage';

interface ContratoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoParaEditar?: Contrato | null;
  onSalvar: (dados: Omit<Contrato, 'id' | 'historicoReajustes'> & { id?: string }) => void;
}

export const ContratoFormModal: React.FC<ContratoFormModalProps> = ({
  isOpen,
  onClose,
  contratoParaEditar,
  onSalvar,
}) => {
  const { clientes, contratos } = useAppData();

  const [clienteId, setClienteId] = useState('');
  const [tipo, setTipo] = useState<TipoContrato>('MENSALIDADE');
  const [modulosSelecionados, setModulosSelecionados] = useState<ModuloContratado[]>([]);
  const [desconto, setDesconto] = useState<number>(0);
  const [inicio, setInicio] = useState(new Date().toISOString().substring(0, 10));
  const [vigenciaMeses, setVigenciaMeses] = useState<number>(12);
  const [diaVencimento, setDiaVencimento] = useState<number>(10);
  const [indiceReajuste, setIndiceReajuste] = useState('IPCA');
  const [situacao, setSituacao] = useState<SituacaoContrato>('ATIVO');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (contratoParaEditar) {
      setClienteId(contratoParaEditar.clienteId);
      setTipo(contratoParaEditar.tipo);
      setModulosSelecionados(contratoParaEditar.modulos);
      setDesconto(contratoParaEditar.desconto);
      setInicio(contratoParaEditar.inicio);
      setVigenciaMeses(contratoParaEditar.vigenciaMeses);
      setDiaVencimento(contratoParaEditar.diaVencimento);
      setIndiceReajuste(contratoParaEditar.indiceReajuste);
      setSituacao(contratoParaEditar.situacao);
    } else {
      setClienteId(clientes[0]?.id || '');
      setTipo('MENSALIDADE');
      setModulosSelecionados([MODULOS_DISPONIVEIS[0], MODULOS_DISPONIVEIS[1]]);
      setDesconto(0);
      setInicio(new Date().toISOString().substring(0, 10));
      setVigenciaMeses(12);
      setDiaVencimento(10);
      setIndiceReajuste('IPCA');
      setSituacao('ATIVO');
    }
    setErro(null);
  }, [contratoParaEditar, isOpen, clientes]);

  const somaModulos = modulosSelecionados.reduce((acc, m) => acc + m.preco, 0);
  const valorTotal = Math.max(0, somaModulos - (desconto || 0));

  const handleToggleModulo = (modulo: ModuloContratado) => {
    const existe = modulosSelecionados.some(m => m.id === modulo.id);
    if (existe) {
      setModulosSelecionados(prev => prev.filter(m => m.id !== modulo.id));
    } else {
      setModulosSelecionados(prev => [...prev, modulo]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // Regra 1: Contrato ATIVO exige cliente, tipo, valor > 0, início e dia de vencimento (1 a 28).
    if (!clienteId) {
      setErro('Selecione um cliente.');
      return;
    }
    if (situacao === 'ATIVO' && valorTotal <= 0) {
      setErro('Contrato ATIVO exige valor total maior que zero.');
      return;
    }
    if (diaVencimento < 1 || diaVencimento > 28) {
      setErro('O dia de vencimento deve estar entre 1 e 28.');
      return;
    }

    const numero =
      contratoParaEditar?.numero ||
      `CTR-${new Date().getFullYear()}-${String(contratos.length + 1).padStart(3, '0')}`;

    onSalvar({
      id: contratoParaEditar?.id,
      numero,
      clienteId,
      tipo,
      modulos: modulosSelecionados,
      desconto,
      valorTotal,
      inicio,
      vigenciaMeses,
      diaVencimento,
      indiceReajuste,
      situacao,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contratoParaEditar ? 'Editar Contrato' : 'Novo Contrato de Serviços'}
      subtitle="Definição de módulos, preços, vigência e vencimento"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Cliente e Tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cliente / Escritório Contábil *
            </label>
            <select
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nomeFantasia} ({c.cidade}/{c.uf})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tipo do Contrato *
            </label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value as TipoContrato)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            >
              <option value="MENSALIDADE">MENSALIDADE (Recorrência Mensal)</option>
              <option value="IMPLANTACAO">IMPLANTAÇÃO (Projeto / Etapas)</option>
              <option value="SOB_MEDIDA">SOB MEDIDA (Desenvolvimento Específico)</option>
              <option value="TREINAMENTO">TREINAMENTO (Capacitação de Equipe)</option>
            </select>
          </div>
        </div>

        {/* Seleção de Módulos */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Módulos Contratados (com tabela de preços) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MODULOS_DISPONIVEIS.map(m => {
              const selecionado = modulosSelecionados.some(mod => mod.id === m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleToggleModulo(m)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selecionado
                      ? 'border-maker-primary bg-blue-50 dark:bg-blue-950/40 text-maker-primary font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{m.nome}</span>
                  <span className="font-mono flex-shrink-0">{formatarMoeda(m.preco)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha Financeira: Soma dos módulos, Desconto e Total Final */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Soma dos Módulos:</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              {formatarMoeda(somaModulos)}
            </span>
          </div>

          <div>
            <label className="block text-slate-500 text-[11px] font-bold">Desconto Concedido (R$):</label>
            <input
              type="number"
              min="0"
              step="10"
              value={desconto}
              onChange={e => setDesconto(Number(e.target.value) || 0)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Valor Total Contrato:</span>
            <span className="font-extrabold text-maker-primary text-base">
              {formatarMoeda(valorTotal)}
            </span>
          </div>
        </div>

        {/* Datas e Parâmetros */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Data de Início *
            </label>
            <input
              type="date"
              required
              value={inicio}
              onChange={e => setInicio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vigência (meses)
            </label>
            <input
              type="number"
              min="1"
              value={vigenciaMeses}
              onChange={e => setVigenciaMeses(Number(e.target.value) || 12)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dia Vencimento (1 a 28) *
            </label>
            <input
              type="number"
              min="1"
              max="28"
              required
              value={diaVencimento}
              onChange={e => setDiaVencimento(Number(e.target.value) || 10)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Índice Reajuste
            </label>
            <select
              value={indiceReajuste}
              onChange={e => setIndiceReajuste(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
            >
              <option value="IPCA">IPCA</option>
              <option value="IGP-M">IGP-M</option>
              <option value="INPC">INPC</option>
            </select>
          </div>
        </div>

        {/* Situação */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Situação do Contrato
          </label>
          <select
            value={situacao}
            onChange={e => setSituacao(e.target.value as SituacaoContrato)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px] focus:outline-none"
          >
            <option value="ATIVO">ATIVO (Gera Faturas)</option>
            <option value="PROPOSTA">PROPOSTA (Não gera faturas)</option>
            <option value="SUSPENSO">SUSPENSO (Inadimplência ou pausa)</option>
            <option value="ENCERRADO">ENCERRADO</option>
          </select>
        </div>

        {/* Botões */}
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
            className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-maker-primary hover:bg-maker-primaryHover text-white shadow-md shadow-maker-primary/20"
          >
            Salvar Contrato
          </button>
        </div>
      </form>
    </Modal>
  );
};
