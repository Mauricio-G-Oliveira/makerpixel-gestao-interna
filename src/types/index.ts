// Domínio do MakerPixel Gestão

export type PerfilUsuario = 'SOCIO' | 'COLABORADOR';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  avatarUrl?: string;
}

export interface Socio {
  id: string;
  nome: string;
  email: string;
  participacao: number; // Porcentagem (ex: 50)
  vigenciaInicio: string; // AAAA-MM
  chavePix?: string;
  proLaboreMensal: number;
}

export interface ParametrosEmpresa {
  reservaPercentual: number; // Padrão 20%
  reservaVigencia: string; // AAAA-MM
  multaAtrasoPercentual: number; // Padrão 2%
  jurosMesPercentual: number; // Padrão 1%
  indiceReajustePadrao: string; // 'IPCA'
  aliquotaSimples: { [competencia: string]: number }; // Ex: '2026-11': 6.5
  limiteLeadSemana: number; // Padrão 10
  cidadeSede: string; // 'Tubarão'
  ufSede: string; // 'SC'
}

export type SituacaoCliente = 'LEAD' | 'PROPOSTA' | 'CLIENTE' | 'EX_CLIENTE';
export type OrigemCliente = 'INDICACAO' | 'SITE' | 'EVENTO' | 'PROSPECCAO';

export interface InteracaoCliente {
  id: string;
  data: string; // ISO string ou AAAA-MM-DD
  canal: 'WHATSAPP' | 'EMAIL' | 'REUNIAO' | 'TELEFONE';
  resumo: string;
  autor: string;
}

export interface Cliente {
  id: string;
  documento: string; // CNPJ ou CPF (apenas dígitos ou formatado)
  razaoSocial: string;
  nomeFantasia: string;
  contato: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  endereco?: string;
  cnae?: string;
  origem: OrigemCliente;
  situacao: SituacaoCliente;
  situacaoReceita?: string; // 'ATIVA', 'SUSPENSA', etc.
  observacoes?: string;
  historicoInteracoes: InteracaoCliente[];
  criadoEm: string;
}

export type EtapaLead =
  | 'NOVO'
  | 'CONTATADO'
  | 'LEMBRETE_ENVIADO'
  | 'RESPONDEU'
  | 'DEMONSTRACAO'
  | 'PROPOSTA'
  | 'GANHO'
  | 'PERDIDO'
  | 'SAIU_DA_LISTA';

export interface LeadProspeccao {
  id: string;
  clienteId: string;
  etapa: EtapaLead;
  motivoPerda?: string;
  dataPrimeiroContato?: string;
  dataUltimoLembrete?: string;
  dataResposta?: string;
  quarentenaAte?: string; // Data ISO caso não responda 7 dias após lembrete
  historicoEnvios: {
    data: string;
    canal: 'WHATSAPP' | 'EMAIL';
    modelo: string;
  }[];
  prioridadeFila: number;
}

export type TipoContrato = 'MENSALIDADE' | 'IMPLANTACAO' | 'SOB_MEDIDA' | 'TREINAMENTO';
export type SituacaoContrato = 'PROPOSTA' | 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';

export interface ModuloContratado {
  id: string;
  nome: string;
  preco: number;
}

export interface ReajusteHistorico {
  data: string;
  percentual: number;
  valorAnterior: number;
  valorNovo: number;
  socioAprovador: string;
  indice: string;
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  tipo: TipoContrato;
  modulos: ModuloContratado[];
  desconto: number;
  valorTotal: number; // soma dos modulos - desconto
  inicio: string; // AAAA-MM-DD
  vigenciaMeses: number; // padrão 12
  diaVencimento: number; // 1 a 28
  indiceReajuste: string; // 'IPCA'
  situacao: SituacaoContrato;
  pdfAssinadoUrl?: string;
  motivoEncerramento?: string;
  dataEncerramento?: string;
  historicoReajustes: ReajusteHistorico[];
}

export type SituacaoFatura = 'ABERTA' | 'PAGA' | 'VENCIDA' | 'CANCELADA';

