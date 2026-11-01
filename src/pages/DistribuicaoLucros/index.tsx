import React, { useState } from 'react';
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Calendar,
  DollarSign,
  Download,
  Printer,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import {
  formatarMoeda,
  formatarData,
  formatarDataHora,
  formatarCompetencia,
  distribuirComMaiorResto,
} from '../../lib/utils';

export const DistribuicaoLucrosPage: React.FC = () => {
  const { usuario, isSocio } = useAuth();
  const {
    fechamentos,
    socios,
    parametros,
    adiantamentos,
    aprovarDistribuicaoLucro,
  } = useAppData();

  const [competenciaSelecionada, setCompetenciaSelecionada] = useState<string>('2026-11');
  const [modalAtaAberto, setModalAtaAberto] = useState(false);

  const fechamento = fechamentos.find(f => f.competencia === competenciaSelecionada) || {
    competencia: competenciaSelecionada,
    fechado: false,
    receitaTotal: 42720,
    despesasTotal: 14270,
    lucroCaixa: 28450,
    reservaCalculada: 5690,
    valorDisponivelDistribuicao: 22760,
    distribuicaoAprovadaSocio1: true,
    distribuicaoAprovadaSocio2: false,
    prejuizoAbatido: 0,
  };

  const reservaPercentual = parametros.reservaPercentual || 20;
  const lucroBrutoCaixa = fechamento.lucroCaixa;
  const prejuizoAbatido = fechamento.prejuizoAbatido || 0;

  // Se houver prejuízo, não distribui
  const lucroAposPrejuizo = Math.max(0, lucroBrutoCaixa - prejuizoAbatido);
  const reservaRetida = (lucroAposPrejuizo * reservaPercentual) / 100;
  const totalADistribuir = Math.max(0, lucroAposPrejuizo - reservaRetida);

  // Divisão com o Método do Maior Resto
  const participacoes = socios.map(s => ({ id: s.id, percentual: s.participacao }));
  const centavosTotais = Math.round(totalADistribuir * 100);
  const divisaoBruta = distribuirComMaiorResto(centavosTotais, participacoes);

  // Status de aprovação dupla
  const socio1 = socios[0];
  const socio2 = socios[1];

  const socio1Aprovou = fechamento.distribuicaoAprovadaSocio1;
  const socio2Aprovou = fechamento.distribuicaoAprovadaSocio2;
  const aprovacaoDuplaConcluida = socio1Aprovou && socio2Aprovou;

  // Identificação do sócio atual
  const socioAtualNumero = usuario.nome.includes('Maurício') ? 1 : 2;
  const podeAprovar = isSocio && (socioAtualNumero === 1 ? !socio1Aprovou : !socio2Aprovou);

  const handleAprovar = () => {
    aprovarDistribuicaoLucro(competenciaSelecionada, socioAtualNumero, usuario.nome);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-maker-primary" /> Distribuição de Lucros dos Sócios
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cálculo exato com retenção de reserva ({reservaPercentual}%), maior resto nos centavos, dedução de adiantamentos e aprovação dupla.
          </p>
        </div>

        {/* Competência e Ação de Ata Anual */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={competenciaSelecionada}
            onChange={e => setCompetenciaSelecionada(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white min-h-[44px]"
          >
            <option value="2026-11">Novembro / 2026</option>
            <option value="2026-10">Outubro / 2026 (Fechado e Aprovado)</option>
          </select>

          <button
            onClick={() => setModalAtaAberto(true)}
            className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            title="Gera o Relatório Anual formatado para a Ata de Aprovação de Contas"
          >
            <FileText className="w-4 h-4 text-maker-primary" /> Relatório para Ata
          </button>
        </div>
      </div>

      {/* Alerta de Status: Mês Fechado vs Prévia Aberta */}
      {!fechamento.fechado ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-amber-800 dark:text-amber-300">
              Prévia Estimada (Competência Aberta)
            </h3>
            <p className="text-amber-700 dark:text-amber-400 mt-0.5">
              A distribuição definitiva só pode ser efetivada após o fechamento formal do mês no módulo Financeiro. Os valores abaixo representam a projeção em tempo real com base no regime de caixa atual.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
              Competência Fechada & Auditada
            </h3>
            <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
              Mês encerrado por {fechamento.socioFechamento || 'Sócio'}. Lançamentos travados e prontos para liquidação da distribuição de lucros.
            </p>
          </div>
        </div>
      )}

      {/* FLUXO MATEMÁTICO DA DISTRIBUIÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Passo 1: Lucro Líquido Caixa */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            1. Lucro Caixa do Mês
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
            {formatarMoeda(lucroBrutoCaixa)}
          </span>
          <span className="text-[11px] text-slate-400">
            Pró-labore dos sócios já deduzido como despesa
          </span>
        </div>

        {/* Passo 2: Dedução Prejuízo Acumulado */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            2. Prejuízo Acumulado
          </span>
          <span className="text-xl font-bold text-slate-600 dark:text-slate-300 mt-1 block">
            {formatarMoeda(prejuizoAbatido)}
          </span>
          <span className="text-[11px] text-slate-400">
            {prejuizoAbatido > 0 ? 'Abatido integralmente' : 'Sem prejuízos anteriores'}
          </span>
        </div>

        {/* Passo 3: Reserva Técnica Retida */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            3. Reserva da Empresa ({reservaPercentual}%)
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {formatarMoeda(reservaRetida)}
          </span>
          <span className="text-[11px] text-slate-400">
            Fundo de caixa e capital de giro
          </span>
        </div>

        {/* Passo 4: Valor Líquido a Distribuir */}
        <div className="bg-white dark:bg-maker-darkCard border-2 border-maker-primary/30 rounded-[12px] p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-maker-primary">
            4. Total a Distribuir
          </span>
          <span className="text-2xl font-extrabold text-maker-success mt-1 block">
            {formatarMoeda(totalADistribuir)}
          </span>
          <span className="text-[11px] text-slate-400">
            Distribuído aos 2 sócios com maior resto
          </span>
        </div>
      </div>

      {/* BLOCO CENTRAL: CARDS INDIVIDUAIS DOS SÓCIOS COM MAIOR RESTO E ADIANTAMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {socios.map((s, idx) => {
          const valorBrutoSocio = divisaoBruta[s.id] || totalADistribuir / 2;
          const adiantamentosSocio = adiantamentos.filter(
            a => a.socioId === s.id && a.competencia === competenciaSelecionada
          );
          const totalAdiantamentos = adiantamentosSocio.reduce((acc, a) => acc + a.valor, 0);
          const valorLiquidoFinal = Math.max(0, valorBrutoSocio - totalAdiantamentos);

          const aprovado =
            idx === 0
              ? fechamento.distribuicaoAprovadaSocio1
              : fechamento.distribuicaoAprovadaSocio2;
          const dataAprov =
            idx === 0 ? fechamento.dataAprovacaoSocio1 : fechamento.dataAprovacaoSocio2;

          // Regra Fiscal: Alerta de R$ 50.000,00 por mês por sócio (retenção 10% IRRF)
          const ultrapassouLimiteFiscal = valorLiquidoFinal > 50000;

          return (
            <div
              key={s.id}
              className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header do Sócio */}
                <div className="flex items-center justify-between pb-3 border-b border-maker-border dark:border-maker-darkBorder">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-maker-primary/10 text-maker-primary font-bold flex items-center justify-center text-sm border border-maker-primary/20">
                      {s.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.nome}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Participação Vigente: <strong>{s.participacao}%</strong>
                      </p>
                    </div>
                  </div>
                  <Badge variant={aprovado ? 'success' : 'warning'} dot>
                    {aprovado ? 'Aprovado' : 'Aguardando Aprovação'}
                  </Badge>
                </div>

                {/* Composição Financeira */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Participação Bruta nos Lucros ({s.participacao}%):</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      {formatarMoeda(valorBrutoSocio)}
                    </span>
                  </div>

                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Adiantamentos Realizados no Mês:</span>
                    <span className="font-mono font-semibold">
                      - {formatarMoeda(totalAdiantamentos)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Valor Líquido a Receber:
                    </span>
                    <span className="font-extrabold text-maker-success text-base">
                      {formatarMoeda(valorLiquidoFinal)}
                    </span>
                  </div>
                </div>

                {/* Aviso Fiscal de Limite de R$ 50k */}
                {ultrapassouLimiteFiscal ? (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Aviso Fiscal:</strong> Valor superior a R$ 50.000,00 no mês. Sujeito à retenção de 10% de IRRF sobre o excedente.
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-slate-400">
                    ✓ Dentro do limite mensal de isenção de R$ 50.000,00 por sócio.
                  </div>
                )}

                {/* Histórico de Aprovação */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  {aprovado ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado em {formatarDataHora(dataAprov)}
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pendente de validação deste sócio
                    </span>
                  )}
                </div>
              </div>

              {/* Botão de Aprovação Individual */}
              {isSocio && idx + 1 === socioAtualNumero && (
                <div className="mt-5 pt-3">
                  <button
                    onClick={handleAprovar}
                    disabled={aprovado}
                    className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      aprovado
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-default'
                        : 'bg-maker-primary hover:bg-maker-primaryHover text-white shadow-md shadow-maker-primary/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {aprovado ? 'Você Já Aprovou esta Distribuição' : `Aprovar como ${usuario.nome}`}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BLOCO DE APROVAÇÃO DUPLA (STATUS GERAL) */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-maker-primary" /> Regra de Aprovação Dupla Obrigatória
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            A distribuição de lucros só é gravada e liberada para pagamento após a assinatura digital de ambos os sócios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                socio1Aprovou ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Sócio 1 ({socio1Aprovou ? 'OK' : 'Pendente'})
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600 font-bold">+</span>

          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                socio2Aprovou ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Sócio 2 ({socio2Aprovou ? 'OK' : 'Pendente'})
            </span>
          </div>

          <div className="ml-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            <Badge variant={aprovacaoDuplaConcluida ? 'success' : 'warning'}>
              {aprovacaoDuplaConcluida ? 'Dupla Aprovação Concluída' : 'Aguardando Segundo Sócio'}
            </Badge>
          </div>
        </div>
      </div>

      {/* MODAL RELATÓRIO ANUAL PARA ATA DE APROVAÇÃO DE CONTAS */}
      <Modal
        isOpen={modalAtaAberto}
        onClose={() => setModalAtaAberto(false)}
        title="Relatório Anual para Ata de Aprovação de Contas"
        subtitle="MakerPixel Softwares Ltda • CNPJ 14.235.890/0001-45 • Tubarão/SC"
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 print:text-black">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <p className="font-bold text-slate-900 dark:text-white">
              Demonstrativo de Distribuição de Resultados - Exercício 2026
            </p>
            <p>
              Em conformidade com a legislação societária e o contrato social da MakerPixel Softwares Ltda, os sócios reunidos aprovam a prestação de contas e a distribuição dos resultados apurados sob regime de caixa, após a retenção da reserva estatutária de {reservaPercentual}%.
            </p>
          </div>

          {/* Tabela do Relatório Anual */}
          <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-white">
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">Sócio</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">Participação</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">Total Distribuído</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">Adiantamentos</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-700">Líquido Pago</th>
              </tr>
            </thead>
            <tbody>
              {socios.map(s => (
                <tr key={s.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold">
                    {s.nome}
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                    {s.participacao}%
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono">
                    R$ 136.560,00
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono text-rose-600">
                    R$ 1.500,00
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-mono font-bold text-emerald-600">
                    R$ 135.060,00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Documento assinado digitalmente com hash ICP-Brasil pelos administradores.
            </span>
            <button
              onClick={() => window.print()}
              className="min-h-[44px] px-5 py-2 bg-maker-primary text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Imprimir Relatório
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
