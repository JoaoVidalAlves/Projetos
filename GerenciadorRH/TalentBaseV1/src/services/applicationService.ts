import type { Application } from "../types";
import { seedApplications } from "../utils/mockDatabase";
import { simulateLatency, generateId } from "./api";
import { todayIso } from "../utils/formatters";
import { getJob, incrementJobApplicantCount } from "./vacancyService";

let applicationsStore: Application[] = [...seedApplications];

export async function listApplications(): Promise<Application[]> {
  return simulateLatency([...applicationsStore]);
}

export async function listApplicationsByCandidate(candidateId: string): Promise<Application[]> {
  return simulateLatency(applicationsStore.filter((a) => a.candidateId === candidateId));
}

export async function listApplicationsByJob(jobId: string): Promise<Application[]> {
  return simulateLatency(applicationsStore.filter((a) => a.jobId === jobId));
}

export interface ApplyResult {
  ok: boolean;
  application?: Application;
  error?: string;
}

/** Cria uma candidatura de um candidato a uma vaga, com as mesmas regras de negócio de hoje. */
export async function applyToJob(candidateId: string, jobId: string): Promise<ApplyResult> {
  const already = applicationsStore.find((a) => a.candidateId === candidateId && a.jobId === jobId);
  if (already) {
    return { ok: false, error: "Você já se candidatou a esta vaga." };
  }
  const job = await getJob(jobId);
  if (!job || job.status === "Encerrada") {
    return { ok: false, error: "Esta vaga não está disponível." };
  }

  const created: Application = {
    id: generateId("app-"),
    candidateId,
    jobId,
    status: "Novo",
    applicationDate: todayIso(),
    history: [{ id: generateId("h-"), status: "Novo", date: todayIso(), changedBy: "Sistema" }],
  };
  applicationsStore = [...applicationsStore, created];
  await incrementJobApplicantCount(jobId);
  return simulateLatency({ ok: true, application: created });
}

export async function updateApplicationStatus(id: string, status: Application["status"]): Promise<Application | undefined> {
  applicationsStore = applicationsStore.map((a) =>
    a.id === id
      ? {
          ...a,
          status,
          history: [...a.history, { id: generateId("h-"), status, date: todayIso(), changedBy: "RH - TalentBase" }],
        }
      : a
  );
  return simulateLatency(applicationsStore.find((a) => a.id === id));
}
