<div align="center">

# 🏢 MakerPixel Gestão Interna

**Plataforma Integrada de Gestão Empresarial, Operacional e Financeira para os Sócios da MakerPixel.**

[![React 18](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.6-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite 6](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub_Pages-10B981?style=for-the-badge&logo=github)](https://mauricio-g-oliveira.github.io/makerpixel-gestao-interna/)

<br />

### 🚀 [Acessar Demonstração Online (Live Demo)](https://mauricio-g-oliveira.github.io/makerpixel-gestao-interna/)

<br />

</div>

---

## 📖 Visão Geral do Projeto

O **MakerPixel Gestão Interna** é o sistema corporativo (*ERP/Backoffice*) desenvolvido para centralizar toda a operação executiva, societária, comercial e financeira da **MakerPixel**, empresa de tecnologia e engenharia de software sediada em **Tubarão / SC**, fundada por **Maurício G. Oliveira** e administrada por **dois sócios (50% / 50%)**.

Para manter total clareza na governança de produtos, os ecossistemas são estruturados em dois projetos complementares:

1. **MakerPixel Gestão Interna (Este Sistema):**
   - O painel operacional de uso interno dos sócios e colaboradores da MakerPixel.
   - Gerencia o ciclo completo do negócio: prospecção de leads contábeis, gestão de contratos, emissão de faturas sem duplicação, controle de despesas e lucros em regime de caixa, **distribuição de lucros com dupla aprovação**, implantações sequenciais, capacitações técnicas com emissão de certificados oficiais e suporte técnico com SLA.

2. **MakerPixel Contábil (O Produto Comercializado):**
   - A suíte de software e robôs de automação vendida pela MakerPixel para escritórios de contabilidade em Santa Catarina e em todo o Brasil.
   - Módulos comercializados: *Conciliação Bancária Automática, Integração Direta com SCI Único, Controle de Vencimentos & Obrigações por Setor e Robô de Conferências Fiscais Inteligentes*.

---

## 🎨 Identidade Visual & Design System MakerPixel

O sistema segue rigorosamente o guia de estilos e diretrizes visuais da MakerPixel:

- **Menu Lateral Escuro (`#0E1726`):** Barra de navegação corporativa com visualização dos módulos, indicador de perfil ativo (`SÓCIO` vs `COLABORADOR`) e suporte a menu gaveta (*drawer*) responsivo em smartphones.
- **Fundo da Aplicação (`#F4F6FA`):** Contraste calibrado para trabalho contínuo, com suporte a **Modo Escuro / Dark Mode** (`#090D16`) acionável a qualquer momento no topo.
- **Cartões e Componentes:** Superfície branca `#FFFFFF` com bordas sutis `#E3E7EE`, cantos arredondados de **12px** (`rounded-xl`) e alvos de toque com no mínimo **44px** (*touch-friendly*).
- **Paleta Semântica:**
  - 🔵 **Azul MakerPixel (`#2F5BEA`):** Destaque primário, CTAs, ações principais e logotipo.
  - 🟢 **Verde Sucesso (`#0F7A4A`):** Faturas pagas, contratos ativos, margens positivas e aprovações concluídas.
  - 🔴 **Vermelho Alerta (`#B42318`):** Vencimentos atrasados, cancelamentos, custos e chamados críticos.
  - 🟡 **Âmbar Atenção (`#B45309`):** Faturas a vencer, pendências de aprovação, suspensões e quarentena de leads.
- **Tipografia:** *Plus Jakarta Sans* com contraste AA e clareza visual em dados numéricos e tabelas.

---

## ⚡ Principais Funcionalidades

### 📊 1. Dashboard Executivo & Governança (`/`)
- **Métricas em Tempo Real:** MRR (*Monthly Recurring Revenue*) das mensalidades ativas do MakerPixel Contábil, Receita do mês em Regime de Caixa, Total a Receber (com destaque visual em vermelho para faturas vencidas) e Lucro Líquido Real.
- **Evolução Financeira:** Gráfico comparativo de Receitas vs Despesas dos últimos 6 meses.
- **Distribuição de Lucros do Mês:** Bloco de acompanhamento em tempo real com apuração de reserva estatutária (20%), maior resto nos centavos e status da **Aprovação Dupla**.
- **Alerta do Fator R:** Monitoramento contínuo da folha de pagamento dos sócios vs faturamento anual, alertando caso o índice fique abaixo de **28%** (enquadramento tributário Simples Nacional).
- **Listas Rápidas Acionáveis:** Faturas abertas com cobrança rápida para WhatsApp, contratos em aniversário de vigência para reajuste anual e fila semanal de leads.

### 👥 2. Clientes & Consulta à Receita Federal (`/clientes`)
- Cadastro completo de escritórios contábeis clientes, dados cadastrais e fiscais.
- **Validação Algorítmica de Documento:** Validação estrita de dígitos verificadores de CNPJ e CPF reais.
- **Botão "Buscar na Receita":** Integração via **BrasilAPI** que preenche exclusivamente os campos vazios e emite alertas caso a situação cadastral não esteja ATIVA.
- Histórico de interações por múltiplos canais (WhatsApp, E-mail, Reunião, Telefone).
- **Transição Automática de Status:** `LEAD` ➔ `PROPOSTA` ➔ `CLIENTE` (ao assinar contrato) ➔ `EX_CLIENTE` (ao encerrar contratos).

### 🎯 3. Funil de Vendas & Fila Semanal de 10 Leads (`/prospeccao`)
- **Fila da Semana:** Seleção inteligente de até 10 leads priorizados automaticamente (1º mesma região - Tubarão/SC, 2º nunca contatados, 3º mais antigos).
- **Cadência Automatizada:**
  - 1ª abordagem comercial do *MakerPixel Contábil*;
  - Lembrete amigável após 3 dias sem resposta;
  - Quarentena de 90 dias após 7 dias do lembrete sem retorno.
- **Lista de Exclusão (`SAIU_DA_LISTA`):** Bloqueio permanente por documento e telefone para contatos que solicitaram descadastro.
- **Disparo Assistido via WhatsApp e E-mail:** Modelos com interpolação dinâmica de `{nome}`, `{empresa}`, `{cidade}` e frase de saída obrigatória (*"Se não fizer sentido agora, é só me avisar que não volto a escrever."*).
- **Placar Semanal:** Contatados, respostas recebidas, demonstrações agendadas e taxa de conversão.

### 📜 4. Gestão de Contratos & Reajuste Anual IPCA (`/contratos`)
- Contratos de mensalidade recorrente, implantação de módulos, desenvolvimento sob medida e turmas de treinamento.
- Módulos comercializados: *Conciliação Bancária Automática (R$ 250), Integração SCI Único (R$ 350), Controle de Vencimentos (R$ 200), Gestão de Entregas por Setor (R$ 180) e Robô de Conferências Fiscais (R$ 220)*.
- **Reajuste Anual no Mês de Aniversário:** Modal de simulação com comparativo entre valor anterior, percentual informado (ex: IPCA 4.8%) e novo valor reajustado com histórico auditável.
- **Suspensão Sugerida:** Alerta automático no painel sugerindo suspender clientes inadimplentes com faturas há mais de 30 dias de atraso.

### 💰 5. Financeiro em Regime de Caixa & Régua de Cobrança (`/financeiro`)
- **Geração de Faturas Sem Duplicação:** Idempotência garantida por chave única `(contratoId, competencia)`.
- **Cálculo Proporcional no 1º Mês:** Fórmula matemática exata: `(valorMensal / diasDoMes) * diasRestantes`.
- **Baixa Inteligente:** Apuração automática de juros/multa recebidos ou desconto concedido em relação ao valor original.
- **Régua de Cobrança Assistida:** Modelos de mensagem para 3 dias antes do vencimento, dia do vencimento, +5 dias de atraso e +15 dias de atraso (com link direto para o WhatsApp).
- **Gestão de Despesas:** Despesas fixas e variáveis classificadas por categoria (Pró-labore dos sócios, Infraestrutura Cloud AWS/Supabase, Honorários Contábeis, DAS Simples).
- **Fechamento do Mês:** Trava definitiva de lançamentos para auditoria e destravamento com justificativa obrigatória.

### ⚖️ 6. Distribuição de Lucros com Dupla Aprovação (`/distribuicao-lucros`)
- **Regra de Ouro:** Apenas competências formalmente fechadas no Financeiro liberam a distribuição de lucros definitiva; competências abertas exibem prévia em tempo real.
- **Fórmula de Apuração:** `Lucro Caixa - Prejuízo Acumulado - Reserva Estatutária (20%) = Valor Líquido a Distribuir`.
- **Método do Maior Resto:** Arredondamento exato nos centavos para fechar 100% com a soma das quotas dos sócios (sem perda de dízimas).
- **Dedução de Adiantamentos:** Retiradas antecipadas no mês são abatidas do valor líquido final de cada sócio.
- **Aprovação Dupla Obrigatória:** O pagamento só é registrado após a validação e assinatura digital de **ambos os sócios** (Maurício e Felipe).
- **Alerta Fiscal:** Notificação visual em caso de retirada superior a R$ 50.000,00 por sócio no mês (retenção de 10% de IRRF).
- **Relatório para Ata de Aprovação de Contas:** Demonstrativo anual formatado para impressão oficial em PDF.

### 🚀 7. Implantações Sequenciais SCI Único (`/projetos`)
- Abertura automática de projeto para contratos de implantação com 5 etapas padrão:
  1. *Kickoff do Projeto e Alinhamento*
  2. *Recebimento dos Dados e Leiautes SCI*
  3. *Configuração dos Robôs e De/Para Contábil*
  4. *Treinamento Prático da Equipe do Escritório*
  5. *Acompanhamento de 30 Dias (Go-Live)*
- **Trava Sequencial:** Uma etapa só pode ser concluída se a etapa anterior estiver finalizada.
- Apontamento de horas dedicadas por sócio e cálculo de rentabilidade real por hora trabalhada.

### 🎓 8. Treinamentos & Emissão de Certificados Oficiais (`/treinamentos`)
- Gestão de turmas de capacitação técnica online e presenciais do *MakerPixel Contábil*.
- Controle de lista de presença por participante.
- **Emissão de Certificado Oficial MakerPixel:** Liberado exclusivamente para participantes com **75% ou mais de presença**, com layout institucional e código de validação.

### 🎧 9. Suporte Técnico com Gestão de SLA (`/suporte`)
- Abertura de chamados restrita a clientes com contrato `ATIVO`.
- Prazos de SLA automáticos: **Alta** (4 horas úteis), **Normal** (24 horas) e **Baixa** (48 horas).
- Contagem regressiva e alertas visuais no painel para chamados próximos ao vencimento.

### ⚙️ 10. Configurações, Quotas dos Sócios & Auditoria (`/configuracoes`)
- Quotas societárias com vigência a partir de competência específica e validação matemática de soma = 100%.
- Parâmetros da empresa (percentual de reserva técnica, multas, juros, IPCA e alíquotas do Simples).
- **Trilha de Auditoria Permanente:** Tabela imutável que registra quem, quando, entidade, id, ação e resumo de todas as alterações sensíveis.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Linguagem** | TypeScript 5.6 | Tipagem estática estrita, interfaces de domínio e segurança em tempo de compilação |
| **Framework UI** | React 18.3 | Interfaces reativas, componentes funcionais e renderização moderna |
| **Estilização** | Tailwind CSS 3.4 | Estilização utilitária com a paleta oficial da MakerPixel (`#0E1726` e `#2F5BEA`) |
| **Build & Bundler** | Vite 6.0 | Compilação ultrarrápida, Hot Module Replacement (HMR) e otimização de bundles |
| **Roteamento** | React Router (HashRouter) | Navegação SPA com suporte nativo a subpastas e refresh sem 404 no GitHub Pages |
| **Ícones** | Lucide React | Conjunto visual moderno, limpo e consistente |
| **Persistência** | LocalStorage Engine | Armazenamento reativo no navegador com seed de desenvolvimento e reset |
| **Integração Externa** | BrasilAPI | Consulta automatizada de CNPJ e situação cadastral na Receita Federal |
| **Deploy & CI/CD** | GitHub Pages + Git Flow | Hospedagem automatizada e controle de versão corporativo |

---

## 🌿 Estrutura de Branches & Governança (Git Flow)

Este repositório adota as melhores práticas de versionamento da indústria:

```
main (Produção estável / Deploy)
  │
  ├── develop (Integração contínua e novas versões)
  │     │
  │     ├── feature/gestao-societaria
  │     ├── feature/dupla-aprovacao-lucros
  │     └── feature/brasilapi-receita-federal
  │
  └── gh-pages (Build estático servido pelo GitHub Pages)
```

- **`main`**: branch de produção estável refletida no ambiente ao vivo.
- **`develop`**: branch onde os desenvolvimentos em andamento são consolidados antes de novas releases.
- **`gh-pages`**: branch com o build de produção (`dist/`) servido pelo GitHub Pages.
- **`feature/*`**: branches pontuais para novas funcionalidades isoladas.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18+ ou superior
- Gerenciador de pacotes `npm`

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/Mauricio-G-Oliveira/makerpixel-gestao-interna.git

# 2. Entrar na pasta do projeto
cd makerpixel-gestao-interna

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra o navegador em `http://localhost:3000` para visualizar a aplicação rodando.

### Comandos de Build e Qualidade

```bash
# Executar a compilação de produção e validação de types
npm run build

# Visualizar a versão de produção compilada localmente
npm run preview
```

---

## 📂 Estrutura de Pastas do Projeto

```
makerpixel-gestao-interna/
├── public/                  # Ícones e assets estáticos
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/          # Badge, StatCard, Modal de diálogo
│   │   ├── layout/          # Layout, Sidebar com drawer, Header com switcher de perfil
│   │   └── visual/          # MakerPixelLogo e elementos de branding
│   ├── lib/                 # Utilitários de domínio
│   │   ├── brasilApi.ts     # Consulta à Receita Federal via BrasilAPI com fallback
│   │   └── utils.ts         # Formatação de moeda BRL, datas, validador de CPF/CNPJ e maior resto
│   ├── pages/               # Módulos de tela da aplicação
│   │   ├── Clientes/        # Gestão de escritórios contábeis e busca na Receita
│   │   ├── Configuracoes/   # Quotas dos sócios (50%/50%), parâmetros e auditoria
│   │   ├── Contratos/       # Contratos, módulos e reajuste anual IPCA
│   │   ├── Dashboard/       # Indicadores executivos, Fator R e evolução de 6 meses
│   │   ├── DistribuicaoLucros/ # Cálculo com reserva 20%, adiantamentos e aprovação dupla
│   │   ├── Financeiro/      # Faturas, régua de cobrança, despesas e fechamento de caixa
│   │   ├── Projetos/        # 5 etapas sequenciais de implantação SCI Único
│   │   ├── Prospeccao/      # Fila da semana (10 leads), cadência e disparos assistidos
│   │   ├── Suporte/         # Chamados técnicos com controle de SLA
│   │   └── Treinamentos/    # Turmas, presença e emissão de certificados oficiais
│   ├── store/               # Gerenciamento de estado e persistência
│   │   ├── authContext.tsx  # Contexto de autenticação, alternador de perfis e tema escuro
│   │   ├── mockData.ts      # Dados semente realistas do ecossistema contábil
│   │   └── storage.ts       # Hook useAppData com LocalStorage reativo
│   ├── types/               # Tipagem estrita TypeScript de todas as entidades
│   ├── App.tsx              # Roteamento central com HashRouter
│   ├── index.css            # Diretivas Tailwind CSS e estilos globais
│   └── main.tsx             # Ponto de entrada React
├── LICENSE                  # Licença MIT
├── package.json             # Dependências e scripts do projeto
├── tailwind.config.js       # Configuração de temas e paleta oficial MakerPixel
├── tsconfig.json            # Configurações do compilador TypeScript
└── vite.config.ts           # Configurações do Vite e base relativa
```

---

## 👤 Autor

**Maurício G. Oliveira**
- GitHub: [@Mauricio-G-Oliveira](https://github.com/Mauricio-G-Oliveira)
- Projeto: [MakerPixel Gestão Interna no GitHub Pages](https://mauricio-g-oliveira.github.io/makerpixel-gestao-interna/)

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para obter mais detalhes.
