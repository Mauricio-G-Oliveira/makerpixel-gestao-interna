import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  Clock,
  Send,
  PieChart,
  Users,
  Target,
  FileText,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import {
  formatarMoeda,
  formatarData,
  formatarCompetencia,
  distribuirComMaiorResto,
} from '../../lib/utils';
import { Fatura } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, isSocio } = useAuth();
  const {
    contratos,
    faturas,
    despesas,
    fechamentos,
    socios,
    parametros,
    leads,
    clientes,
    chamados,
    treinamentos,
    aprovarDistribuicaoLucro,
  } = useAppData();

  const [faturaParaCobrar, setFaturaParaCobrar] = useState<Fatura | null>(null);

  // CÁLCULOS DO DASHBOARD
  const competenciaAtual = '2026-11';

  // 1. MRR: soma das mensalidades dos contratos ativos
  const mrr = contratos
    .filter(c => c.tipo === 'MENSALIDADE' && c.situacao === 'ATIVO')
    .reduce((acc, c) => acc + c.valorTotal, 0);

  // 2. Receita do mês (Recebimentos em regime de caixa)
  const faturasPagasMes = faturas.filter(
    f => f.competencia === competenciaAtual && f.situacao === 'PAGA'
  );
  const receitaMes = faturasPagasMes.reduce((acc, f) => acc + (f.valorRecebido || f.valorBruto), 0);

  // 3. A Receber total e Vencidas (em destaque vermelho)
  const faturasAbertas = faturas.filter(f => f.situacao === 'ABERTA');
  const totalAReceber = faturasAbertas.reduce((acc, f) => acc + f.valorBruto, 0);

  const faturasVencidas = faturas.filter(f => f.situacao === 'VENCIDA');
  const totalVencidas = faturasVencidas.reduce((acc, f) => acc + f.valorBruto, 0);

  // 4. Lucro do Mês (Regime de Caixa: recebido no mês - pago no mês)
  const despesasPagasMes = despesas
    .filter(d => d.competencia === competenciaAtual && d.paga)
    .reduce((acc, d) => acc + d.valor, 0);
  const lucroMes = receitaMes - despesasPagasMes;

  // 5. Distribuição de Lucros do Mês
  const fechamentoAtual = fechamentos.find(f => f.competencia === competenciaAtual) || {
    competencia: competenciaAtual,
    fechado: false,
    receitaTotal: receitaMes,
    despesasTotal: despesasPagasMes,
    lucroCaixa: 28450, // Estimativa com contratos sob medida
    reservaCalculada: 5690,
    valorDisponivelDistribuicao: 22760,
    distribuicaoAprovadaSocio1: true,
    distribuicaoAprovadaSocio2: false,
    prejuizoAbatido: 0,
  };

  const reserva = (fechamentoAtual.lucroCaixa * (parametros.reservaPercentual || 20)) / 100;
  const aDistribuir = Math.max(0, fechamentoAtual.lucroCaixa - reserva);

  // Divisão entre os sócios com método do maior resto
  const participacoes = socios.map(s => ({ id: s.id, percentual: s.participacao }));
  const distribuicaoSocios = distribuirComMaiorResto(Math.round(aDistribuir * 100), participacoes);

  // 6. Indicador Fator R (Folha de 12 meses ÷ Receita de 12 meses)
  // Pró-labore mensal dos sócios = R$ 12.000 x 12 = R$ 144.000
  // Receita anual aproximada = R$ 380.000
  const folhaAnual = socios.reduce((acc, s) => acc + (s.proLaboreMensal || 6000) * 12, 0);
  const receitaAnual = 385000;
  const fatorRPercentual = Math.round((folhaAnual / receitaAnual) * 100);
  const fatorRAlerta = fatorRPercentual < 28;

  // 7. Fila de prospecção da semana (máximo 10)
  const leadsFila = leads.filter(l => l.etapa === 'NOVO' || l.etapa === 'CONTATADO');
  const leadsRestantesSemana = Math.max(0, (parametros.limiteLeadSemana || 10) - leadsFila.length);

  // 8. Contratos para renovar / reajustar
  const contratosReajuste = contratos.filter(c => c.situacao === 'ATIVO' && c.inicio.includes('-11-'));

  // 9. Chamados perto do prazo
  const chamadosUrgentes = chamados.filter(
    c => (c.situacao === 'ABERTO' || c.situacao === 'EM_ATENDIMENTO') && c.prioridade === 'ALTA'
  );

  // Sócio logado aprovação
  const socioLogadoNumero = usuario.nome.includes('Maurício') ? 1 : 2;
  const socioJaAprovou =
    socioLogadoNumero === 1
      ? fechamentoAtual.distribuicaoAprovadaSocio1
      : fechamentoAtual.distribuicaoAprovadaSocio2;

  const handleAprovar = () => {
    aprovarDistribuicaoLucro(competenciaAtual, socioLogadoNumero, usuario.nome);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-vindas e Status do Fator R */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Olá, {usuario.nome} 👋
            </h1>
            <Badge variant="primary" size="sm">
              Competência {formatarCompetencia(competenciaAtual)}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visão consolidada da MakerPixel. Todas as operações contábeis e financeiras sob controle.
          </p>
        </div>

        {/* Card Resumo do Fator R */}
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
            fatorRAlerta
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
          }`}
        >
          {fatorRAlerta ? (
            <ShieldAlert className="w-5 h-5 text-maker-danger flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-maker-success flex-shrink-0" />
          )}
          <div className="text-xs">
            <span className="font-bold block">Fator R: {fatorRPercentual}%</span>
            <span className="text-[11px] opacity-80">
              {fatorRAlerta ? 'Alerta: abaixo de 28% (Simples anexo V)' : 'Enquadramento ideal no Anexo III (>= 28%)'}
            </span>
          </div>
        </div>
      </div>

      {/* CARDS DE INDICADORES PRINCIPAIS (MRR, Receita, A Receber, Lucro) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          titulo="MRR (Receita Recorrente)"
          valor={formatarMoeda(mrr)}
          subtexto="Mensalidades de contratos ativos"
          icone={TrendingUp}
          iconeCor="primary"
          badgeTexto="Recorrente"
          badgeTipo="primary"
          onClick={() => navigate('/contratos')}
        />

        <StatCard
          titulo="Receita do Mês"
          valor={formatarMoeda(receitaMes || 3870)}
          subtexto="Regime de caixa (recebido)"
          icone={DollarSign}
          iconeCor="success"
          badgeTexto="Entradas"
          badgeTipo="success"
          onClick={() => navigate('/financeiro')}
        />

        <StatCard
          titulo="A Receber"
          valor={formatarMoeda(totalAReceber)}
          subtexto={`Vencidas: ${formatarMoeda(totalVencidas)}`}
          subtextoDestaque="Atenção:"
          icone={Clock}
          iconeCor={totalVencidas > 0 ? 'danger' : 'warning'}
          badgeTexto={totalVencidas > 0 ? `${faturasVencidas.length} Vencidas` : 'Em Dia'}
          badgeTipo={totalVencidas > 0 ? 'danger' : 'warning'}
          onClick={() => navigate('/financeiro')}
        />

        <StatCard
          titulo="Lucro Líquido do Mês"
          valor={formatarMoeda(fechamentoAtual.lucroCaixa)}
          subtexto="Receitas menos despesas totais"
          icone={PieChart}
          iconeCor="success"
          badgeTexto="Regime Caixa"
          badgeTipo="success"
          onClick={() => navigate('/distribuicao-lucros')}
        />
      </div>

      {/* BLOCO CENTRAL: GRÁFICO 6 MESES & DISTRIBUIÇÃO DE LUCROS (O CORAÇÃO DO SISTEMA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico Receita x Despesas dos últimos 6 meses */}
        <div className="lg:col-span-7 bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Evolução Financeira (Últimos 6 Meses)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receitas brutas recebidas vs Despesas operacionais
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-maker-primary inline-block" /> Receita
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block" /> Despesas
              </span>
            </div>
          </div>

          {/* Gráfico Visual Bar Chart SVG */}
          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[
              { mes: 'Jun', rec: 26000, desp: 14200 },
              { mes: 'Jul', rec: 29500, desp: 15100 },
              { mes: 'Ago', rec: 31000, desp: 15400 },
              { mes: 'Set', rec: 34800, desp: 16100 },
              { mes: 'Out', rec: 38700, desp: 16510 },
              { mes: 'Nov', rec: 42720, desp: 14270 },
            ].map(item => {
              const maxVal = 45000;
              const hRec = Math.round((item.rec / maxVal) * 160);
              const hDesp = Math.round((item.desp / maxVal) * 160);
              return (
                <div key={item.mes} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="flex items-end gap-1.5 w-full justify-center h-44">
                    <div
                      style={{ height: `${hRec}px` }}
                      className="w-5 sm:w-7 bg-maker-primary rounded-t-md transition-all group-hover:brightness-110 shadow-sm relative group/rec"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/rec:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {formatarMoeda(item.rec)}
                      </span>
                    </div>
                    <div
                      style={{ height: `${hDesp}px` }}
                      className="w-5 sm:w-7 bg-rose-400 dark:bg-rose-500 rounded-t-md transition-all group-hover:brightness-110 shadow-sm relative group/desp"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/desp:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {formatarMoeda(item.desp)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.mes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco Distribuição de Lucros do Mês (Coração do Sistema) */}
        <div className="lg:col-span-5 bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-maker-primary" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Distribuição de Lucros
                </h2>
              </div>
              <Badge variant={fechamentoAtual.fechado ? 'success' : 'warning'}>
                {fechamentoAtual.fechado ? 'Mês Fechado' : 'Prévia Estimada'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cálculo exato com retenção de reserva ({parametros.reservaPercentual}%) e maior resto.
            </p>

            {/* Linhas de Valores */}
            <div className="mt-4 space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lucro Líquido Caixa:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {formatarMoeda(fechamentoAtual.lucroCaixa)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Reserva Retida ({parametros.reservaPercentual}%):
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  - {formatarMoeda(reserva)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total a Distribuir:</span>
                <span className="font-extrabold text-maker-success">
                  {formatarMoeda(aDistribuir)}
                </span>
              </div>
            </div>

            {/* Divisão por Sócio */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Divisão dos Sócios (50% / 50%)
              </span>
              {socios.map((s, idx) => {
                const valorSocio = distribuicaoSocios[s.id] || aDistribuir / 2;
                const aprovado =
                  idx === 0
                    ? fechamentoAtual.distribuicaoAprovadaSocio1
                    : fechamentoAtual.distribuicaoAprovadaSocio2;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{s.nome}</p>
                      <p className="text-[11px] text-slate-400">{s.participacao}% de participação</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {formatarMoeda(valorSocio)}
                      </p>
                      <Badge variant={aprovado ? 'success' : 'warning'} size="sm" dot>
                        {aprovado ? 'Aprovado' : 'Aguardando'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão de Ação / Aprovação Dupla */}
          <div className="mt-5 pt-4 border-t border-maker-border dark:border-maker-darkBorder">
            {isSocio ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAprovar}
                  disabled={socioJaAprovou}
                  className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    socioJaAprovou
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
                      : 'bg-maker-primary hover:bg-maker-primaryHover text-white shadow-md shadow-maker-primary/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {socioJaAprovou
                    ? `Aprovado por Você (${usuario.nome})`
                    : `Aprovar como ${usuario.nome}`}
                </button>
                <Link
                  to="/distribuicao-lucros"
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                  Ver Detalhes
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center">
                Aprovação restrita aos sócios administradores.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* LISTAS OPERACIONAIS E ACIONÁVEIS DO DIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Faturas em Aberto & Cobrança Rápida */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-maker-primary" /> Faturas em Aberto
            </h3>
            <Link
              to="/financeiro"
              className="text-xs text-maker-primary hover:underline font-semibold flex items-center gap-0.5"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {faturasAbertas.slice(0, 3).map(fat => {
              const cli = clientes.find(c => c.id === fat.clienteId);
              return (
                <div
                  key={fat.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                      {cli?.nomeFantasia || cli?.razaoSocial || 'Cliente'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Vence em {formatarData(fat.dataVencimento)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatarMoeda(fat.valorBruto)}
                    </span>
                    <button
                      onClick={() => setFaturaParaCobrar(fat)}
                      className="px-2.5 py-1.5 rounded-lg bg-maker-primary text-white text-[11px] font-bold hover:bg-maker-primaryHover transition-colors flex items-center gap-1 min-h-[36px]"
                      title="Cobrar via WhatsApp"
                    >
                      <Send className="w-3 h-3" /> Cobrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Fila de Prospecção da Semana */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" /> Fila da Semana (Leads)
            </h3>
            <Link
              to="/prospeccao"
              className="text-xs text-maker-primary hover:underline font-semibold flex items-center gap-0.5"
            >
              Funil <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Restam <strong className="text-maker-primary">{leadsRestantesSemana}</strong> para a meta
            semanal de 10 leads prioritários em Tubarão e região.
          </p>

          <div className="space-y-2">
            {leadsFila.slice(0, 3).map(lead => {
              const cli = clientes.find(c => c.id === lead.clienteId);
              return (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white truncate max-w-[160px]">
                      {cli?.nomeFantasia || cli?.razaoSocial}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {cli?.cidade}/{cli?.uf} • {lead.etapa}
                    </p>
                  </div>
                  <Link
                    to="/prospeccao"
                    className="p-2 rounded-lg text-slate-400 hover:text-maker-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Chamados e Contratos Perto do Vencimento */}
        <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Alertas Operacionais
            </h3>
            <span className="text-xs text-slate-400">SLA & Contratos</span>
          </div>

          <div className="space-y-3">
            {/* Chamado Urgente */}
            {chamadosUrgentes.map(ch => (
              <div
                key={ch.id}
                onClick={() => navigate('/suporte')}
                className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer hover:border-rose-300 text-xs"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="danger" size="sm">
                    SLA ALTA (4h)
                  </Badge>
                  <span className="text-[11px] font-mono text-rose-600 font-bold">
                    {ch.numero}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-white mt-1.5 truncate">
                  {ch.assunto}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Prazo limite: {formatarData(ch.prazoLimite)}
                </p>
              </div>
            ))}

            {/* Contrato para Reajuste Anual */}
            {contratosReajuste.map(c => {
              const cli = clientes.find(cl => cl.id === c.clienteId);
              return (
                <div
                  key={c.id}
                  onClick={() => navigate('/contratos')}
                  className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer hover:border-amber-300 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="warning" size="sm">
                      Reajuste Anual
                    </Badge>
                    <span className="text-[11px] font-mono text-amber-700 font-bold">
                      {c.numero}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white mt-1.5 truncate">
                    {cli?.nomeFantasia} (Aniversário IPCA)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Valor atual: {formatarMoeda(c.valorTotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL DE RÉGUA DE COBRANÇA (WHATSAPP ASSISTIDO) */}
      {faturaParaCobrar && (
        <Modal
          isOpen={Boolean(faturaParaCobrar)}
          onClose={() => setFaturaParaCobrar(null)}
          title="Régua de Cobrança Assistida"
          subtitle={`Fatura ${faturaParaCobrar.numero} • ${formatarMoeda(faturaParaCobrar.valorBruto)}`}
        >
          {(() => {
            const cli = clientes.find(c => c.id === faturaParaCobrar.clienteId);
            const mensagem = `Olá ${cli?.contato || 'Prezado(a)'}, tudo bem? Aqui é o ${usuario.nome} da MakerPixel. Notamos que a fatura referente à mensalidade (${faturaParaCobrar.competencia}) no valor de ${formatarMoeda(faturaParaCobrar.valorBruto)} venceu em ${formatarData(faturaParaCobrar.dataVencimento)}. Segue o código para conferência. Se já efetuou o pagamento, favor desconsiderar.`;
            const waLink = `https://wa.me/55${(cli?.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;

            return (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    Destinatário: {cli?.razaoSocial}
                  </p>
                  <p>Contato: {cli?.contato} ({cli?.telefone})</p>
                  <p>Vencimento: {formatarData(faturaParaCobrar.dataVencimento)}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prévia da Mensagem (WhatsApp):
                  </label>
                  <textarea
                    readOnly
                    rows={4}
                    value={mensagem}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setFaturaParaCobrar(null)}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Fechar
                  </button>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setFaturaParaCobrar(null)}
                    className="min-h-[44px] px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Abrir no WhatsApp
                  </a>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
