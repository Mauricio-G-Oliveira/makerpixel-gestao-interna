# MakerPixel Gestão Interna 💼🏢
> Sistema Integrado de Gestão Empresarial, Operacional e Societária da **MakerPixel** (Tubarão/SC).

---

## 📌 Contexto dos Nomes dos Sistemas

A MakerPixel possui dois projetos essenciais com papéis distintos:

1. **MakerPixel Gestão Interna (Este Sistema):**
   - O ERP e backoffice interno de controle da empresa.
   - Usado pelos **dois sócios (50% / 50%)** e colaboradores.
   - Gerencia: clientes e leads, prospecção, contratos, faturamento, despesas, fechamento do mês em regime de caixa, **distribuição de lucros com dupla aprovação**, implantações, treinamentos com certificados e suporte técnico.

2. **MakerPixel Contábil (O Produto Comercial Principal):**
   - O software e suíte de automações que a MakerPixel **vende para escritórios de contabilidade**.
   - Módulos comercializados: *Conciliação Bancária Automática, Integração Direta com SCI Único, Controle de Vencimentos & Obrigações, Gestão de Entregas por Setor e Robô de Conferências Fiscais*.

---

## 🎨 Identidade Visual MakerPixel
- **Menu Lateral Escuro:** `#0E1726` com controle de perfis (`SÓCIO` vs `COLABORADOR`)
- **Fundo do Conteúdo:** `#F4F6FA` (Modo claro) e `#090D16` (Modo escuro opcional)
- **Cartões:** `#FFFFFF` com borda suave `#E3E7EE` e cantos arredondados de `12px`
- **Cor Primária / Destaque:** `#2F5BEA`
- **Cores Semânticas:**
  - 🟢 **Verde (`#0F7A4A`):** Sucesso, faturas pagas, contratos ativos, aprovação concluída.
  - 🔴 **Vermelho (`#B42318`):** Vencidos, erros, despesas, chamados com SLA crítico.
  - 🟡 **Âmbar (`#B45309`):** Atenção, pendências de aprovação, faturas a vencer, suspensão.
- **Tipografia:** *Plus Jakarta Sans* com contraste AA e alvos de toque com no mínimo `44px`.

---

## 📦 Módulos da Gestão Interna

### 1. Início (Dashboard Geral)
- **KPIs em Tempo Real:** MRR das assinaturas do *MakerPixel Contábil*, Receita do Mês em Regime de Caixa, Total a Receber (com destaque em vermelho para vencidas) e Lucro Líquido do Mês.
- **Evolução Financeira:** Gráfico comparativo de Receitas vs Despesas dos últimos 6 meses.
- **Distribuição de Lucros:** Widget em tempo real com retenção de reserva estatutária (20%), divisão com o método do maior resto e status da **Aprovação Dupla**.
- **Listas Acionáveis:** Faturas a vencer com cobrança rápida via WhatsApp, contratos em mês de aniversário para reajuste IPCA, fila da semana de prospecção e alerta do **Fator R** (< 28%).

### 2. Clientes & Escritórios Contábeis
- Cadastro completo de dados fiscais (CNPJ/CPF único com algoritmo real de validação dos dígitos verificadores).
- **Botão "Buscar na Receita":** Consulta via **BrasilAPI** que preenche exclusivamente os campos vazios e emite alerta caso a situação cadastral não esteja ATIVA.
- Histórico de interações por múltiplos canais (WhatsApp, E-mail, Reunião, Telefone).
- Transição automática: `LEAD` ➔ `PROPOSTA` ➔ `CLIENTE` (ao ativar contrato) ➔ `EX_CLIENTE` (ao encerrar contratos).

### 3. Prospecção & Funil de Vendas (MakerPixel Contábil)
- **Fila da Semana:** Seleção de até 10 leads priorizados automaticamente (1º mesma região - Tubarão/SC, 2º nunca contatados, 3º mais antigos).
- **Cadência Inteligente:**
  - 1ª abordagem do *MakerPixel Contábil*;
  - Lembrete amigável após 3 dias sem resposta;
  - Quarentena de 90 dias após 7 dias do lembrete sem retorno.
- **Lista de Exclusão (`SAIU_DA_LISTA`):** Bloqueio permanente por documento e telefone para leads que solicitaram cancelamento.
- **Disparo Assistido via WhatsApp e E-mail:** Modelos com interpolação de `{nome}`, `{empresa}`, `{cidade}` e frase de saída obrigatória.
- **Placar Semanal:** Contatados, respostas, demonstrações agendadas e taxa de conversão.

