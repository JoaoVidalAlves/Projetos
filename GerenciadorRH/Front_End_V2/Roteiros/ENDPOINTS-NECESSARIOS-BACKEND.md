# 🔌 Endpoints necessários — Back-end C# / ASP.NET Core

Mapeamento de todos os endpoints que o front-end React precisa, extraído da análise das páginas e contexto.

---

## 🔐 AuthController — `/api/auth`

Gerencia login, cadastro e gestão de tokens.

### `POST /api/auth/login`
**Funcionalidade:** Autentica usuário (RH ou Candidato)

**Requisição:**
```json
{
  "email": "rh@empresa.com.br",
  "password": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_uuid",
  "user": {
    "id": "user-123",
    "name": "Equipe de RH",
    "email": "rh@empresa.com.br",
    "role": "RH"
  }
}
```

**Resposta (401 Unauthorized):**
```json
{
  "error": "E-mail ou senha inválidos"
}
```

**Front-end:** `LoginPage.tsx` chama isso e armazena `accessToken` + `refreshToken`

---

### `POST /api/auth/registrar`
**Funcionalidade:** Cria conta de candidato (self-service, público)

**Requisição:**
```json
{
  "email": "ana.mendes@email.com",
  "password": "senha123",
  "nome": "Ana Mendes"
}
```

**Resposta (201 Created):**
```json
{
  "id": "candidate-456",
  "email": "ana.mendes@email.com",
  "nome": "Ana Mendes",
  "role": "Candidato"
}
```

**Front-end:** `CadastroPage.tsx` chama isso

---

### `POST /api/auth/refresh`
**Funcionalidade:** Renova access token usando refresh token (automático)

**Requisição:** (refresh token em cookie `httpOnly` — não precisa no corpo)

**Resposta (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "novo_refresh_token_uuid"
}
```

**Front-end:** Interceptor Axios chama automaticamente quando access token expirar

---

### `POST /api/auth/logout`
**Funcionalidade:** Revoga sessão (invalida refresh token)

**Requisição:** (vazio)

**Resposta (200 OK):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

**Front-end:** Navbar/Sidebar chama ao clicar "Sair"

---

## 👥 CandidatosController — `/api/candidatos`

Gerencia candidatos (RH cria manual, candidatos existem via login).

### `GET /api/candidatos`
**Funcionalidade:** Lista todos os candidatos (RH only)

**Query params:**
- `search=` (opcional) — busca por nome, e-mail, vaga
- `status=` (opcional) — filtrar por status (Novo, Em Análise, Entrevista, Aprovado, Reprovado)
- `departamento=` (opcional) — filtrar por departamento
- `page=1` (opcional) — paginação
- `pageSize=10` (opcional)

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "cand-1",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999",
      "position": "Developer Senior",
      "department": "Tecnologia",
      "location": "São Paulo, SP",
      "experience": "10+ anos",
      "status": "Em Análise",
      "appliedDate": "2026-08-29",
      "notes": "Bom perfil"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 10
}
```

**Front-end:** `CandidatosPage.tsx` (`/rh/candidatos`) carrega isso

---

### `POST /api/candidatos`
**Funcionalidade:** Cria candidato manualmente (RH)

