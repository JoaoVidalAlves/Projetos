/**
 * Cliente de API base.
 *
 * Hoje, nenhum dos `services/` faz uma requisição HTTP de verdade — eles
 * operam sobre os dados de `src/utils/mockDatabase.ts` e usam `simulateLatency`
 * para imitar o tempo de resposta de uma API real (o que também obriga a
 * interface a já tratar estados de carregamento corretamente).
 *
 * Quando o back-end em C# / ASP.NET Core estiver pronto, a ideia é que cada
 * função de `services/*.ts` passe a fazer algo como:
 *
 *   export async function listCandidates() {
 *     const res = await fetch(`${API_BASE_URL}/api/candidatos`, { headers: authHeaders() });
 *     if (!res.ok) throw new ApiError(res.status, await res.text());
 *     return res.json();
 *   }
 *
 * Nenhuma página ou componente precisa mudar quando isso acontecer — todos
 * consomem apenas as funções exportadas por `services/`.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** Simula a latência de rede de um back-end real durante o desenvolvimento com mocks. */
export function simulateLatency<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Gera um identificador simples para novos registros criados no mock. */
export function generateId(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Placeholder para futuros cabeçalhos de autenticação (ex.: Bearer token). */
export function authHeaders(): HeadersInit {
  const token = localStorage.getItem("talentbase.token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
