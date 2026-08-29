# ❌ Checklist Completo — O que falta no Front-End V2

**Status geral:** 85% pronto → 15% falta fazer

> **Nota de revisão (leitura direta do código):** os itens #5 (Criar/Editar Vaga) e #6 (Ranking por Vaga) abaixo **já estão implementados** no protótipo como modais em `VagasPage.tsx` — não são mais telas faltando do zero, apenas precisam de refinamentos e conexão com API real. O item #4 (Detalhe de Candidato) também já existe **parcialmente** como painel lateral inline em `CandidatosPage.tsx`. Os checklists foram ajustados para refletir isso.

---

## 🔴 CRÍTICO (Bloqueadores para MVP)

Sem esses, o sistema não funciona de verdade.

### 1. **Integração com API Real** 
- [ ] Instalar `axios` + `@tanstack/react-query`
- [ ] Criar arquivo de configuração de API (`src/api/apiClient.ts`)
- [ ] Implementar interceptor Axios com:
  - [ ] Anexar `Authorization: Bearer <token>` a todos os requests
  - [ ] Interceptar 401 → chamar `POST /api/auth/refresh`
  - [ ] Redirecionar a `/login` se refresh falhar
- [ ] Substituir todas as chamadas de `useAppData()` (mock) por requisições reais com React Query
- [ ] Configurar `VITE_API_URL` em `.env.local`

**Esforço:** 3–4 dias

---

### 2. **Autenticação Real (JWT Bearer)**
- [ ] Atualizar `context.tsx` → função `login()` chama `POST /api/auth/login` em vez de validar localmente
- [ ] Armazenar `accessToken` em memória (variável React)
- [ ] Armazenar `refreshToken` em cookie `httpOnly` (automático pelo navegador)
- [ ] Implementar `logout()` que chama `POST /api/auth/logout`
- [ ] Adicionar campo "Lembrar-me" no `LoginPage` (opcional, mas recomendado)
- [ ] Limpar dados do contexto ao fazer logout

**Telas afetadas:** `LoginPage`, `CadastroPage`  
**Esforço:** 2–3 dias

---

### 3. **Upload de PDF (Currículo)**
- [ ] Criar input de arquivo (`<input type="file" accept=".pdf">`)
- [ ] Validar tamanho (máx 5 MB) e tipo (só PDF)
- [ ] Integrar com storage (Azure Blob ou AWS S3)
  - [ ] Criar presigned URL para upload do cliente
  - [ ] Enviar PDF via PUT request
  - [ ] Retornar URL pública do PDF
- [ ] Armazenar URL do PDF no perfil do candidato
- [ ] Exibir PDF enviado (link para download)
- [ ] Permitir reuploaded/atualizar

**Localização:** `PerfilPage.tsx` (`/candidato/perfil`)  
**Esforço:** 2–3 dias (inclui setup storage)

---

### 4. **Detalhe de Candidato (RH)** — PARCIALMENTE IMPLEMENTADO (painel inline)

Hoje já existe um componente `CandidateDetail` dentro de `CandidatosPage.tsx`, aberto ao clicar em uma linha da tabela (painel lateral, não uma rota separada):
- [x] **Dados pessoais:** nome, e-mail, telefone, localização, cargo/departamento — ✅ pronto
- [x] **Experiência:** exibida como texto livre (campo `experience`, ex. "4 anos") — ✅ pronto (não é uma lista de experiências detalhadas como no perfil do candidato)
- [x] **Habilidades:** tags do perfil — ✅ pronto
- [x] **Status atual:** `<select>` editável, já chama `updateCandidateStatus()` — ✅ pronto
- [x] **Score badge:** meses de experiência calculados via Caminho B (`getExpMonths`) — ✅ pronto
- [x] **Ação "Excluir":** já existe no painel/tabela — ✅ pronto

Falta:
- [ ] **Observações do RH:** textarea editável (`PUT /api/candidatos/:id/observacoes`) — não existe nenhum campo de observações hoje
- [ ] **Histórico de status:** timeline mostrando cada mudança de status com data e quem fez (o tipo `Candidatura.historico` já existe para candidaturas via portal, mas `Candidate` do RH não tem histórico equivalente)
- [ ] Ação "Arquivar" (hoje só existe "Excluir", que remove definitivamente)
- [ ] Rota dedicada `/rh/candidatos/:id` (opcional, para deep-link/compartilhamento) + breadcrumb
- [ ] Botão "Voltar" com filtros mantidos (hoje é só fechar o painel, que já preserva os filtros da tabela por trás)

