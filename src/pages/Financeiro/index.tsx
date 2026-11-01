import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Receipt,
  Send,
  Lock,
  Unlock,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Badge, BadgeVariant } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { Fatura, Despesa, CategoriaDespesa } from '../../types';
import { formatarMoeda, formatarData, formatarCompetencia } from '../../lib/utils';

export const FinanceiroPage: React.FC = () => {
  const { usuario, isSocio } = useAuth();
  const {
    faturas,
    despesas,
    clientes,
    contratos,
    fechamentos,
    parametros,
    gerarFaturasMes,
    baixarFatura,
    cancelarFatura,
    salvarDespesa,
    fecharMes,
    reabrirMes,
  } = useAppData();

  const [abaAtiva, setAbaAtiva] = useState<'faturas' | 'despesas' | 'fechamento'>('faturas');
  const [competenciaFiltro, setCompetenciaFiltro] = useState<string>('2026-11');

  // Modal Baixa Fatura
  const [faturaParaBaixa, setFaturaParaBaixa] = useState<Fatura | null>(null);
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().substring(0, 10));
  const [valorRecebido, setValorRecebido] = useState<number>(0);

  // Modal Cancelar Fatura
  const [faturaParaCancelar, setFaturaParaCancelar] = useState<Fatura | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  // Modal Régua de Cobrança
  const [faturaParaRegua, setFaturaParaRegua] = useState<Fatura | null>(null);
  const [faseRegua, setFaseRegua] = useState<'lembrete3d' | 'vencimento' | 'atraso5d' | 'atraso15d'>('lembrete3d');

  // Modal Nova Despesa
  const [modalNovaDespesa, setModalNovaDespesa] = useState(false);
  const [despDescricao, setDespDescricao] = useState('');
  const [despCategoria, setDespCategoria] = useState<CategoriaDespesa>('INFRAESTRUTURA');
  const [despValor, setDespValor] = useState<number>(0);
  const [despTipo, setDespTipo] = useState<'FIXA' | 'VARIAVEL'>('FIXA');

  // Modal Reabertura de Mês
  const [modalReabrirAberto, setModalReabrirAberto] = useState(false);
  const [motivoReabertura, setMotivoReabertura] = useState('');

  // Status de Fechamento da competência atual
  const fechamentoMesAtual = fechamentos.find(f => f.competencia === competenciaFiltro);
  const mesEstaTravado = Boolean(fechamentoMesAtual?.fechado);

  // Faturas e Despesas filtradas por competência
  const faturasCompetencia = faturas.filter(f => f.competencia === competenciaFiltro);
  const despesasCompetencia = despesas.filter(d => d.competencia === competenciaFiltro);

  // CÁLCULOS FINANCEIROS EM REGIME DE CAIXA
  const totalRecebidoCaixa = faturasCompetencia
    .filter(f => f.situacao === 'PAGA')
    .reduce((acc, f) => acc + (f.valorRecebido || f.valorBruto), 0);

  const totalAReceberAberto = faturasCompetencia
    .filter(f => f.situacao === 'ABERTA' || f.situacao === 'VENCIDA')
    .reduce((acc, f) => acc + f.valorBruto, 0);

  const totalDespesasPagas = despesasCompetencia
    .filter(d => d.paga)
    .reduce((acc, d) => acc + d.valor, 0);

  const lucroRegimeCaixa = totalRecebidoCaixa - totalDespesasPagas;

  // Ações
  const handleGerarFaturas = () => {
    const { geradas, duplicadas } = gerarFaturasMes(competenciaFiltro, usuario.nome);
    alert(
      `Job Executado:\n• ${geradas} faturas novas geradas.\n• ${duplicadas} contratos já faturados (não duplicados conforme chave única).`
    );
  };

  const handleConfirmarBaixa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faturaParaBaixa) return;
    baixarFatura(faturaParaBaixa.id, dataRecebimento, valorRecebido, usuario.nome);
    setFaturaParaBaixa(null);
  };

  const handleConfirmarCancelamento = () => {
    if (!faturaParaCancelar || !motivoCancelamento.trim()) {
      alert('Informe o motivo do cancelamento da fatura.');
      return;
    }
    cancelarFatura(faturaParaCancelar.id, motivoCancelamento, usuario.nome);
    setFaturaParaCancelar(null);
    setMotivoCancelamento('');
  };

  const handleSalvarDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!despDescricao.trim() || despValor <= 0) {
      alert('Preencha os campos obrigatórios da despesa.');
      return;
    }
    salvarDespesa({
      descricao: despDescricao,
      categoria: despCategoria,
      valor: despValor,
      data: new Date().toISOString().substring(0, 10),
      competencia: competenciaFiltro,
      tipo: despTipo,
      paga: true,
    });
    setModalNovaDespesa(false);
    setDespDescricao('');
    setDespValor(0);
  };

  const handleFecharCompetencia = () => {
    if (!confirm(`Deseja fechar a competência ${competenciaFiltro}? Os lançamentos serão travados para auditoria.`)) {
      return;
    }
    fecharMes(competenciaFiltro, usuario.nome);
  };

  const handleConfirmarReabertura = () => {
    if (!motivoReabertura.trim()) {
      alert('O motivo da reabertura é obrigatório.');
      return;
    }
    reabrirMes(competenciaFiltro, motivoReabertura, usuario.nome);
    setModalReabrirAberto(false);
    setMotivoReabertura('');
  };

  // Mensagens da Régua de Cobrança
  const getMensagemRegua = (fat: Fatura) => {
    const cli = clientes.find(c => c.id === fat.clienteId);
    const valor = formatarMoeda(fat.valorBruto);
    const data = formatarData(fat.dataVencimento);

    switch (faseRegua) {
      case 'lembrete3d':
        return `Olá ${cli?.contato || 'Prezado(a)'}, tudo bem? Lembramos que a fatura referente à mensalidade MakerPixel no valor de ${valor} vencerá em 3 dias (${data}). Segue o boleto/PIX para programação.`;
      case 'vencimento':
        return `Olá ${cli?.contato || 'Prezado(a)'}! Sua fatura MakerPixel no valor de ${valor} vence hoje (${data}). Seguem os dados para pagamento facilitado via PIX.`;
      case 'atraso5d':
        return `Prezado(a) ${cli?.contato || 'Cliente'}, notamos uma pendência da fatura ${fat.numero} de ${valor} vencida em ${data}. Conforme contrato, incide multa de 2% + 1% juros. Por gentileza, nos informe a previsão de regularização.`;
      case 'atraso15d':
        return `URGENTE: Prezado(a) ${cli?.contato || 'Cliente'}, sua fatura no valor de ${valor} encontra-se com mais de 15 dias de atraso. Para evitar a suspensão dos serviços e acessos aos robôs SCI, favor regularizar imediatamente.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-maker-primary" /> Gestão Financeira & Caixa
            </h1>
            {mesEstaTravado ? (
              <Badge variant="danger" size="sm">
                <Lock className="w-3 h-3 inline mr-1" /> Competência Travada
              </Badge>
            ) : (
              <Badge variant="success" size="sm">
                <Unlock className="w-3 h-3 inline mr-1" /> Lançamentos Abertos
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Faturas com chave única, proporcional no 1º mês, baixa com juros/desconto e fechamento em regime de caixa.
          </p>
        </div>

        {/* Seletor de Competência e Ações */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={competenciaFiltro}
            onChange={e => setCompetenciaFiltro(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white min-h-[44px]"
          >
            <option value="2026-11">Novembro / 2026 (Atual)</option>
            <option value="2026-10">Outubro / 2026 (Fechado)</option>
            <option value="2026-09">Setembro / 2026</option>
          </select>

          {!mesEstaTravado ? (
            <button
              onClick={handleFecharCompetencia}
              className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Trava a competência para auditoria e autoriza distribuição de lucros"
            >
              <Lock className="w-4 h-4" /> Fechar Mês
            </button>
          ) : (
            <button
              onClick={() => setModalReabrirAberto(true)}
              className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Exige perfil de sócio e registra na auditoria"
            >
              <Unlock className="w-4 h-4" /> Reabrir Mês
            </button>
          )}
        </div>
      </div>

      {/* Cards de Resumo Financeiro em Regime de Caixa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Recebido no Mês (Caixa)</span>
          <span className="text-2xl font-bold text-maker-success mt-1 block">
            {formatarMoeda(totalRecebidoCaixa)}
          </span>
          <span className="text-[11px] text-slate-400">Entradas compensadas</span>
        </div>

        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">A Receber (Fora do Lucro)</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {formatarMoeda(totalAReceberAberto)}
          </span>
          <span className="text-[11px] text-slate-400">Faturas em aberto / vencidas</span>
        </div>

        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Despesas Pagas</span>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {formatarMoeda(totalDespesasPagas)}
          </span>
          <span className="text-[11px] text-slate-400">Pró-labores, infra e tributos</span>
        </div>

        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Lucro Real de Caixa</span>
          <span className="text-2xl font-extrabold text-maker-primary mt-1 block">
            {formatarMoeda(lucroRegimeCaixa)}
          </span>
          <span className="text-[11px] text-slate-400">Recebido − Pago no mês</span>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex items-center gap-2 border-b border-maker-border dark:border-maker-darkBorder">
        <button
          onClick={() => setAbaAtiva('faturas')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            abaAtiva === 'faturas'
              ? 'text-maker-primary border-b-2 border-maker-primary'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Faturas ({faturasCompetencia.length})
        </button>
        <button
          onClick={() => setAbaAtiva('despesas')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            abaAtiva === 'despesas'
              ? 'text-maker-primary border-b-2 border-maker-primary'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Despesas ({despesasCompetencia.length})
        </button>
      </div>

      {/* CONTEÚDO DA ABA FATURAS */}
      {abaAtiva === 'faturas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-500">
              Faturas emitidas para a competência {formatarCompetencia(competenciaFiltro)}.
            </span>

            {!mesEstaTravado && (
              <button
                onClick={handleGerarFaturas}
                className="min-h-[44px] px-5 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-maker-primary/20 flex items-center gap-2"
                title="Gera 1 fatura por contrato ativo de mensalidade. Chave única impede duplicação!"
              >
                <Zap className="w-4 h-4" /> Gerar Faturas do Mês (Sem Duplicar)
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Fatura</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Vencimento</th>
                    <th className="py-3.5 px-4">Valor Bruto</th>
                    <th className="py-3.5 px-4">Recebido</th>
                    <th className="py-3.5 px-4">Situação</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
                  {faturasCompetencia.map(fat => {
                    const cli = clientes.find(c => c.id === fat.clienteId);
                    return (
                      <tr key={fat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white font-mono block">
                            {fat.numero}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {fat.tipoCobranca} {fat.parcela ? `(${fat.parcela})` : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {cli?.nomeFantasia || cli?.razaoSocial}
                          </p>
                          <p className="text-[11px] text-slate-400">{cli?.cidade} / {cli?.uf}</p>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {formatarData(fat.dataVencimento)}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {formatarMoeda(fat.valorBruto)}
                        </td>

                        <td className="py-3.5 px-4">
                          {fat.situacao === 'PAGA' ? (
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                                {formatarMoeda(fat.valorRecebido)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Pago em {formatarData(fat.dataRecebimento)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              fat.situacao === 'PAGA'
                                ? 'success'
                                : fat.situacao === 'VENCIDA'
                                ? 'danger'
                                : fat.situacao === 'CANCELADA'
                                ? 'neutral'
                                : 'warning'
                            }
                            size="sm"
                            dot
                          >
                            {fat.situacao}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {fat.situacao !== 'PAGA' && fat.situacao !== 'CANCELADA' && (
                              <>
                                <button
                                  onClick={() => {
                                    setFaturaParaBaixa(fat);
                                    setValorRecebido(fat.valorBruto);
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                                  title="Dar Baixa (Receber)"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Baixar
                                </button>

                                <button
                                  onClick={() => setFaturaParaRegua(fat)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-maker-primary hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg flex items-center gap-1"
                                  title="Abrir Régua de Cobrança"
                                >
                                  <Send className="w-3.5 h-3.5" /> Cobrar
                                </button>

                                <button
                                  onClick={() => setFaturaParaCancelar(fat)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                                  title="Cancelar fatura com motivo"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA DESPESAS */}
      {abaAtiva === 'despesas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Despesas operacionais e pró-labore dos sócios (computadas antes do lucro).
            </span>

            {!mesEstaTravado && (
              <button
                onClick={() => setModalNovaDespesa(true)}
                className="min-h-[44px] px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Nova Despesa
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Descrição</th>
                    <th className="py-3.5 px-4">Categoria</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
                  {despesasCompetencia.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                        {d.descricao}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="neutral" size="sm">
                          {d.categoria}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {d.tipo === 'FIXA' ? 'Fixa Recorrente' : 'Variável'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{formatarData(d.data)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-rose-600 dark:text-rose-400">
                        {formatarMoeda(d.valor)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant={d.paga ? 'success' : 'warning'} size="sm" dot>
                          {d.paga ? 'Paga' : 'A Pagar'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BAIXAR FATURA (COM CÁLCULO DE JUROS OU DESCONTO) */}
      {faturaParaBaixa && (
        <Modal
          isOpen={Boolean(faturaParaBaixa)}
          onClose={() => setFaturaParaBaixa(null)}
          title="Dar Baixa em Fatura Recebida"
          subtitle={`Fatura ${faturaParaBaixa.numero} • Valor Original: ${formatarMoeda(faturaParaBaixa.valorBruto)}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmarBaixa} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Data do Recebimento em Conta *
              </label>
              <input
                type="date"
                required
                value={dataRecebimento}
                onChange={e => setDataRecebimento(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Valor Efetivamente Recebido (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valorRecebido}
                onChange={e => setValorRecebido(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
              />
            </div>

            {/* Comparativo de Juros / Desconto */}
            {(() => {
              const diff = valorRecebido - faturaParaBaixa.valorBruto;
              if (Math.abs(diff) < 0.01) return null;
              return (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold ${
                    diff > 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {diff > 0
                    ? `Diferença positiva de ${formatarMoeda(diff)} registrada como Juros/Multa recebidos.`
                    : `Diferença negativa de ${formatarMoeda(Math.abs(diff))} registrada como Desconto concedido.`}
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
              <button
                type="button"
                onClick={() => setFaturaParaBaixa(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Confirmar Recebimento
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL RÉGUA DE COBRANÇA */}
      {faturaParaRegua && (
        <Modal
          isOpen={Boolean(faturaParaRegua)}
          onClose={() => setFaturaParaRegua(null)}
          title="Régua de Cobrança Assistida"
          subtitle={`Fatura ${faturaParaRegua.numero}`}
          maxWidth="lg"
        >
          {(() => {
            const cli = clientes.find(c => c.id === faturaParaRegua.clienteId);
            const msg = getMensagemRegua(faturaParaRegua);
            const waLink = `https://wa.me/55${(cli?.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

            return (
              <div className="space-y-4">
                {/* Seletor de Etapa da Régua */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => setFaseRegua('lembrete3d')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      faseRegua === 'lembrete3d' ? 'border-maker-primary bg-blue-50 text-maker-primary' : 'border-slate-200'
                    }`}
                  >
                    3 dias antes
                  </button>
                  <button
                    onClick={() => setFaseRegua('vencimento')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      faseRegua === 'vencimento' ? 'border-maker-primary bg-blue-50 text-maker-primary' : 'border-slate-200'
                    }`}
                  >
                    No vencimento
                  </button>
                  <button
                    onClick={() => setFaseRegua('atraso5d')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      faseRegua === 'atraso5d' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200'
                    }`}
                  >
                    +5 dias atraso
                  </button>
                  <button
                    onClick={() => setFaseRegua('atraso15d')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      faseRegua === 'atraso15d' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200'
                    }`}
                  >
                    +15 dias atraso
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mensagem Padronizada:
                  </label>
                  <textarea
                    readOnly
                    rows={4}
                    value={msg}
                    className="w-full text-xs p-3 rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setFaturaParaRegua(null)}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    Fechar
                  </button>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setFaturaParaRegua(null)}
                    className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Enviar WhatsApp Assistido
                  </a>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* MODAL NOVA DESPESA */}
      <Modal
        isOpen={modalNovaDespesa}
        onClose={() => setModalNovaDespesa(false)}
        title="Lançamento de Despesa"
        subtitle={`Competência ${formatarCompetencia(competenciaFiltro)}`}
        maxWidth="md"
      >
        <form onSubmit={handleSalvarDespesa} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descrição da Despesa *
            </label>
            <input
              type="text"
              required
              value={despDescricao}
              onChange={e => setDespDescricao(e.target.value)}
              placeholder="Ex: Servidores Cloud, Impostos Simples, Pró-labore..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={despCategoria}
                onChange={e => setDespCategoria(e.target.value as CategoriaDespesa)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
              >
                <option value="IMPOSTOS">IMPOSTOS (Simples Nacional)</option>
                <option value="INFRAESTRUTURA">INFRAESTRUTURA (Cloud / Servidores)</option>
                <option value="CONTADOR">CONTADOR (Honorários Externos)</option>
                <option value="FERRAMENTAS">FERRAMENTAS (Softwares e Licenças)</option>
                <option value="MARKETING">MARKETING (Tráfego / Eventos)</option>
                <option value="PRO_LABORE">PRÓ-LABORE (Sócios)</option>
                <option value="OUTROS">OUTROS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipo da Despesa
              </label>
              <select
                value={despTipo}
                onChange={e => setDespTipo(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
              >
                <option value="FIXA">FIXA (Repete todo mês)</option>
                <option value="VARIAVEL">VARIÁVEL (Pontual)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={despValor || ''}
              onChange={e => setDespValor(Number(e.target.value) || 0)}
              placeholder="0,00"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
            <button
              type="button"
              onClick={() => setModalNovaDespesa(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Lançar Despesa
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL CANCELAR FATURA */}
      <Modal
        isOpen={Boolean(faturaParaCancelar)}
        onClose={() => setFaturaParaCancelar(null)}
        title="Cancelar Fatura"
        subtitle={`Fatura ${faturaParaCancelar?.numero}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Regra: Faturas nunca são excluídas fisicamente. O cancelamento exige motivo obrigatório e fica registrado para prestação de contas.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Motivo do Cancelamento *
            </label>
            <textarea
              required
              rows={3}
              value={motivoCancelamento}
              onChange={e => setMotivoCancelamento(e.target.value)}
              placeholder="Descreva o motivo..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setFaturaParaCancelar(null)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirmarCancelamento}
              className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Confirmar Cancelamento
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL REABRIR MÊS COM JUSTIFICATIVA */}
      <Modal
        isOpen={modalReabrirAberto}
        onClose={() => setModalReabrirAberto(false)}
        title="Reabrir Competência Fechada"
        subtitle={`Competência ${formatarCompetencia(competenciaFiltro)}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            A reabertura destrava os lançamentos financeiros. Exige perfil de sócio e grava o motivo na tabela de auditoria permanente.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Justificativa Obrigatória *
            </label>
            <textarea
              required
              rows={3}
              value={motivoReabertura}
              onChange={e => setMotivoReabertura(e.target.value)}
              placeholder="Explique o motivo do ajuste necessário..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setModalReabrirAberto(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarReabertura}
              className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            >
              Reabrir como {usuario.nome}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