**Requisição:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "11988888888",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "position": "Designer UX",
  "department": "Design",
  "experience": "4 anos",
  "skills": ["UI Design", "Figma", "Prototyping"],
  "notes": "Indicação da rede"
}
```

**Resposta (201 Created):**
```json
{
  "id": "cand-123",
  "name": "Maria Santos",
  "status": "Novo",
  "appliedDate": "2026-08-29"
}
```

**Front-end:** `CadastrarPage.tsx` (`/rh/cadastrar`) chama isso

---

### `GET /api/candidatos/{id}`
**Funcionalidade:** Detalhe de um candidato (RH only)

**Resposta (200 OK):**
```json
{
  "id": "cand-1",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "city": "São Paulo",
  "state": "SP",
  "position": "Developer Senior",
  "department": "Tecnologia",
  "location": "São Paulo, SP",
  "experience": "10+ anos",
  "skills": ["React", "Node.js", "TypeScript"],
  "status": "Em Análise",
  "appliedDate": "2026-08-20",
  "notes": "Bom perfil, considerar para entrevista",
  "experiencias": [
    {
      "id": "exp-1",
      "empresa": "Acme Corp",
      "cargo": "Senior Developer",
      "dataInicio": "2020-01-15",
      "dataFim": "2026-08-29"
    }
  ],
  "historico": [
    {
      "id": "hist-1",
      "status": "Novo",
      "data": "2026-08-20",
      "alteradoPor": "RH - TalentBase"
    },
    {
      "id": "hist-2",
      "status": "Em Análise",
      "data": "2026-08-25",
      "alteradoPor": "RH - TalentBase"
    }
  ]
}
```

**Front-end:** Rota `/rh/candidatos/:id` (a implementar) chama isso

---

### `PATCH /api/candidatos/{id}/status`
**Funcionalidade:** Muda status de um candidato (RH only)

**Requisição:**
```json
{
  "status": "Entrevista"
}
```

**Resposta (200 OK):**
```json
{
  "id": "cand-1",
  "status": "Entrevista",
  "historico": [
    { "status": "Novo", "data": "2026-08-20", "alteradoPor": "RH" },
    { "status": "Em Análise", "data": "2026-08-25", "alteradoPor": "RH" },
    { "status": "Entrevista", "data": "2026-08-29", "alteradoPor": "RH" }
  ]
}
```

**Front-end:** `CandidatosPage.tsx` dropdown inline chama isso via `updateCandidateStatus()`

---

### `DELETE /api/candidatos/{id}`
**Funcionalidade:** Deleta/arquiva candidato (RH only)

**Resposta (204 No Content ou 200 OK):**
```json
{
  "message": "Candidato arquivado com sucesso"
}
```

**Front-end:** Ação "excluir" na tabela de candidatos

---

## 💼 VagasController — `/api/vagas`

Gerencia vagas de emprego.

### `GET /api/vagas`
**Funcionalidade:** Lista vagas (RH vê todas, público vê só abertas)

**Query params:**
- `status=` (opcional) — Aberta, Em Processo, Encerrada
- `departamento=` (opcional)
- `busca=` (opcional) — título, depto.

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "vaga-1",
      "title": "Developer React",
      "department": "Tecnologia",
      "type": "CLT",
      "status": "Aberta",
      "location": "São Paulo, SP",
      "postedDate": "2026-08-15",
      "vacancies": 3,
      "candidates": 5,
      "description": "Procuramos um developer React senior...",
      "requirements": ["React 18+", "TypeScript", "5+ anos exp."]
    }
  ],
  "total": 12
}
```

**Front-end:**
- `VitrinePage.tsx` (`/`) — público, carrega `status=Aberta`
- `VagasPage.tsx` (`/rh/vagas`) — RH, carrega todas

---

### `GET /api/vagas/{id}`
**Funcionalidade:** Detalhe de uma vaga

**Resposta (200 OK):**
```json
{
  "id": "vaga-1",
  "title": "Developer React",
  "department": "Tecnologia",
  "type": "CLT",
  "salary": "R$ 8.000 - R$ 12.000",
  "status": "Aberta",
  "location": "São Paulo, SP",
  "description": "Procuramos um developer React senior com experiência em...",
  "requirements": ["React 18+", "TypeScript", "5+ anos exp.", "Inglês fluente"],
  "postedDate": "2026-08-15",
  "vacancies": 3,
  "candidates": 5
}
```

**Front-end:** `VagaDetailPage.tsx` (`/vaga/:id`) carrega isso

---

### `POST /api/vagas`
**Funcionalidade:** Cria nova vaga (RH only)

**Requisição:**
```json
{
  "title": "QA Automation",
  "department": "QA",
  "type": "CLT",
  "salary": "R$ 6.000 - R$ 9.000",
  "location": "Rio de Janeiro, RJ",
  "description": "Procuramos QA specialist...",
  "requirements": ["Selenium", "Python", "3+ anos exp."],
  "vacancies": 2
}
```

**Resposta (201 Created):**
```json
{
  "id": "vaga-123",
  "title": "QA Automation",
  "status": "Aberta",
  "postedDate": "2026-08-29"
}
```

**Front-end:** Form de criar vaga (a implementar em `/rh/vagas/novo`)

---

### `PUT /api/vagas/{id}`
**Funcionalidade:** Edita vaga (RH only)

**Requisição:**
```json
{
  "title": "QA Automation (Updated)",
  "vacancies": 3,
  "status": "Em Processo"
}
```

**Resposta (200 OK):**
```json
{
  "id": "vaga-1",
  "title": "QA Automation (Updated)",
  "vacancies": 3,
  "status": "Em Processo"
}
```

