# Prompt: MakerPixel Gestão (sistema de gestão da minha empresa)

> Cole tudo abaixo no Antigravity. Ele está dividido em fases: peça uma fase por vez ("faça a Fase 1") e revise antes de seguir.

---

## Contexto

Você vai construir o **MakerPixel Gestão**, o sistema interno da MakerPixel, uma empresa de software de Tubarão/SC com **dois sócios** (50% / 50%). A MakerPixel vende ferramentas para escritórios de contabilidade (conciliação bancária, integração com o SCI Único, controle de vencimentos, entregas por setor, conferências fiscais), cobra mensalidade, implantação e treinamentos, e presta suporte.

O sistema controla: clientes e leads, prospecção, contratos, faturas, financeiro, fechamento do mês, distribuição de lucros entre os sócios, implantações, treinamentos e suporte. Também é projeto de **portfólio**: código limpo, testes nas regras de negócio, README profissional.

Idioma: **toda a interface, mensagens e nomes de domínio em português do Brasil**. Datas dd/mm/aaaa, dinheiro R$ 1.234,56. Código (variáveis, classes) pode ser em português, seguindo o domínio (ex.: `Contrato`, `Fatura`, `fecharMes`).

## Stack (obrigatória)

- **Backend:** Java 21, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security com JWT, Bean Validation, Flyway, PostgreSQL. Testes com JUnit 5, Mockito e Testcontainers (PostgreSQL).
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS, React Router, TanStack Query para chamadas à API, React Hook Form + Zod nos formulários.
- **Banco:** PostgreSQL (Supabase em produção; Docker Compose no desenvolvimento).
- **Infra:** Dockerfile da API, `docker-compose.yml` (API + Postgres), GitHub Actions rodando os testes em todo Pull Request.
- Repositórios: `makerpixel-gestao-api` e `makerpixel-gestao-web` (ou um monorepo com `api/` e `web/`, se preferir; diga qual escolheu).

## Arquitetura do backend

- Pacotes por módulo de negócio: `clientes`, `prospeccao`, `contratos`, `financeiro`, `lucros`, `projetos`, `treinamentos`, `suporte`, `config`, `auth`.
- Em cada módulo: `domain` (entidades e regras), `application` (casos de uso / services), `api` (controllers e DTOs), `infra` (repositories).
- **As regras de negócio ficam no domínio e nos services, nunca nos controllers.** Cada regra numerada abaixo tem pelo menos um teste unitário.
- Dinheiro sempre `BigDecimal` com escala 2 e arredondamento `HALF_EVEN`; nunca `double`.
- Datas com `LocalDate`; competência como `YearMonth` (coluna `char(7)` "AAAA-MM").
- Erros de regra viram `422` com mensagem em português para a pessoa (ex.: "A soma das participações dos sócios precisa ser 100%."). Validação de campo, `400`. Não encontrado, `404`.
- Auditoria: tabela `auditoria` (quem, quando, entidade, id, ação, resumo) gravada nas ações importantes (fechar/reabrir mês, aprovar distribuição, encerrar contrato, reajuste).
- Nunca registrar senha, token ou dado sensível em log. Segredos só em variáveis de ambiente (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).

## Módulos e regras de negócio

### 1. Configurações e acesso
- Login por e-mail e senha (BCrypt), JWT com expiração. Perfis: `SOCIO` (acesso total) e `COLABORADOR` (sem financeiro nem lucros).
- Cadastro dos sócios: nome, e-mail, **participação (%)** com **vigência "a partir de"** (AAAA-MM). Regra: a soma das participações vigentes em qualquer mês = 100%. Mudar a participação não altera meses anteriores.
- Parâmetros: percentual da **reserva** (padrão 20%, também com vigência), multa e juros de atraso (padrão 2% + 1% ao mês), índice de reajuste padrão (IPCA), alíquota efetiva do Simples informada pelo contador (por mês).

### 2. Clientes
- Campos: documento (CNPJ/CPF, **único**, validar dígitos), razão social, nome fantasia, contato, e-mail, telefone, cidade, UF, origem (indicação, site, evento, prospecção), situação (`LEAD`, `PROPOSTA`, `CLIENTE`, `EX_CLIENTE`), observações, histórico de interações (data, canal, resumo).
- Regra: lead não tem contrato ativo; vira `CLIENTE` quando o primeiro contrato é marcado como assinado; vira `EX_CLIENTE` quando o último contrato ativo é encerrado.
- Botão "Buscar na Receita": consulta `https://brasilapi.com.br/api/cnpj/v1/{cnpj}` (pela API, não pelo navegador) e preenche **só os campos vazios** (razão social, fantasia, cidade, UF, telefone, CNAE, endereço, situação cadastral). Situação diferente de ATIVA mostra alerta.

