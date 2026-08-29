# 📊 Status Visual — Implementação Front-end vs. Back-end

## Resumo executivo em uma página

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TALENTBASE — STATUS GERAL                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Front-end React:      ████████████████████████░░░ 85%              │
│  Back-end C#/.NET:     ░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%               │
│  Integração Front↔Back: ░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%              │
│  Documentação:         ██████████████████░░░░░░░░░░ 70%              │
│                                                                      │
│  MVP Estimado:         40–50 dias úteis (1 dev .NET + 1 dev React) │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Por funcionalidade — Detalhe

### 🔐 Autenticação

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Tela de login** | ✅ Completa | 🔴 Não existe | 🟡 Bloqueado |
| **Tela de cadastro** | ✅ Completa | 🔴 Não existe | 🟡 Bloqueado |
| **Mock de usuários** | ✅ Funcional | 🔴 N/A | 🟢 OK (demo) |
| **JWT Bearer** | ⚠️ Estrutura | 🔴 Não existe | 🟡 Bloqueado |
| **Refresh token** | ⚠️ Estrutura | 🔴 Não existe | 🟡 Bloqueado |
| **Rate limiting (brute force)** | N/A | 🔴 Não existe | 🟡 Security |

**Impacto bloqueador:** SIM — tudo depende de auth real

---

### 👥 Gerenciar Candidatos (RH)

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Listar candidatos** | ✅ Tabela pronta | 🔴 Não existe | 🟡 Bloqueado |
| **Busca por nome/e-mail** | ✅ Filtro pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Filtro por status** | ✅ Pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Filtro por departamento** | ✅ Pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Editar status (dropdown)** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Detalhe candidato** | 🔴 Não existe | 🔴 Não existe | 🔴 Crítico |
| **Adicionar observações** | ⚠️ Campo existe | 🔴 Não existe | 🟡 Bloqueado |
| **Excluir/arquivar** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |

**Impacto bloqueador:** SIM — nenhuma CRUD de candidatos funciona sem back-end

---

### 💼 Gerenciar Vagas (RH)

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Listar vagas** | ✅ Grid pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Criar vaga** | ⚠️ Form não existe | 🔴 Não existe | 🔴 Crítico |
| **Editar vaga** | ⚠️ Form não existe | 🔴 Não existe | 🔴 Crítico |
| **Ver detalhe** | ✅ Layout pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Encerrar vaga** | ⚠️ Campo status | 🔴 Não existe | 🟡 Bloqueado |

**Impacto bloqueador:** SIM — RH não consegue gerenciar vagas

---

### 🎯 Candidaturas (Pipeline)

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Máquina de estados** | ✅ Implementada | 🔴 Não existe | 🟡 Bloqueado |
| **Histórico de status** | ✅ Estrutura | 🔴 Não existe | 🟡 Bloqueado |
| **Mudar status (RH)** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Candidato se aplicar** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Ver minhas candidaturas** | ✅ Pronto | 🔴 Não existe | 🟡 Bloqueado |

**Impacto bloqueador:** SIM — pipeline inteiro é mock

---