**Front-end:** Form de editar vaga (a implementar em `/rh/vagas/:id/editar`)

---

## 🎯 CandidaturasController — `/api/candidaturas`

Gerencia candidaturas (aplicações a vagas).

### `GET /api/candidaturas`
**Funcionalidade:** Lista candidaturas (RH vê todas, Candidato vê só as suas)

**Query params:**
- `vagaId=` (opcional)
- `candidatoId=` (opcional)
- `status=` (opcional)

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "cand-app-1",
      "candidatoId": "cand-1",
      "candidatoName": "João Silva",
      "vagaId": "vaga-1",
      "vagaTitle": "Developer React",
      "status": "Em Análise",
      "dataCandidatura": "2026-08-20",
      "ultimaAtualizacao": "2026-08-25"
    }
  ],
  "total": 5
}
```

**Front-end:**
- `CandidatosPage.tsx` — RH vê candidaturas na lista/detalhe
- `CandidaturasPage.tsx` (`/candidato/candidaturas`) — Candidato vê só suas

---

### `GET /api/candidaturas/me`
**Funcionalidade:** Lista candidaturas do candidato logado (Candidato only)

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "cand-app-1",
      "vagaId": "vaga-1",
      "vagaTitle": "Developer React",
      "vagaDepartment": "Tecnologia",
      "status": "Em Análise",
      "dataCandidatura": "2026-08-20",
      "historico": [
        { "status": "Novo", "data": "2026-08-20", "alteradoPor": "Sistema" },
        { "status": "Em Análise", "data": "2026-08-25", "alteradoPor": "RH" }
      ]
    }
  ]
}
```

**Front-end:** `CandidaturasPage.tsx` (`/candidato/candidaturas`) chama isso

---

### `POST /api/candidaturas`
**Funcionalidade:** Candidato se aplica a uma vaga (Candidato only)

**Requisição:**
```json
{
  "vagaId": "vaga-1"
}
```

**Resposta (201 Created):**
```json
{
  "id": "cand-app-123",
  "candidatoId": "cand-456",
  "vagaId": "vaga-1",
  "status": "Novo",
  "dataCandidatura": "2026-08-29",
  "message": "Candidatura enviada com sucesso!"
}
```

**Front-end:** `VagaDetailPage.tsx` botão "Candidatar-se" chama isso

---

### `GET /api/candidaturas/{id}`
**Funcionalidade:** Detalhe de uma candidatura (RH ou dono)

**Resposta (200 OK):**
```json
{
  "id": "cand-app-1",
  "candidatoId": "cand-1",
  "candidato": {
    "name": "João Silva",
    "email": "joao@email.com",
    "experience": "10+ anos"
  },
  "vagaId": "vaga-1",
  "vaga": {
    "title": "Developer React",
    "department": "Tecnologia"
  },
  "status": "Em Análise",
  "dataCandidatura": "2026-08-20",
  "historico": [
    { "status": "Novo", "data": "2026-08-20", "alteradoPor": "Sistema" },
    { "status": "Em Análise", "data": "2026-08-25", "alteradoPor": "RH" }
  ]
}
```

---

### `PATCH /api/candidaturas/{id}/status`
**Funcionalidade:** Muda status da candidatura (RH only)

**Requisição:**
```json
{
  "status": "Entrevista"
}
```

**Resposta (200 OK):**
```json
{
  "id": "cand-app-1",
  "status": "Entrevista",
  "historico": [
    { "status": "Novo", "data": "2026-08-20", "alteradoPor": "Sistema" },
    { "status": "Em Análise", "data": "2026-08-25", "alteradoPor": "RH" },
    { "status": "Entrevista", "data": "2026-08-29", "alteradoPor": "RH" }
  ]
}
```

**Front-end:** Dropdown de status na lista de candidaturas

---

## 📚 ExperienciasController — `/api/experiencias`

Gerencia experiências profissionais do candidato.

