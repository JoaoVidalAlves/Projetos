import type { Status, JobStatus } from "../types";

interface BadgeStyle {
  label: string;
  badgeClass: string;
  dotClass: string;
}

/** Aparência de cada status de candidato/candidatura. Alterar aqui muda em todo o app. */
export const STATUS_STYLES: Record<Status, BadgeStyle> = {
  "Novo": { label: "Novo", badgeClass: "bg-stone-100 text-stone-600", dotClass: "bg-stone-400" },
  "Em Análise": { label: "Em Análise", badgeClass: "bg-amber-soft text-amber border border-amber/30", dotClass: "bg-amber" },
  "Entrevista": { label: "Entrevista", badgeClass: "bg-info-soft text-info border border-info/30", dotClass: "bg-info" },
  "Aprovado": { label: "Aprovado", badgeClass: "bg-accent-soft text-accent-dark border border-accent/30", dotClass: "bg-accent" },
  "Reprovado": { label: "Reprovado", badgeClass: "bg-danger-soft text-danger border border-danger/30", dotClass: "bg-danger" },
};

/** Aparência de cada status de vaga. */
export const JOB_STATUS_STYLES: Record<JobStatus, BadgeStyle> = {
  "Aberta": { label: "Aberta", badgeClass: "bg-accent-soft text-accent-dark border border-accent/30", dotClass: "bg-accent" },
  "Em Processo": { label: "Em Processo", badgeClass: "bg-info-soft text-info border border-info/30", dotClass: "bg-info" },
  "Encerrada": { label: "Encerrada", badgeClass: "bg-stone-100 text-stone-500", dotClass: "bg-stone-400" },
};

/** Aparência das tags de modalidade de trabalho. */
export const MODALITY_STYLES: Record<string, string> = {
  Presencial: "bg-amber-soft text-amber",
  Híbrido: "bg-violet-soft text-violet",
  Remoto: "bg-teal-soft text-teal",
};

export const DEFAULT_MODALITY_STYLE = "bg-stone-100 text-muted";