### 3. Prospecção (funil de vendas, até 10 leads por semana)
- Etapas do lead: `NOVO` → `CONTATADO` → `LEMBRETE_ENVIADO` → `RESPONDEU` → `DEMONSTRACAO` → `PROPOSTA` → `GANHO` | `PERDIDO` (motivo obrigatório) | `SAIU_DA_LISTA`.
- **Fila da semana:** mostra no máximo 10 leads (configurável), escolhidos por prioridade: mesma região (cidade/UF configurável) primeiro, depois quem nunca foi contatado, depois os mais antigos.
- **Cadência:** 1ª mensagem; se não respondeu em 3 dias, aparece para **um** lembrete; sem resposta 7 dias depois do lembrete, entra em **quarentena de 90 dias** e só volta à fila depois disso.
- **Lista de exclusão:** `SAIU_DA_LISTA` nunca mais aparece na fila, nem em importações futuras (bloqueio pelo documento e pelo telefone).
- Modelos de mensagem com variáveis `{nome}`, `{empresa}`, `{cidade}`; toda mensagem de prospecção termina com a frase de saída ("Se não fizer sentido agora, é só me avisar que não volto a escrever.").
- Botão **"Abrir no WhatsApp"** gera o link `https://wa.me/55{telefone}?text={mensagem}` (envio assistido: a pessoa confere e envia). Botão "Copiar e-mail". **Não** implementar disparo automático em massa pelo WhatsApp.
- Cada envio registra data, canal e modelo usado. Placar semanal: contatados, respostas, demonstrações, taxa de resposta.

### 4. Contratos
- Campos: cliente, tipo (`MENSALIDADE`, `IMPLANTACAO`, `SOB_MEDIDA`, `TREINAMENTO`), módulos contratados (lista com preço por módulo), desconto, valor total (soma − desconto), início, vigência em meses (padrão 12), dia de vencimento (1 a 28), índice de reajuste, situação (`PROPOSTA`, `ATIVO`, `SUSPENSO`, `ENCERRADO`), PDF assinado (upload), motivo e data de encerramento.
- Regras:
  1. Contrato `ATIVO` exige cliente, tipo, valor > 0, início e dia de vencimento.
  2. Só contrato `ATIVO` gera faturas; proposta não gera.
  3. Renovação automática ao fim da vigência se ninguém encerrar; aviso **30 dias antes** do fim.
  4. **Reajuste anual** no mês de aniversário pelo índice do contrato: o sistema mostra a prévia (valor atual, percentual informado, novo valor) e um sócio confirma; o valor anterior vai para o histórico.
  5. Encerrar não apaga: para de gerar faturas a partir do mês seguinte; faturas já geradas continuam.
  6. Fatura vencida há mais de 30 dias → o sistema **sugere** suspender (um sócio confirma). Pagou, volta a `ATIVO`.

### 5. Financeiro
- **Faturas:** geradas pelo job do dia 1 (e por um botão "Gerar faturas do mês"), uma por contrato `ATIVO` de mensalidade, vencimento no dia do contrato.
  - **Chave única (contrato, competência):** rodar duas vezes não duplica.
  - Primeiro mês proporcional: valor ÷ dias do mês × dias a partir do início.
  - Implantação, sob medida e treinamento: fatura única ou parcelas, na assinatura ou na entrega da etapa.
  - Situações: `ABERTA` → `PAGA` | `VENCIDA` → `PAGA` | `CANCELADA` (motivo). Paga exige data e valor recebido; diferença registrada como desconto concedido ou juros/multa recebidos.
  - Régua de cobrança: lembrete 3 dias antes, aviso no vencimento, cobrança com 5 e 15 dias de atraso (mensagens prontas, com botão do WhatsApp e do e-mail).
- **Despesas:** categoria (`IMPOSTOS`, `INFRAESTRUTURA`, `CONTADOR`, `FERRAMENTAS`, `MARKETING`, `PRO_LABORE`, `OUTROS`), descrição, data, valor, fixa ou variável, comprovante. Fixas se repetem todo mês até serem encerradas.
- **Lucro em regime de caixa:** lucro do mês = recebido no mês − pago no mês. Faturado e não recebido aparece em "A receber", fora do lucro.
- **Fechar o mês** grava o resumo (recebido, despesas, lucro, reserva) e **trava** lançamentos daquela competência. Reabrir exige sócio e fica na auditoria.
- **MRR** = soma das mensalidades dos contratos ativos no último dia do mês.
- **Fator R** (indicador): folha (pró-labore + salários) ÷ receita dos últimos 12 meses; alerta abaixo de 28%.

### 6. Distribuição de lucros (o coração do sistema)
- Só **mês fechado** distribui; mês aberto mostra prévia.
- Cálculo: lucro do mês → menos **reserva** (% vigente) → **a distribuir** → dividido pela **participação vigente** de cada sócio.
- **Prejuízo acumulado:** mês com prejuízo não distribui, e o prejuízo é abatido dos lucros dos meses seguintes antes de qualquer distribuição.
- **Limite de caixa:** nunca distribuir mais do que o saldo de caixa menos a reserva.
- **Centavos fecham com o total** pelo método do maior resto (a soma dos sócios é sempre igual ao valor a distribuir).
- **Adiantamento:** retirada antes do fechamento é lançada como adiantamento do sócio e descontada no fechamento.
- **Pró-labore é despesa**, entra antes do cálculo.
- **Aprovação dupla:** a distribuição só é registrada depois que **os dois sócios** aprovam (grava quem e quando). Depois de paga, não se edita: corrige-se com lançamento de ajuste.
- Aviso de **R$ 50 mil por mês por sócio** (acima disso, retenção de 10% de IRRF).
- Relatório anual por sócio (para a ata de aprovação de contas).

