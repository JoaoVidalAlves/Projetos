# Guia de Implementação do Back-end — TalentBase

> Substitui `ENDPOINTS-NECESSARIOS-BACKEND.md`. O front-end mudou de arquitetura desde a versão anterior deste guia: não existe mais um `context.tsx` único chamando dados mockados diretamente — agora existe uma camada `src/services/*.ts` que é a **única** parte do front que precisa mudar. Este guia mapeia, arquivo por arquivo e função por função, qual endpoint C#/ASP.NET Core deve substituir cada mock.

**Como usar este guia:** para cada função abaixo, o "contrato hoje" mostra a assinatura TypeScript real (já em produção no front, mockada); o "endpoint proposto" é o que o back-end deve expor para que a troca em `services/` seja apenas substituir o corpo da função por um `fetch`/`axios`, sem mudar a assinatura nem tocar em nenhuma página.

**Base URL:** lida de `VITE_API_BASE_URL` (ver `src/services/api.ts` e `.env.example`).
**Autenticação:** todas as rotas exceto `POST /api/auth/login`, `POST /api/auth/registrar` e `GET /api/vagas` (portal público) devem exigir `Authorization: Bearer {token}`. O placeholder já existe em `src/services/api.ts → authHeaders()`.

---

## 1. AuthController — `src/services/authService.ts`

### `login(email, password): Promise<LoginResult>`
```ts
interface LoginResult { ok: boolean; user?: AuthUser; error?: string }
interface AuthUser { id: string; name: string; email: string; role: "RH" | "Candidato" }
```

**Endpoint:** `POST /api/auth/login`

Request:
```json
{ "email": "rh@empresa.com.br", "password": "••••••" }
```

