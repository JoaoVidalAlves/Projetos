import type { AuthUser } from "../types";
import { demoAccounts } from "../utils/mockDatabase";
import { simulateLatency } from "./api";

export interface LoginResult {
  ok: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Autentica um usuário.
 *
 * Implementação atual: procura o e-mail em `demoAccounts` e aceita qualquer
 * senha (não há back-end para validar). Quando a API existir, troque o
 * corpo desta função por uma chamada `POST /api/auth/login` que retorna o
 * usuário e um token — a assinatura da função pode continuar a mesma.
 */
export async function login(email: string, _password: string): Promise<LoginResult> {
  await simulateLatency(null, 400);
  const account = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!account) {
    return { ok: false, error: "E-mail não encontrado. Use rh@empresa.com.br ou ana.mendes@email.com" };
  }
  return {
    ok: true,
    user: { id: account.id, name: account.name, email: account.email, role: account.role },
  };
}

/** Encerra a sessão. Hoje é apenas local; futuramente pode chamar `POST /api/auth/logout`. */
export async function logout(): Promise<void> {
  await simulateLatency(null, 100);
}
