import type { Status } from "./status";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: Status;
  appliedDate: string;
  /** Faixa de experiência informada em texto livre (ex.: "4 anos"). */
  experience: string;
  skills: string[];
  location: string;
}

/** Uma experiência profissional individual, usada para o cálculo real de tempo total (meses). */
export interface Experience {
  id: string;
  candidateId: string;
  companyName: string;
  role: string;
  startDate: string;
  /** null significa "emprego atual". */
  endDate: string | null;
  description?: string;
}

/** Perfil do candidato autenticado no portal (distinto do registro `Candidate` usado pelo RH). */
export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  desiredPosition: string;
  department: string;
  skills: string[];
  resumeUrl?: string;
  experiences: Experience[];
}

/** Payload aceito ao cadastrar um candidato manualmente (RH) ou criar um perfil. */
export type NewCandidateInput = Omit<Candidate, "id" | "status" | "appliedDate">;
