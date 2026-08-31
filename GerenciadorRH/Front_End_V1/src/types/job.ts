export type JobStatus = "Aberta" | "Em Processo" | "Encerrada";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  modality: string;
  type: string;
  openings: number;
  candidatesCount: number;
  status: JobStatus;
  postedDate: string;
  minExperienceMonths: number;
  description?: string;
  skills?: string[];
}

export type NewJobInput = Omit<Job, "id" | "candidatesCount" | "postedDate">;
export type UpdateJobInput = Partial<NewJobInput>;