Resposta 200 OK:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "rh-1", "name": "Equipe de RH", "email": "rh@empresa.com.br", "role": "RH" }
}
```

Resposta 401 Unauthorized (credenciais inválidas):
```json
{ "error": "E-mail ou senha inválidos." }
```

No front, `authService.login` deve armazenar o `token` (ex.: `localStorage.setItem("talentbase.token", token)` — a chave já é lida por `authHeaders()`) e retornar `{ ok: true, user }` ou `{ ok: false, error }`.

### `logout(): Promise<void>`
**Endpoint:** `POST /api/auth/logout` (opcional — pode ser só client-side, removendo o token do `localStorage`, caso o back-end não mantenha blacklist de tokens)

### Novo — registro de candidato
O front hoje trata cadastro (`RegisterPage`) como um caso especial dentro do fluxo de login (ver `STATUS-IMPLEMENTACAO-TALENTBASE.md`). Ao implementar, criar:

**Endpoint:** `POST /api/auth/registrar`
```json
// Request
{
  "name": "Ana Carolina Mendes",
  "email": "ana.mendes@email.com",
  "password": "••••••",
  "city": "São Paulo",
  "state": "SP",
  "desiredPosition": "Desenvolvedora Frontend",
  "department": "Tecnologia"
}
// Resposta 201 Created — mesmo formato do login (token + user)
```

---

## 2. CandidatesController — `src/services/candidateService.ts`

Modelo `Candidate` (`src/types/candidate.ts`):
```ts
interface Candidate {
  id: string; name: string; position: string; department: string;
  email: string; phone: string; status: Status; appliedDate: string;
  experience: string; skills: string[]; location: string;
}
```

### `listCandidates(): Promise<Candidate[]>`
**Endpoint:** `GET /api/candidatos` (RH only)
Resposta 200: array de `Candidate` (ver acima). Considerar paginação server-side no futuro — hoje o front pagina no cliente (`components/ui/Pagination`).

### `updateCandidateStatus(id, status): Promise<Candidate | undefined>`
**Endpoint:** `PATCH /api/candidatos/{id}/status`
```json
// Request
{ "status": "Entrevista" }
// Resposta 200: objeto Candidate atualizado
// 404 se o id não existir
```

### `deleteCandidate(id): Promise<void>`
**Endpoint:** `DELETE /api/candidatos/{id}` → 204 No Content

### `createCandidate(input): Promise<Candidate>`
```ts
type NewCandidateInput = Omit<Candidate, "id" | "status" | "appliedDate">;
```
**Endpoint:** `POST /api/candidatos` (cadastro manual pelo RH)
```json
// Request
{ "name": "...", "position": "...", "department": "...", "email": "...", "phone": "...", "experience": "4 anos", "skills": ["React"], "location": "..." }
// Resposta 201: Candidate completo (com id, status: "Novo", appliedDate gerados pelo servidor)
```

### Pendente de endpoint próprio (ver `STATUS-IMPLEMENTACAO-TALENTBASE.md`, seção 4)
Quando o painel de detalhe do candidato (RH) ganhar observações e histórico, sugerimos:
- `PUT /api/candidatos/{id}/observacoes` — `{ "notes": "..." }`
- `GET /api/candidatos/{id}/historico` — lista de `{ status, date, changedBy }`, no mesmo formato de `HistoryEntry` já usado em `Application`.

---

## 3. VacancyController — `src/services/vacancyService.ts`

Modelo `Job` (`src/types/job.ts`):
```ts
interface Job {
  id: string; title: string; department: string; location: string;
  modality: string; type: string; openings: number; candidatesCount: number;
  status: "Aberta" | "Em Processo" | "Encerrada"; postedDate: string;
  minExperienceMonths: number; description?: string; skills?: string[];
}
```

### `listJobs(): Promise<Job[]>`
**Endpoint:** `GET /api/vagas` — **rota pública** (usada tanto pela vitrine `/` quanto pelo painel RH `/rh/vagas`; o front já filtra vagas "Encerrada" no cliente para a vitrine pública, mas considerar um parâmetro `?status=Aberta,Em Processo` para reduzir payload)

### `getJob(id): Promise<Job | undefined>`
**Endpoint:** `GET /api/vagas/{id}` — pública (usada em `/vaga/:id`) → 404 se não existir

### `createJob(input): Promise<Job>`
```ts
type NewJobInput = Omit<Job, "id" | "candidatesCount" | "postedDate">;
```
**Endpoint:** `POST /api/vagas` (RH only)
```json
// Request
{
  "title": "Desenvolvedora Frontend", "department": "Tecnologia", "location": "São Paulo, SP",
  "modality": "Híbrido", "type": "CLT", "openings": 2, "status": "Aberta",
  "minExperienceMonths": 36, "description": "...", "skills": ["React", "TypeScript"]
}
// Resposta 201: Job completo (id, candidatesCount: 0, postedDate gerados pelo servidor)
```
Usado pelo modal `JobModal` (`src/pages/hr/JobModal.tsx`), acionado pelo botão "Nova vaga" em `/rh/vagas`.

### `updateJob(id, input): Promise<Job | undefined>`
```ts
type UpdateJobInput = Partial<NewJobInput>;
```
**Endpoint:** `PUT /api/vagas/{id}` (RH only) — mesmo corpo do `POST`, todos os campos opcionais. Usado pelo mesmo `JobModal`, quando aberto a partir do botão "Editar".

### `getJobRanking(jobId): Promise<RankedApplicant[]>`
```ts
interface RankedApplicant {
  applicationId: string; candidateId: string; candidateName: string;
  candidatePosition: string; experienceLabel: string; months: number; qualified: boolean;
}
```
**Endpoint:** `GET /api/vagas/{id}/ranking` (RH only)

Hoje esse cálculo é feito **no cliente**, cruzando `applicationService.listApplicationsByJob(jobId)` com `candidateService.listCandidates()` e a regra de qualificação da seção 4.3 de `ARQUITETURA-TALENTBASE.md` (qualificados primeiro, depois por meses decrescente). O ideal é que o back-end assuma esse cálculo:

```json
// Resposta 200
[
  { "applicationId": "app-1", "candidateId": "1", "candidateName": "Ana Carolina Mendes", "candidatePosition": "Desenvolvedora Frontend", "experienceLabel": "4 anos", "months": 48, "qualified": true }
]
```

Melhorias sugeridas para esta fase (ver seção 4 de `STATUS-IMPLEMENTACAO-TALENTBASE.md`): incluir `matchScore` (percentual de habilidades da vaga presentes no candidato) e `matchedSkills`/`missingSkills`.

### `incrementJobApplicantCount(id)`
Função interna, chamada por `applicationService.applyToJob` — não precisa de endpoint próprio; no back-end, isso deve ser um efeito colateral (dentro de uma transação) do endpoint de criação de candidatura (seção 4).

---

## 4. ApplicationsController — `src/services/applicationService.ts`

Modelo `Application` (`src/types/application.ts`):
```ts
interface Application {
  id: string; candidateId: string; jobId: string; status: Status;
  applicationDate: string; notes?: string; history: HistoryEntry[];
}
interface HistoryEntry { id: string; status: Status; date: string; changedBy: string }
```

### `listApplications(): Promise<Application[]>`
**Endpoint:** `GET /api/candidaturas` (RH only — todas as candidaturas)

### `listApplicationsByCandidate(candidateId): Promise<Application[]>`
**Endpoint:** `GET /api/candidaturas/me` (Candidato — usa o id do token, não recebe `candidateId` por query) → usado em `/candidato/candidaturas`

### `listApplicationsByJob(jobId): Promise<Application[]>`
**Endpoint:** `GET /api/vagas/{id}/candidaturas` (RH only) — hoje usado internamente pelo cálculo de ranking (seção 3); pode ser absorvido pelo próprio `GET /api/vagas/{id}/ranking` no back-end.

### `applyToJob(candidateId, jobId): Promise<ApplyResult>`
```ts
interface ApplyResult { ok: boolean; application?: Application; error?: string }
```
**Endpoint:** `POST /api/candidaturas` (Candidato — `candidateId` vem do token, não do body)
```json
// Request
{ "jobId": "4" }
// Resposta 201
{ "id": "app-9", "candidateId": "1", "jobId": "4", "status": "Novo", "applicationDate": "2026-08-30", "history": [{ "id": "h-1", "status": "Novo", "date": "2026-08-30", "changedBy": "Sistema" }] }
// Resposta 409 Conflict — candidatura duplicada
{ "error": "Você já se candidatou a esta vaga." }
// Resposta 422 Unprocessable Entity — vaga encerrada
{ "error": "Esta vaga não está disponível." }
```
O back-end deve replicar as duas validações de negócio já implementadas no mock (duplicidade e vaga encerrada — seção 4.4 de `ARQUITETURA-TALENTBASE.md`) e, na mesma transação, incrementar `Job.candidatesCount`.

### `updateApplicationStatus(id, status): Promise<Application | undefined>`
**Endpoint:** `PATCH /api/candidaturas/{id}/status` (RH only)
```json
// Request
{ "status": "Entrevista" }
// Resposta 200: Application atualizada, com um novo item em `history`
```
O back-end deve anexar automaticamente um `HistoryEntry` a cada chamada (não é responsabilidade do front enviar o histórico).

---

## 5. UserController — `src/services/userService.ts`

Modelo `CandidateProfile` (`src/types/candidate.ts`):
```ts
interface CandidateProfile {
  id: string; name: string; email: string; phone: string; city: string; state: string;
  desiredPosition: string; department: string; skills: string[];
  resumeUrl?: string; experiences: Experience[];
}
interface Experience {
  id: string; candidateId: string; companyName: string; role: string;
  startDate: string; endDate: string | null; description?: string;
}
```

### `getCandidateProfile(): Promise<CandidateProfile>`
**Endpoint:** `GET /api/perfil` (Candidato — id vem do token)

### `updateCandidateProfile(input): Promise<CandidateProfile>`
```ts
type UpdateProfileInput = Partial<Omit<CandidateProfile, "id" | "experiences">>;
```
**Endpoint:** `PUT /api/perfil` — corpo com os campos a atualizar, resposta com o perfil completo atualizado

### `addExperience(input): Promise<Experience>`
```ts
type NewExperienceInput = Omit<Experience, "id" | "candidateId">;
```
**Endpoint:** `POST /api/perfil/experiencias`
```json
// Request
{ "companyName": "StartupXYZ", "role": "Desenvolvedora Junior", "startDate": "2022-02", "endDate": "2023-06", "description": "..." }
// Resposta 201: Experience completa (id, candidateId gerados pelo servidor)
```

### `updateExperience(id, input): Promise<Experience | undefined>`
**Endpoint:** `PUT /api/perfil/experiencias/{id}`

### `deleteExperience(id): Promise<void>`
**Endpoint:** `DELETE /api/perfil/experiencias/{id}` → 204 No Content

### Upload de currículo (pendente — ver seção 4 de `STATUS-IMPLEMENTACAO-TALENTBASE.md`)
Sugestão:
**Endpoint:** `POST /api/perfil/curriculo` (multipart/form-data) → retorna `{ "resumeUrl": "https://..." }`, que o front grava em `CandidateProfile.resumeUrl`. Decisão de storage (Azure Blob / S3 / GCS) em aberto.

---

## 6. Tratamento de erros — padrão esperado pelo front

`src/services/api.ts` já define:
```ts
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
```

Ao implementar cada função de `services/*.ts` com `fetch` real, o padrão deve ser:
```ts
const res = await fetch(`${API_BASE_URL}/api/candidatos`, { headers: authHeaders() });
if (!res.ok) throw new ApiError(res.status, await res.text());
return res.json();
```

Recomenda-se que toda resposta de erro do back-end siga o formato `{ "error": "mensagem legível" }`, para que a UI (que já usa `toast.error(...)` do Sonner em vários pontos) possa exibir a mensagem diretamente.

---

## 7. CORS e ambiente

- Origem a liberar em desenvolvimento: `http://localhost:5173` (porta padrão do Vite, ver `vite.config.ts`)
- Variável de ambiente do front: `VITE_API_BASE_URL` (ver `.env.example` na raiz do projeto)
- Cabeçalho de autenticação: `Authorization: Bearer {token}`, montado por `authHeaders()` em `src/services/api.ts`

---

## 8. Ordem sugerida de implementação

1. `AuthController` (login + registro) — desbloqueia todo o resto
2. `VacancyController` (`GET /api/vagas`, `GET /api/vagas/{id}`) — desbloqueia a vitrine pública, que não exige login
3. `CandidatesController` + `POST/PUT /api/vagas` (RH) — desbloqueia o painel de RH
4. `ApplicationsController` (`POST /api/candidaturas` + status) — fecha o ciclo de candidatura
5. `GET /api/vagas/{id}/ranking` — pode vir depois, já que o front calcula isso localmente como fallback
6. `UserController` (perfil + experiências) — fecha o portal do candidato
7. Upload de currículo — pode ficar para uma fase posterior, isolado do resto
