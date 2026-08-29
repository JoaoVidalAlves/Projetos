export type Status = "Novo" | "Em Análise" | "Entrevista" | "Aprovado" | "Reprovado";
export type JobStatus = "Aberta" | "Em Processo" | "Encerrada";
export type UserRole = "RH" | "Candidato";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: Status;
  appliedDate: string;
  experience: string;
  skills: string[];
  location: string;
}

export interface Experiencia {
  id: string;
  candidatoId: string;
  nomeEmpresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string | null;
  descricao?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  modality: string;
  openings: number;
  candidates: number;
  status: JobStatus;
  postedDate: string;
  type: string;
  experienciaMinimaMeses: number;
  description?: string;
  skills?: string[];
}

export interface Candidatura {
  id: string;
  candidatoId: string;
  vagaId: string;
  status: Status;
  dataCandidatura: string;
  observacoes?: string;
  historico: { id: string; status: Status; data: string; alteradoPor: string }[];
}

export interface CandidatoProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cidade: string;
  estado: string;
  posicaoDesejada: string;
  department: string;
  skills: string[];
  curriculoUrl?: string;
  experiencias: Experiencia[];
}
