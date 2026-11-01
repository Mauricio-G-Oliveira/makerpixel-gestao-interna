import { useState, useEffect } from 'react';
import {
  Socio,
  ParametrosEmpresa,
  Cliente,
  Contrato,
  Fatura,
  Despesa,
  FechamentoMes,
  AdiantamentoSocio,
  Projeto,
  TurmaTreinamento,
  ChamadoSuporte,
  AuditoriaItem,
  LeadProspeccao,
  EtapaLead,
} from '../types';
import {
  SOCIOS_INICIAIS,
  PARAMETROS_INICIAIS,
  CLIENTES_INICIAIS,
  CONTRATOS_INICIAIS,
  FATURAS_INICIAIS,
  DESPESAS_INICIAIS,
  FECHAMENTOS_INICIAIS,
  ADIANTAMENTOS_INICIAIS,
  PROJETOS_INICIAIS,
  TREINAMENTOS_INICIAIS,
  CHAMADOS_INICIAIS,
  AUDITORIA_INICIAL,
  LEADS_INICIAIS,
} from './mockData';
import { calcularValorProporcional, getCompetenciaAtual } from '../lib/utils';

const STORAGE_KEYS = {
  SOCIOS: 'mp_socios_v1',
  PARAMETROS: 'mp_parametros_v1',
  CLIENTES: 'mp_clientes_v1',
  CONTRATOS: 'mp_contratos_v1',
  FATURAS: 'mp_faturas_v1',
  DESPESAS: 'mp_despesas_v1',
  FECHAMENTOS: 'mp_fechamentos_v1',
  ADIANTAMENTOS: 'mp_adiantamentos_v1',
  PROJETOS: 'mp_projetos_v1',
  TREINAMENTOS: 'mp_treinamentos_v1',
  CHAMADOS: 'mp_chamados_v1',
  AUDITORIA: 'mp_auditoria_v1',
  LEADS: 'mp_leads_v1',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

export function useAppData() {
  const [socios, setSocios] = useState<Socio[]>(() => getStorageItem(STORAGE_KEYS.SOCIOS, SOCIOS_INICIAIS));
  const [parametros, setParametros] = useState<ParametrosEmpresa>(() =>
    getStorageItem(STORAGE_KEYS.PARAMETROS, PARAMETROS_INICIAIS)
  );
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    getStorageItem(STORAGE_KEYS.CLIENTES, CLIENTES_INICIAIS)
  );
  const [leads, setLeads] = useState<LeadProspeccao[]>(() =>
    getStorageItem(STORAGE_KEYS.LEADS, LEADS_INICIAIS)
  );
  const [contratos, setContratos] = useState<Contrato[]>(() =>
    getStorageItem(STORAGE_KEYS.CONTRATOS, CONTRATOS_INICIAIS)
  );
  const [faturas, setFaturas] = useState<Fatura[]>(() =>
    getStorageItem(STORAGE_KEYS.FATURAS, FATURAS_INICIAIS)
  );
  const [despesas, setDespesas] = useState<Despesa[]>(() =>
    getStorageItem(STORAGE_KEYS.DESPESAS, DESPESAS_INICIAIS)
  );
  const [fechamentos, setFechamentos] = useState<FechamentoMes[]>(() =>
    getStorageItem(STORAGE_KEYS.FECHAMENTOS, FECHAMENTOS_INICIAIS)
  );
  const [adiantamentos, setAdiantamentos] = useState<AdiantamentoSocio[]>(() =>
    getStorageItem(STORAGE_KEYS.ADIANTAMENTOS, ADIANTAMENTOS_INICIAIS)
  );
  const [projetos, setProjetos] = useState<Projeto[]>(() =>
    getStorageItem(STORAGE_KEYS.PROJETOS, PROJETOS_INICIAIS)
  );
  const [treinamentos, setTreinamentos] = useState<TurmaTreinamento[]>(() =>
    getStorageItem(STORAGE_KEYS.TREINAMENTOS, TREINAMENTOS_INICIAIS)
  );
  const [chamados, setChamados] = useState<ChamadoSuporte[]>(() =>
    getStorageItem(STORAGE_KEYS.CHAMADOS, CHAMADOS_INICIAIS)
  );
  const [auditoria, setAuditoria] = useState<AuditoriaItem[]>(() =>
    getStorageItem(STORAGE_KEYS.AUDITORIA, AUDITORIA_INICIAL)
  );

  // Sincroniza com localStorage
  useEffect(() => setStorageItem(STORAGE_KEYS.SOCIOS, socios), [socios]);
  useEffect(() => setStorageItem(STORAGE_KEYS.PARAMETROS, parametros), [parametros]);
  useEffect(() => setStorageItem(STORAGE_KEYS.CLIENTES, clientes), [clientes]);
  useEffect(() => setStorageItem(STORAGE_KEYS.LEADS, leads), [leads]);
  useEffect(() => setStorageItem(STORAGE_KEYS.CONTRATOS, contratos), [contratos]);
  useEffect(() => setStorageItem(STORAGE_KEYS.FATURAS, faturas), [faturas]);
  useEffect(() => setStorageItem(STORAGE_KEYS.DESPESAS, despesas), [despesas]);
  useEffect(() => setStorageItem(STORAGE_KEYS.FECHAMENTOS, fechamentos), [fechamentos]);
  useEffect(() => setStorageItem(STORAGE_KEYS.ADIANTAMENTOS, adiantamentos), [adiantamentos]);
  useEffect(() => setStorageItem(STORAGE_KEYS.PROJETOS, projetos), [projetos]);
  useEffect(() => setStorageItem(STORAGE_KEYS.TREINAMENTOS, treinamentos), [treinamentos]);
  useEffect(() => setStorageItem(STORAGE_KEYS.CHAMADOS, chamados), [chamados]);
  useEffect(() => setStorageItem(STORAGE_KEYS.AUDITORIA, auditoria), [auditoria]);

  // Auditoria helper
  const registrarAuditoria = (
    quem: string,
    entidade: string,
    entidadeId: string,
    acao: AuditoriaItem['acao'],
    resumo: string
  ) => {
    const novoItem: AuditoriaItem = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quando: new Date().toISOString(),
      quem,
      entidade,
      entidadeId,
      acao,
      resumo,
    };
    setAuditoria(prev => [novoItem, ...prev]);
  };

  // CLIENTES
  const salvarCliente = (clienteData: Omit<Cliente, 'id' | 'criadoEm' | 'historicoInteracoes'> & { id?: string }) => {
    if (clienteData.id) {
      // Edição
      setClientes(prev =>
        prev.map(c => (c.id === clienteData.id ? { ...c, ...clienteData } : c))
      );
      registrarAuditoria('Usuário', 'Cliente', clienteData.id, 'EDITAR', `Cliente ${clienteData.razaoSocial} atualizado.`);
    } else {
      // Novo
      const novoId = `cli-${Date.now()}`;
      const novoCliente: Cliente = {
        ...clienteData,
        id: novoId,
        criadoEm: new Date().toISOString().substring(0, 10),
        historicoInteracoes: [],
      };
      setClientes(prev => [novoCliente, ...prev]);

      // Se for LEAD, cria entrada no funil de prospecção
      if (novoCliente.situacao === 'LEAD') {
        const novoLead: LeadProspeccao = {
          id: `lead-${Date.now()}`,
          clienteId: novoId,
          etapa: 'NOVO',
          prioridadeFila: 1,
          historicoEnvios: [],
        };
        setLeads(prev => [novoLead, ...prev]);
      }
      registrarAuditoria('Usuário', 'Cliente', novoId, 'CRIAR', `Novo cliente cadastrado: ${novoCliente.razaoSocial}`);
    }
  };

  const adicionarInteracaoCliente = (
    clienteId: string,
    canal: 'WHATSAPP' | 'EMAIL' | 'REUNIAO' | 'TELEFONE',
    resumo: string,
    autor: string
  ) => {
    setClientes(prev =>
      prev.map(c => {
        if (c.id === clienteId) {
          const interacao = {
            id: `int-${Date.now()}`,
            data: new Date().toISOString().substring(0, 10),
            canal,
            resumo,
            autor,
          };
          return {
            ...c,
            historicoInteracoes: [interacao, ...(c.historicoInteracoes || [])],
          };
        }
        return c;
      })
    );
  };

  // PROSPECÇÃO / FUNIL
  const moverEtapaLead = (leadId: string, novaEtapa: EtapaLead, motivoPerda?: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          const atualizado: LeadProspeccao = {
            ...l,
            etapa: novaEtapa,
            motivoPerda: novaEtapa === 'PERDIDO' || novaEtapa === 'SAIU_DA_LISTA' ? motivoPerda : undefined,
          };
          if (novaEtapa === 'CONTATADO' && !l.dataPrimeiroContato) {
            atualizado.dataPrimeiroContato = new Date().toISOString().substring(0, 10);
          }
          if (novaEtapa === 'LEMBRETE_ENVIADO') {
            atualizado.dataUltimoLembrete = new Date().toISOString().substring(0, 10);
          }
          if (novaEtapa === 'RESPONDEU') {
            atualizado.dataResposta = new Date().toISOString().substring(0, 10);
          }
          return atualizado;
        }
        return l;
      })
    );
  };

  const registrarEnvioProspeccao = (
    leadId: string,
    canal: 'WHATSAPP' | 'EMAIL',
    modelo: string,
    autor: string
  ) => {
    const hoje = new Date().toISOString().substring(0, 10);
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          const envios = [...l.historicoEnvios, { data: hoje, canal, modelo }];
          let novaEtapa = l.etapa;
          if (l.etapa === 'NOVO') {
            novaEtapa = 'CONTATADO';
          } else if (l.etapa === 'CONTATADO') {
            novaEtapa = 'LEMBRETE_ENVIADO';
          }
          return {
            ...l,
            etapa: novaEtapa,
            dataPrimeiroContato: l.dataPrimeiroContato || hoje,
            dataUltimoLembrete: l.etapa === 'CONTATADO' ? hoje : l.dataUltimoLembrete,
            historicoEnvios: envios,
          };
        }
        return l;
      })
    );

    // Registra também no histórico do cliente
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      adicionarInteracaoCliente(
        lead.clienteId,
        canal,
        `Envio de mensagem de prospecção [${modelo}]`,
        autor
      );
    }
  };

  // CONTRATOS
  const salvarContrato = (contratoData: Omit<Contrato, 'id' | 'historicoReajustes'> & { id?: string }) => {
    if (contratoData.id) {
      setContratos(prev =>
        prev.map(c => (c.id === contratoData.id ? { ...c, ...contratoData } : c))
      );
      registrarAuditoria('Usuário', 'Contrato', contratoData.id, 'EDITAR', `Contrato ${contratoData.numero} editado.`);
    } else {
      const novoId = `cont-${Date.now()}`;
      const novoContrato: Contrato = {
        ...contratoData,
        id: novoId,
        historicoReajustes: [],
      };
      setContratos(prev => [novoContrato, ...prev]);

      // Regra: cliente vira 'CLIENTE' ao assinar contrato
      setClientes(prev =>
        prev.map(cl => (cl.id === novoContrato.clienteId ? { ...cl, situacao: 'CLIENTE' } : cl))
      );

      // Se for contrato de implantação, abre projeto automaticamente
      if (novoContrato.tipo === 'IMPLANTACAO') {
        const clienteAlvo = clientes.find(c => c.id === novoContrato.clienteId);
        const novoProjeto: Projeto = {
          id: `proj-${Date.now()}`,
          contratoId: novoId,
          clienteId: novoContrato.clienteId,
          nome: `Implantação SCI - ${clienteAlvo?.nomeFantasia || 'Cliente'}`,
          inicio: novoContrato.inicio,
          status: 'EM_ANDAMENTO',
          horasTotais: 0,
          etapas: [
            {
              ordem: 1,
              nome: '1. Kickoff do Projeto',
              descricao: 'Alinhamento inicial com gestor e responsáveis.',
              concluida: false,
              horasRegistradas: 0,
              prazoEstimado: '5 dias',
            },
            {
              ordem: 2,
              nome: '2. Recebimento dos Dados e Layouts',
              descricao: 'Envio de leiautes, contas bancárias e extratos.',
              concluida: false,
              horasRegistradas: 0,
              prazoEstimado: '10 dias',
            },
            {
              ordem: 3,
              nome: '3. Configuração dos Robôs e De/Para',
              descricao: 'Parametrização das regras de conciliação e SCI.',
              concluida: false,
              horasRegistradas: 0,
              prazoEstimado: '15 dias',
            },
            {
              ordem: 4,
              nome: '4. Treinamento da Equipe',
              descricao: 'Treinamento prático da equipe contábil.',
              concluida: false,
              horasRegistradas: 0,
              prazoEstimado: '20 dias',
            },
            {
              ordem: 5,
              nome: '5. Acompanhamento de 30 Dias (Go-Live)',
              descricao: 'Suporte assistido no primeiro mês de uso.',
              concluida: false,
              horasRegistradas: 0,
              prazoEstimado: '30 dias',
            },
          ],
        };
        setProjetos(prev => [novoProjeto, ...prev]);
      }

      registrarAuditoria(
        'Usuário',
        'Contrato',
        novoId,
        'CRIAR',
        `Contrato ${novoContrato.numero} criado com valor R$ ${novoContrato.valorTotal.toFixed(2)}`
      );
    }
  };

  const aplicarReajusteContrato = (
    contratoId: string,
    percentual: number,
    novoValor: number,
    socioAprovador: string,
    indice: string = 'IPCA'
  ) => {
    setContratos(prev =>
      prev.map(c => {
        if (c.id === contratoId) {
          const reajuste = {
            data: new Date().toISOString().substring(0, 10),
            percentual,
            valorAnterior: c.valorTotal,
            valorNovo: novoValor,
            socioAprovador,
            indice,
          };
          return {
            ...c,
            valorTotal: novoValor,
            historicoReajustes: [reajuste, ...(c.historicoReajustes || [])],
          };
        }
        return c;
      })
    );
    registrarAuditoria(
      socioAprovador,
      'Contrato',
      contratoId,
      'REAJUSTE',
      `Reajuste de ${percentual}% aplicado pelo índice ${indice}. Novo valor: R$ ${novoValor.toFixed(2)}`
    );
  };

  const alterarSituacaoContrato = (
    contratoId: string,
    novaSituacao: Contrato['situacao'],
    motivo?: string,
    socio?: string
  ) => {
    setContratos(prev =>
      prev.map(c => {
        if (c.id === contratoId) {
          return {
            ...c,
            situacao: novaSituacao,
            motivoEncerramento: novaSituacao === 'ENCERRADO' ? motivo : c.motivoEncerramento,
            dataEncerramento:
              novaSituacao === 'ENCERRADO' ? new Date().toISOString().substring(0, 10) : c.dataEncerramento,
          };
        }
        return c;
      })
    );

    // Se encerrou contrato, verifica se cliente ainda tem algum outro contrato ATIVO
    if (novaSituacao === 'ENCERRADO') {
      const c = contratos.find(ct => ct.id === contratoId);
      if (c) {
        const outrosAtivos = contratos.filter(
          ct => ct.clienteId === c.clienteId && ct.id !== contratoId && ct.situacao === 'ATIVO'
        );
        if (outrosAtivos.length === 0) {
          setClientes(prev =>
            prev.map(cl => (cl.id === c.clienteId ? { ...cl, situacao: 'EX_CLIENTE' } : cl))
          );
        }
      }
    }

    registrarAuditoria(
      socio || 'Usuário',
      'Contrato',
      contratoId,
      novaSituacao === 'ENCERRADO' ? 'ENCERRAR_CONTRATO' : 'SUSPENDER_CONTRATO',
      `Situação do contrato alterada para ${novaSituacao}. Motivo: ${motivo || 'N/A'}`
    );
  };

  // FATURAS & FINANCEIRO
  const gerarFaturasMes = (competencia: string, socioExecutor: string): { geradas: number; duplicadas: number } => {
    let geradas = 0;
    let duplicadas = 0;
    const novasFaturas: Fatura[] = [];

    // Contratos de mensalidade que estão ATIVOS
    const contratosMensalidade = contratos.filter(
      c => c.tipo === 'MENSALIDADE' && c.situacao === 'ATIVO'
    );

    contratosMensalidade.forEach(c => {
      // Regra de ouro: chave única (contrato, competência)
      const jaExiste = faturas.some(
        f => f.contratoId === c.id && f.competencia === competencia && f.situacao !== 'CANCELADA'
      );

      if (jaExiste) {
        duplicadas++;
        return;
      }

      // Calcula dia de vencimento (1 a 28)
      const [ano, mes] = competencia.split('-');
      const dia = String(c.diaVencimento).padStart(2, '0');
      const dataVencimento = `${ano}-${mes}-${dia}`;
      const dataEmissao = `${ano}-${mes}-01`;

      // Primeiro mês proporcional caso o contrato tenha iniciado dentro desta competência
      let valorFinal = c.valorTotal;
      if (c.inicio.startsWith(competencia)) {
        valorFinal = calcularValorProporcional(c.valorTotal, c.inicio);
      }

      const novaFatura: Fatura = {
        id: `fat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        numero: `FAT-${ano}${mes}-${String(faturas.length + geradas + 1).padStart(3, '0')}`,
        contratoId: c.id,
        clienteId: c.clienteId,
        competencia,
        dataEmissao,
        dataVencimento,
        valorBruto: valorFinal,
        situacao: 'ABERTA',
        tipoCobranca: 'MENSALIDADE',
      };

      novasFaturas.push(novaFatura);
      geradas++;
    });

    if (novasFaturas.length > 0) {
      setFaturas(prev => [...novasFaturas, ...prev]);
      registrarAuditoria(
        socioExecutor,
        'Fatura',
        competencia,
        'CRIAR',
        `${geradas} faturas geradas para a competência ${competencia}.`
      );
    }

    return { geradas, duplicadas };
  };

  const baixarFatura = (
    faturaId: string,
    dataRecebimento: string,
    valorRecebido: number,
    socio: string
  ) => {
    setFaturas(prev =>
      prev.map(f => {
        if (f.id === faturaId) {
          const diferenca = valorRecebido - f.valorBruto;
          let jurosMulta = 0;
          let descontoConcedido = 0;
          if (diferenca > 0) jurosMulta = diferenca;
          if (diferenca < 0) descontoConcedido = Math.abs(diferenca);

          return {
            ...f,
            situacao: 'PAGA',
            dataRecebimento,
            valorRecebido,
            jurosMulta,
            descontoConcedido,
          };
        }
        return f;
      })
    );

    // Se contrato estava suspenso por fatura vencida, reativa automaticamente
    const fat = faturas.find(f => f.id === faturaId);
    if (fat) {
      const ctr = contratos.find(c => c.id === fat.contratoId);
      if (ctr && ctr.situacao === 'SUSPENSO') {
        alterarSituacaoContrato(ctr.id, 'ATIVO', 'Pagamento recebido. Contrato reativado.', socio);
      }
    }

    registrarAuditoria(
      socio,
      'Fatura',
      faturaId,
      'EDITAR',
      `Fatura baixada com recebimento de R$ ${valorRecebido.toFixed(2)} em ${dataRecebimento}`
    );
  };

  const cancelarFatura = (faturaId: string, motivo: string, socio: string) => {
    setFaturas(prev =>
      prev.map(f => (f.id === faturaId ? { ...f, situacao: 'CANCELADA', motivoCancelamento: motivo } : f))
    );
    registrarAuditoria(socio, 'Fatura', faturaId, 'EDITAR', `Fatura cancelada. Motivo: ${motivo}`);
  };

  // DESPESAS
  const salvarDespesa = (despesaData: Omit<Despesa, 'id'> & { id?: string }) => {
    if (despesaData.id) {
      setDespesas(prev => prev.map(d => (d.id === despesaData.id ? { ...d, ...despesaData } : d)));
    } else {
      const nova: Despesa = { ...despesaData, id: `desp-${Date.now()}` };
      setDespesas(prev => [nova, ...prev]);
    }
  };

  // FECHAMENTO DE MÊS
  const fecharMes = (competencia: string, socio: string) => {
    // Calcula totais em regime de caixa
    const faturasPagas = faturas.filter(
      f => f.competencia === competencia && f.situacao === 'PAGA'
    );
    const receitaTotal = faturasPagas.reduce((acc, f) => acc + (f.valorRecebido || f.valorBruto), 0);

    const despesasMes = despesas.filter(d => d.competencia === competencia);
    const despesasTotal = despesasMes.reduce((acc, d) => acc + d.valor, 0);

    const lucroCaixa = receitaTotal - despesasTotal;
    const reservaPercentual = parametros.reservaPercentual || 20;
    const reservaCalculada = lucroCaixa > 0 ? (lucroCaixa * reservaPercentual) / 100 : 0;
    const valorDisponivel = lucroCaixa > 0 ? lucroCaixa - reservaCalculada : 0;

    const novoFechamento: FechamentoMes = {
      competencia,
      fechado: true,
      dataFechamento: new Date().toISOString(),
      socioFechamento: socio,
      receitaTotal,
      despesasTotal,
      lucroCaixa,
      reservaCalculada,
      valorDisponivelDistribuicao: valorDisponivel,
      distribuicaoAprovadaSocio1: false,
      distribuicaoAprovadaSocio2: false,
      prejuizoAbatido: 0,
    };

    setFechamentos(prev => {
      const filtrado = prev.filter(f => f.competencia !== competencia);
      return [novoFechamento, ...filtrado];
    });

    registrarAuditoria(
      socio,
      'FechamentoMes',
      competencia,
      'FECHAR_MES',
      `Competência ${competencia} fechada. Lucro caixa: R$ ${lucroCaixa.toFixed(2)}, Reserva retida: R$ ${reservaCalculada.toFixed(2)}.`
    );
  };

  const reabrirMes = (competencia: string, motivo: string, socio: string) => {
    setFechamentos(prev =>
      prev.map(f => (f.competencia === competencia ? { ...f, fechado: false } : f))
    );
    registrarAuditoria(
      socio,
      'FechamentoMes',
      competencia,
      'REABRIR_MES',
      `Competência ${competencia} reaberta por ${socio}. Motivo: ${motivo}`
    );
  };

  const aprovarDistribuicaoLucro = (competencia: string, socioNumero: 1 | 2, nomeSocio: string) => {
    setFechamentos(prev =>
      prev.map(f => {
        if (f.competencia === competencia) {
          if (socioNumero === 1) {
            return {
              ...f,
              distribuicaoAprovadaSocio1: true,
              dataAprovacaoSocio1: new Date().toISOString(),
              socio1Nome: nomeSocio,
            };
          } else {
            return {
              ...f,
              distribuicaoAprovadaSocio2: true,
              dataAprovacaoSocio2: new Date().toISOString(),
              socio2Nome: nomeSocio,
            };
          }
        }
        return f;
      })
    );
    registrarAuditoria(
      nomeSocio,
      'DistribuicaoLucros',
      competencia,
      'APROVAR_LUCRO',
      `Sócio ${nomeSocio} aprovou a distribuição de lucros da competência ${competencia}.`
    );
  };

  // PROJETOS
  const concluirEtapaProjeto = (projetoId: string, ordemEtapa: number, socio: string) => {
    setProjetos(prev =>
      prev.map(p => {
        if (p.id === projetoId) {
          // Trava sequencial: etapa só conclui se a anterior estiver concluída
          if (ordemEtapa > 1) {
            const etapaAnterior = p.etapas.find(e => e.ordem === ordemEtapa - 1);
            if (!etapaAnterior || !etapaAnterior.concluida) {
              alert('A etapa anterior precisa ser concluída antes desta!');
              return p;
            }
          }

          const etapasAtualizadas = p.etapas.map(e => {
            if (e.ordem === ordemEtapa) {
              return {
                ...e,
                concluida: true,
                dataConclusao: new Date().toISOString().substring(0, 10),
                responsavel: socio,
              };
            }
            return e;
          });

          const todasConcluidas = etapasAtualizadas.every(e => e.concluida);
          return {
            ...p,
            etapas: etapasAtualizadas,
            status: todasConcluidas ? 'CONCLUIDO' : 'EM_ANDAMENTO',
          };
        }
        return p;
      })
    );
  };

  const apontarHorasProjeto = (projetoId: string, ordemEtapa: number, horas: number) => {
    setProjetos(prev =>
      prev.map(p => {
        if (p.id === projetoId) {
          const etapas = p.etapas.map(e =>
            e.ordem === ordemEtapa ? { ...e, horasRegistradas: (e.horasRegistradas || 0) + horas } : e
          );
          const total = etapas.reduce((acc, curr) => acc + (curr.horasRegistradas || 0), 0);
          return { ...p, etapas, horasTotais: total };
        }
        return p;
      })
    );
  };

  // TREINAMENTOS & CERTIFICADOS
  const atualizarPresencaAluno = (
    turmaId: string,
    alunoId: string,
    percentual: number
  ) => {
    setTreinamentos(prev =>
      prev.map(t => {
        if (t.id === turmaId) {
          const alunos = t.alunos.map(a =>
            a.id === alunoId ? { ...a, percentualPresenca: percentual } : a
          );
          return { ...t, alunos };
        }
        return t;
      })
    );
  };

  const emitirCertificadoAluno = (turmaId: string, alunoId: string) => {
    const turma = treinamentos.find(t => t.id === turmaId);
    const aluno = turma?.alunos.find(a => a.id === alunoId);

    // Regra: certificado só com 75% ou mais de presença
    if (!aluno || aluno.percentualPresenca < 75) {
      alert('Certificado só pode ser emitido para alunos com 75% ou mais de presença.');
      return false;
    }

    const codigo = `MP-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hoje = new Date().toISOString().substring(0, 10);

    setTreinamentos(prev =>
      prev.map(t => {
        if (t.id === turmaId) {
          const alunos = t.alunos.map(a =>
            a.id === alunoId
              ? {
                  ...a,
                  certificadoEmitido: true,
                  dataCertificado: hoje,
                  codigoValidacao: codigo,
                }
              : a
          );
          return { ...t, alunos };
        }
        return t;
      })
    );
    return true;
  };

  // SUPORTE
  const abrirChamado = (chamadoData: Omit<ChamadoSuporte, 'id' | 'numero' | 'abertoEm' | 'prazoLimite'>) => {
    // Regra: só cliente com contrato ATIVO pode abrir chamado
    const contratosCliente = contratos.filter(
      c => c.clienteId === chamadoData.clienteId && c.situacao === 'ATIVO'
    );
    if (contratosCliente.length === 0) {
      const suspenso = contratos.some(
        c => c.clienteId === chamadoData.clienteId && c.situacao === 'SUSPENSO'
      );
      if (suspenso) {
        alert('Este cliente possui contratos SUSPENSOS por inadimplência. Abertura permitida apenas para regularização!');
      } else {
        alert('Apenas clientes com contrato ATIVO podem abrir chamados de suporte técnico.');
        return;
      }
    }

    const agora = new Date();
    let horasSla = 24;
    if (chamadoData.prioridade === 'ALTA') horasSla = 4;
    if (chamadoData.prioridade === 'BAIXA') horasSla = 48;

    const prazo = new Date(agora.getTime() + horasSla * 60 * 60 * 1000).toISOString();
    const novoChamado: ChamadoSuporte = {
      ...chamadoData,
      id: `cham-${Date.now()}`,
      numero: `SUP-${agora.getFullYear()}-${String(chamados.length + 1).padStart(3, '0')}`,
      abertoEm: agora.toISOString(),
      slaHorasUteis: horasSla,
      prazoLimite: prazo,
      situacao: 'ABERTO',
    };

    setChamados(prev => [novoChamado, ...prev]);
  };

  const encerrarChamado = (chamadoId: string, solucao: string, atendente: string) => {
    setChamados(prev =>
      prev.map(ch =>
        ch.id === chamadoId
          ? {
              ...ch,
              situacao: 'ENCERRADO',
              solucao,
              atendente,
              encerradoEm: new Date().toISOString(),
            }
          : ch
      )
    );
  };

  // SÓCIOS E PARÂMETROS
  const salvarSocios = (novosSocios: Socio[]) => {
    // Regra de ouro: soma das participações = 100%
    const soma = novosSocios.reduce((acc, s) => acc + (Number(s.participacao) || 0), 0);
    if (Math.abs(soma - 100) > 0.01) {
      throw new Error(`A soma das participações dos sócios precisa ser exatamente 100%. (Soma atual: ${soma}%)`);
    }
    setSocios(novosSocios);
  };

  const resetarParaPadrao = () => {
    if (confirm('Deseja realmente restaurar todos os dados para o padrão de demonstração?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return {
    socios,
    parametros,
    clientes,
    leads,
    contratos,
    faturas,
    despesas,
    fechamentos,
    adiantamentos,
    projetos,
    treinamentos,
    chamados,
    auditoria,
    // Ações
    salvarCliente,
    adicionarInteracaoCliente,
    moverEtapaLead,
    registrarEnvioProspeccao,
    salvarContrato,
    aplicarReajusteContrato,
    alterarSituacaoContrato,
    gerarFaturasMes,
    baixarFatura,
    cancelarFatura,
    salvarDespesa,
    fecharMes,
    reabrirMes,
    aprovarDistribuicaoLucro,
    concluirEtapaProjeto,
    apontarHorasProjeto,
    atualizarPresencaAluno,
    emitirCertificadoAluno,
    abrirChamado,
    encerrarChamado,
    salvarSocios,
    setParametros,
    resetarParaPadrao,
  };
}