### 7. Projetos e implantações
- Todo contrato de implantação abre um projeto com etapas padrão: kickoff, recebimento dos dados, configuração, treinamento, acompanhamento de 30 dias.
- Etapa só conclui se a anterior estiver concluída; etapa atrasada aparece no Início.
- Implantação parcelada por etapa: a fatura da parcela nasce quando a etapa é concluída.
- Horas registradas por sócio e por projeto; relatório de horas × valor do contrato.

### 8. Treinamentos
- Turma: tema, cliente (ou aberta), data e hora, modalidade (online/presencial), carga horária, vagas, preço (por turma ou por pessoa), material.
- Turma incluída em contrato não gera fatura; avulsa gera na data da turma.
- Presença por participante; **certificado (PDF) só com 75% ou mais** da carga horária.
- Cancelamento com menos de 48 h pode gerar taxa (definida no contrato).

### 9. Suporte
- Chamado: cliente, assunto, prioridade (`ALTA`, `NORMAL`, `BAIXA`), situação (`ABERTO`, `EM_ATENDIMENTO`, `AGUARDANDO_CLIENTE`, `ENCERRADO`), solução.
- Prazo da primeira resposta: alta 4 h úteis, normal 24 h, baixa 48 h. Chamado perto do prazo aparece no Início.
- Só cliente com contrato `ATIVO` abre chamado (suspenso: só para regularizar).

### 10. Início (dashboard)
Cartões: MRR, receita do mês, a receber (com vencidas em vermelho), lucro do mês. Gráfico receita × despesas dos últimos 6 meses. Bloco "Distribuição de lucros do mês" (lucro, reserva, a distribuir, valor de cada sócio, botão Aprovar). Listas: contratos para renovar/reajustar, faturas em aberto (botão Cobrar), próximos treinamentos, chamados perto do prazo, **fila de prospecção da semana** (quantos faltam), alerta do Fator R. Cada item leva à tela certa.

## Visual

- Menu lateral escuro (#0E1726) com os módulos; conteúdo em fundo claro (#F4F6FA), cartões brancos com borda #E3E7EE, cantos 12 px, destaque azul #2F5BEA; vermelho #B42318 para vencido, âmbar #B45309 para atenção, verde #0F7A4A para ok. Fonte Plus Jakarta Sans.
- Responsivo (no celular o menu vira gaveta), botões com no mínimo 44 px, contraste AA, rótulos em todos os campos.
- Tema escuro opcional.

## Fases (faça uma por vez e pare para eu revisar)

1. **Fundação:** projeto, Docker Compose, Flyway V1, login JWT, sócios e parâmetros, layout com menu, CI. Seed de desenvolvimento com 2 sócios e dados fictícios.
2. **Clientes e Contratos:** CRUD, validação de CNPJ, busca na Receita, situações, renovação e reajuste com prévia.
3. **Financeiro:** geração de faturas (sem duplicar, proporcional), baixa, despesas fixas e variáveis, fechamento e reabertura do mês, MRR.
4. **Distribuição de lucros:** cálculo completo com reserva, prejuízo acumulado, limite de caixa, maior resto, adiantamentos e aprovação dupla.
5. **Início (dashboard)** com todos os indicadores.
6. **Prospecção:** fila da semana, cadência, quarentena, lista de exclusão, modelos e links do WhatsApp/e-mail, placar.
7. **Implantações, Treinamentos (com certificado) e Suporte.**
8. **Acabamento:** auditoria, régua de cobrança, Fator R, README com prints, deploy (API no Render, front na Vercel ou Cloudflare Pages, banco no Supabase) com subdomínios `app.` e `api.`.

Em cada fase:
- Migrations novas (nunca alterar uma migration antiga).
- **Testes das regras da fase** (unitários no domínio e de integração com Testcontainers nos endpoints principais). Nomes de teste em português descrevendo a regra ("nao_gera_duas_faturas_do_mesmo_contrato_na_mesma_competencia").
- Ao terminar: liste os arquivos criados/alterados, como rodar (`docker compose up`, `./mvnw test`, `npm run dev`) e o que testar na tela.
- Não faça commit nem push: eu reviso e faço o commit em uma branch `feat/<fase>` a partir da `develop`.

## O que não fazer

- Não usar `double`/`float` para dinheiro.
- Não colocar regra de negócio no controller nem no componente React.
- Não apagar registros financeiros: cancelar com motivo, ajustar com lançamento.
- Não disparar mensagens automáticas em massa pelo WhatsApp.
- Não versionar `.env`, senhas ou chaves.
- Não inventar regras além das escritas aqui: se algo estiver ambíguo, pergunte antes de implementar.
