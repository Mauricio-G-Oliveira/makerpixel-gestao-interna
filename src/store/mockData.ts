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
  ModuloContratado,
} from '../types';
import { CLIENTES_TUBARAO, LEADS_TUBARAO } from './contatosTubarao';

// Catálogo de Serviços e Módulos do MakerPixel Contábil
export const MODULOS_DISPONIVEIS: ModuloContratado[] = [
  { id: 'mod-1', nome: 'Conciliação Bancária Automática', preco: 250 },
  { id: 'mod-2', nome: 'Integração com SCI Único', preco: 350 },
  { id: 'mod-3', nome: 'Controle de Vencimentos e Obrigações', preco: 200 },
  { id: 'mod-4', nome: 'Gestão de Entregas por Setor', preco: 180 },
  { id: 'mod-5', nome: 'Robô de Conferências Fiscais', preco: 220 },
];

// Estrutura Societária Oficial - Titular Único (100% Maurício G. Oliveira)
export const SOCIOS_INICIAIS: Socio[] = [
  {
    id: 'socio-1',
    nome: 'Maurício G. Oliveira',
    email: 'mauricio@makerpixel.com.br',
    participacao: 100, // Titular Único - 100% das Quotas
    vigenciaInicio: '2024-01',
    chavePix: 'mauricio@makerpixel.com.br',
    proLaboreMensal: 8000,
  },
];

// Parâmetros Fiscais e Operacionais da Empresa
export const PARAMETROS_INICIAIS: ParametrosEmpresa = {
  reservaPercentual: 20,
  reservaVigencia: '2024-01',
  multaAtrasoPercentual: 2,
  jurosMesPercentual: 1,
  indiceReajustePadrao: 'IPCA',
  aliquotaSimples: {
    '2026-10': 6.2,
    '2026-11': 6.5,
  },
  limiteLeadSemana: 10,
  cidadeSede: 'Tubarão',
  ufSede: 'SC',
};

// Base Real: 47 Escritórios Contábeis de Tubarão/SC (Zero dados de teste)
export const CLIENTES_INICIAIS: Cliente[] = [
  ...CLIENTES_TUBARAO,
];

// Fila Real de Prospecção (47 leads, zero contatos enviados até o momento)
export const LEADS_INICIAIS: LeadProspeccao[] = [
  ...LEADS_TUBARAO,
];

// Contratos: Inicia vazio para a operação real
export const CONTRATOS_INICIAIS: Contrato[] = [];

// Faturas: Inicia vazio para a operação real
export const FATURAS_INICIAIS: Fatura[] = [];

// Despesas: Inicia vazio para a operação real
export const DESPESAS_INICIAIS: Despesa[] = [];

// Fechamentos Mensais: Inicia vazio para a operação real
export const FECHAMENTOS_INICIAIS: FechamentoMes[] = [];

// Adiantamentos: Inicia vazio
export const ADIANTAMENTOS_INICIAIS: AdiantamentoSocio[] = [];

// Projetos de Implantação: Inicia vazio
export const PROJETOS_INICIAIS: Projeto[] = [];

// Turmas de Treinamento: Inicia vazio
export const TREINAMENTOS_INICIAIS: TurmaTreinamento[] = [];

// Chamados de Suporte: Inicia vazio
export const CHAMADOS_INICIAIS: ChamadoSuporte[] = [];

// Registro de Auditoria Inicial do Sistema
export const AUDITORIA_INICIAL: AuditoriaItem[] = [
  {
    id: 'aud-1',
    quando: '2026-11-20T20:00:00Z',
    quem: 'Maurício G. Oliveira',
    entidade: 'Sistema',
    entidadeId: 'makerpixel-init',
    acao: 'CRIAR',
    resumo: 'Inicialização oficial do sistema MakerPixel Gestão Interna (Titular Único 100% Maurício G. Oliveira). Base real de 47 escritórios contábeis de Tubarão/SC carregada.',
  },
];
