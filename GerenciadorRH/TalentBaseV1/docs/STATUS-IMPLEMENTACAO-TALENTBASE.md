# Status de Implementação — TalentBase

> Substitui `ANALISE-FRONTEND-V2-RESUMO.md`, `STATUS-VISUAL-IMPLEMENTACAO.md` e `CHECKLIST-COMPLETO-O-QUE-FALTA.md`. Esses três documentos descreviam o mesmo projeto (a versão exportada do Figma) sob três ângulos diferentes, com bastante conteúdo repetido. Como o front-end foi reconstruído do zero com uma arquitetura muito mais organizada, este documento único cobre os três ângulos — resumo executivo, status por tela e checklist do que falta — sem repetição.

**Data:** 30/08/2026
**Situação geral:** front-end funcional de ponta a ponta sobre dados mockados, com camada de `services/` isolada e pronta para receber a API real. Nenhuma tela precisa ser criada do zero — o trabalho restante é essencialmente back-end + integração.

---

## 1. Resumo executivo

O front-end **não é um protótipo descartável**: é um MVP funcional com regra de negócio completa (pipeline de status, cálculo de experiência com dois caminhos, ranking, candidatura com validações). A diferença em relação à versão anterior (exportada do Figma) é puramente arquitetural — mesma funcionalidade, código reorganizado em camadas (`types/`, `services/`, `contexts/`, `hooks/`, `components/ui`, `components/domain`) para permitir plugar uma API real sem reescrever páginas.

Custo de desenvolvimento restante concentrado em:
1. **Back-end (a maior parte):** API C# + banco + endpoints (ver `GUIA-BACKEND-ENDPOINTS.md`)
2. **Integração:** trocar o corpo das funções de `services/*.ts` por chamadas HTTP reais
3. **Refinamentos pontuais:** upload de PDF, observações/histórico no detalhe do candidato, score de match no ranking (listados na seção 4)

---

## 2. Status por tela

| Rota | Página | Frontend | Dados |
|---|---|---|---|
| `/login` | `LoginPage` | ✅ Completo | Mock (`authService`, aceita qualquer senha) |
| `/cadastro` | `RegisterPage` | ✅ Completo, incluindo consentimento LGPD obrigatório | Mock |
| `/` | `JobsBoardPage` | ✅ Busca + filtros (departamento, modalidade, contrato) funcionais no cliente | Mock (`vacancyService`) |
| `/vaga/:id` | `JobDetailPage` | ✅ Completo — candidatura real, bloqueia duplicata e vaga encerrada, bloqueia usuário RH | Mock |
| `/rh/dashboard` | `DashboardPage` | ✅ KPIs + gráfico + lista de recentes | Mock; gráfico usa série fixa de 6 meses (`utils/mockDatabase.ts → hiringChartData`), não recalculada a partir dos dados reais |
| `/rh/candidatos` | `CandidatesPage` | ✅ Tabela com busca/filtros/paginação + painel de detalhe lateral (`CandidateDetailPanel`) | Mock (`candidateService`) |
| `/rh/vagas` | `JobsPage` | ✅ Grid + CRUD completo via modal (`JobModal`) + ranking via modal (`RankingPanel`) | Mock (`vacancyService`) |
| `/rh/cadastrar` | `RegisterCandidatePage` | ✅ Completo, 2 seções (dados pessoais + profissionais) | Mock |
| `/candidato/perfil` | `ProfilePage` | ✅ Edição de dados + CRUD de experiências com cálculo automático de tempo total | Mock (`userService`) |
| `/candidato/candidaturas` | `ApplicationsPage` | ✅ Lista com histórico de status expansível | Mock (`applicationService`) |

**Nenhuma tela está faltando.** O que resta são refinamentos dentro de telas já existentes (seção 4) e a integração de dados reais (seção 5).

---

## 3. Funcionalidades confirmadas (não precisam ser refeitas)

- ✅ CRUD de vagas (criar/editar) — modal `JobModal`, chama `createJob()`/`updateJob()` do `DataContext`
- ✅ Ranking de candidatos por vaga — modal `RankingPanel`, aplica a regra de qualificação + ordenação por experiência (seção 4.3 do documento de arquitetura)
- ✅ Cálculo de experiência total unindo intervalos sobrepostos (Caminho A)
- ✅ Candidatura com todas as validações de negócio (duplicidade, vaga encerrada, papel do usuário)
- ✅ Histórico de mudança de status da candidatura, exibido como timeline
- ✅ Filtro por departamento/modalidade/contrato na vitrine pública
- ✅ Consentimento LGPD obrigatório no cadastro

