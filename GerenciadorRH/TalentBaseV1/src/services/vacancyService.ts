import type { Job, NewJobInput, UpdateJobInput } from "../types";
import { seedJobs } from "../utils/mockDatabase";
import { simulateLatency, generateId } from "./api";
import { todayIso } from "../utils/formatters";
import { getExperienceMonths } from "../utils/experience";
import { listApplicationsByJob } from "./applicationService";
import { listCandidates } from "./candidateService";

let jobsStore: Job[] = [...seedJobs];

export async function listJobs(): Promise<Job[]> {
  return simulateLatency([...jobsStore]);
}

export async function getJob(id: string): Promise<Job | undefined> {
  return simulateLatency(jobsStore.find((j) => j.id === id));
}

export async function createJob(input: NewJobInput): Promise<Job> {
  const created: Job = { ...input, id: generateId("vaga-"), candidatesCount: 0, postedDate: todayIso() };
  jobsStore = [...jobsStore, created];
  return simulateLatency(created);
}

export async function updateJob(id: string, input: UpdateJobInput): Promise<Job | undefined> {
  jobsStore = jobsStore.map((j) => (j.id === id ? { ...j, ...input } : j));
  return simulateLatency(jobsStore.find((j) => j.id === id));
}

/** Usado internamente quando uma nova candidatura é criada (ver `applicationService`). */
export async function incrementJobApplicantCount(id: string): Promise<void> {
  jobsStore = jobsStore.map((j) => (j.id === id ? { ...j, candidatesCount: j.candidatesCount + 1 } : j));
}

export interface RankedApplicant {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidatePosition: string;
  experienceLabel: string;
  months: number;
  qualified: boolean;
}

/**
 * Ranking de candidatos de uma vaga: os que atendem à experiência mínima
 * aparecem primeiro, depois ordenados por meses de experiência (decrescente).
 * Hoje usa apenas a faixa de experiência em texto (Caminho B); quando a API
 * existir, o ideal é que o back-end calcule isso e este service apenas
 * repasse o resultado de `GET /api/vagas/{id}/ranking`.
 */
export async function getJobRanking(jobId: string): Promise<RankedApplicant[]> {
  const [job, applications, candidates] = await Promise.all([
    getJob(jobId),
    listApplicationsByJob(jobId),
    listCandidates(),
  ]);
  if (!job) return [];

  const ranked: RankedApplicant[] = applications
    .map((application) => {
      const candidate = candidates.find((c) => c.id === application.candidateId);
      if (!candidate) return null;
      const months = getExperienceMonths(candidate.experience);
      return {
        applicationId: application.id,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidatePosition: candidate.position,
        experienceLabel: candidate.experience,
        months,
        qualified: months >= job.minExperienceMonths,
      };
    })
    .filter((x): x is RankedApplicant => x !== null);

  return ranked.sort((a, b) => {
    if (a.qualified !== b.qualified) return a.qualified ? -1 : 1;
    return b.months - a.months;
  });
}