**Componentes relacionados:** `CandidateDetail` em `src/app/pages/rh/CandidatosPage.tsx`
**Esforço restante:** 2–3 dias (menor do que o estimado originalmente, pois a base já existe)

---

### 5. **Criar/Editar Vaga (RH)** — JÁ IMPLEMENTADO (como modal)

O componente `JobModal` em `src/app/pages/rh/VagasPage.tsx` já cobre a maior parte deste item, aberto pelos botões "Nova vaga" e "Editar" (não são rotas separadas, é um modal):
- [x] Formulário com `react-hook-form`, campos: **Título**, **Departamento** (select fixo de `DEPARTMENTS`), **Localização**, **Modalidade**, **Contrato**, **Vagas disponíveis** (número), **Status**, **Exp. mínima (meses)**, **Habilidades** (texto separado por vírgula), **Descrição** (textarea) — ✅ pronto
- [x] Chama `createJob()` (criar) e `updateJob()` (editar) do contexto — ✅ pronto
- [x] Botão "Cancelar" fecha o modal sem salvar — ✅ pronto
- [x] `postedDate` já é gerado automaticamente (não editável) — ✅ pronto

Falta:
- [ ] Validação além do `required` básico (tamanho máx. do título, formato)
- [ ] Campo de **salário** — não existe no tipo `Job` nem no formulário hoje
- [ ] Departamento populado via API (`GET /api/departamentos`) em vez de lista fixa em `data.ts`
- [ ] Habilidades como tags/autocomplete em vez de texto livre separado por vírgula
- [ ] Migrar validação para `zod` (biblioteca ainda não está no `package.json`)
- [ ] Integrar com `POST /api/vagas` / `PUT /api/vagas/{id}` reais (hoje só grava no contexto mock)
- [ ] Avaliar se vale extrair para rotas dedicadas (`/rh/vagas/novo`, `/rh/vagas/:id/editar`) para deep-link, em vez de manter só como modal

**Localização:** `src/app/pages/rh/VagasPage.tsx` (componente `JobModal`) → botões "Nova vaga" / "Editar" nos cards
**Esforço restante:** 1–2 dias (bem menor do que o estimado originalmente, pois o formulário já existe)

---

### 6. **Ranking por Vaga (RH)** — PARCIALMENTE IMPLEMENTADO (como modal)

