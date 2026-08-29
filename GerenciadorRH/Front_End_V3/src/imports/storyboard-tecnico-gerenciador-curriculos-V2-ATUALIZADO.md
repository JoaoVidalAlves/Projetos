# Storyboard Técnico — Gerenciador de Currículos ("TalentBase")

**Documento:** Storyboard técnico e arquitetural
**Front-end analisado:** `Job_Prospecting_Dashboard.zip` (export React/TypeScript gerado pelo Figma Make)
**Back-end proposto:** C# / ASP.NET Core Web API
**Banco de dados:** relacional (SQL Server ou PostgreSQL)

> **Nota de revisão (após leitura direta do código-fonte):** esta versão corrige pontos em que a análise V2 estava desatualizada. Em especial: **criação/edição de vaga** e **ranking de candidatos por vaga** já estão implementados no protótipo (como modais em `VagasPage.tsx`), não são mais itens pendentes; o "detalhe de candidato (RH)" existe como um **painel lateral inline** em `CandidatosPage.tsx` (não uma rota separada) e ainda falta observações/histórico nele; o formulário de cadastro manual de currículo (`CadastrarPage.tsx`) tem **2 seções**, não 3 (não existe seção de observações); e `date-fns` já está instalado, enquanto `zod` ainda não.

---

## 0. Contexto e premissas (o que foi encontrado no anexo) — **ATUALIZADO EM ANÁLISE V2**

O ZIP contém **código React/TypeScript totalmente funcional** do protótipo Figma (Figma Make), nomeado **"Job Prospecting Dashboard"** (marca interna no app: **TalentBase**). Stack confirmada: React 18 + TypeScript + Vite + Tailwind CSS 4 + Radix UI/shadcn + `recharts` + `lucide-react` + `react-router` (v7).

**IMPORTANTE — Mudança significativa em relação ao storyboard anterior:**

A análise anterior assumiu que o front-end continha apenas as 4 telas de RH. **Na verdade, o código implementado já inclui estrutura de rotas completa, layouts separados para RH/Candidato, e telas parcialmente desenvolvidas para:**
- ✅ Login (`/login`)
- ✅ Cadastro (`/cadastro`)
- ✅ Portal público de vagas (`/` — vitrine)
- ✅ Detalhe de vaga (`/vaga/:id`)
- ✅ Perfil do candidato (`/candidato/perfil`)
- ✅ Candidaturas do candidato (`/candidato/candidaturas`)
- ✅ Dashboard RH (`/rh/dashboard`) — **já implementada**
- ✅ Candidatos RH (`/rh/candidatos`)
- ✅ Vagas RH (`/rh/vagas`)
- ✅ Cadastrar currículo manual RH (`/rh/cadastrar`) — **já implementada**

**Premissas validadas/ajustadas:**

