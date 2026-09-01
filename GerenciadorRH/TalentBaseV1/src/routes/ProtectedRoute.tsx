import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/ui/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Se informado, exige que o usuário autenticado tenha exatamente esse papel. */
  role?: UserRole;
}

/**
 * Centraliza a regra de acesso às áreas autenticadas. Hoje verifica apenas
 * o usuário mockado em `AuthContext`; quando a API real existir, este é o
 * único lugar que precisará entender tokens expirados, refresh, etc.
 */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, authLoading } = useAuth();

  if (authLoading) return <Loading label="Verificando sessão..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