### `GET /api/experiencias`
**Funcionalidade:** Lista experiências do candidato logado

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": "exp-1",
      "empresa": "Acme Corp",
      "cargo": "Senior Developer",
      "dataInicio": "2020-01-15",
      "dataFim": "2026-08-29",
      "descricao": "Desenvolvimento em React e Node.js"
    },
    {
      "id": "exp-2",
      "empresa": "StartupXYZ",
      "cargo": "Developer",
      "dataInicio": "2018-06-01",
      "dataFim": "2019-12-31",
      "descricao": "Full-stack development"
    }
  ],
  "totalMeses": 96
}
```

**Front-end:** `PerfilPage.tsx` (`/candidato/perfil`) carrega para mostrar lista + total

---

### `POST /api/experiencias`
**Funcionalidade:** Adiciona experiência profissional (Candidato only)

**Requisição:**
```json
{
  "empresa": "Acme Corp",
  "cargo": "Senior Developer",
  "dataInicio": "2020-01-15",
  "dataFim": "2026-08-29",
  "descricao": "Desenvolvimento em React e Node.js"
}
```

**Resposta (201 Created):**
```json
{
  "id": "exp-123",
  "empresa": "Acme Corp",
  "cargo": "Senior Developer",
  "totalMesesAgora": 96
}
```

**Front-end:** Form de adicionar experiência em `PerfilPage.tsx`

---

### `PUT /api/experiencias/{id}`
**Funcionalidade:** Edita experiência (Candidato only)

**Requisição:**
```json
{
  "empresa": "Acme Corp",
  "cargo": "Senior Developer",
  "dataInicio": "2020-01-15",
  "dataFim": "2026-08-30"
}
```

**Resposta (200 OK):**
```json
{
  "id": "exp-1",
  "empresa": "Acme Corp",
  "totalMesesAgora": 97
}
```

---

### `DELETE /api/experiencias/{id}`
**Funcionalidade:** Deleta experiência (Candidato only)

**Resposta (204 No Content ou 200 OK)**

---

## 📊 DashboardController — `/api/dashboard`

Endpoints para dashboards e relatórios (RH only).

### `GET /api/dashboard/resumo`
**Funcionalidade:** KPIs principais

**Resposta (200 OK):**
```json
{
  "totalCandidatos": 42,
  "vagasAbertas": 5,
  "emProcesso": 12,
  "aprovados": 8
}
```

**Front-end:** `DashboardPage.tsx` carrega para montar KPI cards

---

### `GET /api/dashboard/candidaturas-por-mes`
**Funcionalidade:** Série histórica (últimos 6 meses)

**Resposta (200 OK):**
```json
{
  "data": [
    { "month": "Mar", "candidatos": 8, "contratados": 2 },
    { "month": "Abr", "candidatos": 12, "contratados": 3 },
    { "month": "Mai", "candidatos": 10, "contratados": 2 },
    { "month": "Jun", "candidatos": 15, "contratados": 4 },
    { "month": "Jul", "candidatos": 18, "contratados": 5 },
    { "month": "Ago", "candidatos": 20, "contratados": 6 }
  ]
}
```

**Front-end:** `DashboardPage.tsx` carrega para BarChart recharts

---

### `GET /api/dashboard/funil-status`
**Funcionalidade:** Breakdown de candidaturas por status

**Resposta (200 OK):**
```json
{
  "data": [
    { "status": "Novo", "count": 5 },
    { "status": "Em Análise", "count": 12 },
    { "status": "Entrevista", "count": 8 },
    { "status": "Aprovado", "count": 4 },
    { "status": "Reprovado", "count": 13 }
  ]
}
```

**Front-end:** `DashboardPage.tsx` carrega para breakdown card

---

## 🎯 VagasRankingController (novo) — `/api/vagas/{id}/ranking`

Endpoint de ranking (implementar na Fase 4).

### `GET /api/vagas/{id}/ranking`
**Funcionalidade:** Lista candidatos de uma vaga ordenados por score (Fase 4)

**Query params:**
- `sortBy=score` (default), `sortBy=nome`, `sortBy=data`
- `filterHabilidades=` (opcional) — filtrar por habilidades

**Resposta (200 OK):**
```json
{
  "vaga": {
    "id": "vaga-1",
    "title": "Developer React"
  },
  "candidatos": [
    {
      "candidaturaId": "cand-app-1",
      "candidatoId": "cand-1",
      "candidatoName": "João Silva",
      "experienciaMeses": 120,
      "habilidadesMatch": ["React", "TypeScript", "Node.js"],
      "habilidadesMissing": ["GraphQL"],
      "matchScore": 95,
      "status": "Em Análise",
      "dataCandidatura": "2026-08-20"
    },
    {
      "candidaturaId": "cand-app-2",
      "candidatoId": "cand-2",
      "candidatoName": "Maria Santos",
      "experienciaMeses": 60,
      "habilidadesMatch": ["React"],
      "habilidadesMissing": ["TypeScript", "Node.js"],
      "matchScore": 45,
      "status": "Novo",
      "dataCandidatura": "2026-08-25"
    }
  ]
}
```

---

## 📝 HabilidadesController — `/api/habilidades`

Gerencia habilidades (skills).

### `GET /api/habilidades?busca=react`
**Funcionalidade:** Autocomplete de habilidades

**Resposta (200 OK):**
```json
{
  "data": [
    { "id": "hab-1", "nome": "React" },
    { "id": "hab-2", "nome": "React Native" },
    { "id": "hab-3", "nome": "Reactive Programming" }
  ]
}
```

**Front-end:** Componentes de input de habilidades (seções de cadastro, perfil)

---

### `POST /api/habilidades`
**Funcionalidade:** Cria nova habilidade (auto-criar se não existir)

**Requisição:**
```json
{
  "nome": "GraphQL"
}
```

**Resposta (201 Created ou 200 OK se já existe):**
```json
{
  "id": "hab-123",
  "nome": "GraphQL"
}
```

---

## 🔒 Autorização por endpoint

| Endpoint | Público | RH | Candidato | Admin |
|---|---|---|---|---|
| `POST /api/auth/login` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/auth/registrar` | ✅ | ❌ | ❌ | ❌ |
| `POST /api/auth/refresh` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/auth/logout` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/vagas?status=Aberta` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/vagas` (todas) | ❌ | ✅ | ❌ | ✅ |
| `GET /api/vagas/{id}` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/vagas` | ❌ | ✅ | ❌ | ✅ |
| `PUT /api/vagas/{id}` | ❌ | ✅ | ❌ | ✅ |
| `GET /api/candidatos` | ❌ | ✅ | ❌ | ✅ |
| `GET /api/candidatos/{id}` | ❌ | ✅ | Próprio | ✅ |
| `POST /api/candidatos` | ❌ | ✅ | ❌ | ✅ |
| `PATCH /api/candidatos/{id}/status` | ❌ | ✅ | ❌ | ✅ |
| `GET /api/candidaturas` | ❌ | ✅ | Próp. | ✅ |
| `GET /api/candidaturas/me` | ❌ | ❌ | ✅ | ❌ |
| `POST /api/candidaturas` | ❌ | ❌ | ✅ | ❌ |
| `PATCH /api/candidaturas/{id}/status` | ❌ | ✅ | ❌ | ✅ |
| `GET /api/experiencias` | ❌ | ❌ | ✅ (próprio) | ✅ |
| `POST /api/experiencias` | ❌ | ❌ | ✅ | ✅ |
| `GET /api/dashboard/*` | ❌ | ✅ | ❌ | ✅ |
| `GET /api/habilidades?busca=` | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Checklist de implementação

