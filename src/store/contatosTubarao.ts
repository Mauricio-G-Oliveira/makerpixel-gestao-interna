// Dados e utilitários dos 47 Escritórios de Contabilidade de Tubarão/SC
// Fonte: Google Maps (busca de 17/11/2026).
import { Cliente, LeadProspeccao } from '../types';

export interface ContatoTubarao {
  id: string;
  numero: number;
  nome: string;
  telefone: string;
  telefoneOriginal: string;
  tipo: string;
  hasWhatsapp: boolean;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  isOrprocon: boolean;
  observacoes: string;
}

export const CONTATOS_TUBARAO_RAW: ContatoTubarao[] = [
  {
    "id": "cli-tb-1",
    "numero": 1,
    "nome": "Adão Coradini",
    "telefone": "4836221438",
    "telefoneOriginal": "+55 48 3622-1438",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Tv. Eng. Annes Gualberto, 2916 - Oficinas",
    "bairro": "Oficinas",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-2",
    "numero": 2,
    "nome": "AF Contabilidade e Consultoria em Gestão Empresarial",
    "telefone": "48988014630",
    "telefoneOriginal": "+55 48 98801-4630",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "Rua Tubalcain Faraco, 21 - Sl 701 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-3",
    "numero": 3,
    "nome": "Confiance Assessoria e Consultoria Contábil",
    "telefone": "4830522998",
    "telefoneOriginal": "+55 48 3052-2998",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Luís Pedro Oliveira, 395 - Dehon",
    "bairro": "Dehon",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-4",
    "numero": 4,
    "nome": "Contab Assessoria Contábil",
    "telefone": "4830524886",
    "telefoneOriginal": "+55 48 3052-4886",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 926 - sala 701 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-5",
    "numero": 5,
    "nome": "Contabilidade Nunes",
    "telefone": "4836262973",
    "telefoneOriginal": "+55 48 3626-2973",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Luís Delfino, 219 - Passagem",
    "bairro": "Passagem",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-6",
    "numero": 6,
    "nome": "Contabilidade Tubarão Digital",
    "telefone": "",
    "telefoneOriginal": "",
    "tipo": "Não Informado",
    "hasWhatsapp": false,
    "endereco": "R. Manoel Inocêncio Nunes, 11 - Sl 1 - São Martinho",
    "bairro": "São Martinho",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-7",
    "numero": 7,
    "nome": "Contabilitá Assessoria Contábil",
    "telefone": "48988540126",
    "telefoneOriginal": "+55 48 98854-0126",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Manoel Miguel Bittencourt, 950 - Humaitá de Cima",
    "bairro": "Humaitá de Cima",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-8",
    "numero": 8,
    "nome": "CONTPREVSC - Contabilidade & Previdência",
    "telefone": "48991290483",
    "telefoneOriginal": "+55 48 99129-0483",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Jovencio Rodrigues da Cunha, 138 - São João Margem Esquerda",
    "bairro": "São João Margem Esquerda",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-9",
    "numero": 9,
    "nome": "Contronil Escritório de Contabilidade",
    "telefone": "4836221584",
    "telefoneOriginal": "+55 48 3622-1584",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 926 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-10",
    "numero": 10,
    "nome": "CONX Contabilidade & Consultoria",
    "telefone": "4836284484",
    "telefoneOriginal": "+55 48 3628-4484",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Rua Aldomar Cardoso, 64 - Ed. Satto IV, sala 405 - Passagem",
    "bairro": "Passagem",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-11",
    "numero": 11,
    "nome": "DB Contabilidade",
    "telefone": "4836220522",
    "telefoneOriginal": "+55 48 3622-0522",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Expedicionário José Pedro Coelho, 173 - Sl 4 - Dehon",
    "bairro": "Dehon",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-12",
    "numero": 12,
    "nome": "Digital Cont Contabilidade",
    "telefone": "",
    "telefoneOriginal": "",
    "tipo": "Não Informado",
    "hasWhatsapp": false,
    "endereco": "R. Princesa Isabel, 441 - Sala 02 - Oficinas",
    "bairro": "Oficinas",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-13",
    "numero": 13,
    "nome": "DPIERI Contabilidade",
    "telefone": "4836225767",
    "telefoneOriginal": "+55 48 3622-5767",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Washington Luís, 59 - Vila Moema",
    "bairro": "Vila Moema",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-14",
    "numero": 14,
    "nome": "ELLO Contabilidade S/S Ltda.",
    "telefone": "4836268035",
    "telefoneOriginal": "+55 48 3626-8035",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. José Nicolau de Carvalho, 74 - Monte Castelo",
    "bairro": "Monte Castelo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-15",
    "numero": 15,
    "nome": "Escricon Contabilidade",
    "telefone": "4836224352",
    "telefoneOriginal": "+55 48 3622-4352",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. José Antunes Martins, 192 - Vila Moema",
    "bairro": "Vila Moema",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-16",
    "numero": 16,
    "nome": "Escrita Contabilidade Consultiva",
    "telefone": "48996850105",
    "telefoneOriginal": "+55 48 99685-0105",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "Av. Expedicionário José Pedro Coelho, 1237 - 2º andar - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-17",
    "numero": 17,
    "nome": "Excelência Contábil",
    "telefone": "",
    "telefoneOriginal": "",
    "tipo": "Não Informado",
    "hasWhatsapp": false,
    "endereco": "R. Manoel Miguel Bittencourt - Humaitá",
    "bairro": "Humaitá",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-18",
    "numero": 18,
    "nome": "FACC Contabilidade",
    "telefone": "4836327167",
    "telefoneOriginal": "+55 48 3632-7167",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Expedicionário José Pedro Coelho, 199 - Dehon",
    "bairro": "Dehon",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-19",
    "numero": 19,
    "nome": "Fato Contábil Assessoria Empresarial",
    "telefone": "4836265633",
    "telefoneOriginal": "+55 48 3626-5633",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Expedicionário José Pedro Coelho, 1679 - Revoredo",
    "bairro": "Revoredo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-20",
    "numero": 20,
    "nome": "França o meu contador gestão empresarial",
    "telefone": "4836290411",
    "telefoneOriginal": "+55 48 3629-0411",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Prudente de Morais, 807 - Recife",
    "bairro": "Recife",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-21",
    "numero": 21,
    "nome": "Gisa Escritório Contábil",
    "telefone": "4836322667",
    "telefoneOriginal": "+55 48 3632-2667",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Jaime Águiar de Souza, 693 - Humaitá de Cima",
    "bairro": "Humaitá de Cima",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-22",
    "numero": 22,
    "nome": "Hold Contabilidade",
    "telefone": "4830524321",
    "telefoneOriginal": "+55 48 3052-4321",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Luiz Martins Collaço, 537 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-23",
    "numero": 23,
    "nome": "JS Contabilidade e Gestão",
    "telefone": "48999164720",
    "telefoneOriginal": "+55 48 99916-4720",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "Av. Pres. Getúlio Vargas, 4120 - Sala 03 - Revoredo",
    "bairro": "Revoredo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-24",
    "numero": 24,
    "nome": "LUCRON Contabilidade",
    "telefone": "4831921590",
    "telefoneOriginal": "+55 48 3192-1590",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Roberto Zumblick, 2113 - Humaitá de Cima",
    "bairro": "Humaitá de Cima",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-25",
    "numero": 25,
    "nome": "M-CON Consultoria e Contabilidade",
    "telefone": "4836263799",
    "telefoneOriginal": "+55 48 3626-3799",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 926 - Sl 610 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-26",
    "numero": 26,
    "nome": "Maximiano & Antunes Serviços Contábeis",
    "telefone": "48996945048",
    "telefoneOriginal": "+55 48 99694-5048",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "Av. Marcolino Martins Cabral, 926 - EJB 9º andar, salas 911/912 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-27",
    "numero": 27,
    "nome": "Meister Contabilidade",
    "telefone": "4836267007",
    "telefoneOriginal": "+55 48 3626-7007",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 1788 - Passagem",
    "bairro": "Passagem",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-28",
    "numero": 28,
    "nome": "MM Contabilidade",
    "telefone": "",
    "telefoneOriginal": "",
    "tipo": "Não Informado",
    "hasWhatsapp": false,
    "endereco": "R. Tarquínio Balsini, 368 - Morrotes",
    "bairro": "Morrotes",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-29",
    "numero": 29,
    "nome": "MT2 Contabilidade Consultiva",
    "telefone": "48984039969",
    "telefoneOriginal": "+55 48 98403-9969",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. das Pitangas, 58 - Monte Castelo",
    "bairro": "Monte Castelo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-30",
    "numero": 30,
    "nome": "Orprocon Escritório Contábil",
    "telefone": "4830523288",
    "telefoneOriginal": "+55 48 3052-3288",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 1315 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": true,
    "observacoes": "Empresa onde trabalho: não abordar"
  },
  {
    "id": "cli-tb-31",
    "numero": 31,
    "nome": "Pericial Contabilidade",
    "telefone": "4833025415",
    "telefoneOriginal": "+55 48 3302-5415",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Expedicionário José Pedro Coelho, 2505 - Revoredo",
    "bairro": "Revoredo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-32",
    "numero": 32,
    "nome": "Peters Contabilidade",
    "telefone": "48996070727",
    "telefoneOriginal": "+55 48 99607-0727",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Pio XII, 834 - Sala 01 - Humaitá",
    "bairro": "Humaitá",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-33",
    "numero": 33,
    "nome": "Prime Contabilidade",
    "telefone": "4836223021",
    "telefoneOriginal": "+55 48 3622-3021",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Rosário, 612 - sala 01 (Ed. Eco Amábile) - Vila Moema",
    "bairro": "Vila Moema",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-34",
    "numero": 34,
    "nome": "Rcon Contabilidade",
    "telefone": "48999164328",
    "telefoneOriginal": "+55 48 99916-4328",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. João Alfredo Rosa, 4970 - São João Margem Esquerda",
    "bairro": "São João Margem Esquerda",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-35",
    "numero": 35,
    "nome": "Settus Contabilidade",
    "telefone": "4831920647",
    "telefoneOriginal": "+55 48 3192-0647",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Profa. Eugênia dos Reis Perito, 183 - Sala 1 - Vila Moema",
    "bairro": "Vila Moema",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-36",
    "numero": 36,
    "nome": "Silvacon Serviços Contábeis",
    "telefone": "4836221417",
    "telefoneOriginal": "+55 48 3622-1417",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Rua Eng. Annes Gualberto, 2728 - Oficinas",
    "bairro": "Oficinas",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-37",
    "numero": 37,
    "nome": "Silésio Contabilidade",
    "telefone": "4830522081",
    "telefoneOriginal": "+55 48 3052-2081",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Rua Tubalcain Faraco, 20 - Sl 301 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-38",
    "numero": 38,
    "nome": "Solução Contabilidade",
    "telefone": "4836264569",
    "telefoneOriginal": "+55 48 3626-4569",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Expedicionário José Pedro Coelho, 1836 - Revoredo",
    "bairro": "Revoredo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-39",
    "numero": 39,
    "nome": "Soma Contabilidade",
    "telefone": "48996198505",
    "telefoneOriginal": "+55 48 99619-8505",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Bernardino Silva, 221 - Monte Castelo",
    "bairro": "Monte Castelo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-40",
    "numero": 40,
    "nome": "Top Contabilidade",
    "telefone": "4836261551",
    "telefoneOriginal": "+55 48 3626-1551",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Antônio Delpizzo Júnior, 2576 - Oficinas",
    "bairro": "Oficinas",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-41",
    "numero": 41,
    "nome": "TS Assessoria Contábil",
    "telefone": "48996304775",
    "telefoneOriginal": "+55 48 99630-4775",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Lucia Kulakowski Saldanha, 96 - São João Margem Esquerda",
    "bairro": "São João Margem Esquerda",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-42",
    "numero": 42,
    "nome": "Tubacon Contabilidade",
    "telefone": "48999141635",
    "telefoneOriginal": "+55 48 99914-1635",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Roberto Zumblick, 2727 - Sala 1 - Humaitá",
    "bairro": "Humaitá",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-43",
    "numero": 43,
    "nome": "Unifique Contabilidade",
    "telefone": "48996096713",
    "telefoneOriginal": "+55 48 99609-6713",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "Av. Marcolino Martins Cabral, 2644 - Vila Moema",
    "bairro": "Vila Moema",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-44",
    "numero": 44,
    "nome": "União Contabilidade",
    "telefone": "4830524444",
    "telefoneOriginal": "+55 48 3052-4444",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Bernardino Antunes Teixeira, 225 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-45",
    "numero": 45,
    "nome": "Vizzi Contabilidade",
    "telefone": "4830530430",
    "telefoneOriginal": "+55 48 3053-0430",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "Av. Marcolino Martins Cabral, 926 - Sl 1410 - Centro",
    "bairro": "Centro",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-46",
    "numero": 46,
    "nome": "WR Contabilidade e Planejamento Tributário",
    "telefone": "48998167694",
    "telefoneOriginal": "+55 48 99816-7694",
    "tipo": "Celular",
    "hasWhatsapp": true,
    "endereco": "R. Eponina Alves Martins, 325 - Monte Castelo",
    "bairro": "Monte Castelo",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  },
  {
    "id": "cli-tb-47",
    "numero": 47,
    "nome": "WV Contabilidade",
    "telefone": "4836324506",
    "telefoneOriginal": "+55 48 3632-4506",
    "tipo": "Fixo",
    "hasWhatsapp": false,
    "endereco": "R. Ver. Manoel Brígido Costa, 448 - Humaitá",
    "bairro": "Humaitá",
    "cidade": "Tubarão",
    "uf": "SC",
    "isOrprocon": false,
    "observacoes": ""
  }
];