### 📚 Portal do Candidato

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Vitrine pública de vagas** | ✅ Carrossel pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Filtros (cargo, depto., local)** | ✅ Estrutura | 🔴 Não existe | 🟡 Bloqueado |
| **Detalhe da vaga** | ✅ Layout pronto | 🔴 Não existe | 🟡 Bloqueado |
| **Botão "Candidatar-se"** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Perfil de candidato** | ✅ Seções prontas | 🔴 Não existe | 🟡 Bloqueado |
| **CRUD de experiências** | ✅ Funcional (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Upload de PDF** | ⚠️ Campo, sem integração | 🔴 Não existe | 🔴 Crítico |

**Impacto bloqueador:** SIM — portal inteiro é mockado

---

### 📊 Dashboard (RH)

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **KPI cards** | ✅ Calcula (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Gráfico candidatos/mês** | ✅ Recharts (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Funil por status** | ✅ Breakdown (mock) | 🔴 Não existe | 🟡 Bloqueado |
| **Lista recentes** | ✅ Exibe (mock) | 🔴 Não existe | 🟡 Bloqueado |

**Impacto bloqueador:** NÃO-CRÍTICO — dashboard é visual, dados mensageiros. Funciona bem com mock.

---

### 🎓 Ranking de Candidatos (Future)

| Funcionalidade | Front-end | Back-end | Status |
|---|---|---|---|
| **Tela de ranking** | 🔴 Não existe | 🔴 Não existe | 🔴 Adiada (Fase 4) |
| **Cálculo de score** | ⚠️ Lógica esboçada | 🔴 Não existe | 🔴 Adiada (Fase 4) |
| **Filtro por habilidades** | 🔴 Não existe | 🔴 Não existe | 🔴 Adiada (Fase 4) |

**Impacto bloqueador:** NÃO — Feature, não MVP. Pode ser adicionada na Fase 4.

---

## Quadro de progresso por semana (estimado)

```
SEMANA 1 — Back-end Fase 0
┌─────────────────────────────┐
│ [███░░░░░░░░░░░░░░░░░░] 15% │  Setup .NET + EF + DB schema
│ Tarefas:                    │
│ - Criar solução .NET        │
│ - Tables: Empresa, Usuario  │
│ - Identity + JWT config     │
└─────────────────────────────┘

SEMANA 2 — Back-end Fase 1 + Front-end integração
┌─────────────────────────────┐
│ BACK: [██████░░░░░░░░░░░░] 30% │  AuthController + CRUD Vagas
│ FRONT: [█████░░░░░░░░░░░░░░] 25% │  Axios + React Query setup
└─────────────────────────────┘

SEMANA 3 — Back-end Fase 2 + integração
┌─────────────────────────────┐
│ BACK: [█████████░░░░░░░░░░] 45% │  CandidatosController + Dash
│ FRONT: [███████░░░░░░░░░░░░] 35% │  Login + Dashboard funcionando
└─────────────────────────────┘

SEMANA 4 — Back-end Fase 3 + integração candidato
┌─────────────────────────────┐
│ BACK: [██████████░░░░░░░░░] 60% │  ExperienciasController
│ FRONT: [██████████░░░░░░░░░] 50% │  Perfil + Candidaturas ok
└─────────────────────────────┘

SEMANA 5 — Back-end Fase 4 + refinamentos
┌─────────────────────────────┐
│ BACK: [███████████░░░░░░░░] 75% │  Ranking + Habilidades
│ FRONT: [██████████░░░░░░░░░] 60% │  Detalhe candidato + forms
└─────────────────────────────┘

SEMANA 6–7 — QA + Deploy
┌─────────────────────────────┐
│ BACK: [████████████░░░░░░░] 85% │  Testes + observabilidade
│ FRONT: [███████████░░░░░░░░] 75% │  Testes + responsividade
└─────────────────────────────┘

SEMANA 7–8 — Produção
┌─────────────────────────────┐
│ TOTAL: [████████████████░░░] 90% │  MVP em produção
│ Pendente: Features nice-to-have (Fase 3+)
└─────────────────────────────┘
```

---

## Recursos necessários

### Equipe recomendada

```
┌──────────────────────────────────────────┐
│ Back-end (C# / .NET)                     │
├──────────────────────────────────────────┤
│ • 1 dev senior (.NET) → 50% do tempo     │
│ • Conhecimento: EF Core, JWT, SQL        │
│ • ~280 horas (~7 semanas full-time)      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Front-end (React / TypeScript)           │
├──────────────────────────────────────────┤
│ • 1 dev pleno (React) → 50% do tempo     │
│ • Conhecimento: React Router, Axios, UI  │
│ • ~140 horas (~3.5 semanas full-time)    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ DevOps / Infra                           │
├──────────────────────────────────────────┤
│ • Preparar: Docker, CI/CD, DNS, SSL      │
│ • Pode ser paralelo (~20 horas)          │
└──────────────────────────────────────────┘

Total: ~1.5 dev-months (2 devs, 5–7 semanas)
```

---

## Dependências críticas (ordem de descongelamento)

```
1️⃣  BACK: POST /api/auth/login
    ↓ (Desbloqueador para tudo)
    
2️⃣  FRONT + BACK integração auth
    ↓
    
3️⃣  BACK: GET /api/vagas (pública) + GET /api/candidatos (RH)
    ↓
    
4️⃣  FRONT: Telas conectadas ao back
    ↓
    
5️⃣  BACK: POST /api/candidatos, POST /api/vagas, CRUD completo
    ↓
    
6️⃣  Testes e5️⃣e2e
    ↓
    
7️⃣  Deploy MVP
```

---

## Status de cada tela — Matriz

```
                   FRONT-END                    BACK-END              TODO
┌────────────────────────────────────────────────────────────────────────┐
│ /login           ✅ Estrutura 100%           🔴 Não existe      Conectar auth
│ /cadastro        ✅ Form 100%                🔴 Não existe      POST /registrar
│ /                ✅ UI 100%                  🔴 Não existe      GET /vagas?open
│ /vaga/:id        ✅ UI 90%                   🔴 Não existe      GET /vagas/{id}
│ /rh/dashboard    ✅ Funcional 100% (mock)    🔴 Não existe      GET /dashboard/*
│ /rh/candidatos   ✅ Tabela 90%               🔴 Não existe      GET /candidatos
│ /rh/vagas        ✅ Grid 90%                 🔴 Não existe      GET /vagas (RH)
│ /rh/cadastrar    ✅ Funcional 100% (mock)    🔴 Não existe      POST /candidatos
│ /candidato/...   ✅ UI 80%                   🔴 Não existe      GET /experiencias
│ /candidato/cand. ✅ UI 80%                   🔴 Não existe      GET /candidaturas/me
│ Ranking          🔴 Não existe               🔴 Não existe      Adiado (Fase 4)
│ Detalhe Cand.    🔴 Não existe               🔴 Não existe      Adiado
│ Criar/Edit Vaga  🔴 Form não existe          🔴 Não existe      Adiado
└────────────────────────────────────────────────────────────────────────┘
```

---

## Recomendação final

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✅ O front-end está 85% pronto para uso real.                  │
│  ❌ O back-end não existe e é 100% bloqueador.                  │
│                                                                  │
│  PRÓXIMA AÇÃO:                                                   │
│  → Iniciar desenvolvimento do back-end HOJE (Fase 0)           │
│  → Front-end fica parado até que auth real funcione           │
│  → Integração começa na Semana 2                              │
│                                                                  │
│  Estimativa total: 6–7 semanas com 2 devs                      │
│  Primeiro MVP: Final da Semana 5                              │
│  Pronto para produção: Semana 7–8                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Gerado:** 29/08/2026  
**Próxima atualização:** Após primeira sprint do back-end
