# TalentBase

Portal de vagas e painel de recrutamento. Front-end independente, construído do zero em React + TypeScript + Tailwind CSS — **não** utiliza nenhum código, tema ou estrutura gerados pelo Figma.

## Rodando o projeto

```bash
npm install
cp .env.example .env   # opcional por enquanto — ver seção "Integração com a API"
npm run dev
```

Abre em `http://localhost:5173`.

### Contas de demonstração (login mockado)

| Papel | E-mail | Senha |
|---|---|---|
| RH | `rh@empresa.com.br` | qualquer senha |
| Candidato | `ana.mendes@email.com` | qualquer senha |

## Arquitetura

```text
src/
├── assets/        # imagens/ícones estáticos (vazio por enquanto)
├── components/
│   ├── ui/        # componentes genéricos: Button, Input, Select, Modal, Card, Badge...
│   ├── domain/    # componentes que conhecem regras de negócio: Avatar, StatusBadge...
│   └── layout/    # Navbar, Sidebar
├── contexts/      # estado global em React Context (Auth, Data)
├── hooks/         # useAuth, useAppData, useJobRanking — porta de entrada dos contexts
├── layouts/       # PublicLayout, HRLayout, CandidateLayout
├── pages/         # uma pasta por área (raiz, hr/, candidate/)
├── routes/        # AppRoutes.tsx (árvore de rotas) + ProtectedRoute.tsx (guarda de acesso)
├── services/      # camada de acesso a dados — ver abaixo
├── types/         # interfaces TypeScript por domínio
└── utils/         # formatação, cálculo de experiência, opções de domínio, dados mockados
```

### Por que essa separação

- **`pages/` não fala com dados diretamente.** Toda página usa os hooks `useAuth()`/`useAppData()`, nunca importa de `services/` ou `utils/mockDatabase.ts`.
- **`contexts/` não sabe de onde os dados vêm.** `DataContext` chama funções de `services/*.ts` e guarda o resultado em `useState`; ele não sabe se por trás existe um mock ou uma API real.
- **`services/` é a única camada que hoje "sabe" que os dados são mockados.** Cada arquivo em `services/` expõe funções `async` (`listCandidates()`, `applyToJob()`, `updateJob()`...) que hoje leem/escrevem em `utils/mockDatabase.ts`, simulando latência de rede com `simulateLatency()`.

Isso significa que **nada em `pages/`, `components/` ou `contexts/` precisa mudar** quando o back-end em C# / ASP.NET Core estiver pronto — só o conteúdo de `services/`.

## Integração futura com a API (C# / ASP.NET Core)

Hoje, por exemplo, `src/services/candidateService.ts` tem:

```ts
export async function listCandidates(): Promise<Candidate[]> {
  return simulateLatency([...candidatesStore]);
}
```

Quando a API existir, essa função passa a ser:

```ts
export async function listCandidates(): Promise<Candidate[]> {
  const res = await fetch(`${API_BASE_URL}/api/candidatos`, { headers: authHeaders() });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}
```

A URL base já é lida de uma variável de ambiente (`VITE_API_BASE_URL`, ver `.env.example`) em `src/services/api.ts`. Nenhuma página precisa ser tocada — todas continuam chamando `useAppData().candidates` normalmente.

O mesmo vale para autenticação (`src/services/authService.ts`): hoje ele apenas confere um e-mail contra uma lista fixa; quando existir `POST /api/auth/login`, é só trocar o corpo da função e guardar o token retornado (há um placeholder em `authHeaders()` já esperando por isso).

### Ordem sugerida para conectar o back-end

1. `services/authService.ts` → `POST /api/auth/login`
2. `services/vacancyService.ts` → `GET/POST/PUT /api/vagas`, `GET /api/vagas/{id}/ranking`
3. `services/candidateService.ts` → `GET/PATCH/DELETE /api/candidatos`
4. `services/applicationService.ts` → `GET/POST/PATCH /api/candidaturas`
5. `services/userService.ts` → `GET/PUT /api/perfil`, `/api/experiencias`

## Funcionalidades

Tudo que existia no protótipo anterior foi preservado:

- **Portal público:** vitrine de vagas com busca e filtros (departamento, modalidade, contrato), detalhe da vaga, candidatura com validações (login obrigatório, evita duplicidade, bloqueia vaga encerrada e usuários RH).
- **Cadastro/login de candidato** com consentimento LGPD.
- **Painel de RH:** dashboard com KPIs e gráfico, lista de candidatos com busca/filtros/paginação e painel de detalhe, cadastro manual de candidato, CRUD de vagas (modal) e ranking de candidatos por vaga (modal), calculado pela mesma regra de antes (experiência mínima + meses de experiência).
- **Portal do candidato:** edição de perfil, gestão de experiências profissionais (com cálculo automático do tempo total, unindo intervalos sobrepostos), acompanhamento de candidaturas com histórico de status.

## Decisões de manutenção

- **Cores, fontes e espaçamentos** ficam centralizados em `tailwind.config.js` (paleta `ink`/`accent`/`amber`/etc. e fontes `display`/`sans`/`mono`) — trocar a marca é editar um arquivo só.
- **Aparência de status** (candidatura e vaga) fica em `utils/statusConfig.ts` — mudar uma cor não exige caçar `className` espalhados pelas páginas.
- **Opções de formulário** (departamentos, modalidades, tipos de contrato, status) ficam em `utils/domainOptions.ts`.
- Todos os formulários usam os mesmos componentes (`components/ui/Input`, `Select`, `Textarea`, `Button`), então um ajuste visual em um desses arquivos reflete em todo o sistema.