export interface Fatura {
  id: string;
  numero: string;
  contratoId: string;
  clienteId: string;
  competencia: string; // AAAA-MM
  dataEmissao: string;
  dataVencimento: string;
  valorBruto: number;
  valorRecebido?: number;
  dataRecebimento?: string;
  jurosMulta?: number;
  descontoConcedido?: number;
  situacao: SituacaoFatura;
  motivoCancelamento?: string;
  tipoCobranca: 'MENSALIDADE' | 'IMPLANTACAO' | 'AVULSO';
  parcela?: string; // Ex: '1/3'
}

export type CategoriaDespesa =
  | 'IMPOSTOS'
  | 'INFRAESTRUTURA'
  | 'CONTADOR'
  | 'FERRAMENTAS'
  | 'MARKETING'
  | 'PRO_LABORE'
  | 'OUTROS';

export interface Despesa {
  id: string;
  descricao: string;
  categoria: CategoriaDespesa;
  valor: number;
  data: string; // AAAA-MM-DD
  competencia: string; // AAAA-MM
  tipo: 'FIXA' | 'VARIAVEL';
  comprovanteUrl?: string;
  paga: boolean;
}

export interface FechamentoMes {
  competencia: string; // AAAA-MM
  fechado: boolean;
  dataFechamento?: string;
  socioFechamento?: string;
  receitaTotal: number;
  despesasTotal: number;
  lucroCaixa: number; // Recebido - Pago
  reservaCalculada: number;
  valorDisponivelDistribuicao: number;
  distribuicaoAprovadaSocio1: boolean;
  dataAprovacaoSocio1?: string;
  socio1Nome?: string;
  distribuicaoAprovadaSocio2: boolean;
  dataAprovacaoSocio2?: string;
  socio2Nome?: string;
  prejuizoAbatido: number;
}

export interface AdiantamentoSocio {
  id: string;
  socioId: string;
  competencia: string;
  data: string;
  valor: number;
  descricao: string;
}

export interface EtapaProjeto {
  ordem: number;
  nome: string;
  descricao: string;
  concluida: boolean;
  dataConclusao?: string;
  responsavel?: string;
  horasRegistradas: number;
  prazoEstimado?: string;
}

export interface Projeto {
  id: string;
  contratoId: string;
  clienteId: string;
  nome: string;
  inicio: string;
  etapas: EtapaProjeto[];
  status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO';
  horasTotais: number;
}

export interface AlunoTreinamento {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  percentualPresenca: number;
  certificadoEmitido: boolean;
  dataCertificado?: string;
  codigoValidacao?: string;
}

export interface TurmaTreinamento {
  id: string;
  tema: string;
  clienteId?: string; // Se vinculado a contrato
  tipo: 'CONTRATO' | 'AVULSO';
  dataHora: string;
  modalidade: 'ONLINE' | 'PRESENCIAL';
  localOuLink: string;
  cargaHorariaHoras: number;
  vagasTotais: number;
  preco?: number;
  materialUrl?: string;
  alunos: AlunoTreinamento[];
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
}

export type PrioridadeSuporte = 'ALTA' | 'NORMAL' | 'BAIXA';
export type SituacaoSuporte = 'ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO_CLIENTE' | 'ENCERRADO';

export interface ChamadoSuporte {
  id: string;
  numero: string;
  clienteId: string;
  assunto: string;
  descricao: string;
  prioridade: PrioridadeSuporte;
  situacao: SituacaoSuporte;
  abertoEm: string;
  slaHorasUteis: number; // 4h alta, 24h normal, 48h baixa
  prazoLimite: string; // ISO string
  solucao?: string;
  atendente?: string;
  encerradoEm?: string;
}

export interface AuditoriaItem {
  id: string;
  quando: string; // ISO string
  quem: string;
  entidade: string;
  entidadeId: string;
  acao: 'CRIAR' | 'EDITAR' | 'FECHAR_MES' | 'REABRIR_MES' | 'APROVAR_LUCRO' | 'REAJUSTE' | 'ENCERRAR_CONTRATO' | 'SUSPENDER_CONTRATO';
  resumo: string;
}
