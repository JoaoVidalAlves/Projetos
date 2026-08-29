import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser, Candidate, Job, Candidatura, CandidatoProfile, Experiencia, Status } from "./types";
import {
  INITIAL_CANDIDATES, INITIAL_JOBS, INITIAL_CANDIDATURAS,
  CANDIDATO_PROFILE, DEMO_ACCOUNTS, calcularMesesTotais,
} from "./data";

// --- AUTH CONTEXT ---
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, _password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// --- APP DATA CONTEXT ---
interface AppContextValue {
  // RH data
  candidates: Candidate[];
  jobs: Job[];
  candidaturas: Candidatura[];
  // Candidato data
  candidatoProfile: CandidatoProfile;
  experienciasTotalMeses: number;

  // RH actions
  updateCandidateStatus: (id: string, status: Status) => void;
  deleteCandidate: (id: string) => void;
  addCandidate: (data: Omit<Candidate, "id" | "status" | "appliedDate">) => void;
  createJob: (data: Omit<Job, "id" | "candidates" | "postedDate">) => void;
  updateJob: (id: string, data: Partial<Omit<Job, "id" | "candidates" | "postedDate">>) => void;
  updateCandidaturaStatus: (id: string, status: Status) => void;

  // Candidato actions
  applyToJob: (vagaId: string) => { ok: boolean; error?: string };
  updateCandidatoProfile: (data: Partial<Omit<CandidatoProfile, "id" | "experiencias">>) => void;
  addExperiencia: (data: Omit<Experiencia, "id" | "candidatoId">) => void;
  updateExperiencia: (id: string, data: Partial<Omit<Experiencia, "id" | "candidatoId">>) => void;
  deleteExperiencia: (id: string) => void;
  myCandidaturas: Candidatura[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppData(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppProvider");
  return ctx;
}

// --- COMBINED PROVIDER ---
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>(INITIAL_CANDIDATURAS);
  const [candidatoProfile, setCandidatoProfile] = useState<CandidatoProfile>(CANDIDATO_PROFILE);

  // Derived: total experience months calculated from profile experiences (Section 5.2)
  const experienciasTotalMeses = calcularMesesTotais(candidatoProfile.experiencias);

  // --- AUTH ---
  function login(email: string, _password: string): { ok: boolean; error?: string } {
    const account = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) return { ok: false, error: "E-mail não encontrado. Use rh@empresa.com.br ou ana.mendes@email.com" };
    setUser({ id: account.id, name: account.name, email: account.email, role: account.role });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  // --- RH ACTIONS ---
  function updateCandidateStatus(id: string, status: Status) {
    setCandidates((cs) => cs.map((c) => c.id === id ? { ...c, status } : c));
  }

  function deleteCandidate(id: string) {
    setCandidates((cs) => cs.filter((c) => c.id !== id));
  }

  function addCandidate(data: Omit<Candidate, "id" | "status" | "appliedDate">) {
    const newC: Candidate = {
      ...data,
      id: Date.now().toString(),
      status: "Novo",
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setCandidates((cs) => [newC, ...cs]);
  }

  function createJob(data: Omit<Job, "id" | "candidates" | "postedDate">) {
    const newJ: Job = {
      ...data,
      id: Date.now().toString(),
      candidates: 0,
      postedDate: new Date().toISOString().split("T")[0],
    };
    setJobs((js) => [...js, newJ]);
  }

  function updateJob(id: string, data: Partial<Omit<Job, "id" | "candidates" | "postedDate">>) {
    setJobs((js) => js.map((j) => j.id === id ? { ...j, ...data } : j));
  }

  function updateCandidaturaStatus(id: string, status: Status) {
    setCandidaturas((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              historico: [
                ...c.historico,
                { id: Date.now().toString(), status, data: new Date().toISOString().split("T")[0], alteradoPor: "RH - TalentBase" },
              ],
            }
          : c
      )
    );
  }

  // --- CANDIDATO ACTIONS ---
  function applyToJob(vagaId: string): { ok: boolean; error?: string } {
    if (!user || user.role !== "Candidato") return { ok: false, error: "Faça login como candidato para se candidatar." };
    const already = candidaturas.find((c) => c.candidatoId === user.id && c.vagaId === vagaId);
    if (already) return { ok: false, error: "Você já se candidatou a esta vaga." };
    const job = jobs.find((j) => j.id === vagaId);
    if (!job || job.status === "Encerrada") return { ok: false, error: "Esta vaga não está disponível." };
    const newCandidatura: Candidatura = {
      id: Date.now().toString(),
      candidatoId: user.id,
      vagaId,
      status: "Novo",
      dataCandidatura: new Date().toISOString().split("T")[0],
      historico: [{ id: Date.now().toString(), status: "Novo", data: new Date().toISOString().split("T")[0], alteradoPor: "Sistema" }],
    };
    setCandidaturas((cs) => [...cs, newCandidatura]);
    setJobs((js) => js.map((j) => j.id === vagaId ? { ...j, candidates: j.candidates + 1 } : j));
    return { ok: true };
  }

  function updateCandidatoProfile(data: Partial<Omit<CandidatoProfile, "id" | "experiencias">>) {
    setCandidatoProfile((p) => ({ ...p, ...data }));
  }

  function addExperiencia(data: Omit<Experiencia, "id" | "candidatoId">) {
    const newExp: Experiencia = { ...data, id: Date.now().toString(), candidatoId: user?.id ?? "1" };
    setCandidatoProfile((p) => ({ ...p, experiencias: [...p.experiencias, newExp] }));
  }

  function updateExperiencia(id: string, data: Partial<Omit<Experiencia, "id" | "candidatoId">>) {
    setCandidatoProfile((p) => ({
      ...p,
      experiencias: p.experiencias.map((e) => e.id === id ? { ...e, ...data } : e),
    }));
  }

  function deleteExperiencia(id: string) {
    setCandidatoProfile((p) => ({ ...p, experiencias: p.experiencias.filter((e) => e.id !== id) }));
  }

  const myCandidaturas = user ? candidaturas.filter((c) => c.candidatoId === user.id) : [];

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <AppContext.Provider value={{
        candidates, jobs, candidaturas, candidatoProfile, experienciasTotalMeses,
        updateCandidateStatus, deleteCandidate, addCandidate, createJob, updateJob, updateCandidaturaStatus,
        applyToJob, updateCandidatoProfile, addExperiencia, updateExperiencia, deleteExperiencia, myCandidaturas,
      }}>
        {children}
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}
