import type { Candidate, NewCandidateInput, Status } from "../types";
import { seedCandidates } from "../utils/mockDatabase";
import { simulateLatency, generateId } from "./api";
import { todayIso } from "../utils/formatters";

/** Estado "em servidor" mantido em memória enquanto não existe uma API real. */
let candidatesStore: Candidate[] = [...seedCandidates];

export async function listCandidates(): Promise<Candidate[]> {
  return simulateLatency([...candidatesStore]);
}

export async function updateCandidateStatus(id: string, status: Status): Promise<Candidate | undefined> {
  candidatesStore = candidatesStore.map((c) => (c.id === id ? { ...c, status } : c));
  return simulateLatency(candidatesStore.find((c) => c.id === id));
}

export async function deleteCandidate(id: string): Promise<void> {
  candidatesStore = candidatesStore.filter((c) => c.id !== id);
  return simulateLatency(undefined);
}

export async function createCandidate(input: NewCandidateInput): Promise<Candidate> {
  const created: Candidate = {
    ...input,
    id: generateId("cand-"),
    status: "Novo",
    appliedDate: todayIso(),
  };
  candidatesStore = [created, ...candidatesStore];
  return simulateLatency(created);
}