1. **O front já suporta autenticação com dois perfis (RH e Candidato).** A lógica existe em `context.tsx` com `AuthUser` (role: `RH` | `Candidato`), mas ainda é mock-based (validação contra `DEMO_ACCOUNTS`). Integração com API C#/.NET é o próximo passo.
2. **Candidatura agora é uma entidade de primeira classe** (`Candidatura` em `types.ts`), com vínculo real `candidatoId` + `vagaId`. O sistema já mantém histórico de status (`historico: { status, data, alteradoPor }`).
3. **Experiências profissionais já modeladas** — `Experiencia[]` por candidato, com cálculo de tempo total em meses via `calcularMesesTotais()` (seção 5.2). Isso **já implementa o Caminho A** (datas reais, não faixas) no contexto de dados.
4. **Entidade `Empresa` ainda está fora do escopo do front** — o sistema continua mono-tenant a nível de UI (não há seletor de empresa). No back-end (C# — seção 4), será modelada como tabela, mas sem UI de gestão por enquanto.

O documento agora foca em **O QUE AINDA FALTA** — principalmente integração com API real e refinamentos nas telas parcialmente implementadas — em vez de propor tudo do zero.

---

## 1. Fluxos principais de usuário

### 1.1 Fluxo do RH (já mapeado no protótipo)

1. **Login** (perfil RH) → redireciona para o **Dashboard**.
2. **Dashboard**: visão geral (KPIs, gráfico "Candidatos por Mês", funil de status, últimas 5 candidaturas) → ponto de partida para navegar a Candidatos ou Vagas.
3. **Gerenciar Vagas**: criar/editar/encerrar uma vaga (tela nova — o protótipo só lista) → vaga aberta passa a aparecer no portal público do candidato.
4. **Gerenciar Candidatos**: buscar/filtrar por nome, status ou departamento → alterar status inline (dropdown) → adicionar observações → excluir/arquivar.
5. **Cadastro manual de currículo**: quando o RH recebe um currículo por fora do sistema (e-mail, indicação, LinkedIn) → preenche o formulário em 3 seções (pessoal, profissional, observações) → candidato entra com status **Novo**.
6. **Ranquear candidatos de uma vaga**: RH abre uma vaga específica e visualiza os candidatos ordenados por tempo de experiência (e outros critérios), para priorizar quem entrevistar primeiro (seção 5).

**Máquina de estados da candidatura** (já implícita no protótipo, formalizada aqui):

```
Novo → Em Análise → Entrevista → Aprovado
                                → Reprovado
```
`Aprovado` e `Reprovado` são estados finais. `Reprovado` pode ocorrer a partir de qualquer estágio anterior (não precisa passar por Entrevista).

### 1.2 Fluxo do candidato (proposto — não existe no protótipo)

1. Acessa a **vitrine pública de vagas** (sem login) → filtra por cargo, departamento, localização, modalidade → abre o detalhe de uma vaga.
2. **Cria conta / login** (perfil Candidato) — pode ser motivado pelo botão "Candidatar-se".
3. Completa o **perfil**: dados pessoais, **experiências profissionais** (empresa, cargo, data início/fim — a fonte real do tempo de experiência), habilidades, upload do currículo em PDF.
4. **Candidata-se** a uma vaga específica (cria um registro de `Candidatura`, diferente do cadastro manual do RH, que hoje não gera esse vínculo).
5. Acompanha o **status da candidatura** em "Minhas Candidaturas" (somente leitura) — mesma máquina de estados da seção 1.1.
6. Recebe notificação (e-mail, e opcionalmente in-app) a cada mudança de status ou convite de entrevista.

---

## 2. Principais telas e componentes (Front-end React atual)

### 2.1 ✅ Já implementadas (com código real em `/src/app/pages`)

| Tela | Status | Componentes principais |
|---|---|---|
| **Dashboard RH** (`/rh/dashboard`) | ✅ **Pronto** | 4 KPI cards (Total, Vagas Abertas, Em Processo, Aprovados); gráfico de barras `<BarChart>` recharts (últimos 6 meses); card "Por Status" com breakdown; lista "Candidatos Recentes" (últimas 5) |
| **Cadastrar Currículo RH** (`/rh/cadastrar`) | ✅ **Pronto** | Formulário 3 seções: (1) Dados Pessoais (nome*, e-mail*, tel., cidade/UF); (2) Dados Profissionais (vaga*, departamento*, experiência em faixas, habilidades); (3) Observações → validação inline + sucesso |
| **Candidatos RH** (`/rh/candidatos`) | ⚠️ **Funcional (mock), falta detalhe completo** | Tabela com avatar, nome, depto., candidatura, status (dropdown editável), ações (excluir); busca por nome/posição/e-mail; filtros por status e departamento. Ao clicar na linha, abre um **painel lateral de detalhe** (não é uma rota própria) com dados de contato, experiência, habilidades e um "score badge" com meses de experiência (Caminho B). O painel **não tem** campo de observações do RH nem histórico de mudanças de status. |
| **Vagas RH** (`/rh/vagas`) | ✅ **Funcional (mock), CRUD completo** | Grid de cards com título, depto., tipo, status, local, data, nº de vagas/candidatos e badge de exp. mínima. Busca por título + filtro por status. Botão **"Nova vaga"** e **"Editar"** abrem um modal (`JobModal`) com formulário completo (título, depto., localização, modalidade, contrato, nº de vagas, status, exp. mínima em meses, habilidades, descrição) que já chama `createJob()`/`updateJob()` do contexto. Botão **"Ranking"** abre um painel (`RankingPanel`) que ordena os candidatos da vaga por status "atende requisito" (Seção 5.3) e depois por meses de experiência (Caminho B) — **não é uma rota dedicada**, é um modal dentro da própria página. |
| **Login** (`/login`) | ✅ **Estrutura completa** | Form e-mail + senha; roteamento por role (RH → `/rh/dashboard`, Candidato → `/candidato/perfil`); demo accounts: `rh@empresa.com.br` / `ana.mendes@email.com` |
| **Cadastro** (`/cadastro`) | ⚠️ **Estrutura pronta, API pendente** | Form básico para registrar novo candidato; redirect ao perfil após sucesso |
| **Portal Vitrine** (`/`) | ⚠️ **Estrutura, lógica de filtros parcial** | Cards de vagas com filtros (cargo, depto., local, modalidade); busca por texto. Acesso público (sem login) |
| **Detalhe da Vaga** (`/vaga/:id`) | ⚠️ **Estrutura, falta "Candidatar-se"** | Mostra vaga completa; botão "Candidatar-se" redireciona a `/login` se anônimo |
| **Perfil Candidato** (`/candidato/perfil`) | ⚠️ **Estrutura pronta, CRUD parcial** | Dados pessoais + seção de experiências (add/edit/delete). Cálculo de meses totais já funciona via `calcularMesesTotais()`. Falta upload de PDF. |
| **Minhas Candidaturas** (`/candidato/candidaturas`) | ⚠️ **Estrutura pronta, lógica parcial** | Lista de candidaturas do usuário com status, data, botão para ver detalhe (histórico de status). |

Layouts: `PublicLayout` (sem sidebar), `RhLayout` (sidebar RH), `CandidatoLayout` (sidebar candidato).

### 2.2 ⚠️ Em desenvolvimento (estrutura criada, faltam refinamentos)

**Atualização importante:** ao contrário do que a análise anterior indicava, **"Criar/Editar Vaga" e "Ranking de Candidatos" já existem no protótipo** — implementados como modais dentro de `VagasPage.tsx`, não como rotas dedicadas. O que falta é menor do que o storyboard anterior sugeria:

| Tela | O que existe | O que falta |
|---|---|---|
| **Detalhe Candidato (RH)** | Painel lateral inline em `CandidatosPage.tsx` (abre ao clicar na linha): dados de contato, experiência, habilidades, status editável, score badge. Sem rota própria. | Campo de **observações do RH** (editável), **histórico de mudanças de status** (timeline), ação "Arquivar" (só existe "Excluir"), e opcionalmente uma rota dedicada `/rh/candidatos/:id` para deep-link/compartilhamento |
| **Criar/Editar Vaga (RH)** | ✅ **Já implementado** — modal `JobModal` em `VagasPage.tsx`, com formulário completo (título, depto., localização, modalidade, tipo, vagas, status, exp. mínima, habilidades, descrição) chamando `createJob()`/`updateJob()` | Validação mais robusta (hoje só `required` básico do `react-hook-form`); campo de salário (não existe no tipo `Job`); rota dedicada opcional (`/rh/vagas/:id/editar`) para linkar diretamente |
| **Ranking de Candidatos por Vaga (RH)** | ✅ **Já implementado** — modal `RankingPanel` em `VagasPage.tsx`, aplica exatamente a regra da seção 5.3 (candidatos que atendem a exp. mínima primeiro, depois por meses decrescente, usando Caminho B/`getExpMonths`) | Score de match (%), tags de habilidades correspondentes/faltantes, filtros (por habilidade, status, score mínimo), ordenação alternativa (nome, data), ação rápida de mudar status a partir do ranking, rota dedicada opcional `/rh/vagas/:id/ranking` |

### 2.3 Design system e reutilização

O projeto já traz **shadcn/ui + Tailwind CSS 4** totalmente integrados:
- Componentes usados: `Avatar`, `StatusBadge` (custom em `Shared.tsx`), `Button`, `Select`, `Input`, `Textarea`, `Card`, `Table`, `Dialog`, `Accordion`, `Tabs`, etc.
- Theme tokens em `/src/styles/theme.css` — cores, tipografia, espaçamentos já definidos e prontos para extensão.
- **Todos os novos formulários/telas da seção 2.2 devem reaproveitar esses componentes**, não introduzir estilos inline ou bibliotecas paralelas.

### 2.3 Reaproveitamento de design system

O front-end já traz Radix UI/shadcn (`accordion`, `dialog`, `select`, `tabs`, `table`, `dropdown-menu`, `avatar`, `sonner` para toasts, etc.) totalmente integrados ao Tailwind. Todas as telas novas da seção 2.2 devem reaproveitar esses mesmos componentes e os tokens de tema (`src/styles/theme.css`) para manter consistência visual, em vez de introduzir uma segunda biblioteca de UI.

---

## 3. Requisitos de autenticação — **Front-end + Back-end C#**

### 3.1 Front-end (React) — Situação atual

**Status:** ✅ Contexto auth implementado (mock), ⚠️ Aguardando integração com API real.

O `AuthContext` em `context.tsx` já define:
- `login(email, password)` — valida contra `DEMO_ACCOUNTS`, retorna `{ ok, error? }`
- `logout()` — limpa o usuário
- `user: AuthUser | null` — `{ id, name, email, role }` onde `role: "RH" | "Candidato"`

**Demo accounts atuais:**
```
RH: rh@empresa.com.br (qualquer senha)
Candidato: ana.mendes@email.com (qualquer senha)
```

**Fluxo esperado após integração com API:**

1. **Login (`POST /api/auth/login`):**
   - Entrada: `{ email, password }`
   - Retorno: `{ accessToken, refreshToken, user: { id, name, email, role } }`
   - Front armazena: `accessToken` em memória (variável React), `refreshToken` em cookie `httpOnly`

2. **Refresh (`POST /api/auth/refresh`):**
   - Cookie `httpOnly` enviado automaticamente pelo navegador
   - Retorno: novo `accessToken`
   - Interceptor Axios/fetch anexa token a todo request como `Authorization: Bearer <accessToken>`

3. **Logout (`POST /api/auth/logout`):**
   - Revoga `refreshToken` no banco
   - Limpa estado local (mata `accessToken` em memória)

**O que implementar no front-end:**

- Criar interceptor Axios (ou similar com `fetch`) que:
  - Intercepta 401 → tenta refresh automático
  - Anexa `Authorization: Bearer` header a todos os requests
  - Redireciona a `/login` se refresh falhar
- Atualizar `login()` em `context.tsx` para chamar `POST /api/auth/login` em vez de validar localmente
- `LoginPage` e `CadastroPage` **já usam `react-hook-form`** (biblioteca já no `package.json`); falta apenas trocar a validação básica (`required`, `minLength`) por schemas `zod`, que **ainda precisa ser adicionado ao `package.json`** (não está instalado hoje)

### 3.2 Back-end (C# / ASP.NET Core) — Requisitos

**Tecnologias:**
- ASP.NET Core Identity (gestão de usuários/senhas/roles)
- JWT Bearer (emissão e validação de tokens)
- `System.IdentityModel.Tokens.Jwt` (library Microsoft)

**Perfis e permissões:**
- Roles: `RH`, `Candidato`, `Admin` (opcional, para gerenciar contas de RH)
- `[Authorize(Roles = "RH")]` em endpoints sensíveis
- `[Authorize(Roles = "Candidato")]` em endpoints de candidato
- `[AllowAnonymous]` em endpoints públicos (vagas abertas, login, cadastro)

**Endpoints de autenticação:**
- `POST /api/auth/login` — validar e retornar tokens
- `POST /api/auth/registrar` — criar candidato (self-service)
- `POST /api/auth/refresh` — renovar access token
- `POST /api/auth/logout` — revogar refresh token

**Armazenamento de tokens:**
- Access token: **JWT com TTL 15–60 min** (sem persistência no banco)
- Refresh token: **armazenado com hash** na tabela `RefreshToken` (permite revogação)
- Política de senha: mínimo 8 caracteres, complexidade via `IdentityOptions`
- Rate limiting: `Microsoft.AspNetCore.RateLimiting` no endpoint `/api/auth/login` (proteção força bruta)
- **LGPD**: tela de cadastro do candidato precisa de consentimento explícito de tratamento de dados; prever endpoint de exclusão de conta/dados a pedido do titular (`DELETE /api/candidatos/me`) e política de retenção documentada.
- 2FA para contas RH é uma extensão recomendável (não obrigatória no MVP), dado o volume de dados sensíveis que essas contas acessam.

---

## 4. Modelagem de dados

### 4.1 Entidades principais

| Tabela | Campos-chave | Relacionamentos |
|---|---|---|
| `Empresa` | Id, Nome, CNPJ, Setor, Site | 1:N com `Vaga` |
| `Usuario` | Id, Nome, Email, SenhaHash, EmpresaId (nullable) | 1:1 opcional com `Candidato`; N:1 com `Empresa` (quando RH) |
| `Departamento` | Id, Nome | 1:N com `Vaga`; 0:1 com `Candidato` (área de interesse) |
| `Candidato` | Id, UsuarioId (nullable), Nome, Email, Telefone, Cidade, Estado, CurriculoUrl, PosicaoDesejada, ExperienciaTotalMeses (calculado) | 1:N com `Experiencia`; N:N com `Habilidade`; 1:N com `Candidatura` |
| `Experiencia` | Id, CandidatoId, NomeEmpresa, Cargo, DataInicio, DataFim (nullable) | N:1 com `Candidato` |
| `Vaga` | Id, EmpresaId, DepartamentoId, Titulo, Localizacao, Modalidade, Tipo, VagasDisponiveis, ExperienciaMinimaMeses, Status, DataPublicacao | N:1 com `Empresa`/`Departamento`; 1:N com `Candidatura`; N:N com `Habilidade` |
| `Habilidade` | Id, Nome (unique) | N:N com `Candidato` e `Vaga` |
| `Candidatura` | Id, CandidatoId, VagaId, Status, DataCandidatura, Observacoes | N:1 com `Candidato` e `Vaga`; 1:N com `HistoricoStatusCandidatura`; único por (CandidatoId, VagaId) |
| `HistoricoStatusCandidatura` | Id, CandidaturaId, StatusAnterior, StatusNovo, AlteradoPorUsuarioId, AlteradoEm | N:1 com `Candidatura` |

**Tabelas de junção / extensões opcionais:** `CandidatoHabilidade` e `VagaHabilidade` (N:N puras); `Entrevista` (Id, CandidaturaId, DataHora, Local/Link, EntrevistadorUsuarioId, Status, Feedback) — útil, mas não bloqueia o MVP.

### 4.2 Decisões de modelagem que valem destacar

- **`Empresa` (quem contrata) ≠ `Experiencia.NomeEmpresa` (empregador anterior do candidato).** São conceitos diferentes: a primeira é uma entidade do sistema (tabela `Empresa`, quem publica vagas); a segunda é texto livre dentro de `Experiencia`, já que normalizar os empregadores anteriores dos candidatos como entidades próprias seria engenharia excessiva para o escopo atual.
- **`Candidatura` corrige a falta de FK real entre Candidato e Vaga** observada no protótipo (campo `position` era texto livre). Com isso, perguntas como "quantos candidatos se aplicaram à vaga X" passam a ser uma consulta confiável, não uma comparação de strings.
- **Banco de talentos:** `Candidato` pode existir sem nenhuma `Candidatura` formal — os campos `PosicaoDesejada` (texto) e `DepartamentoInteresseId` no próprio candidato preservam o fluxo de cadastro manual e rápido que já existe no protótipo. Quando o RH vincula formalmente o candidato a uma vaga, cria-se o registro em `Candidatura`.
- **Enums no banco usam identificadores sem acentuação** (`EmAnalise`, `Hibrido`) — o rótulo acentuado (`"Em Análise"`) fica só na camada de apresentação (front-end).

### 4.3 Exemplo de classes C# / EF Core

```csharp
// Models/Candidato.cs
public class Candidato
{
    public int Id { get; set; }
    public int? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? CurriculoUrl { get; set; }

    public string? PosicaoDesejada { get; set; }
    public int? DepartamentoInteresseId { get; set; }

    // Cache calculado a partir de Experiencias — ver seção 5
    public int ExperienciaTotalMeses { get; set; }

    public ICollection<Experiencia> Experiencias { get; set; } = new List<Experiencia>();
    public ICollection<Habilidade> Habilidades { get; set; } = new List<Habilidade>();
    public ICollection<Candidatura> Candidaturas { get; set; } = new List<Candidatura>();

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}

// Models/Experiencia.cs
public class Experiencia
{
    public int Id { get; set; }
    public int CandidatoId { get; set; }
    public Candidato Candidato { get; set; } = null!;

    public string NomeEmpresa { get; set; } = string.Empty; // texto livre (empregador anterior)
    public string Cargo { get; set; } = string.Empty;
    public DateOnly DataInicio { get; set; }
    public DateOnly? DataFim { get; set; } // null = emprego atual
    public string? Descricao { get; set; }
}

// Models/Vaga.cs
public class Vaga
{
    public int Id { get; set; }
    public int EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;
    public int DepartamentoId { get; set; }
    public Departamento Departamento { get; set; } = null!;

    public string Titulo { get; set; } = string.Empty;
    public string Localizacao { get; set; } = string.Empty;
    public ModalidadeTrabalho Modalidade { get; set; }
    public TipoContrato Tipo { get; set; }
    public int VagasDisponiveis { get; set; }
    public int ExperienciaMinimaMeses { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public StatusVaga Status { get; set; } = StatusVaga.Aberta;
    public DateOnly DataPublicacao { get; set; }

    public ICollection<Candidatura> Candidaturas { get; set; } = new List<Candidatura>();
    public ICollection<Habilidade> HabilidadesRequeridas { get; set; } = new List<Habilidade>();
}

// Models/Candidatura.cs
public class Candidatura
{
    public int Id { get; set; }
    public int CandidatoId { get; set; }
    public Candidato Candidato { get; set; } = null!;
    public int VagaId { get; set; }
    public Vaga Vaga { get; set; } = null!;

    public StatusCandidatura Status { get; set; } = StatusCandidatura.Novo;
    public DateTime DataCandidatura { get; set; } = DateTime.UtcNow;
    public string? Observacoes { get; set; }

    public ICollection<HistoricoStatusCandidatura> Historico { get; set; } = new List<HistoricoStatusCandidatura>();
}
```

```csharp
// Data/AppDbContext.cs (trecho relevante)
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Candidatura>()
        .HasIndex(c => new { c.CandidatoId, c.VagaId })
        .IsUnique(); // um candidato não se candidata duas vezes à mesma vaga

    modelBuilder.Entity<Candidato>()
        .HasMany(c => c.Habilidades)
        .WithMany(h => h.Candidatos)
        .UsingEntity(j => j.ToTable("CandidatoHabilidade"));

    modelBuilder.Entity<Vaga>()
        .HasMany(v => v.HabilidadesRequeridas)
        .WithMany(h => h.Vagas)
        .UsingEntity(j => j.ToTable("VagaHabilidade"));
}
```

---

## 5. Regras de ranqueamento por tempo de experiência

### 5.1 Como medir "tempo de experiência"

Duas fontes possíveis, e o time precisa decidir entre elas (ou oferecer as duas):

- **Caminho A — recomendado:** substituir o `<select>` de faixas fixas do formulário atual por um CRUD real de `Experiencia` (empresa, cargo, data início/fim). O tempo total é **calculado**, não digitado — muito mais preciso, e é o que sustenta um ranqueamento confiável.
- **Caminho B — atalho de curto prazo:** manter o `<select>` de faixas como está hoje e mapear cada faixa para um valor numérico mínimo em meses (`"Menos de 1 ano"` → 0, `"5 anos"` → 60, `"10+ anos"` → 120). Zero mudança de UI, porém menos preciso (não captura múltiplas experiências nem sobreposição de períodos).

Recomendação prática: **lançar com B e migrar para A** assim que o portal do candidato existir — o modelo de dados da seção 4 já suporta os dois sem retrabalho (o campo `ExperienciaTotalMeses` em `Candidato` é populado por qualquer um dos dois caminhos).

### 5.2 Cálculo (caminho A) — cuidado com sobreposição de períodos

Somar `DataFim - DataInicio` de cada experiência ingenuamente **infla o resultado** quando o candidato teve dois vínculos simultâneos (ex.: CLT + freelance no mesmo período). A forma correta é unir os intervalos antes de somar:

```csharp
public static class ExperienciaCalculator
{
    public static int CalcularMesesTotais(IEnumerable<Experiencia> experiencias)
    {
        var intervalos = experiencias
            .Select(e => (Inicio: e.DataInicio, Fim: e.DataFim ?? DateOnly.FromDateTime(DateTime.Today)))
            .OrderBy(i => i.Inicio)
            .ToList();

        var unificados = new List<(DateOnly Inicio, DateOnly Fim)>();
        foreach (var atual in intervalos)
        {
            if (unificados.Count > 0 && atual.Inicio <= unificados[^1].Fim)
            {
                var ultimo = unificados[^1];
                unificados[^1] = (ultimo.Inicio, atual.Fim > ultimo.Fim ? atual.Fim : ultimo.Fim);
            }
            else
            {
                unificados.Add(atual);
            }
        }

        return unificados.Sum(i => (i.Fim.Year - i.Inicio.Year) * 12 + (i.Fim.Month - i.Inicio.Month));
    }
}
```

`Candidato.ExperienciaTotalMeses` deve ser **recalculado e persistido** a cada `POST`/`PUT`/`DELETE` em `/api/candidatos/{id}/experiencias` (não recalculado a cada leitura — mais barato para ordenar listas grandes).

### 5.3 Regra de ranqueamento (MVP)

Para a listagem de candidatos de uma vaga específica (`GET /api/vagas/{id}/ranking`):

1. Candidatos com `ExperienciaTotalMeses >= Vaga.ExperienciaMinimaMeses` aparecem primeiro, ordenados de forma decrescente pela experiência.
2. Candidatos abaixo do mínimo **não são descartados automaticamente** — aparecem depois, sinalizados como "abaixo do requisito"; a decisão final é do RH.

```csharp
[HttpGet("{id}/ranking")]
[Authorize(Roles = "RH")]
public async Task<ActionResult<List<CandidatoRankingDto>>> GetRanking(int id)
{
    var vaga = await _context.Vagas.FindAsync(id);
    if (vaga is null) return NotFound();

    var candidaturas = await _context.Candidaturas
        .Where(c => c.VagaId == id)
        .Include(c => c.Candidato)
        .ToListAsync();

    var ranking = candidaturas
        .Select(c => new CandidatoRankingDto
        {
            CandidatoId = c.CandidatoId,
            Nome = c.Candidato.Nome,
            ExperienciaMeses = c.Candidato.ExperienciaTotalMeses,
            AtendeRequisito = c.Candidato.ExperienciaTotalMeses >= vaga.ExperienciaMinimaMeses,
            Status = c.Status
        })
        .OrderByDescending(c => c.AtendeRequisito)
        .ThenByDescending(c => c.ExperienciaMeses)
        .ToList();

    return Ok(ranking);
}
```

### 5.4 Evolução futura — score composto

Quando fizer sentido considerar mais do que experiência (habilidades batendo com a vaga, recência da candidatura), uma pontuação ponderada substitui o `OrderByDescending` simples:

```
Score = (peso_exp   × min(exp_candidato / exp_minima_vaga, 2.0))
      + (peso_skill  × habilidades_em_comum / habilidades_pedidas)
      + (peso_recencia × fator_tempo_desde_candidatura)
```

Os pesos podem ficar configuráveis por vaga ou globais. Não é necessário para o MVP — vale registrar como próximo passo natural.

---

## 6. Endpoints de API (C# / ASP.NET Core)

### `AuthController` — `/api/auth`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/registrar` | Cadastro público (perfil Candidato) | Público |
| POST | `/api/auth/login` | Autentica; retorna access + refresh token | Público |
| POST | `/api/auth/refresh` | Renova access token | Refresh token válido |
| POST | `/api/auth/logout` | Revoga refresh token | Autenticado |
| POST | `/api/auth/esqueci-senha` | Dispara e-mail de redefinição | Público |
| POST | `/api/auth/redefinir-senha` | Confirma nova senha via token | Público |

### `UsuariosController` — `/api/usuarios` (contas RH)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/usuarios` | Lista contas RH da empresa | Admin |
| POST | `/api/usuarios` | Convida/cria conta RH | Admin |
| PUT | `/api/usuarios/{id}` | Atualiza dados | Admin |
| DELETE | `/api/usuarios/{id}` | Desativa conta | Admin |

### `EmpresasController` — `/api/empresas`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/empresas/{id}` | Detalhe da empresa | RH |
| PUT | `/api/empresas/{id}` | Atualiza dados da empresa | Admin |

### `CandidatosController` — `/api/candidatos`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/candidatos` | Lista/busca/filtra (`nome`, `status`, `departamento`, `vagaId`, `experienciaMin`, `page`, `pageSize`) | RH |
| GET | `/api/candidatos/{id}` | Detalhe | RH |
| POST | `/api/candidatos` | Cadastro manual (equivale à tela "Cadastrar Currículo" atual) | RH |
| PUT | `/api/candidatos/{id}` | Atualiza dados | RH |
| DELETE | `/api/candidatos/{id}` | Remove/arquiva | RH |
| GET | `/api/candidatos/me` | Meu perfil | Candidato |
| PUT | `/api/candidatos/me` | Atualiza meu perfil | Candidato |
| POST | `/api/candidatos/me/curriculo` | Upload do PDF do currículo | Candidato |

### `ExperienciasController` — `/api/candidatos/{candidatoId}/experiencias`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/` | Lista experiências do candidato | RH ou dono |
| POST | `/` | Adiciona experiência (recalcula `ExperienciaTotalMeses`) | RH ou dono |
| PUT | `/{id}` | Edita experiência | RH ou dono |
| DELETE | `/{id}` | Remove experiência | RH ou dono |

### `VagasController` — `/api/vagas`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/vagas` | Lista vagas abertas (filtros: `departamento`, `localizacao`, `modalidade`, `tipo`) | Público |
| GET | `/api/vagas/{id}` | Detalhe da vaga | Público |
| POST | `/api/vagas` | Cria vaga | RH |
| PUT | `/api/vagas/{id}` | Edita vaga | RH |
| PATCH | `/api/vagas/{id}/status` | Abre/encerra vaga | RH |
| DELETE | `/api/vagas/{id}` | Remove vaga | RH |
| GET | `/api/vagas/{id}/candidatos` | Lista candidaturas da vaga | RH |
| GET | `/api/vagas/{id}/ranking` | ⭐ Candidatos ordenados pela regra da seção 5 | RH |

### `CandidaturasController` — `/api/candidaturas`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/candidaturas` | Lista com filtros (`vagaId`, `candidatoId`, `status`) | RH |
| GET | `/api/candidaturas/me` | Minhas candidaturas | Candidato |
| POST | `/api/candidaturas` | Candidata-se a uma vaga (`vagaId` no corpo) | Candidato |
| GET | `/api/candidaturas/{id}` | Detalhe | RH ou dono |
| PATCH | `/api/candidaturas/{id}/status` | Muda status (grava em `HistoricoStatusCandidatura`) | RH |
| GET | `/api/candidaturas/{id}/historico` | Histórico de status | RH ou dono |

### `DashboardController` — `/api/dashboard`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/dashboard/resumo` | KPIs (total de candidatos, vagas abertas, entrevistas, aprovados) | RH |
| GET | `/api/dashboard/candidaturas-por-mes` | Série mensal para o gráfico de barras | RH |
| GET | `/api/dashboard/funil-status` | Contagem de candidaturas por status | RH |

### `HabilidadesController` — `/api/habilidades`

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/habilidades?busca=` | Autocomplete de habilidades cadastradas | Autenticado |
| POST | `/api/habilidades` | Cria nova habilidade (se ainda não existir) | RH ou Candidato |

---

## 7. Bibliotecas e ferramentas recomendadas

### 7.1 Back-end (C# / .NET)

| Biblioteca | Uso |
|---|---|
| **ASP.NET Core Web API (.NET 10, LTS atual)** | Framework base da API |
| **Entity Framework Core** | ORM; provider `Microsoft.EntityFrameworkCore.SqlServer` ou `Npgsql.EntityFrameworkCore.PostgreSQL` |
| **ASP.NET Core Identity** | Gestão de usuários, senhas, roles |
| **Microsoft.AspNetCore.Authentication.JwtBearer** | Emissão/validação de JWT |
| **FluentValidation** | Validação de DTOs mais expressiva que DataAnnotations |
| **AutoMapper** (ou Mapster) | Mapeamento Entity ↔ DTO |
| **Serilog** | Logging estruturado |
| **Swashbuckle.AspNetCore** | Swagger/OpenAPI — documentação automática dos endpoints da seção 6 |
| **xUnit + FluentAssertions + Moq** | Testes unitários e de integração |
| **Hangfire** (opcional) | Jobs em background — reenvio de e-mails, recomputo em lote de ranking |

### 7.2 Front-end (análise do `package.json` + recomendações)

| Biblioteca | Situação |
|---|---|
| React 18 + TypeScript + Vite | ✅ Ativo e funcional |
| Tailwind CSS 4 + Radix UI/shadcn | ✅ Ativo; já está sendo usado em todas as telas |
| `recharts`, `lucide-react`, `sonner` | ✅ Ativo (gráficos, ícones, toasts) |
| `react-router` v7 | ✅ **Já em uso!** Estrutura de rotas completa implementada em `App.tsx` com layouts separados (Public, RH, Candidato) |
| `react-hook-form` | ⚠️ **Já está no `package.json`, mas não é usado** — formulários ainda usam `useState` manual. Recomenda-se migrar progressivamente: (1) Login/Cadastro (prioridade), (2) Criar/Editar Vaga, (3) Experiências no Perfil |
| `zod` | ⚠️ **Já está no `package.json`** — usar junto com `react-hook-form` para validação tipada |
| **Axios ou fetch + TanStack Query** | 🔴 **NÃO está no projeto ainda** — necessário para consumir a API C#. Recomendação: `axios` + `@tanstack/react-query` (cache automático, retry, refetch) |
| `date-fns` | Considerar adicionar para manipulação de datas nos campos de experiência |

### 7.3 Infraestrutura

- Banco relacional: **SQL Server** ou **PostgreSQL** (ambos com bom suporte a EF Core).
- Armazenamento de currículos em PDF: Azure Blob Storage ou AWS S3 (não em disco local/banco).
- Containerização do back-end com Docker; pipeline CI/CD (GitHub Actions, já que o repositório usa GitHub pelo `codeload.github.com`/`raw.githubusercontent.com` como padrão comum, ou Azure DevOps).

---

## 8. Roadmap de implementação — **Front-end + Back-end C#**

Considerando que o front-end React **já tem estrutura de rotas e layout completo**, o foco agora é:
1. **Back-end:** criar a API C# + banco de dados
2. **Front-end:** conectar as telas existentes aos endpoints reais

### **Fase 0 — Fundação back-end** (Semana 1–2)

1. Setup: .NET 10 Web API + EF Core + PostgreSQL/SQL Server
2. Tabelas núcleo: `Empresa`, `Usuario` (Identity), `Departamento`, `Vaga`, `Candidato`, `Experiencia`, `Candidatura`, `HistoricoStatusCandidatura`, `Habilidade`, `RefreshToken`
3. ASP.NET Identity + JWT Bearer; roles `RH`, `Candidato`, `Admin`
4. Swagger ativo; CORS configurado
5. Migrations iniciais e seed de dados (departamentos, vagas de exemplo, usuários demo)

### **Fase 1 — Autenticação + Núcleo RH** (Semana 2–3)

**Back-end:**
6. `AuthController`: `POST /api/auth/login`, `POST /api/auth/registrar` (candidato), `POST /api/auth/refresh`, `POST /api/auth/logout`
7. `VagasController`: CRUD completo para RH (`GET /api/vagas`, `POST /api/vagas`, `PUT /api/vagas/{id}`, `DELETE /api/vagas/{id}`)
8. `CandidatosController`: listar, atualizar (manual cadastro via RH), excluir — espelhando `RegisterView` do front
9. `DashboardController`: endpoints para KPIs (`GET /api/dashboard/resumo`, `/candidaturas-por-mes`, `/funil-status`)

**Front-end:**
10. Configurar **Axios** + **React Query** (TanStack Query); interceptor com refresh automático
11. Atualizar `context.tsx`: função `login()` chama `POST /api/auth/login` real
12. Ligar `LoginPage` e `CadastroPage` aos endpoints `/api/auth/login` e `/api/auth/registrar`
13. Ligar `DashboardPage` (`/rh/dashboard`) aos endpoints de `DashboardController` (substituir `initialCandidates`, `hiringData`)
14. Ligar `CadastrarPage` (`/rh/cadastrar`) a `POST /api/candidatos`
15. Ligar `VagasPage` (`/rh/vagas`) a `GET /api/vagas`

### **Fase 2 — Pipeline de candidaturas** (Semana 3–4)

**Back-end:**
16. `CandidaturasController`: CRUD + transição de status (`GET /api/candidaturas`, `POST /api/candidaturas`, `PATCH /api/candidaturas/{id}/status` — grava histórico automático)
17. Endpoints privados por role: RH vê todas, Candidato vê só as suas

**Front-end:**
18. Ligar `CandidatosPage` (`/rh/candidatos`) a `GET /api/candidatos` + mudança de status via `PATCH /api/candidatos/{id}/status`
19. Criar tela **Detalhe Candidato** (`/rh/candidatos/:id`) com histórico de status, experiências, notas
20. Ligar `CandidaturasPage` (`/candidato/candidaturas`) a `GET /api/candidaturas/me`

### **Fase 3 — Portal do candidato + Experiências** (Semana 4–5)

**Back-end:**
21. `ExperienciasController`: CRUD (`GET /api/experiencias`, `POST`, `PUT`, `DELETE`) — cada POST/PUT recalcula `Candidato.ExperienciaTotalMeses`
22. Endpoint público: `GET /api/vagas?status=Aberta` (vitrine pública, sem auth)
23. `POST /api/candidaturas` para candidato se aplicar a uma vaga

**Front-end:**
24. Ligar `VitrinePage` (`/`) a `GET /api/vagas?status=Aberta` + filtros (cargo, depto., local, modalidade)
25. Ligar `VagaDetailPage` (`/vaga/:id`) a `GET /api/vagas/{id}` + botão "Candidatar-se" chama `POST /api/candidaturas`
26. Ligar `PerfilPage` (`/candidato/perfil`) a `GET /api/candidatos/me` + completar CRUD de experiências via `ExperienciasController`
27. **Implementar upload de PDF** para currículo (integração com Azure Blob Storage ou AWS S3)

### **Fase 4 — Ranqueamento + Refinamentos** (Semana 5–6)

**Back-end:**
28. Função `ExperienciaCalculator`: reconcilia faixas (seção 5.1) com datas reais; persiste `Candidato.ExperienciaTotalMeses`
29. Endpoint `GET /api/vagas/{id}/ranking`: ordena candidatos por score (experiência + habilidades matching)
30. `HabilidadesController`: autocomplete (`GET /api/habilidades?busca=`) + normalização

**Front-end:**
31. O modal de **Ranking de Candidatos** já existe (`RankingPanel` em `VagasPage.tsx`); conectar a `GET /api/vagas/{id}/ranking` e adicionar score de match, tags de habilidades e filtros. Avaliar se vale extrair para uma rota dedicada (`/rh/vagas/:id/ranking`)
32. Adotar `zod` (ainda **não está no `package.json`**, precisa ser instalado) para validação tipada nos formulários — hoje todos usam `react-hook-form` (já instalado e em uso em `LoginPage`, `CadastroPage`, `CadastrarPage`, `VagasPage` e `PerfilPage`) apenas com regras básicas (`required`, `minLength`)
33. `date-fns` **já está no `package.json`** (não precisa ser adicionado) — avaliar se vale substituir as manipulações de data manuais em `data.ts`/`PerfilPage.tsx` por suas funções

### **Fase 5 — QA + Produção** (Semana 6–7)

34. Testes unitários e integração (xUnit back-end, vitest/Playwright front-end)
35. Observabilidade: Serilog + Application Insights (back-end), erro tracking (front-end)
36. Security review: HTTPS, CORS, rate limiting, LGPD
37. Deploy: Docker containerização, CI/CD (GitHub Actions ou Azure DevOps)

**Paralelo a todas as fases:**
- ✅ Back-end: Swagger docs atualizado a cada sprint
- ✅ Front-end: testes de componentes novos
- ✅ Ambos: refatorações progressivas (não deixar tech debt)

---

## 9. Status detalhado do front-end (análise V2)

### Estrutura geral — ✅ Completa

- ✅ `react-router` v7 com rotas para RH, Candidato e público
- ✅ Layouts separados (`PublicLayout`, `RhLayout`, `CandidatoLayout`)
- ✅ `AuthContext` + `AppContext` com lógica de estado (mock)
- ✅ Componentes UI completos (shadcn + Tailwind + Radix)
- ✅ Data estruturada em `types.ts` com tipos corretos

### Páginas — Status por rota

| Rota | Componente | Implementação |
|---|---|---|
| `/login` | `LoginPage` | ✅ Form completo, roteamento por role, **demo accounts** funcionam |
| `/cadastro` | `CadastroPage` | ⚠️ Form presente, **falta chamar API** |
| `/` | `VitrinePage` | ⚠️ Filtros estruturados, **carrega `jobsData` mockado** |
| `/vaga/:id` | `VagaDetailPage` | ⚠️ Layout pronto, **falta buscar vaga por ID** |
| `/rh/dashboard` | `DashboardPage` | ✅ **Totalmente funcional** com gráficos, KPIs, lista recente |
| `/rh/candidatos` | `CandidatosPage` | ⚠️ Tabela + filtros + painel de detalhe funcionais, **carrega `INITIAL_CANDIDATES` mockado**; falta observações/histórico no painel |
| `/rh/vagas` | `VagasPage` | ✅ Grid + filtros + **CRUD completo (criar/editar) e ranking já funcionam via modais**, **carrega `INITIAL_JOBS` mockado** |
| `/rh/cadastrar` | `CadastrarPage` | ✅ **Totalmente funcional** com validação, seções, sucesso (chama `addCandidate()` no contexto) |
| `/candidato/perfil` | `PerfilPage` | ⚠️ Seções de dados + CRUD experiências, **campos básicos prontos, falta upload de PDF** |
| `/candidato/candidaturas` | `CandidaturasPage` | ⚠️ Lista de candidaturas com status, **carrega `candidaturas` do contexto** |

### Funcionalidades que já funcionam (mock)

- ✅ Login com detecção de perfil (RH vs Candidato) → redireciona corretamente
- ✅ Cadastrar currículo (RH) → salva no contexto, mostra sucesso
- ✅ Editar status de candidato (RH) → dropdown inline funciona
- ✅ Adicionar/editar/deletar experiências (Candidato) → atualiza contexto e recalcula total em meses
- ✅ Aplicar a vaga (Candidato) → cria `Candidatura` no contexto, incrementa contador de candidatos, bloqueia candidatura duplicada e vagas encerradas
- ✅ Cálculo de experiência total → função `calcularMesesTotais()` funciona com dados reais (datas, não faixas)
- ✅ Criar/editar vaga (RH) → modal `JobModal` em `VagasPage.tsx` chama `createJob()`/`updateJob()`
- ✅ Ranking de candidatos por vaga (RH) → modal `RankingPanel` em `VagasPage.tsx`, aplica a regra da seção 5.3
- ✅ Filtro por departamento na vitrine pública → já funciona (`VitrinePage.tsx`, junto com modalidade e tipo de contrato)

### O que **não** funciona ou falta

- 🔴 Nenhum endpoint real é chamado — tudo é mockado no contexto
- 🔴 Upload de currículo em PDF — campo pronto (com botão que dispara um toast informativo), mas sem integração com storage
- 🔴 Persistência de dados — atualizar página perde tudo (normal para mock)
- 🔴 Rota dedicada de detalhe de candidato (RH) — existe apenas como painel lateral inline em `CandidatosPage.tsx`, sem URL própria, sem campo de observações e sem histórico de status
- 🔴 Score de match / habilidades correspondentes no ranking de vaga — o ranking hoje só considera meses de experiência (Caminho B), não compara habilidades
- 🔴 Seção "Observações" no formulário de cadastro manual de currículo (`CadastrarPage.tsx`) — o formulário atual tem só 2 seções (dados pessoais e profissionais), não 3
- 🔴 Gráfico do Dashboard (`hiringData`) é uma série fixa de 6 meses, não é recalculado a partir de `candidates`/`jobs` do contexto

### Próximos passos (resumo executivo)

1. **Back-end (Fase 0–2, 2–3 semanas):** Setup .NET Web API + tabelas + autenticação real
2. **Front-end (Semana 1, paralelo):** Instalar Axios + React Query; criar interceptor auth
3. **Integração (Fase 1–2, 1–2 semanas):** Conectar cada tela aos endpoints correspondentes
4. **Expansão (Fase 3–4, 2–3 semanas):** Detalhe candidato, criar vaga, ranking, upload PDF
5. **QA + Deploy (Fase 5, 1–2 semanas):** Testes, observabilidade, containerização

---

## 10. Observações finais — V2 (atualizado com achados)

### O que mudou em relação ao storyboard original

O storyboard anterior assumiu que o front-end era apenas um protótipo de telas estáticas. **Na verdade, é um protótipo funcional (mock-based) muito mais avançado:** já tem rotas, contexto de estado, validação, cálculos, e fluxos completos.

Isso **acelera** o desenvolvimento, porque:
- Não precisa descartar a UI e reconstruir (a UI + layout estão prontos)
- A lógica de negócio (máquina de estados, cálculo de experiência) já está implementada
- Só falta conectar ao back-end real (Axios + endpoints)

### Decisões que ainda valem confirmação

1. **Mono-tenant ou multi-empresa?** — hoje não há seletor de empresa na UI. Para produção, se não houver, a `Empresa` fica como entrada única no banco (hardcoded ou configuração). Se quiser multi-empresa, é uma feature para a Fase 3 ou depois.

2. **Faixa de experiência ou datas reais?** — o front-end já suporta **ambas** (seção 5.1/5.2). A faixa (`"4 anos"`) é usada como fallback quando o candidato não preenche experiências detalhadas. As datas reais (`dataInicio`, `dataFim`) são coletadas e usadas para cálculo preciso. Recomenda-se deixar ambas ativas: candidato preenchendo um mas não o outro não quebra nada.

3. **Upload de PDF?** — o campo existe no `PerfilPage`, mas não há implementação. Recomenda-se adiar para Fase 3 (junto com storage de blobs). Não bloqueia nenhuma outra feature.

### Checklist antes de iniciar back-end

- [ ] Confirmar banco de dados (PostgreSQL vs SQL Server)
- [ ] Confirmar estratégia de armazenamento de PDFs (Azure Blob, AWS S3, NAS)
- [ ] Definir variáveis de ambiente (connection string, JWT secret, CORS origins)
- [ ] Preparar repositório .NET (estrutura de pastas, `appsettings.json`)
- [ ] Criar primeira migration com tabelas da Fase 0
- [ ] Validar que CORS está configurado para `http://localhost:5173` (porta padrão Vite)

Este documento é agora o **baseline para desenvolvimento**, com as próximas Fases refinadas conforme o back-end e integração evoluem.
