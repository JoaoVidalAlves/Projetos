/** Formata uma data ISO (yyyy-mm-dd) para o padrão brasileiro dd/mm/yyyy. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Formata uma data ISO por extenso em português, ex.: "agosto de 2026". */
export function formatDateLong(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

/** Formata uma data no formato "yyyy-mm" (input type=month) como "Ago/2026". */
export function formatMonthYear(monthValue: string): string {
  const [year, month] = monthValue.split("-");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${months[parseInt(month, 10) - 1]}/${year}`;
}

/** Retorna a data atual no formato ISO yyyy-mm-dd. */
export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}
