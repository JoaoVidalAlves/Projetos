# Plano de Implementação — Um Semestre (Gerenciador de Currículos em C#)

**Para quem é este documento:** você, começando agora em POO, sem experiência prévia em desenvolvimento web, com um semestre para entregar o back-end inteiro em C#.
**Como ele se relaciona com o `storyboard-tecnico-gerenciador-curriculos.md` (documento anterior):** aquele é a especificação "de onde o sistema pode chegar" — arquitetura completa, pensada para um time. Este aqui é o roteiro real, com escopo cortado para caber no seu tempo e no seu nível atual, sequenciado para você aprender e construir ao mesmo tempo.

---

## 0. Antes do plano: alinhando expectativas

Sendo direto: o storyboard anterior, como está — JWT com refresh token, upload de arquivo, multi-empresa, LGPD, ~34 endpoints — é escopo de produto de verdade, feito por um time. Não é o que você vai construir sozinho(a) num semestre começando do zero em POO. Isso não é um problema seu: é assim que **qualquer** projeto profissional funciona também — corta-se agressivamente até um MVP (produto mínimo viável) e o resto vira "trabalho futuro". Este documento faz esse corte por você.

**Boa notícia, e ela é real:** eu abri o ZIP com as correções que você mandou, e o front-end já evoluiu bastante — alguém (você ou a própria ferramenta do Figma) usou o storyboard anterior para gerar as telas que faltavam: painel de detalhe do candidato, modal de criar/editar vaga, e um painel de ranking que já ordena candidatos por tempo de experiência (calculando no próprio front-end, com a tabela de conversão de faixa para meses que eu tinha sugerido na seção 5.1). Isso significa que **a maior parte do trabalho de tela já está pronta**, e o que sobra para você é, de fato, majoritariamente back-end — o que bate com o que você quer fazer.

**Premissas que estou assumindo** (ajuste se algo não bater):
- Projeto solo (é o que dá a entender pelo jeito que você escreveu).
- Semestre com algo entre 14 e 18 semanas letivas úteis — uso 16 como referência.
- "Desenvolvimento web" que falta aprender é pouco: HTTP, JSON, e trocar dados mockados por chamadas reais de API no front-end já pronto. Você **não** precisa aprender React a fundo.

---

## 1. O que este plano corta em relação ao storyboard anterior (e por quê)

| Do storyboard anterior | Aqui vira | Por quê |
|---|---|---|
| Controllers (`[HttpGet]`, `ControllerBase`) | **Minimal APIs** | Menos código de "cerimônia" para aprender — e é a abordagem que a própria Microsoft recomenda hoje para projetos novos. Controllers continuam válidos como evolução futura, se o projeto crescer. |
| SQL Server / PostgreSQL | **SQLite** | Zero instalação de servidor de banco — é um arquivo só. Continua sendo banco relacional de verdade (atende o requisito), e o EF Core trata igual. |
| JWT + refresh token + revogação | **JWT simples**, token único válido por algumas horas/dias | Refresh token exige uma camada inteira de complexidade (tabela própria, rotação, revogação) que não muda a nota nem a robustez percebida de um projeto acadêmico. |
| CRUD completo de `Experiencia` (datas, sobreposição) | **"Caminho B"**: faixa fixa → meses (já implementado no front, `EXP_TO_MONTHS`) | Já está feito na v2 do seu front-end. Replicar a mesma tabela no back-end é trivial; o CRUD de datas fica como extensão, não como bloqueio. |
| `Empresa`, `Habilidade` normalizada, `HistoricoStatusCandidatura`, `Entrevista` | **Cortados do MVP** | Não aparecem na UI hoje e não são essenciais para o fluxo funcionar. **Exceção:** se o enunciado do seu professor pede a entidade "Empresa" explicitamente, mantenha — é barata (uma tabela + uma FK em Vaga). |
| Upload real de PDF em blob storage | **Campo de link/URL do currículo** (texto) | Upload de arquivo binário é um projeto à parte (storage, validação de tipo, tamanho). Um campo de link resolve o requisito funcional sem essa complexidade. |
| LGPD, rate limiting, 2FA, notificações por e-mail | **Mencionados como próximos passos**, não implementados | Corretos de se ter em produção; irrelevantes para a nota de um projeto de semestre. |

