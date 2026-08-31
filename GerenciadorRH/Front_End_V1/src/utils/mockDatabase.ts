/**
 * Base de dados mockada (em memória).
 *
 * Este é o ÚNICO lugar onde dados fictícios existem no projeto. Nenhum
 * componente de interface importa deste arquivo diretamente — apenas a
 * camada de `services/` (ver `src/services`). Quando o back-end em C#/
 * ASP.NET estiver pronto, basta reescrever os arquivos de `services/`
 * para chamar a API real; nada em `pages/`, `components/` ou `contexts/`
 * precisa mudar.
 */
import type { Candidate, Job, Application, Experience, CandidateProfile, UserRole } from "../types";

export const hiringChartData = [
  { month: "Mar", candidates: 24, hired: 3 },
  { month: "Abr", candidates: 31, hired: 5 },
  { month: "Mai", candidates: 28, hired: 4 },
  { month: "Jun", candidates: 38, hired: 7 },
  { month: "Jul", candidates: 45, hired: 9 },
  { month: "Ago", candidates: 52, hired: 11 },
];

export const seedCandidates: Candidate[] = [
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

export const seedJobs: Job[] = [
  { id: "1", title: "Desenvolvedora Frontend", department: "Tecnologia", location: "São Paulo, SP", modality: "Híbrido", type: "CLT", openings: 2, candidatesCount: 14, status: "Em Processo", postedDate: "2026-07-28", minExperienceMonths: 36, description: "Buscamos uma desenvolvedora frontend para compor nosso time de produto, trabalhando com React, TypeScript e design systems modernos.", skills: ["React", "TypeScript", "CSS", "Figma"] },
  { id: "2", title: "Gerente de Projetos", department: "Gestão", location: "Remoto", modality: "Remoto", type: "CLT", openings: 1, candidatesCount: 8, status: "Aberta", postedDate: "2026-08-05", minExperienceMonths: 60, description: "Gerenciar projetos de tecnologia de ponta a ponta, coordenando times multidisciplinares e garantindo entregas no prazo e no orçamento.", skills: ["Scrum", "Kanban", "MS Project", "PMBOK"] },
  { id: "3", title: "Analista de Marketing", department: "Marketing", location: "Belo Horizonte, MG", modality: "Presencial", type: "CLT", openings: 3, candidatesCount: 22, status: "Em Processo", postedDate: "2026-07-20", minExperienceMonths: 24, description: "Planejar e executar campanhas de marketing digital, análise de métricas e estratégias de growth para produtos B2B e B2C.", skills: ["SEO", "Google Ads", "Meta Ads", "Analytics", "CRM"] },
  { id: "4", title: "Engenheiro de Backend", department: "Tecnologia", location: "Remoto", modality: "Remoto", type: "PJ", openings: 2, candidatesCount: 19, status: "Aberta", postedDate: "2026-08-10", minExperienceMonths: 48, description: "Desenvolver e manter APIs RESTful e microsserviços em ambiente cloud, com foco em escalabilidade e observabilidade.", skills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"] },
  { id: "5", title: "Designer UX/UI", department: "Produto", location: "São Paulo, SP", modality: "Híbrido", type: "CLT", openings: 1, candidatesCount: 11, status: "Encerrada", postedDate: "2026-07-15", minExperienceMonths: 12, description: "Criar experiências de usuário intuitivas e visualmente consistentes, colaborando com times de produto e engenharia.", skills: ["Figma", "Prototyping", "User Research", "Design Systems"] },
  { id: "6", title: "Analista de Dados", department: "Tecnologia", location: "Remoto", modality: "Remoto", type: "PJ", openings: 2, candidatesCount: 16, status: "Aberta", postedDate: "2026-08-12", minExperienceMonths: 60, description: "Transformar dados brutos em insights acionáveis, construindo pipelines, dashboards e modelos preditivos.", skills: ["Python", "SQL", "Power BI", "dbt", "Spark"] },
  { id: "7", title: "Desenvolvedor Mobile", department: "Tecnologia", location: "Porto Alegre, RS", modality: "Presencial", type: "CLT", openings: 1, candidatesCount: 9, status: "Em Processo", postedDate: "2026-08-01", minExperienceMonths: 36, description: "Desenvolver e manter aplicativos mobile iOS e Android com Flutter, garantindo performance e experiência de usuário de alta qualidade.", skills: ["Flutter", "Dart", "React Native", "Firebase"] },
];

export const seedApplications: Application[] = [
  {
    id: "app-1",
    candidateId: "1",
    jobId: "1",
    status: "Entrevista",
    applicationDate: "2026-08-12",
    notes: "Candidatura via portal",
    history: [
      { id: "h1", status: "Novo", date: "2026-08-12", changedBy: "Sistema" },
      { id: "h2", status: "Em Análise", date: "2026-08-14", changedBy: "RH - TalentBase" },
      { id: "h3", status: "Entrevista", date: "2026-08-18", changedBy: "RH - TalentBase" },
    ],
  },
];

export const seedExperiences: Experience[] = [
  { id: "exp-1", candidateId: "1", companyName: "StartupXYZ", role: "Desenvolvedora Junior", startDate: "2022-02-01", endDate: "2023-06-30", description: "Desenvolvimento de interfaces com React e Vue.js." },
  { id: "exp-2", candidateId: "1", companyName: "Agência Digital ABC", role: "Desenvolvedora Pleno", startDate: "2023-07-01", endDate: null, description: "Liderança técnica de projetos frontend, design system e mentoria de júniores." },
];

export const seedCandidateProfile: CandidateProfile = {
  id: "1",
  name: "Ana Carolina Mendes",
  email: "ana.mendes@email.com",
  phone: "(11) 99234-5678",
  city: "São Paulo",
  state: "SP",
  desiredPosition: "Desenvolvedora Frontend",
  department: "Tecnologia",
  skills: ["React", "TypeScript", "CSS", "Figma", "Node.js"],
  resumeUrl: undefined,
  experiences: seedExperiences,
};

export interface DemoAccount {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export const demoAccounts: DemoAccount[] = [
  { id: "rh-1", email: "rh@empresa.com.br", role: "RH", name: "Equipe de RH" },
  { id: "1", email: "ana.mendes@email.com", role: "Candidato", name: "Ana Carolina Mendes" },
];