export const CSV_ORIGINAL_TUBARAO: string = "#,Escritório,Telefone,Tipo,WhatsApp (link),Endereço,Bairro,Google Maps,Status do contato,Data do contato,Observações\n1,Adão Coradini,+55 48 3622-1438,Fixo,,\"Tv. Eng. Annes Gualberto, 2916 - Oficinas\",Oficinas,abrir,A contatar,,\n2,AF Contabilidade e Consultoria em Gestão Empresarial,+55 48 98801-4630,Celular,WhatsApp,\"Rua Tubalcain Faraco, 21 - Sl 701 - Centro\",Centro,abrir,A contatar,,\n3,Confiance Assessoria e Consultoria Contábil,+55 48 3052-2998,Fixo,,\"R. Luís Pedro Oliveira, 395 - Dehon\",Dehon,abrir,A contatar,,\n4,Contab Assessoria Contábil,+55 48 3052-4886,Fixo,,\"Av. Marcolino Martins Cabral, 926 - sala 701 - Centro\",Centro,abrir,A contatar,,\n5,Contabilidade Nunes,+55 48 3626-2973,Fixo,,\"R. Luís Delfino, 219 - Passagem\",Passagem,abrir,A contatar,,\n6,Contabilidade Tubarão Digital,não informado,,,\"R. Manoel Inocêncio Nunes, 11 - Sl 1 - São Martinho\",São Martinho,abrir,A contatar,,\n7,Contabilitá Assessoria Contábil,+55 48 98854-0126,Celular,WhatsApp,\"R. Manoel Miguel Bittencourt, 950 - Humaitá de Cima\",Humaitá de Cima,abrir,A contatar,,\n8,CONTPREVSC - Contabilidade & Previdência,+55 48 99129-0483,Celular,WhatsApp,\"R. Jovencio Rodrigues da Cunha, 138 - São João Margem Esquerda\",São João Margem Esquerda,abrir,A contatar,,\n9,Contronil Escritório de Contabilidade,+55 48 3622-1584,Fixo,,\"Av. Marcolino Martins Cabral, 926 - Centro\",Centro,abrir,A contatar,,\n10,CONX Contabilidade & Consultoria,+55 48 3628-4484,Fixo,,\"Rua Aldomar Cardoso, 64 - Ed. Satto IV, sala 405 - Passagem\",Passagem,abrir,A contatar,,\n11,DB Contabilidade,+55 48 3622-0522,Fixo,,\"Av. Expedicionário José Pedro Coelho, 173 - Sl 4 - Dehon\",Dehon,abrir,A contatar,,\n12,Digital Cont Contabilidade,não informado,,,\"R. Princesa Isabel, 441 - Sala 02 - Oficinas\",Oficinas,abrir,A contatar,,\n13,DPIERI Contabilidade,+55 48 3622-5767,Fixo,,\"R. Washington Luís, 59 - Vila Moema\",Vila Moema,abrir,A contatar,,\n14,ELLO Contabilidade S/S Ltda.,+55 48 3626-8035,Fixo,,\"R. José Nicolau de Carvalho, 74 - Monte Castelo\",Monte Castelo,abrir,A contatar,,\n15,Escricon Contabilidade,+55 48 3622-4352,Fixo,,\"R. José Antunes Martins, 192 - Vila Moema\",Vila Moema,abrir,A contatar,,\n16,Escrita Contabilidade Consultiva,+55 48 99685-0105,Celular,WhatsApp,\"Av. Expedicionário José Pedro Coelho, 1237 - 2º andar - Centro\",Centro,abrir,A contatar,,\n17,Excelência Contábil,não informado,,,R. Manoel Miguel Bittencourt - Humaitá,Humaitá,abrir,A contatar,,\n18,FACC Contabilidade,+55 48 3632-7167,Fixo,,\"Av. Expedicionário José Pedro Coelho, 199 - Dehon\",Dehon,abrir,A contatar,,\n19,Fato Contábil Assessoria Empresarial,+55 48 3626-5633,Fixo,,\"Av. Expedicionário José Pedro Coelho, 1679 - Revoredo\",Revoredo,abrir,A contatar,,\n20,França o meu contador gestão empresarial,+55 48 3629-0411,Fixo,,\"R. Prudente de Morais, 807 - Recife\",Recife,abrir,A contatar,,\n21,Gisa Escritório Contábil,+55 48 3632-2667,Fixo,,\"R. Jaime Águiar de Souza, 693 - Humaitá de Cima\",Humaitá de Cima,abrir,A contatar,,\n22,Hold Contabilidade,+55 48 3052-4321,Fixo,,\"R. Luiz Martins Collaço, 537 - Centro\",Centro,abrir,A contatar,,\n23,JS Contabilidade e Gestão,+55 48 99916-4720,Celular,WhatsApp,\"Av. Pres. Getúlio Vargas, 4120 - Sala 03 - Revoredo\",Revoredo,abrir,A contatar,,\n24,LUCRON Contabilidade,+55 48 3192-1590,Fixo,,\"R. Roberto Zumblick, 2113 - Humaitá de Cima\",Humaitá de Cima,abrir,A contatar,,\n25,M-CON Consultoria e Contabilidade,+55 48 3626-3799,Fixo,,\"Av. Marcolino Martins Cabral, 926 - Sl 610 - Centro\",Centro,abrir,A contatar,,\n26,Maximiano & Antunes Serviços Contábeis,+55 48 99694-5048,Celular,WhatsApp,\"Av. Marcolino Martins Cabral, 926 - EJB 9º andar, salas 911/912 - Centro\",Centro,abrir,A contatar,,\n27,Meister Contabilidade,+55 48 3626-7007,Fixo,,\"Av. Marcolino Martins Cabral, 1788 - Passagem\",Passagem,abrir,A contatar,,\n28,MM Contabilidade,não informado,,,\"R. Tarquínio Balsini, 368 - Morrotes\",Morrotes,abrir,A contatar,,\n29,MT2 Contabilidade Consultiva,+55 48 98403-9969,Celular,WhatsApp,\"R. das Pitangas, 58 - Monte Castelo\",Monte Castelo,abrir,A contatar,,\n30,Orprocon Escritório Contábil,+55 48 3052-3288,Fixo,,\"Av. Marcolino Martins Cabral, 1315 - Centro\",Centro,abrir,A contatar,,Empresa onde trabalho: não abordar\n31,Pericial Contabilidade,+55 48 3302-5415,Fixo,,\"Av. Expedicionário José Pedro Coelho, 2505 - Revoredo\",Revoredo,abrir,A contatar,,\n32,Peters Contabilidade,+55 48 99607-0727,Celular,WhatsApp,\"R. Pio XII, 834 - Sala 01 - Humaitá\",Humaitá,abrir,A contatar,,\n33,Prime Contabilidade,+55 48 3622-3021,Fixo,,\"Av. Rosário, 612 - sala 01 (Ed. Eco Amábile) - Vila Moema\",Vila Moema,abrir,A contatar,,\n34,Rcon Contabilidade,+55 48 99916-4328,Celular,WhatsApp,\"R. João Alfredo Rosa, 4970 - São João Margem Esquerda\",São João Margem Esquerda,abrir,A contatar,,\n35,Settus Contabilidade,+55 48 3192-0647,Fixo,,\"R. Profa. Eugênia dos Reis Perito, 183 - Sala 1 - Vila Moema\",Vila Moema,abrir,A contatar,,\n36,Silvacon Serviços Contábeis,+55 48 3622-1417,Fixo,,\"Rua Eng. Annes Gualberto, 2728 - Oficinas\",Oficinas,abrir,A contatar,,\n37,Silésio Contabilidade,+55 48 3052-2081,Fixo,,\"Rua Tubalcain Faraco, 20 - Sl 301 - Centro\",Centro,abrir,A contatar,,\n38,Solução Contabilidade,+55 48 3626-4569,Fixo,,\"Av. Expedicionário José Pedro Coelho, 1836 - Revoredo\",Revoredo,abrir,A contatar,,\n39,Soma Contabilidade,+55 48 99619-8505,Celular,WhatsApp,\"R. Bernardino Silva, 221 - Monte Castelo\",Monte Castelo,abrir,A contatar,,\n40,Top Contabilidade,+55 48 3626-1551,Fixo,,\"R. Antônio Delpizzo Júnior, 2576 - Oficinas\",Oficinas,abrir,A contatar,,\n41,TS Assessoria Contábil,+55 48 99630-4775,Celular,WhatsApp,\"R. Lucia Kulakowski Saldanha, 96 - São João Margem Esquerda\",São João Margem Esquerda,abrir,A contatar,,\n42,Tubacon Contabilidade,+55 48 99914-1635,Celular,WhatsApp,\"R. Roberto Zumblick, 2727 - Sala 1 - Humaitá\",Humaitá,abrir,A contatar,,\n43,Unifique Contabilidade,+55 48 99609-6713,Celular,WhatsApp,\"Av. Marcolino Martins Cabral, 2644 - Vila Moema\",Vila Moema,abrir,A contatar,,\n44,União Contabilidade,+55 48 3052-4444,Fixo,,\"R. Bernardino Antunes Teixeira, 225 - Centro\",Centro,abrir,A contatar,,\n45,Vizzi Contabilidade,+55 48 3053-0430,Fixo,,\"Av. Marcolino Martins Cabral, 926 - Sl 1410 - Centro\",Centro,abrir,A contatar,,\n46,WR Contabilidade e Planejamento Tributário,+55 48 99816-7694,Celular,WhatsApp,\"R. Eponina Alves Martins, 325 - Monte Castelo\",Monte Castelo,abrir,A contatar,,\n47,WV Contabilidade,+55 48 3632-4506,Fixo,,\"R. Ver. Manoel Brígido Costa, 448 - Humaitá\",Humaitá,abrir,A contatar,,";