Nada disso é "errado" no documento anterior — é a diferença entre uma especificação de arquitetura e um plano de execução para o seu contexto real.

---

## 2. Modelo de dados e endpoints — versão enxuta do MVP

### Dados (4 tabelas, contra as 9+ do documento anterior)

| Tabela | Campos essenciais |
|---|---|
| `Usuario` (via Identity) | Id, Nome, Email, SenhaHash, Perfil (RH \| Candidato) |
| `Candidato` | Id, UsuarioId?, Nome, Email, Telefone, Cidade, Estado, PosicaoDesejada, Departamento, Experiencia (faixa — texto), ExperienciaMeses (calculado) |
| `Vaga` | Id, Titulo, Departamento, Localizacao, Modalidade, Tipo, VagasDisponiveis, ExperienciaMinimaMeses, Status, DataPublicacao |
| `Candidatura` | Id, CandidatoId, VagaId, Status, DataCandidatura |

Use os campos `Tipo` (`CLT`, `PJ`, `Estágio`, `Freelance`) e `Modalidade` (`Presencial`, `Híbrido`, `Remoto`) exatamente como já estão no front-end corrigido — não precisa inventar valores novos.

### Endpoints (10, contra os ~34 do documento anterior)

```
POST   /api/auth/registrar
POST   /api/auth/login

GET    /api/candidatos
POST   /api/candidatos
PUT    /api/candidatos/{id}
DELETE /api/candidatos/{id}

GET    /api/vagas
POST   /api/vagas
PUT    /api/vagas/{id}
GET    /api/vagas/{id}/ranking

POST   /api/candidaturas
PATCH  /api/candidaturas/{id}/status
```

Isso já cobre dashboard (derivado de `/candidatos` e `/vagas`), as 4 telas do RH e o essencial de candidatura. Quando isso estiver rodando de ponta a ponta, você tem um sistema **completo e demonstrável** — o resto é incremento.

---

## 3. O semestre em 7 blocos

Datas são aproximadas (~16 semanas) — o que importa é a ordem e o entregável de cada bloco, não a data exata. Se um bloco atrasar, o mais fácil de comprimir é o Bloco 7; o mais arriscado de comprimir é o Bloco 6 (autenticação costuma ser onde quem está começando mais trava, então dar espaço a ela é proposital).

