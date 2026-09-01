import { createContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../types";
import * as authService from "../services/authService";

export interface AuthContextValue {
  user: AuthUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function login(email: string, password: string) {
    setAuthLoading(true);
    const result = await authService.login(email, password);
    setAuthLoading(false);
    if (result.ok && result.user) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
