# Arquitetura Técnica — TalentBase

> Substitui `storyboard-tecnico-gerenciador-curriculos.md` e `storyboard-tecnico-gerenciador-curriculos-V2-ATUALIZADO.md`. Aqueles dois documentos descreviam a versão exportada do Figma (`Front_End_V2`/`Front_End_V4`), com um contexto único (`context.tsx`), páginas monolíticas e nenhuma camada de serviços. O projeto foi **reconstruído do zero** (`talentbase/`) com arquitetura própria, preparada para back-end real. Este documento descreve a versão atual.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS (tema próprio) + React Router DOM v6 + React Hook Form + Sonner + Recharts + Lucide Icons.
**Back-end alvo:** C# / ASP.NET Core Web API (ainda não implementado — ver `GUIA-BACKEND-ENDPOINTS.md`).

---

## 1. Estrutura de pastas

```text
src/
├── types/         # interfaces por domínio (user, status, candidate, job, application)
├── utils/         # formatação, cálculo de experiência, opções de domínio, config visual de status, base mockada
├── services/      # ÚNICA camada que hoje sabe que os dados são mockados
├── contexts/      # AuthContext, DataContext — não sabem de onde os dados vêm
├── hooks/         # useAuth, useAppData, useJobRanking — porta de entrada dos contexts
├── components/
│   ├── ui/        # Button, Input, Select, Textarea, Modal, Card, Badge, Loading, ErrorMessage, Pagination
│   ├── domain/    # Avatar, StatusBadge/JobStatusBadge/ModalityBadge, FileTab
│   └── layout/    # Navbar, Sidebar
├── layouts/       # PublicLayout, HRLayout, CandidateLayout
├── pages/         # uma pasta por área (raiz, hr/, candidate/)
└── routes/        # AppRoutes.tsx (árvore de rotas) + ProtectedRoute.tsx
```

A regra de dependência é sempre **pages → hooks → contexts → services → (mock hoje / API amanhã)**. Nenhuma página importa `services/` ou `utils/mockDatabase.ts` diretamente.

---

## 2. Mapa de rotas

| Rota | Página | Layout | Acesso |
|---|---|---|---|
| `/login` | `LoginPage` | — (tela cheia) | Público |
| `/cadastro` | `RegisterPage` | — (tela cheia) | Público |
| `/` | `JobsBoardPage` | `PublicLayout` | Público |
| `/vaga/:id` | `JobDetailPage` | `PublicLayout` | Público (candidatura exige login) |
| `/rh/dashboard` | `DashboardPage` | `HRLayout` | Papel `RH` |
| `/rh/candidatos` | `CandidatesPage` | `HRLayout` | Papel `RH` |
| `/rh/vagas` | `JobsPage` | `HRLayout` | Papel `RH` |
| `/rh/cadastrar` | `RegisterCandidatePage` | `HRLayout` | Papel `RH` |
| `/candidato/perfil` | `ProfilePage` | `CandidateLayout` | Papel `Candidato` |
| `/candidato/candidaturas` | `ApplicationsPage` | `CandidateLayout` | Papel `Candidato` |

O controle de acesso é centralizado em `routes/ProtectedRoute.tsx` — é o único lugar que precisa mudar quando a autenticação real (JWT) substituir o mock.

---

## 3. Modelo de domínio (`src/types/`)

| Arquivo | Entidade | Campos principais |
|---|---|---|
| `user.ts` | `AuthUser` | `id, name, email, role: "RH" \| "Candidato"` |
| `status.ts` | `Status` | `"Novo" \| "Em Análise" \| "Entrevista" \| "Aprovado" \| "Reprovado"` |
| `candidate.ts` | `Candidate` | ficha do RH: `position, department, email, phone, status, appliedDate, experience (texto livre), skills[], location` |
| `candidate.ts` | `Experience` | experiência real: `candidateId, companyName, role, startDate, endDate \| null, description?` |
| `candidate.ts` | `CandidateProfile` | perfil do próprio candidato logado: dados pessoais + `experiences: Experience[]` |
| `job.ts` | `Job` | `title, department, location, modality, type, openings, candidatesCount, status: JobStatus, postedDate, minExperienceMonths, description?, skills?[]` |
| `application.ts` | `Application` | candidatura: `candidateId, jobId, status, applicationDate, history: HistoryEntry[]` |