// Converte a lista para o modelo Cliente
export const CLIENTES_TUBARAO: Cliente[] = CONTATOS_TUBARAO_RAW.map(c => {
  const docLimpo = `TB${String(c.numero).padStart(4, '0')}000100`;
  const obsTexto = c.isOrprocon
    ? '⚠️ EMPRESA ONDE TRABALHO: NÃO ABORDAR'
    : `Bairro: ${c.bairro} | Tipo: ${c.tipo}${c.observacoes ? ' | ' + c.observacoes : ''}`;

  return {
    id: c.id,
    documento: docLimpo,
    razaoSocial: c.nome.toUpperCase(),
    nomeFantasia: c.nome,
    contato: 'Responsável Contábil',
    email: '',
    telefone: c.telefone,
    cidade: c.cidade,
    uf: c.uf,
    endereco: c.endereco,
    cnae: '6920-6/01 - Atividades de contabilidade',
    origem: 'PROSPECCAO',
    situacao: 'LEAD',
    situacaoReceita: 'ATIVA',
    observacoes: obsTexto,
    criadoEm: '2026-11-17',
    historicoInteracoes: [],
  };
});

// Converte a lista para o modelo LeadProspeccao
export const LEADS_TUBARAO: LeadProspeccao[] = CONTATOS_TUBARAO_RAW.map(c => {
  if (c.isOrprocon) {
    return {
      id: `lead-${c.id}`,
      clienteId: c.id,
      etapa: 'SAIU_DA_LISTA',
      motivoPerda: 'Empresa onde trabalho: não abordar',
      prioridadeFila: 9999,
      historicoEnvios: [],
    };
  }

  return {
    id: `lead-${c.id}`,
    clienteId: c.id,
    etapa: 'NOVO',
    prioridadeFila: c.numero,
    historicoEnvios: [],
  };
});