### 4. Contratos de Serviços & Módulos
- Módulos comercializados do *MakerPixel Contábil*: Conciliação Bancária, Integração SCI Único, Controle de Vencimentos, Entregas por Setor e Conferências Fiscais.
- Cálculo automático de valor total (soma dos módulos − desconto concedido).
- **Reajuste Anual no Mês de Aniversário:** Modal com simulação comparativa entre valor anterior, percentual de reajuste (ex: IPCA 4.8%) e novo valor reajustado com histórico permanente.
- Regra de suspensão automática sugerida caso haja faturas em aberto há mais de 30 dias.

### 5. Financeiro & Regime de Caixa
- **Geração de Faturas Sem Duplicação:** Chave única `(contratoId, competencia)` garantindo idempotência total.
- **Cálculo Proporcional no Primeiro Mês:** `(valor / diasDoMes) * diasRestantes`.
- **Baixa de Faturas:** Registro de data e valor recebido com apuração de juros/multa recebidos ou desconto concedido.
- **Régua de Cobrança Assistida:** Modelos para 3 dias antes, dia do vencimento, +5 dias de atraso e +15 dias de atraso.
- **Lançamento de Despesas:** Despesas fixas e variáveis classificadas por categoria (Pró-labore, Infraestrutura Cloud, Contador, Simples Nacional).
- **Fechamento de Mês:** Trava definitiva de lançamentos para auditoria e destravamento com justificativa obrigatória.

### 6. Distribuição de Lucros (Coração do Sistema)
- **Fórmula de Apuração:** `Lucro Caixa - Prejuízo Acumulado - Reserva (20%) = Valor a Distribuir`.
- **Método do Maior Resto:** Arredondamento exato nos centavos para fechar 100% com a soma dos sócios.
- **Dedução de Adiantamentos:** Retiradas antecipadas no mês são abatidas do valor líquido final de cada sócio.
- **Aprovação Dupla:** Exigência de confirmação digital de **ambos os sócios** para liberação do pagamento.
- **Alerta Fiscal:** Notificação visual em caso de retirada superior a R$ 50.000,00 no mês (retenção de 10% de IRRF).
- **Relatório para Ata de Aprovação de Contas:** Demonstrativo anual formatado para impressão e arquivo societário.

### 7. Implantações (Projetos MakerPixel Contábil)
- 5 etapas sequenciais padronizadas de implantação:
  1. *Kickoff*
  2. *Recebimento dos Dados e Leiautes SCI*
  3. *Configuração dos Robôs e De/Para*
  4. *Treinamento da Equipe Contábil*
  5. *Acompanhamento de 30 Dias (Go-Live)*
- Trava sequencial (uma etapa só é concluída se a anterior estiver finalizada).
- Apontamento de horas dedicadas por sócio e cálculo de rentabilidade por hora.

### 8. Treinamentos & Emissão de Certificados
- Controle de turmas de capacitação do *MakerPixel Contábil*.
- Registro de frequência dos participantes.
- **Emissão de Certificado Oficial MakerPixel:** Liberado exclusivamente para participantes com **75% ou mais de presença**, com layout institucional e código de validação.

### 9. Suporte Técnico & Gestão de SLA
- Chamados restritos a escritórios com contrato `ATIVO`.
- Prazos de SLA: **Alta** (4 horas úteis), **Normal** (24 horas) e **Baixa** (48 horas).
- Alerta visual no painel para chamados próximos ao vencimento.

### 10. Configurações & Trilha de Auditoria
- Quotas dos sócios com vigência e validação matemática de soma = 100%.
- Parâmetros da empresa (percentual de reserva, multas, juros, alíquota Simples).
- Tabela de Auditoria completa registrando autor, data/hora, entidade e ação.

---

## 🛠️ Tecnologias Utilizadas
- **Framework:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS (Paleta oficial MakerPixel `#0E1726` e `#2F5BEA`)
- **Ícones:** Lucide React
- **Roteamento:** React Router (HashRouter para compatibilidade nativa com GitHub Pages)
- **Persistência:** LocalStorage com suporte a reset de dados de demonstração

---

© 2026 MakerPixel • Tubarão/SC. Todos os direitos reservados.
