import type { Status } from "./status";

export interface HistoryEntry {
  id: string;
  status: Status;
  date: string;
  changedBy: string;
}

/** Uma candidatura de um candidato do portal a uma vaga publicada. */
export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: Status;
  applicationDate: string;
  notes?: string;
  history: HistoryEntry[];
}