`Candidate` (ficha mantida pelo RH) e `CandidateProfile` (perfil do candidato autenticado) são **entidades distintas de propósito**: a primeira é o registro que o RH gerencia manualmente ou recebe de uma candidatura; a segunda é o que o próprio candidato edita no portal. No back-end, provavelmente serão a mesma tabela vista por duas APIs diferentes — mas o front já trata isso como dois contratos separados, então essa decisão pode ser tomada livremente no back-end sem quebrar o front.

---

## 4. Regras de negócio

### 4.1 Pipeline de status da candidatura
```
Novo → Em Análise → Entrevista → Aprovado / Reprovado
```
Implementado em `utils/statusConfig.ts` (aparência) e `types/status.ts` (valores válidos). Toda mudança de status de uma `Application` gera uma entrada em `history` (`applicationService.updateApplicationStatus`).

### 4.2 Cálculo de experiência — dois caminhos
- **Caminho A — datas reais** (`utils/experience.ts → calculateTotalExperienceMonths`): usado no perfil do candidato (`CandidateProfile.experiences`). Une intervalos que se sobrepõem antes de somar, para não contar duas vezes um período em que o candidato teve dois vínculos simultâneos.
- **Caminho B — faixa em texto** (`utils/experience.ts → getExperienceMonths` + `EXPERIENCE_RANGE_TO_MONTHS`): usado quando só existe uma faixa textual (`Candidate.experience`, ex. "4 anos") — é o caso do cadastro manual do RH e do ranking por vaga.

### 4.3 Ranking de candidatos por vaga
Implementado em `services/vacancyService.ts → getJobRanking`. Regra: candidatos que atendem `job.minExperienceMonths` (Caminho B) aparecem primeiro; dentro de cada grupo, ordena por meses de experiência decrescente. Hoje o cálculo é feito no cliente a partir das listas mockadas de `candidateService` e `applicationService`; a expectativa é que o back-end assuma esse cálculo (ver seção de ranking no guia de endpoints).

### 4.4 Candidatura (regras de bloqueio)
Implementado em `services/applicationService.ts → applyToJob`:
- Bloqueia candidatura duplicada (mesmo `candidateId` + `jobId`).
- Bloqueia candidatura a vaga com `status: "Encerrada"`.
- Ao criar a candidatura, incrementa `Job.candidatesCount` (`vacancyService.incrementJobApplicantCount`).

---

## 5. Componentes reutilizáveis

| Componente | Uso |
|---|---|
| `ui/Button`, `ui/Input`, `ui/Select`, `ui/Textarea` | Todos os formulários do sistema (login, cadastro, cadastro manual, modal de vaga, modal de experiência, perfil) |
| `ui/Modal` | Base de `JobModal`, `RankingPanel`, `ExperienceFormModal` |
| `ui/Pagination` | Tabela de candidatos (RH) |
| `domain/StatusBadges` (`StatusBadge`, `JobStatusBadge`, `ModalityBadge`) | Cor/rótulo de status em toda a interface — trocar uma cor é editar `utils/statusConfig.ts`, não caçar `className` |
| `domain/FileTab` | Elemento de assinatura visual (selo/etiqueta no canto dos cards de vaga) |
| `layout/Navbar`, `layout/Sidebar` | Compõem `PublicLayout`/`CandidateLayout` e `HRLayout`, respectivamente |

---

## 6. O que muda quando o back-end existir

Nenhum arquivo de `pages/`, `components/`, `contexts/`, `hooks/`, `layouts/` ou `routes/` deveria precisar mudar. As únicas mudanças esperadas são dentro de `src/services/*.ts` — ver `GUIA-BACKEND-ENDPOINTS.md` para o mapeamento função a função.
