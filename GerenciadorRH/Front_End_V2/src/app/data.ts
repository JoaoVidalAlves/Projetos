import type { Candidate, Job, Candidatura, CandidatoProfile, Experiencia } from "./types";

// Section 5.1 — Caminho B: faixa → meses
export const EXP_TO_MONTHS: Record<string, number> = {
  "Menos de 1 ano": 6,
  "1 ano": 12,
  "2 anos": 24,
  "3 anos": 36,
  "4 anos": 48,
  "5 anos": 60,
  "6 anos": 72,
  "7 anos": 84,
  "8 anos": 96,
  "9 anos": 108,
  "10+ anos": 120,
};

export function getExpMonths(exp: string): number {
  return EXP_TO_MONTHS[exp] ?? 0;
}

// Section 5.2 — Cálculo real com union de intervalos (Caminho A)
export function calcularMesesTotais(experiencias: Experiencia[]): number {
  if (experiencias.length === 0) return 0;
  const intervalos = experiencias
    .map((e) => ({
      inicio: new Date(e.dataInicio),
      fim: e.dataFim ? new Date(e.dataFim) : new Date(),
    }))
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  const unificados: { inicio: Date; fim: Date }[] = [];
  for (const atual of intervalos) {
    if (unificados.length > 0 && atual.inicio <= unificados[unificados.length - 1].fim) {
      const ultimo = unificados[unificados.length - 1];
      if (atual.fim > ultimo.fim) ultimo.fim = atual.fim;
    } else {
      unificados.push({ ...atual });
    }
  }
  return unificados.reduce((total, { inicio, fim }) => {
    return total + (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
  }, 0);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateBR(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

// Config
export const STATUS_CONFIG = {
  "Novo": { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400", label: "Novo" },
  "Em Análise": { badge: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400", label: "Em Análise" },
  "Entrevista": { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500", label: "Entrevista" },
  "Aprovado": { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", label: "Aprovado" },
  "Reprovado": { badge: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500", label: "Reprovado" },
} as const;

export const JOB_STATUS_CONFIG = {
  "Aberta": { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Em Processo": { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  "Encerrada": { badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
} as const;

export const ALL_STATUSES = ["Novo", "Em Análise", "Entrevista", "Aprovado", "Reprovado"] as const;
export const DEPARTMENTS = ["Tecnologia", "Marketing", "Gestão", "Produto", "Recursos Humanos", "Financeiro", "Comercial"];
export const MODALITIES = ["Presencial", "Híbrido", "Remoto"];
export const JOB_TYPES = ["CLT", "PJ", "Estágio", "Freelance"];

// Mock chart data
export const hiringData = [
  { month: "Mar", candidatos: 24, contratados: 3 },
  { month: "Abr", candidatos: 31, contratados: 5 },
  { month: "Mai", candidatos: 28, contratados: 4 },
  { month: "Jun", candidatos: 38, contratados: 7 },
  { month: "Jul", candidatos: 45, contratados: 9 },
  { month: "Ago", candidatos: 52, contratados: 11 },
];

// Mock candidates
export const INITIAL_CANDIDATES: Candidate[] = [
  { id: "1", name: "Ana Carolina Mendes", position: "Desenvolvedora Frontend", department: "Tecnologia", email: "ana.mendes@email.com", phone: "(11) 99234-5678", status: "Entrevista", appliedDate: "2026-08-12", experience: "4 anos", skills: ["React", "TypeScript", "CSS"], location: "São Paulo, SP" },
  { id: "2", name: "Bruno Ferreira Lima", position: "Gerente de Projetos", department: "Gestão", email: "bruno.lima@email.com", phone: "(21) 98765-4321", status: "Em Análise", appliedDate: "2026-08-10", experience: "7 anos", skills: ["Scrum", "MS Project", "PMBOK"], location: "Rio de Janeiro, RJ" },
  { id: "3", name: "Carla Oliveira Santos", position: "Analista de Marketing", department: "Marketing", email: "carla.santos@email.com", phone: "(31) 97654-3210", status: "Aprovado", appliedDate: "2026-08-05", experience: "3 anos", skills: ["SEO", "Google Ads", "Analytics"], location: "Belo Horizonte, MG" },
  { id: "4", name: "Diego Alves Costa", position: "Engenheiro de Backend", department: "Tecnologia", email: "diego.costa@email.com", phone: "(11) 96543-2109", status: "Novo", appliedDate: "2026-08-15", experience: "5 anos", skills: ["Node.js", "Python", "AWS"], location: "São Paulo, SP" },
  { id: "5", name: "Elisa Rodrigues Pinto", position: "Designer UX/UI", department: "Produto", email: "elisa.pinto@email.com", phone: "(41) 95432-1098", status: "Reprovado", appliedDate: "2026-08-01", experience: "2 anos", skills: ["Figma", "Sketch", "Prototipagem"], location: "Curitiba, PR" },
  { id: "6", name: "Felipe Nascimento Gomes", position: "Analista de Dados", department: "Tecnologia", email: "felipe.gomes@email.com", phone: "(85) 94321-0987", status: "Em Análise", appliedDate: "2026-08-08", experience: "6 anos", skills: ["Python", "SQL", "Power BI"], location: "Fortaleza, CE" },
  { id: "7", name: "Gabriela Teixeira Moura", position: "Analista de RH", department: "Recursos Humanos", email: "gabi.moura@email.com", phone: "(11) 93210-9876", status: "Entrevista", appliedDate: "2026-08-11", experience: "3 anos", skills: ["Recrutamento", "Treinamento", "CLT"], location: "São Paulo, SP" },
  { id: "8", name: "Henrique Barbosa Souza", position: "Desenvolvedor Mobile", department: "Tecnologia", email: "henrique.souza@email.com", phone: "(51) 92109-8765", status: "Novo", appliedDate: "2026-08-16", experience: "4 anos", skills: ["Flutter", "React Native", "Swift"], location: "Porto Alegre, RS" },
  { id: "9", name: "Isabela Monteiro Cruz", position: "Analista de Marketing", department: "Marketing", email: "isabela.cruz@email.com", phone: "(71) 91098-7654", status: "Em Análise", appliedDate: "2026-08-09", experience: "5 anos", skills: ["Content", "Social Media", "Branding"], location: "Salvador, BA" },
  { id: "10", name: "João Pedro Ramos Silva", position: "Engenheiro de Backend", department: "Tecnologia", email: "joao.silva@email.com", phone: "(61) 90987-6543", status: "Aprovado", appliedDate: "2026-08-03", experience: "8 anos", skills: ["Java", "Spring Boot", "Kafka"], location: "Brasília, DF" },
];

export const INITIAL_JOBS: Job[] = [
  { id: "1", title: "Desenvolvedora Frontend", department: "Tecnologia", location: "São Paulo, SP", modality: "Híbrido", openings: 2, candidates: 14, status: "Em Processo", postedDate: "2026-07-28", type: "CLT", experienciaMinimaMeses: 36, description: "Buscamos uma desenvolvedora frontend para compor nosso time de produto, trabalhando com React, TypeScript e design systems modernos.", skills: ["React", "TypeScript", "CSS", "Figma"] },
  { id: "2", title: "Gerente de Projetos", department: "Gestão", location: "Remoto", modality: "Remoto", openings: 1, candidates: 8, status: "Aberta", postedDate: "2026-08-05", type: "CLT", experienciaMinimaMeses: 60, description: "Gerenciar projetos de tecnologia de ponta a ponta, coordenando times multidisciplinares e garantindo entregas no prazo e no orçamento.", skills: ["Scrum", "Kanban", "MS Project", "PMBOK"] },
  { id: "3", title: "Analista de Marketing", department: "Marketing", location: "Belo Horizonte, MG", modality: "Presencial", openings: 3, candidates: 22, status: "Em Processo", postedDate: "2026-07-20", type: "CLT", experienciaMinimaMeses: 24, description: "Planejar e executar campanhas de marketing digital, análise de métricas e estratégias de growth para produtos B2B e B2C.", skills: ["SEO", "Google Ads", "Meta Ads", "Analytics", "CRM"] },
  { id: "4", title: "Engenheiro de Backend", department: "Tecnologia", location: "Remoto", modality: "Remoto", openings: 2, candidates: 19, status: "Aberta", postedDate: "2026-08-10", type: "PJ", experienciaMinimaMeses: 48, description: "Desenvolver e manter APIs RESTful e microsserviços em ambiente cloud, com foco em escalabilidade e observabilidade.", skills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"] },
  { id: "5", title: "Designer UX/UI", department: "Produto", location: "São Paulo, SP", modality: "Híbrido", openings: 1, candidates: 11, status: "Encerrada", postedDate: "2026-07-15", type: "CLT", experienciaMinimaMeses: 12, description: "Criar experiências de usuário intuitivas e visualmente consistentes, colaborando com times de produto e engenharia.", skills: ["Figma", "Prototyping", "User Research", "Design Systems"] },
  { id: "6", title: "Analista de Dados", department: "Tecnologia", location: "Remoto", modality: "Remoto", openings: 2, candidates: 16, status: "Aberta", postedDate: "2026-08-12", type: "PJ", experienciaMinimaMeses: 60, description: "Transformar dados brutos em insights acionáveis, construindo pipelines, dashboards e modelos preditivos.", skills: ["Python", "SQL", "Power BI", "dbt", "Spark"] },
  { id: "7", title: "Desenvolvedor Mobile", department: "Tecnologia", location: "Porto Alegre, RS", modality: "Presencial", openings: 1, candidates: 9, status: "Em Processo", postedDate: "2026-08-01", type: "CLT", experienciaMinimaMeses: 36, description: "Desenvolver e manter aplicativos mobile iOS e Android com Flutter, garantindo performance e experiência de usuário de alta qualidade.", skills: ["Flutter", "Dart", "React Native", "Firebase"] },
];

// Mock candidaturas (applications by the demo candidate — Ana, id:1)
export const INITIAL_CANDIDATURAS: Candidatura[] = [
  {
    id: "cand1",
    candidatoId: "1",
    vagaId: "1",
    status: "Entrevista",
    dataCandidatura: "2026-08-12",
    observacoes: "Candidatura via portal",
    historico: [
      { id: "h1", status: "Novo", data: "2026-08-12", alteradoPor: "Sistema" },
      { id: "h2", status: "Em Análise", data: "2026-08-14", alteradoPor: "RH - TalentBase" },
      { id: "h3", status: "Entrevista", data: "2026-08-18", alteradoPor: "RH - TalentBase" },
    ],
  },
];

// Mock experiencias do candidato demo (Ana, id:1)
export const INITIAL_EXPERIENCIAS: Experiencia[] = [
  {
    id: "exp1",
    candidatoId: "1",
    nomeEmpresa: "StartupXYZ",
    cargo: "Desenvolvedora Junior",
    dataInicio: "2022-02-01",
    dataFim: "2023-06-30",
    descricao: "Desenvolvimento de interfaces com React e Vue.js.",
  },
  {
    id: "exp2",
    candidatoId: "1",
    nomeEmpresa: "Agência Digital ABC",
    cargo: "Desenvolvedora Pleno",
    dataInicio: "2023-07-01",
    dataFim: null,
    descricao: "Liderança técnica de projetos frontend, design system e mentoria de júniores.",
  },
];

export const CANDIDATO_PROFILE: CandidatoProfile = {
  id: "1",
  name: "Ana Carolina Mendes",
  email: "ana.mendes@email.com",
  phone: "(11) 99234-5678",
  cidade: "São Paulo",
  estado: "SP",
  posicaoDesejada: "Desenvolvedora Frontend",
  department: "Tecnologia",
  skills: ["React", "TypeScript", "CSS", "Figma", "Node.js"],
  curriculoUrl: undefined,
  experiencias: INITIAL_EXPERIENCIAS,
};

// Demo credentials
export const DEMO_ACCOUNTS = [
  { email: "rh@empresa.com.br", role: "RH" as const, name: "Equipe de RH", id: "rh1" },
  { email: "ana.mendes@email.com", role: "Candidato" as const, name: "Ana Carolina Mendes", id: "1" },
];