### Bloco 0 — Preparação (semana 1)
- Instalar: .NET SDK, um editor (Visual Studio Community se estiver no Windows — é o mais guiado para iniciante; ou VS Code + extensão C# Dev Kit em qualquer sistema), Node.js (só para rodar o front-end pronto), Git.
- Criar um repositório no GitHub **já na semana 1** e commitar desde o início — não deixe isso para o fim; projeto sem histórico de commits costuma pesar mal em avaliação, e te protege de perder trabalho.
- Rodar o front-end existente (`npm i`, depois `npm run dev`) só para ver funcionando. Ver o produto final rodando antes de escrever a primeira linha de back-end ajuda a manter o rumo.

### Bloco 1 — Fundamentos de C#/POO aplicados ao domínio (semanas 2–4)
- **Estudar:** variáveis, tipos, condicionais, laços, métodos, classes, objetos, propriedades, `List<T>`.
- **Praticar:** criar as classes `Candidato`, `Vaga`, `Candidatura` como POCOs simples (sem banco, sem web) e um programa de console que cadastra, lista e filtra candidatos em memória.
- **Entregável do bloco:** console app rodando local, cadastra e lista candidatos em uma `List<Candidato>`.
- **Recurso:** Microsoft Learn — [C# Fundamentals for Absolute Beginners](https://learn.microsoft.com/en-us/shows/csharp-fundamentals-for-absolute-beginners/) e a [Foundational C# Certification](https://learn.microsoft.com/en-us/dotnet/csharp/) (gratuita, com freeCodeCamp, linkada na página oficial de C#).

### Bloco 2 — Persistência: de `List<T>` para SQLite (semanas 4–6)
- **Estudar:** o que é um ORM, `DbContext`, `DbSet`, migrations.
- **Praticar:** plugar EF Core + SQLite no console app do Bloco 1; gerar a primeira migration; salvar e consultar candidatos de verdade num arquivo `.db`.
- **Entregável do bloco:** o mesmo console app, agora persistindo em SQLite (os dados sobrevivem a reiniciar o programa).
- **Recurso:** Microsoft Learn — [Getting Started with EF Core](https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app) (o próprio tutorial oficial já usa SQLite, exatamente por ser mais simples para começar).

### Bloco 3 — Primeira Web API (semanas 6–9)
- **Estudar:** o que é uma API REST, verbos HTTP (GET/POST/PUT/DELETE), JSON, Minimal APIs do ASP.NET Core.
- **Praticar:** transformar o projeto num ASP.NET Core Web API; expor os endpoints de `Candidato` e `Vaga` da seção 2; testar tudo pelo Swagger (interface de teste que já vem pronta, sem precisar do front-end ainda).
- **Entregável do bloco:** API rodando local, CRUD real de Candidato e Vaga testável pelo Swagger.
- **Recurso:** Microsoft Learn — [Tutorial: Create a Minimal API with ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api) (o exemplo oficial é literalmente um CRUD de lista de tarefas — mesma estrutura que você vai usar para Candidato/Vaga).

> Um exemplo do tamanho real de um endpoint em Minimal API, para desmistificar:
> ```csharp
> app.MapGet("/api/candidatos", async (AppDbContext db) =>
>     await db.Candidatos.ToListAsync());
>
> app.MapPost("/api/candidatos", async (Candidato c, AppDbContext db) => {
>     db.Candidatos.Add(c);
>     await db.SaveChangesAsync();
>     return Results.Created($"/api/candidatos/{c.Id}", c);
> });
> ```
> É bem menos cerimônia do que os exemplos com `[HttpGet]`/`ControllerBase` do documento anterior — e dá exatamente no mesmo resultado.

### Bloco 4 — Conectar o front-end existente à API (semanas 9–11)
- **Estudar:** o mínimo de `fetch` (requisição HTTP em JavaScript) e CORS. Não é necessário aprender React a fundo.
- **Praticar:** no `App.tsx`, trocar os arrays mockados (`initialCandidates`, `initialJobs`) por dados vindos da sua API; ligar os formulários de cadastro de currículo e criação de vaga aos `POST` correspondentes.
- **Entregável do bloco:** o front-end que você já tem pronto mostrando dados reais do seu banco, não mais mockados.
- **Nota:** esta costuma ser a parte que mais assusta quem nunca fez web, mas como o front-end já está construído, o trabalho aqui é localizado e mecânico — substituir a origem do dado, não construir tela nova.

### Bloco 5 — Ranking por experiência no back-end (semanas 11–12)
- **Estudar:** LINQ (`Where`, `OrderBy`) — já meio familiar dos blocos anteriores.
- **Praticar:** mover a lógica que hoje roda no front-end (`getExpMonths` + ordenação, dentro de `RankingPanel`) para o endpoint `GET /api/vagas/{id}/ranking`; o front-end passa a consumir o resultado pronto em vez de calcular localmente.
- **Entregável do bloco:** endpoint de ranking funcionando; é o requisito de "regras de ranqueamento" do enunciado, resolvido de ponta a ponta.

### Bloco 6 — Autenticação por perfil (semanas 12–14)
- **Estudar:** autenticação vs. autorização, ASP.NET Core Identity, o conceito de JWT (não precisa entender criptografia a fundo — entenda o fluxo: login envia usuário/senha, recebe um token, esse token vai em toda requisição seguinte).
- **Praticar:** adicionar Identity com as roles `RH` e `Candidato`; endpoint de login emitindo um JWT simples (sem refresh token); tela de login no front; proteger os endpoints de RH com `[Authorize(Roles = "RH")]`.
- **Entregável do bloco:** login funcionando; um candidato autenticado não consegue acessar rotas de RH.
- **Dê a este bloco o tempo que ele pede.** É onde a maioria de quem está começando trava — errar a ordem (tentar fazer isso no Bloco 1, por exemplo) costuma gerar mais frustração do que progresso.

### Bloco 7 — Portal do candidato (mínimo) + polimento + apresentação (semanas 14–16)
- Se sobrar tempo: tela simples de vitrine de vagas + "minhas candidaturas" para o perfil Candidato (o "Caminho A" completo do portal fica como extensão, não como meta).
- Dados de teste (seed) para a demonstração, revisão de bugs, ensaiar a apresentação.
- **Entregável final:** sistema funcionando de ponta a ponta para demo — login, CRUD de vagas e candidatos, candidatura, ranking.

---

## 4. Prioridades se o tempo apertar

**Não abra mão disto (é o que faz o projeto "funcionar"):**
- CRUD de Candidato e Vaga, front-end conectado à API de verdade.
- Login com os dois perfis (RH e Candidato) protegendo as rotas certas.
- Endpoint de ranking por experiência.
- Persistência real em SQLite (não em memória).

**Importante, mas negociável:**
- Portal do candidato completo (pode ficar só a listagem de vagas, sem "minhas candidaturas").
- Link de currículo (pode ficar de fora da primeira entrega).
- Status da candidatura com histórico (pode ser só o status atual, sem auditoria).

**Corte sem dó se faltar tempo:**
- Refresh token, revogação de sessão.
- Testes automatizados extensos (um ou dois testes já mostram que você entende o conceito).
- Habilidades normalizadas em tabela própria (deixe como campo de texto, como já está no protótipo).
- Qualquer coisa da tabela da seção 1 marcada como "cortado do MVP".

---

## 5. Armadilhas comuns de quem está começando (e como evitar)

- **Tentar estudar tudo antes de escrever a primeira linha.** POO, banco, API e auth têm profundidade infinita — você não precisa (nem vai conseguir) dominar cada assunto antes de usá-lo. O plano acima é sequenciado assim de propósito: aprende o suficiente, constrói, aprende mais.
- **Copiar e colar código de tutorial sem reescrever à mão.** Para fixar, digite os exemplos você mesmo(a) em vez de colar — é mais lento no primeiro dia e mais rápido em todos os seguintes.
- **Deixar autenticação para a última semana "porque parece fácil".** Não é — reserve o tempo do Bloco 6 de verdade.
- **Não usar Git desde o dia 1.** Sem isso, um erro grave pode custar semanas de trabalho, e a maioria das avaliações de projeto olha o histórico de commits como evidência de progresso real.
- **Tratar o storyboard anterior como um roteiro obrigatório.** Ele é a referência de "onde dá para chegar", não a lista do que precisa estar pronto na entrega — este documento é que define isso.

---

## 6. Marcos para mostrar progresso ao professor/orientador

Cada fim de bloco já é, por design, algo demonstrável:

1. Fim do Bloco 1 — console app com POO aplicada ao domínio do projeto.
2. Fim do Bloco 3 — API funcionando, testável pelo Swagger, com persistência real.
3. Fim do Bloco 4 — front-end e back-end integrados, rodando como sistema único.
4. Fim do Bloco 6 — sistema com os dois perfis de autenticação, que é provavelmente o requisito mais "visível" do enunciado.
5. Fim do Bloco 7 — entrega final.

Levar algo funcionando a cada marco (mesmo que pequeno) tende a valer mais, e gerar menos ansiedade, do que tentar mostrar tudo pronto só no fim.