### Fase 0
- [ ] `POST /api/auth/login` + registro de usuário
- [ ] `POST /api/auth/registrar`
- [ ] `POST /api/auth/refresh`
- [ ] `POST /api/auth/logout`
- [ ] Tabelas: `Usuario`, `Vaga`, `Candidato` básicas

### Fase 1
- [ ] `GET /api/vagas`
- [ ] `POST /api/vagas`
- [ ] `PUT /api/vagas/{id}`
- [ ] `GET /api/candidatos`
- [ ] `POST /api/candidatos`
- [ ] `PATCH /api/candidatos/{id}/status`
- [ ] `GET /api/dashboard/resumo`
- [ ] `GET /api/dashboard/candidaturas-por-mes`
- [ ] `GET /api/dashboard/funil-status`

### Fase 2
- [ ] `GET /api/candidaturas`
- [ ] `POST /api/candidaturas`
- [ ] `PATCH /api/candidaturas/{id}/status`
- [ ] Tabela: `HistoricoStatusCandidatura` com audit

### Fase 3
- [ ] `GET /api/experiencias`
- [ ] `POST /api/experiencias`
- [ ] `PUT /api/experiencias/{id}`
- [ ] `DELETE /api/experiencias/{id}`
- [ ] Upload de PDF (integração storage)
- [ ] `GET /api/habilidades?busca=`

### Fase 4
- [ ] `GET /api/vagas/{id}/ranking`
- [ ] Cálculo de score de matching

---

**Documento gerado:** 29/08/2026  
**Versão:** 1.0  
**Próxima atualização:** Conforme endpoints forem implementados