O componente `RankingPanel` em `src/app/pages/rh/VagasPage.tsx` já implementa a base, aberto pelo botão "Ranking" em cada card de vaga (não é uma rota separada):
- [x] **Posição** (#1, #2, #3...) — ✅ pronto
- [x] **Candidato** (nome + cargo, sem avatar) — ✅ pronto
- [x] **Experiência** (meses calculados via Caminho B/`getExpMonths`, exibido com ícone de estrela) — ✅ pronto
- [x] Ordenação: candidatos que **atendem a exp. mínima da vaga** aparecem primeiro, depois por meses decrescente (exatamente a regra da seção 5.3 do storyboard) — ✅ pronto
- [x] Candidatos abaixo do mínimo aparecem com opacidade reduzida e aviso "abaixo do mínimo" (não são descartados) — ✅ pronto

Falta:
- [ ] **Score de match** (%) — hoje só usa meses de experiência, sem ponderar habilidades
- [ ] **Habilidades match** (tags verdes) / **Habilidades faltando** (tags vermelhas)
- [ ] **Status** da candidatura na própria linha do ranking
- [ ] **Data de aplicação** na própria linha
- [ ] Filtros (por habilidade, status, score mínimo)
- [ ] Ordenação alternativa (por nome, por data)
- [ ] Botão para abrir detalhe do candidato a partir do ranking
- [ ] Ação rápida de mudar status direto do ranking
- [ ] Conectar a `GET /api/vagas/{id}/ranking` real (hoje calcula tudo no cliente a partir do contexto mock)

**Localização:** `src/app/pages/rh/VagasPage.tsx` (componente `RankingPanel`) → botão "Ranking" em cada card
**Esforço restante:** 2–3 dias (a base de ordenação já funciona; falta enriquecer com dados de habilidades/status e conectar à API)

---

## 🟡 ALTO (Funcionalidades incompletas)

Existem, mas faltam refinamentos ou conexão com API.

### 7. **LoginPage** — Falta conexão com API real
**Arquivo:** `src/app/pages/LoginPage.tsx`

Hoje:
- ✅ Form de e-mail + senha
- ✅ Validação básica
- ✅ Redireciona por role (RH → `/rh/dashboard`, Candidato → `/candidato/perfil`)
- ✅ Demo accounts funcionam (mock)

Falta:
- [ ] Chamar `POST /api/auth/login` em vez de validar localmente
- [ ] Exibir erros do back-end (e-mail não encontrado, senha incorreta)
- [ ] Spinner de loading enquanto autentica
- [ ] Mensagem "Conectando..." no botão
- [ ] Salvar `accessToken` + `refreshToken` no contexto/storage
- [ ] Adicionar checkbox "Lembrar-me por 30 dias" (opcional)
- [ ] Redirecionar se já estiver logado (go to dashboard)
- [ ] Link "Esqueceu a senha?" → tela de reset (Fase 2, opcional)

**Esforço:** 2–3 dias

---

### 8. **CadastroPage** — Falta API
**Arquivo:** `src/app/pages/CadastroPage.tsx`

Hoje:
- ✅ Form com nome, e-mail, senha, cidade/UF, posição desejada, área de atuação
- ✅ Validação inline (`react-hook-form`)
- ✅ **Checkbox de consentimento LGPD obrigatório** — já implementado, com erro se não marcado (ao contrário do checklist anterior, que listava isso como pendente)
- ✅ Link para login se já tem conta
- ✅ Toast de sucesso + redirecionamento (ao perfil se for o e-mail demo, senão à tela de login)

Falta:
- [ ] Campo de **confirmação de senha** (hoje só existe um campo de senha, sem confirmação)
- [ ] Chamar `POST /api/auth/registrar` em vez de mock
- [ ] Exibir erros do back-end (e-mail já existe, senha fraca)
- [ ] Spinner de loading (hoje só desabilita o botão via `isSubmitting`)
- [ ] Validar força da senha (feedback visual)
- [ ] Confirmar e-mail (enviar link de verificação) — Fase 2, opcional

**Esforço:** 2–3 dias

---

### 9. **VitrinePage** — Falta dados reais
**Arquivo:** `src/app/pages/VitrinePage.tsx`

Hoje:
- ✅ Grid de cards de vagas (exclui automaticamente vagas "Encerrada")
- ✅ Filtros funcionais no cliente: busca por cargo/departamento, **departamento**, **modalidade** e **tipo de contrato** (todos já filtram a lista em tempo real via `useMemo`)
- ✅ Contador de resultados e botão "Limpar filtros"
- ✅ Estado vazio com ícone quando nenhuma vaga bate com os filtros

(Não há filtro por localização nem por faixa salarial — ver itens pendentes abaixo.)

Falta:
- [ ] Chamar `GET /api/vagas?status=Aberta` em vez de dados mockados
- [ ] Pagination (página 1, 2, 3...) com Next/Prev buttons
- [ ] Counter "Mostrando X de Y vagas"
- [ ] Estado vazio: "Nenhuma vaga encontrada" com ícone
- [ ] Loading skeleton enquanto carrega
- [ ] Ordem padrão: "Mais recentes primeiro"
- [ ] Filtro avançado: busca por range de salário
- [ ] Destacar vagas urgentes (badge "Urgente")

**Esforço:** 2–3 dias

---

### 10. **VagaDetailPage** — Falta dados + ação
**Arquivo:** `src/app/pages/VagaDetailPage.tsx`

Hoje:
- ✅ Layout da vaga (título, descrição, habilidades desejadas) via rota `/vaga/:id`
- ✅ Botão "Candidatar-se" **já funcional no mock**: chama `applyToJob()`, cria uma `Candidatura` real vinculada a `candidatoId` + `vagaId`, incrementa o contador de candidatos da vaga, e mostra toast de sucesso/erro
- ✅ Redireciona a `/login` se o visitante estiver anônimo
- ✅ Se já for candidato autenticado e já tiver se candidatado: mostra "Você já se candidatou" (botão já some) — **já implementado**, ao contrário do checklist anterior
- ✅ Se a vaga estiver "Encerrada": mostra aviso "Vaga encerrada" e não exibe o botão — **já implementado**
- ✅ Bloqueia usuários com perfil RH de se candidatar (mostra toast de erro)

Falta:
- [ ] Chamar `GET /api/vagas/{id}` em vez de dados mockados (hoje busca a vaga em `jobs` do contexto)
- [ ] Mostrar dados adicionais: salário (campo não existe no tipo `Job`), localização em mapa, nº de candidatos já aplicados na sidebar (hoje só mostra no cabeçalho), "Aberto desde X dias"
- [ ] Botão compartilhar (LinkedIn, WhatsApp, e-mail)
- [ ] Seção "Vagas similares" (recomendações)

**Esforço:** 2–3 dias

---

### 11. **PerfilPage (Candidato)** — Falta integração + upload
**Arquivo:** `src/app/pages/candidato/PerfilPage.tsx`

Hoje:
- ✅ Seção "Dados Pessoais" (nome, e-mail, telefone, cidade)
- ✅ Seção "Experiências" com CRUD (add/edit/delete)
- ✅ Cálculo de meses totais funcionando

Falta:
- [ ] **Dados pessoais:**
  - [ ] Chamar `GET /api/candidatos/me` ao carregar
  - [ ] Chamar `PUT /api/candidatos/me` ao salvar
  - [ ] Campo "Foto de perfil" com upload
  - [ ] Campo "Bio/Resumo" (textarea)
  - [ ] Campo "Localização" (select de cidades ou autocomplete)
  - [ ] Campo "Telefone" com máscara
  - [ ] Campo "LinkedIn URL" (validar URL)
  
- [ ] **Seção Experiências:**
  - [ ] Chamar `GET /api/experiencias` ao carregar
  - [ ] Chamar `POST /api/experiencias` ao adicionar
  - [ ] Chamar `PUT /api/experiencias/{id}` ao editar
  - [ ] Chamar `DELETE /api/experiencias/{id}` ao deletar
  - [ ] Campo "Data Fim" com checkbox "Atualmente aqui" (remover fim)
  - [ ] Validar que data fim > data início
  - [ ] Arredondar meses totais com 2 casas decimais
  - [ ] Mostrar badge "Experiência requerida" se bate com vaga
  
- [ ] **Seção Habilidades:**
  - [ ] Usar autocomplete (`GET /api/habilidades?busca=`)
  - [ ] Permitir adicionar habilidades não-existe (auto-criar)
  - [ ] Tags com X para remover
  - [ ] Limite de habilidades (ex: máx 20)
  
- [ ] **Seção Currículo (PDF):**
  - [ ] Input de arquivo
  - [ ] Validar tamanho + tipo
  - [ ] Botão upload com progress bar
  - [ ] Se já tem PDF: mostrar link para download + botão "Remover" + botão "Atualizar"
  - [ ] Armazenar em storage (Azure Blob / AWS S3)

- [ ] **Botão "Salvar":**
  - [ ] Validar todos os campos obrigatórios
  - [ ] Enviar dados via `PUT /api/candidatos/me`
  - [ ] Toast de sucesso: "Perfil atualizado com sucesso!"
  - [ ] Spinner enquanto envia

**Esforço:** 4–5 dias

---

### 12. **CandidatosPage (RH)** — Falta dados + detalhe
**Arquivo:** `src/app/pages/rh/CandidatosPage.tsx`

Hoje:
- ✅ Tabela com colunas (nome, vaga, depto., local, experiência, status, data)
- ✅ Dropdown de status (inline edit)
- ✅ Ação de excluir
- ✅ Filtros: status, departamento
- ✅ Busca por texto

Falta:
- [ ] Chamar `GET /api/candidatos?search=&status=&department=` em vez de dados mockados
- [ ] Integrar dropdown status com `PATCH /api/candidatos/{id}/status`
- [ ] Integrar ação excluir com `DELETE /api/candidatos/{id}` (com confirmação)
- [ ] Adicionar coluna "Ações" com dropdown menu:
  - [ ] Ver detalhe → link a `/rh/candidatos/:id`
  - [ ] Mudar status (vs. inline?)
  - [ ] Adicionar observação (modal inline)
  - [ ] Arquivar
  - [ ] Excluir
- [ ] Pagination (página X de Y)
- [ ] Sorting por colunas (clicável no header)
- [ ] Loading skeleton enquanto carrega
- [ ] Estado vazio: "Nenhum candidato encontrado"
- [ ] Selecionar múltiplos (checkbox na primeira coluna)
- [ ] Ações em lote: mudar status, excluir (quando selecionar múltiplos)

**Esforço:** 3–4 dias

---

### 13. **VagasPage (RH)** — Falta dados + criar
**Arquivo:** `src/app/pages/rh/VagasPage.tsx`

Hoje:
- ✅ Grid de cards (título, depto., tipo, status, local, data, vagas, candidatos)
- ✅ Filtro por status (Abertas / Em Processo / Encerradas)

Falta:
- [ ] Chamar `GET /api/vagas` em vez de dados mockados
- [ ] Botão "Nova Vaga" → link a `/rh/vagas/novo`
- [ ] Cada card é clickável → `/rh/vagas/:id/editar`
- [ ] Ações no card (dropdown menu):
  - [ ] Editar → `/rh/vagas/:id/editar`
  - [ ] Ver ranking de candidatos → `/rh/vagas/:id/ranking`
  - [ ] Encerrar vaga → `PUT /api/vagas/{id}` com status=Encerrada
  - [ ] Duplicar vaga → clona todos os dados
  - [ ] Excluir → `DELETE /api/vagas/{id}` (com confirmação)
- [ ] Filtro por departamento (adicionar)
- [ ] Busca por título
- [ ] Pagination
- [ ] Loading skeleton
- [ ] Estado vazio

**Esforço:** 3–4 dias

---

### 14. **CandidaturasPage (Candidato)** — Falta dados
**Arquivo:** `src/app/pages/candidato/CandidaturasPage.tsx`

Hoje:
- ✅ Lista de candidaturas do contexto
- ✅ Mostrar status de cada

Falta:
- [ ] Chamar `GET /api/candidaturas/me` em vez de contexto mock
- [ ] Mostrar em cada card:
  - [ ] Título da vaga
  - [ ] Departamento
  - [ ] Data da aplicação
  - [ ] Status atual (badge colorida)
  - [ ] Última atualização
- [ ] Botão para ver histórico completo → modal com timeline
- [ ] Botão "Voltar a se candidatar" se foi rejeitado e vaga reabre
- [ ] Filtro por status
- [ ] Sorting por data (mais recente primeiro)
- [ ] Estado vazio: "Você ainda não se candidatou a nenhuma vaga"
- [ ] Link para voltar à vitrine: "Explorar mais vagas"

**Esforço:** 2–3 dias

---

### 15. **DashboardPage (RH)** — Falta dados reais
**Arquivo:** `src/app/pages/rh/DashboardPage.tsx`

Hoje:
- ✅ KPI cards calculando do contexto mock
- ✅ Gráfico recharts renderizando
- ✅ Funil por status
- ✅ Lista candidatos recentes

Falta:
- [ ] Chamar `GET /api/dashboard/resumo` para KPIs
- [ ] Chamar `GET /api/dashboard/candidaturas-por-mes` para gráfico
- [ ] Chamar `GET /api/dashboard/funil-status` para breakdown
- [ ] Adicionar período/filtro (últimos 30 dias, 6 meses, 1 ano)
- [ ] Cards de KPI com tendência (↑↓) e % mudança vs. período anterior
- [ ] Gráfico: tooltip ao hover mostrando números exatos
- [ ] Gráfico: export para PNG/CSV
- [ ] Seção "Alertas": vagas sem candidatos, candidatos com status antiga, etc.
- [ ] Seção "Próximas entrevistas" (com datas)
- [ ] Refresh automático ou botão "Atualizar dados"

**Esforço:** 2–3 dias

---

### 16. **CadastrarPage (RH)** — Falta integração API
**Arquivo:** `src/app/pages/rh/CadastrarPage.tsx`

Hoje:
- ✅ Formulário 3 seções
- ✅ Validação
- ✅ Tela de sucesso

Falta:
- [ ] Chamar `POST /api/candidatos` em vez de `addCandidate()` do contexto
- [ ] Integrar campo "Vaga pretendida" com autocomplete (`GET /api/vagas?search=`)
- [ ] Integrar campo "Departamento" com select de `GET /api/departamentos`
- [ ] Integrar campo "Habilidades" com autocomplete (`GET /api/habilidades?busca=`)
- [ ] Remover campo "Tempo de experiência" (select de faixas) — usar data real em experiências
- [ ] Ou: manter ambos (faixa como fallback, data real quando candidato preencher perfil)
- [ ] Validar e-mail único (check real contra back-end, não local)
- [ ] Após sucesso: link para editar candidato recém-criado
- [ ] Ou: voltar à lista de candidatos com novo candidato destacado

**Esforço:** 2–3 dias

---

## 🟢 MÉDIO (Nice-to-have antes de produção)

Não bloqueadores, mas melhoram UX/DX.

### 17. **Migrar formulários para `react-hook-form` + `zod`**
- [ ] Converter `LoginPage` (de `useState` para `useForm`)
- [ ] Converter `CadastroPage`
- [ ] Converter `CadastrarPage` (cadastro manual RH)
- [ ] Converter form de vaga (quando criado)
- [ ] Converter form de experiência (quando integrado)

**Benefícios:** Validação tipada, menos bugs, melhor performance  
**Esforço:** 2–3 dias (para todas as páginas)

---

### 18. **Melhorar validação de formulários**
- [ ] E-mail: validar formato + unicidade (API)
- [ ] Senha: feedback visual de força (fraco/médio/forte)
- [ ] Datas: usar date picker (`react-datepicker` ou Radix `<Calendar>`)
- [ ] Range de datas: validar que fim > início
- [ ] URLs: validar formato LinkedIn, Portfolio, etc.
- [ ] Máscaras de entrada: CEP, telefone, CPF (opcional)

**Esforço:** 1–2 dias

---

### 19. **Responsividade mobile**
- [ ] Testar todas as telas em mobile (375px, 768px, 1024px)
- [ ] Sidebar → collapsar em mobile (hamburger menu)
- [ ] Tabelas → converter para cards em mobile
- [ ] Formulários → stack vertical em mobile
- [ ] Botões → aumentar hit area (mín 44px)
- [ ] Modals → full-screen em mobile
- [ ] Gráficos → responsivos (recharts já faz)

**Esforço:** 3–4 dias

---

### 20. **Notificações (in-app + Email)**
- [ ] Toast ao sucesso/erro de qualquer ação (já existe `sonner`)
- [ ] Integrar com `sonner` (já está, só usar mais)
- [ ] Botão de "Descartar" toast
- [ ] Diferentes tipos: success, error, info, warning
- [ ] Notificações de mudar status de candidatura (back-end envia email, front-end mostra badge)
- [ ] Notificações de convite de entrevista (badge em `/candidato/candidaturas`)

**Esforço:** 1–2 dias

---

### 21. **Busca avançada/Filtros**
- [ ] Multi-select de departamentos
- [ ] Multi-select de habilidades
- [ ] Range de experiência (de/até meses)
- [ ] Range de salário (de/até)
- [ ] Filtros com "Aplicar" / "Limpar" buttons
- [ ] Salvar filtros recentes (localStorage ou back-end)
- [ ] Indicador: "X filtros aplicados"

**Esforço:** 2–3 dias

---

### 22. **Paginação completa**
- [ ] Componente `<Pagination>` reutilizável
- [ ] Mostrar página X de Y
- [ ] Botões: First, Prev, 1 2 3 4 5, Next, Last
- [ ] Jump to page (input número)
- [ ] Página size selector (10, 20, 50 por página)
- [ ] Total de resultados: "Mostrando X–Y de Z"

**Esforço:** 1–2 dias

---

### 23. **Loading states**
- [ ] Skeleton loaders nas tabelas
- [ ] Spinner no botão durante request
- [ ] Blur/fade na tabela enquanto carrega
- [ ] Indicador "Carregando..." em cards

**Esforço:** 1 dia

---

### 24. **Estados vazios**
- [ ] Ilustração quando não há dados
- [ ] Mensagem descritiva: "Nenhum candidato encontrado"
- [ ] CTA (call-to-action): "Adicionar um novo" ou link relacionado
- [ ] Por seção: candidatos, vagas, experiências, candidaturas

**Esforço:** 1 dia

---

### 25. **Geolocalização (Localização)**
- [ ] Select de cidades com autocomplete (integrar com API)
- [ ] Ou usar lat/lng para mapa
- [ ] GoogleMaps embed em detalhe de vaga (mostrar local)

**Esforço:** 2 dias (depende de API de localidades)

---

### 26. **Internacionalização (i18n)** — OPCIONAL
- [ ] Textos em português só por agora (OK)
- [ ] Setup para suportar inglês/espanhol depois
- [ ] Usar biblioteca (`react-i18next`)

**Esforço:** 1 dia (setup) + texto

---

## 🔵 BAIXO (Extras/Futuro)

Não são críticos para MVP.

### 27. **Funcionalidades de RH avançadas**
- [ ] Tela de "Relatórios" (exportar dados)
- [ ] Agendamento automático de entrevistas
- [ ] Integração com calendário (Google Calendar, Outlook)
- [ ] Chat integrado com candidato
- [ ] Avaliações/Feedback de entrevistas
- [ ] Score de matching automático

**Esforço:** Variável (5+ dias cada)  
**Fase:** 3–4+

---

### 28. **Funcionalidades de Candidato avançadas**
- [ ] Recomendações personalizadas de vagas
- [ ] Alertas de novas vagas que combinam
- [ ] Salvar vagas favoritas
- [ ] Currículo em múltiplos formatos (PDF, Word, HTML)
- [ ] Carta de apresentação
- [ ] Portfolio (integrar GitHub, Behance, etc.)

**Esforço:** Variável (3+ dias cada)  
**Fase:** 3–4+

---

### 29. **Analytics**
- [ ] Rastrear visualizações de vaga
- [ ] Rastrear cliques em "Candidatar-se"
- [ ] Heatmap de qual seção do perfil é editada mais
- [ ] Google Analytics integration

**Esforço:** 1–2 dias  
**Fase:** 4+

---

### 30. **Acessibilidade (A11y)**
- [ ] WCAG 2.1 Level AA
- [ ] Screen reader support (labels, roles, aria)
- [ ] Navegação por teclado
- [ ] Contraste de cores (verificar com ferramenta)
- [ ] Testes com screen reader

**Esforço:** 2–3 dias  
**Fase:** 5+ ou paralelo

---

### 31. **Testes Automatizados**
- [ ] Vitest para testes unitários de componentes
- [ ] Playwright ou Cypress para E2E
- [ ] Coverage mínimo 60%

**Esforço:** 3–4 dias  
**Fase:** 5

---

### 32. **Performance**
- [ ] Code splitting (lazy load de rotas)
- [ ] Otimizar bundle (tree-shaking, minify)
- [ ] Image optimization (WebP, srcset)
- [ ] Caching strategies (Service Worker)
- [ ] Lighthouse score > 90

**Esforço:** 2–3 dias  
**Fase:** 5

---

### 33. **Dark mode** — EXTRA
- [ ] Toggle no header
- [ ] Persistir preferência (localStorage ou back-end)
- [ ] Usar CSS variables do tema

**Esforço:** 1 dia  
**Fase:** 4+

---

## 📋 Resumo por prioridade

| Prioridade | Item | Qty | Dias |
|---|---|---|---|
| 🔴 **CRÍTICO** | Integração API, Auth JWT, PDF upload, completar Detalhe Candidato, enriquecer Ranking | 5 | 10–13 (reduzido: Criar/Editar Vaga e Ranking básico já existem) |
| 🟡 **ALTO** | Completar 7 telas (Login, Cadastro, Vitrine, Detalhe Vaga, Perfil, Candidatos, Vagas, Candidaturas, Dashboard, Cadastrar) | 10 | 20–25 |
| 🟢 **MÉDIO** | Validação com zod, Mobile, Notificações, Filtros, Paginação | 9 | 12–15 |
| 🔵 **BAIXO** | Analytics, A11y, Testes, Performance, Dark mode, Features avançadas | 8+ | 10+ |
| 📊 **TOTAL MVP** | Até "MÉDIO" | 24 | 42–53 dias/dev |

**Se 1 dev React (fulltime):** 42–53 dias = ~9 semanas  
**Se 1.5 dev React (paralelo com .NET):** 27–36 dias = ~5–7 semanas  
**Se 2 dev React:** 21–27 dias = ~4–5 semanas

> Estimativa revisada para baixo em relação à versão anterior deste documento, porque a leitura do código mostrou que "Criar/Editar Vaga" e "Ranking por Vaga" (antes tratados como telas inexistentes) já têm implementação funcional no protótipo.

---

## 🎯 Ordem recomendada de implementação (por semana)

```
SEMANA 1 — Fundação integração
├─ Instalar Axios + React Query
├─ Criar interceptor auth
├─ Atualizar context.tsx para chamar API
└─ Conectar LoginPage + CadastroPage (15h)

SEMANA 2 — RH Fase 1
├─ Conectar DashboardPage aos endpoints
├─ Conectar CandidatosPage ao GET /api/candidatos
├─ Conectar CadastrarPage ao POST /api/candidatos
└─ (15h)

SEMANA 3 — RH Fase 2
├─ Completar painel de detalhe do candidato (já existe inline; falta observações + histórico)
├─ Conectar modal de criar/editar vaga — já existe (JobModal) — a POST/PUT reais
├─ Conectar VagasPage ao GET /api/vagas
└─ (14h — reduzido, pois as telas já existem no protótipo)

SEMANA 4 — Candidato Fase 1
├─ Conectar VitrinePage ao GET /api/vagas?open
├─ Conectar VagaDetailPage + botão candidatar
├─ Conectar PerfilPage ao GET /api/candidatos/me
├─ Conectar CRUD de experiências
└─ (20h)

SEMANA 5 — Candidato Fase 2
├─ Implementar upload de PDF
├─ Conectar CandidaturasPage ao GET /api/candidaturas/me
├─ Migrar formulários para react-hook-form
└─ (18h)

SEMANA 6 — Ranking + refinamentos
├─ Enriquecer RankingPanel existente (score, habilidades, filtros)
├─ Validação melhorada
├─ Responsividade mobile
├─ Loading states + empty states
└─ (16h — reduzido, pois o ranking básico já existe)

SEMANA 7 — QA + Produção
├─ Testes E2E (Playwright)
├─ Performance (Lighthouse)
├─ A11y
├─ Deploy
└─ (20h)

TOTAL: ~128 horas de dev React (16 dias/dev fulltime)
```

---

## ✅ Checklist de QA antes de ir pro ar

- [ ] Todos os endpoints da API retunam 200/201/204 ou erro apropriado
- [ ] Login funciona com JWT real
- [ ] Logout limpa token e redireciona
- [ ] Refresh token automático funciona (deixar expirar e fazer ação)
- [ ] Upload de PDF funciona e arquivo é persistido
- [ ] Responsividade OK em mobile (teste em device real)
- [ ] Performance: Lighthouse score > 85 (mobile), > 90 (desktop)
- [ ] Acessibilidade: navegação por teclado, screen reader, contraste OK
- [ ] Todos os forms validam (campo obrigatório, formato, unicidade)
- [ ] Botões "Cancelar" funcionam (não salvam, voltam)
- [ ] Paginação funciona (navegar entre páginas, tamanho)
- [ ] Filtros funcionam (combinar filtros, limpar)
- [ ] Estados de loading aparecem (não fica travado)
- [ ] Mensagens de erro aparecem (não é crash silencioso)
- [ ] Breadcrumb/navegação está correta
- [ ] Links internos funcionam (sem 404)
- [ ] Logout automático quando token expira (sessão expirada)
- [ ] Permissões respeitadas (RH não acessa `/candidato`, etc.)
- [ ] Dados sensíveis não aparecem no console
- [ ] HTTPS funciona (certificado válido)
- [ ] CORS configurado corretamente (sem erros no console)

---

**Documento gerado:** 29/08/2026
**Revisado:** 29/08/2026 (após leitura direta do código-fonte do ZIP)
**Total de itens faltando:** 32 (itens #5 e #6 deixaram de ser "telas inexistentes" e viraram refinamentos de telas já implementadas)
**Esforço total:** 42–53 dias/dev (MVP) + 10+ dias (extras)
**Próxima atualização:** Conforme itens forem completados
