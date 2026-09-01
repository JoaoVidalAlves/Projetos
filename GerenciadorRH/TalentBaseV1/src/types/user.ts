export type UserRole = "RH" | "Candidato";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