---

## 4. O que falta refinar (não são telas novas)

| Item | Onde | Descrição |
|---|---|---|
| **Observações do RH + histórico de status no candidato** | `CandidateDetailPanel` (painel lateral em `CandidatesPage`) | Falta campo de observações editável e uma timeline de mudanças de status (hoje só existe no lado do candidato, via `Application.history`) |
| **Score de match no ranking** | `RankingPanel` / `vacancyService.getJobRanking` | Hoje o ranking usa só meses de experiência (Caminho B); falta comparar habilidades da vaga (`Job.skills`) com as do candidato e gerar um score percentual |
| **Upload de currículo em PDF** | `ProfilePage` | Campo de upload existe visualmente (mostra um toast informativo), mas não há integração real com storage (Azure Blob / S3 / GCS — decisão em aberto) |
| **Campo de salário na vaga** | `Job` (tipo) + `JobModal` | Não existe no modelo de dados atual; avaliar se entra no MVP |
| **Gráfico do dashboard com dados reais** | `DashboardPage` | Usa série fixa (`hiringChartData`); precisa ser recalculado a partir de candidatos/contratações reais quando a API existir |
| **Departamentos via API** | `utils/domainOptions.ts → DEPARTMENTS` | Hoje é uma lista fixa no front; avaliar se deve vir de um endpoint (`GET /api/departamentos`) para permitir customização por empresa |

Nenhum desses itens bloqueia a integração com o back-end — todos podem ser feitos depois, incrementalmente.

---

## 5. Integração com API — o que muda em cada `service`

Ver o detalhamento completo (rotas, DTOs, exemplos de JSON) em `GUIA-BACKEND-ENDPOINTS.md`. Resumo do escopo:

| Arquivo | Funções a conectar |
|---|---|
| `services/authService.ts` | `login`, `logout` |
| `services/candidateService.ts` | `listCandidates`, `updateCandidateStatus`, `deleteCandidate`, `createCandidate` |
| `services/vacancyService.ts` | `listJobs`, `getJob`, `createJob`, `updateJob`, `getJobRanking` |
| `services/applicationService.ts` | `listApplications`, `listApplicationsByCandidate`, `listApplicationsByJob`, `applyToJob`, `updateApplicationStatus` |
| `services/userService.ts` | `getCandidateProfile`, `updateCandidateProfile`, `addExperience`, `updateExperience`, `deleteExperience` |

---

## 6. Roadmap sugerido

| Fase | Duração estimada | Escopo |
|---|---|---|
| **Fase 0** | 1 semana | Setup .NET + banco (PostgreSQL ou SQL Server) + Identity/JWT |
| **Fase 1** | 1–2 semanas | `authService` + `vacancyService` + `candidateService` reais |
| **Fase 2** | 1 semana | `applicationService` real + dashboard com dados reais |
| **Fase 3** | 1 semana | `userService` real + upload de PDF |
| **Fase 4** | 3–5 dias | Score de match no ranking + observações/histórico no candidato (RH) |
| **Fase 5** | 3–5 dias | QA, tratamento de erros de rede na UI, deploy |

**Total estimado:** 5–6 semanas com 1–2 pessoas — menor que a estimativa anterior (6–7 semanas), porque a camada de `services/` já isola toda a troca de dados e nenhuma tela precisa ser recriada.

## 7. Decisões em aberto (para alinhar antes de começar o back-end)

- [ ] Banco de dados: PostgreSQL ou SQL Server?
- [ ] Storage de PDFs: Azure Blob, AWS S3 ou Google Cloud Storage?
- [ ] Provedor de e-mail para notificações (SendGrid, Amazon SES, etc.) — fora do MVP inicial?
- [ ] `Departamentos`/`Modalidades`/`Tipos de contrato` continuam fixos no front ou passam a vir de tabela própria no banco?
- [ ] Score de match do ranking entra no MVP ou fica para uma fase seguinte?
