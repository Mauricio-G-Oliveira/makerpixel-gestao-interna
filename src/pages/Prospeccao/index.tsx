import React, { useState } from 'react';
import {
  Target,
  Send,
  MessageSquare,
  Copy,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  Ban,
  Check,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { LeadProspeccao, EtapaLead, Cliente } from '../../types';
import { formatarTelefone, formatarData } from '../../lib/utils';

export const ProspeccaoPage: React.FC = () => {
  const { usuario } = useAuth();
  const {
    leads,
    clientes,
    parametros,
    moverEtapaLead,
    registrarEnvioProspeccao,
  } = useAppData();

  const [leadModal, setLeadModal] = useState<LeadProspeccao | null>(null);
  const [modalPerdaAberto, setModalPerdaAberto] = useState(false);
  const [motivoPerda, setMotivoPerda] = useState('');
  const [tipoPerda, setTipoPerda] = useState<'PERDIDO' | 'SAIU_DA_LISTA'>('PERDIDO');

  // Modelos de Mensagem com Variáveis
  const [modeloSelecionado, setModeloSelecionado] = useState<'apresentacao' | 'lembrete' | 'demonstracao'>('apresentacao');
  const [copiadoToast, setCopiadoToast] = useState(false);

  // Modelos pré-configurados
  const modelosMensagem = {
    apresentacao: {
      titulo: '1ª Abordagem - Integração SCI e Conciliação',
      corpo: 'Olá {nome}, tudo bem? Me chamo {autor} da MakerPixel aqui de Tubarão/SC. Desenvolvemos automações específicas para escritórios de contabilidade que utilizam o sistema SCI Único (como a conciliação bancária 100% automática e conferências fiscais com inteligência). Gostaria de saber se vocês da {empresa} em {cidade} teriam 10 minutinhos nesta semana para conhecer como os escritórios da região estão economizando mais de 20 horas semanais por analista?',
    },
    lembrete: {
      titulo: 'Lembrete Amigável (após 3 dias sem resposta)',
      corpo: 'Olá {nome}, tudo bem? Passando apenas para saber se você conseguiu dar uma olhada na mensagem anterior sobre a automação contábil para o SCI na {empresa}. Temos casos práticos de escritórios em {cidade} com ótimos resultados.',
    },
    demonstracao: {
      titulo: 'Convite para Demonstração Prática',
      corpo: 'Olá {nome}! Que ótimo conversar contigo. Podemos agendar uma rápida demonstração online de 15 minutos para eu mostrar a tela do robô integrador funcionando com o SCI Único na prática para a equipe da {empresa}?',
    },
  };

  const FRASE_SAIDA = 'Se não fizer sentido agora, é só me avisar que não volto a escrever.';

  // Regra de priorização da Fila da Semana (máx 10 leads configurável)
  // 1º mesma região (cidade Tubarão/SC), 2º nunca contatados, 3º mais antigos
  const limiteFila = parametros.limiteLeadSemana || 10;
  const hoje = new Date();

  const leadsFilaSemana = leads
    .filter(l => {
      // Regra de exclusão: SAIU_DA_LISTA nunca aparece na fila
      if (l.etapa === 'SAIU_DA_LISTA' || l.etapa === 'GANHO' || l.etapa === 'PERDIDO') return false;

      // Regra de quarentena: se tiver quarentena ativa, não aparece na fila até vencer os 90 dias
      if (l.quarentenaAte) {
        const dataFimQuarentena = new Date(l.quarentenaAte);
        if (dataFimQuarentena > hoje) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const cliA = clientes.find(c => c.id === a.clienteId);
      const cliB = clientes.find(c => c.id === b.clienteId);

      // Prioridade 1: Mesma região
      const aMesmaRegiao = cliA?.cidade?.toLowerCase() === parametros.cidadeSede?.toLowerCase();
      const bMesmaRegiao = cliB?.cidade?.toLowerCase() === parametros.cidadeSede?.toLowerCase();
      if (aMesmaRegiao && !bMesmaRegiao) return -1;
      if (!aMesmaRegiao && bMesmaRegiao) return 1;

      // Prioridade 2: Nunca contatados primeiro
      const aNunca = !a.dataPrimeiroContato;
      const bNunca = !b.dataPrimeiroContato;
      if (aNunca && !bNunca) return -1;
      if (!aNunca && bNunca) return 1;

      return (a.prioridadeFila || 99) - (b.prioridadeFila || 99);
    })
    .slice(0, limiteFila);

  // Placar Semanal
  const totalContatados = leads.filter(l => l.dataPrimeiroContato).length;
  const totalRespostas = leads.filter(l => l.dataResposta || l.etapa === 'RESPONDEU' || l.etapa === 'DEMONSTRACAO' || l.etapa === 'PROPOSTA' || l.etapa === 'GANHO').length;
  const totalDemonstracoes = leads.filter(l => l.etapa === 'DEMONSTRACAO' || l.etapa === 'PROPOSTA' || l.etapa === 'GANHO').length;
  const taxaResposta = totalContatados > 0 ? Math.round((totalRespostas / totalContatados) * 100) : 0;

  // Montagem da mensagem interpolada com as variáveis {nome}, {empresa}, {cidade} e autor
  const montarMensagemPronta = (lead: LeadProspeccao | null) => {
    if (!lead) return '';
    const cli = clientes.find(c => c.id === lead.clienteId);
    const mod = modelosMensagem[modeloSelecionado];

    let texto = mod.corpo
      .replace(/{nome}/g, cli?.contato?.split(' ')[0] || 'Parceiro(a)')
      .replace(/{empresa}/g, cli?.nomeFantasia || cli?.razaoSocial || 'Escritório')
      .replace(/{cidade}/g, cli?.cidade || 'sua região')
      .replace(/{autor}/g, usuario.nome);

    return `${texto}\n\n${FRASE_SAIDA}`;
  };

  const handleCopiarEmail = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoToast(true);
    setTimeout(() => setCopiadoToast(false), 2500);
    if (leadModal) {
      registrarEnvioProspeccao(leadModal.id, 'EMAIL', modelosMensagem[modeloSelecionado].titulo, usuario.nome);
    }
  };

  const handleConfirmarPerda = () => {
    if (!leadModal) return;
    if (!motivoPerda.trim()) {
      alert('O motivo é obrigatório.');
      return;
    }
    moverEtapaLead(leadModal.id, tipoPerda, motivoPerda);
    setModalPerdaAberto(false);
    setLeadModal(null);
    setMotivoPerda('');
  };

  const etapasKanban: { etapa: EtapaLead; titulo: string; cor: string }[] = [
    { etapa: 'NOVO', titulo: 'Novos Leads', cor: 'border-slate-300' },
    { etapa: 'CONTATADO', titulo: '1º Contato Enviado', cor: 'border-blue-400' },
    { etapa: 'LEMBRETE_ENVIADO', titulo: 'Lembrete Enviado', cor: 'border-amber-400' },
    { etapa: 'RESPONDEU', titulo: 'Respondeu', cor: 'border-emerald-400' },
    { etapa: 'DEMONSTRACAO', titulo: 'Demonstração Agendada', cor: 'border-indigo-400' },
    { etapa: 'PROPOSTA', titulo: 'Proposta Comercial', cor: 'border-purple-400' },
    { etapa: 'GANHO', titulo: 'Ganho (Fechou!)', cor: 'border-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header e Placar Semanal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-maker-primary" /> Prospecção & Funil de Vendas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fila semanal priorizada de até 10 leads, cadência inteligente, quarentena de 90 dias e disparo assistido via WhatsApp.
          </p>
        </div>

        {/* Placar Semanal */}
        <div className="flex items-center gap-3 bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-3 shadow-sm self-start">
          <div className="px-3 border-r border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contatados</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {totalContatados}
            </span>
          </div>
          <div className="px-3 border-r border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Respostas</span>
            <span className="text-base font-extrabold text-maker-primary">
              {totalRespostas}
            </span>
          </div>
          <div className="px-3 border-r border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Demonstrações</span>
            <span className="text-base font-extrabold text-amber-500">
              {totalDemonstracoes}
            </span>
          </div>
          <div className="px-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Taxa Resposta</span>
            <span className="text-base font-extrabold text-maker-success">
              {taxaResposta}%
            </span>
          </div>
        </div>
      </div>

      {/* FILA DA SEMANA (MÁXIMO 10 LEADS PRIORITÁRIOS) */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Fila Prioritária da Semana ({leadsFilaSemana.length} de {limiteFila} leads)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Critério: Tubarão/SC primeiro ➔ Sem contato prévio ➔ Mais antigos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {leadsFilaSemana.map((lead, idx) => {
            const cli = clientes.find(c => c.id === lead.clienteId);
            const isTubarão = cli?.cidade?.toLowerCase() === 'tubarão';

            return (
              <div
                key={lead.id}
                onClick={() => setLeadModal(lead)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-maker-primary/40 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                    {isTubarão && (
                      <Badge variant="primary" size="sm">
                        📍 Mesma Região
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {cli?.nomeFantasia || cli?.razaoSocial}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Contato: {cli?.contato || 'Responsável'} • {cli?.cidade}/{cli?.uf}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <Badge variant={lead.etapa === 'NOVO' ? 'neutral' : 'warning'} size="sm">
                    {lead.etapa}
                  </Badge>
                  <span className="text-[11px] font-bold text-maker-primary hover:underline flex items-center gap-0.5">
                    Disparar Mensagem <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PIPELINE / KANBAN COMPLETO */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Pipeline de Oportunidades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {etapasKanban.map(col => {
            const leadsNestaEtapa = leads.filter(l => l.etapa === col.etapa);
            return (
              <div
                key={col.etapa}
                className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-3 min-w-[210px] flex flex-col shadow-sm"
              >
                <div className={`pb-2.5 mb-2.5 border-b-2 ${col.cor} flex justify-between items-center`}>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {col.titulo}
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {leadsNestaEtapa.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {leadsNestaEtapa.map(lead => {
                    const cli = clientes.find(c => c.id === lead.clienteId);
                    return (
                      <div
                        key={lead.id}
                        onClick={() => setLeadModal(lead)}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer text-xs transition-colors"
                      >
                        <p className="font-bold text-slate-800 dark:text-white truncate">
                          {cli?.nomeFantasia}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cli?.cidade} / {cli?.uf}</p>
                        {lead.dataPrimeiroContato && (
                          <span className="text-[10px] text-slate-400 block mt-1">
                            1º contato: {formatarData(lead.dataPrimeiroContato)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE DISPARO ASSISTIDO & DETALHES DO LEAD */}
      {leadModal && (
        <Modal
          isOpen={Boolean(leadModal)}
          onClose={() => setLeadModal(null)}
          title="Cadência de Prospecção Assistida"
          subtitle={clientes.find(c => c.id === leadModal.clienteId)?.razaoSocial}
          maxWidth="xl"
        >
          {(() => {
            const cli = clientes.find(c => c.id === leadModal.clienteId);
            const mensagemPronta = montarMensagemPronta(leadModal);
            const waLink = `https://wa.me/55${(cli?.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(mensagemPronta)}`;

            return (
              <div className="space-y-5">
                {/* Seleção do Modelo de Mensagem */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Escolha o Modelo de Abordagem:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setModeloSelecionado('apresentacao')}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        modeloSelecionado === 'apresentacao'
                          ? 'border-maker-primary bg-blue-50 dark:bg-blue-950/40 text-maker-primary font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="block font-semibold">1. Apresentação SCI</span>
                      <span className="text-[10px] opacity-75">1º contato direto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModeloSelecionado('lembrete')}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        modeloSelecionado === 'lembrete'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="block font-semibold">2. Lembrete (3 dias)</span>
                      <span className="text-[10px] opacity-75">Cadência amigável</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModeloSelecionado('demonstracao')}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        modeloSelecionado === 'demonstracao'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="block font-semibold">3. Agendar Demo</span>
                      <span className="text-[10px] opacity-75">Após resposta</span>
                    </button>
                  </div>
                </div>

                {/* Prévia da Mensagem Formatada */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mensagem Personalizada ({cli?.contato || 'Contato'} • {cli?.cidade}):
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ✓ Termina com frase de saída obrigatória
                    </span>
                  </div>
                  <textarea
                    readOnly
                    rows={6}
                    value={mensagemPronta}
                    className="w-full text-xs p-3.5 rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                {/* Ações Assistidas (WhatsApp wa.me e Copiar E-mail) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-maker-border dark:border-maker-darkBorder">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTipoPerda('PERDIDO');
                        setModalPerdaAberto(true);
                      }}
                      className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      Marcar Perdido
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTipoPerda('SAIU_DA_LISTA');
                        setModalPerdaAberto(true);
                      }}
                      className="px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                    >
                      Pediu para Sair da Lista
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopiarEmail(mensagemPronta)}
                      className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-2"
                    >
                      {copiadoToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      {copiadoToast ? 'Copiado!' : 'Copiar E-mail'}
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        registrarEnvioProspeccao(
                          leadModal.id,
                          'WHATSAPP',
                          modelosMensagem[modeloSelecionado].titulo,
                          usuario.nome
                        );
                        setLeadModal(null);
                      }}
                      className="min-h-[44px] px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <Send className="w-4 h-4" /> Abrir no WhatsApp
                    </a>
                  </div>
                </div>

                {/* Histórico de Envios Anteriores */}
                {leadModal.historicoEnvios.length > 0 && (
                  <div className="pt-3 border-t border-maker-border dark:border-maker-darkBorder text-xs">
                    <h4 className="font-bold text-slate-500 uppercase text-[10px] mb-2">
                      Histórico de Envios deste Lead
                    </h4>
                    <div className="space-y-1.5">
                      {leadModal.historicoEnvios.map((env, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {env.canal}: {env.modelo}
                          </span>
                          <span className="text-slate-400">{formatarData(env.data)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* MODAL DE MOTIVO OBRIGATÓRIO DE PERDA / SAIU DA LISTA */}
      <Modal
        isOpen={modalPerdaAberto}
        onClose={() => setModalPerdaAberto(false)}
        title={tipoPerda === 'SAIU_DA_LISTA' ? 'Adicionar à Lista de Exclusão' : 'Desqualificar Lead (Perdido)'}
        subtitle="O motivo é obrigatório para alimentar o histórico de auditoria e prospecção"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {tipoPerda === 'SAIU_DA_LISTA'
              ? 'Leads que pedem para sair da lista nunca mais aparecerão na fila da semana nem em importações futuras (bloqueio por documento e telefone).'
              : 'Informe a razão pela qual este lead não avançou (ex: já possui solução, sem orçamento, não atende no momento).'}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Motivo Obrigatório *
            </label>
            <textarea
              required
              rows={3}
              value={motivoPerda}
              onChange={e => setMotivoPerda(e.target.value)}
              placeholder="Descreva o motivo..."
              className="w-full p-3 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setModalPerdaAberto(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarPerda}
              className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
