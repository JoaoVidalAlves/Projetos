import type { Experience } from "../types";

/**
 * Caminho B: quando só existe uma faixa de experiência em texto livre
 * (ex.: cadastro manual do RH, ou o campo `experience` de `Candidate`),
 * convertemos a faixa para uma estimativa em meses.
 */
export const EXPERIENCE_RANGE_TO_MONTHS: Record<string, number> = {
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

export function getExperienceMonths(rangeLabel: string): number {
  return EXPERIENCE_RANGE_TO_MONTHS[rangeLabel] ?? 0;
}

/**
 * Caminho A: quando o candidato tem uma lista de experiências reais
 * (data de início/fim), calculamos o tempo total unindo intervalos que se
 * sobrepõem, para não contar duas vezes períodos concorrentes.
 */
export function calculateTotalExperienceMonths(experiences: Experience[]): number {
  if (experiences.length === 0) return 0;

  const intervals = experiences
    .map((e) => ({
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : new Date(),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged: { start: Date; end: Date }[] = [];
  for (const current of intervals) {
    const last = merged[merged.length - 1];
    if (last && current.start <= last.end) {
      if (current.end > last.end) last.end = current.end;
    } else {
      merged.push({ ...current });
    }
  }

  return merged.reduce((total, { start, end }) => {
    return total + (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }, 0);
}