function dispararDownload(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Exportador CSV completo com BOM para compatibilidade com Excel e Google Planilhas
export function exportarContatosParaCSV(
  contatos: ContatoTubarao[],
  nomeArquivo: string = 'makerpixel_contatos_tubarao.csv'
) {
  const colunas = [
    '#',
    'Escritório',
    'Telefone',
    'Tipo',
    'WhatsApp Link',
    'Endereço',
    'Bairro',
    'Cidade',
    'UF',
    'Status',
    'Observações'
  ];

  const linhas = contatos.map((c, i) => {
    const waLink = c.hasWhatsapp && c.telefone ? `https://wa.me/55${c.telefone}` : '';
    const status = c.isOrprocon ? 'Não Abordar' : 'A contatar';
    const foneFormatado = c.telefone
      ? (c.telefone.length === 11
          ? `(48) ${c.telefone.substring(2, 7)}-${c.telefone.substring(7)}`
          : `(48) ${c.telefone.substring(2, 6)}-${c.telefone.substring(6)}`)
      : c.telefoneOriginal;
    const valores = [
      String(c.numero || i + 1),
      `"${c.nome.replace(/"/g, '""')}"`,
      `"${foneFormatado}"`,
      c.tipo,
      waLink,
      `"${c.endereco.replace(/"/g, '""')}"`,
      `"${c.bairro}"`,
      c.cidade,
      c.uf,
      status,
      `"${(c.observacoes || (c.isOrprocon ? 'Empresa onde trabalho: não abordar' : '')).replace(/"/g, '""')}"`
    ];
    return valores.join(';');
  });

  const conteudoCsv = '\uFEFF' + [colunas.join(';'), ...linhas].join('\r\n');
  const blob = new Blob([conteudoCsv], { type: 'text/csv;charset=utf-8;' });
  dispararDownload(blob, nomeArquivo);
}

// 2. Exportador JSON estruturado
export function exportarContatosParaJSON(
  contatos: ContatoTubarao[],
  nomeArquivo: string = 'makerpixel_contatos_tubarao.json'
) {
  const jsonStr = JSON.stringify(contatos, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  dispararDownload(blob, nomeArquivo);
}

// 3. Exportador vCard (.vcf) para celular (adiciona à agenda do celular de uma só vez)
export function exportarContatosParaVCard(
  contatos: ContatoTubarao[],
  nomeArquivo: string = 'contatos_contabeis_tubarao.vcf'
) {
  const cards = contatos.map(c => {
    const tel = c.telefone ? `+55${c.telefone}` : '';
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${c.nome}`,
      `ORG:${c.nome}`,
      tel ? `TEL;TYPE=CELL,VOICE:${tel}` : '',
      `ADR;TYPE=WORK:;;${c.endereco};${c.cidade};${c.bairro};${c.uf};Brasil`,
      `NOTE:Escritório de Contabilidade em Tubarão/SC - Bairro: ${c.bairro}${c.observacoes ? ' - ' + c.observacoes : ''}`,
      'END:VCARD'
    ].filter(Boolean).join('\r\n');
  }).join('\r\n');

  const blob = new Blob([cards], { type: 'text/vcard;charset=utf-8;' });
  dispararDownload(blob, nomeArquivo);
}

// 4. Gerador de lista de números limpa para WhatsApp / Disparador
export function gerarTextoDisparoWhatsApp(contatos: ContatoTubarao[]): string {
  return contatos
    .filter(c => c.telefone && !c.isOrprocon)
    .map(c => `55${c.telefone};${c.nome};${c.bairro}`)
    .join('\n');
}

// 5. Download direto do CSV original
export function baixarCSVOriginalTubarao() {
  const blob = new Blob(['\uFEFF' + CSV_ORIGINAL_TUBARAO], { type: 'text/csv;charset=utf-8;' });
  dispararDownload(blob, 'escritorios_contabilidade_tubarao_original.csv');
}
