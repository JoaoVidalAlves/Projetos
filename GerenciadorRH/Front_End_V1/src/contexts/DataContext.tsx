import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Candidate, Job, Application, CandidateProfile, Status, NewCandidateInput, NewJobInput, UpdateJobInput } from "../types";
import * as candidateService from "../services/candidateService";
import * as vacancyService from "../services/vacancyService";
import * as applicationService from "../services/applicationService";
import * as userService from "../services/userService";
import { calculateTotalExperienceMonths } from "../utils/experience";
import { useAuth } from "../hooks/useAuth";

export interface DataContextValue {
  loading: boolean;
  candidates: Candidate[];
  jobs: Job[];
  applications: Application[];
  candidateProfile: CandidateProfile;
  myApplications: Application[];
  totalExperienceMonths: number;

  // RH — candidatos
  updateCandidateStatus: (id: string, status: Status) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  createCandidate: (input: NewCandidateInput) => Promise<void>;

  // RH — vagas
  createJob: (input: NewJobInput) => Promise<void>;
  updateJob: (id: string, input: UpdateJobInput) => Promise<void>;

  // RH — candidaturas
  updateApplicationStatus: (id: string, status: Status) => Promise<void>;

  // Candidato
  applyToJob: (jobId: string) => Promise<{ ok: boolean; error?: string }>;
  updateCandidateProfile: (input: userService.UpdateProfileInput) => Promise<void>;
  addExperience: (input: userService.NewExperienceInput) => Promise<void>;
  updateExperience: (id: string, input: Partial<userService.NewExperienceInput>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  refresh: () => Promise<void>;
}

export const DataContext = createContext<DataContextValue | null>(null);

const emptyProfile: CandidateProfile = {
  id: "",
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  desiredPosition: "",
  department: "",
  skills: [],
  experiences: [],
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(emptyProfile);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [candidatesData, jobsData, applicationsData, profileData] = await Promise.all([
      candidateService.listCandidates(),
      vacancyService.listJobs(),
      applicationService.listApplications(),
      userService.getCandidateProfile(),
    ]);
    setCandidates(candidatesData);
    setJobs(jobsData);
    setApplications(applicationsData);
    setCandidateProfile(profileData);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // --- RH: candidatos ---
  async function updateCandidateStatus(id: string, status: Status) {
    const updated = await candidateService.updateCandidateStatus(id, status);
    if (updated) setCandidates((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function deleteCandidate(id: string) {
    await candidateService.deleteCandidate(id);
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  async function createCandidate(input: NewCandidateInput) {
    const created = await candidateService.createCandidate(input);
    setCandidates((prev) => [created, ...prev]);
  }

  // --- RH: vagas ---
  async function createJob(input: NewJobInput) {
    const created = await vacancyService.createJob(input);
    setJobs((prev) => [...prev, created]);
  }

  async function updateJob(id: string, input: UpdateJobInput) {
    const updated = await vacancyService.updateJob(id, input);
    if (updated) setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
  }

  // --- RH: candidaturas ---
  async function updateApplicationStatus(id: string, status: Status) {
    const updated = await applicationService.updateApplicationStatus(id, status);
    if (updated) setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  // --- Candidato ---
  async function applyToJob(jobId: string) {
    if (!user || user.role !== "Candidato") {
      return { ok: false, error: "Faça login como candidato para se candidatar." };
    }
    const result = await applicationService.applyToJob(user.id, jobId);
    if (result.ok && result.application) {
      setApplications((prev) => [...prev, result.application!]);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, candidatesCount: j.candidatesCount + 1 } : j)));
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }

  async function updateCandidateProfileData(input: userService.UpdateProfileInput) {
    const updated = await userService.updateCandidateProfile(input);
    setCandidateProfile(updated);
  }

  async function addExperience(input: userService.NewExperienceInput) {
    const created = await userService.addExperience(input);
    setCandidateProfile((prev) => ({ ...prev, experiences: [...prev.experiences, created] }));
  }

  async function updateExperience(id: string, input: Partial<userService.NewExperienceInput>) {
    const updated = await userService.updateExperience(id, input);
    if (updated) {
      setCandidateProfile((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) => (e.id === id ? updated : e)),
      }));
    }
  }

  async function deleteExperience(id: string) {
    await userService.deleteExperience(id);
    setCandidateProfile((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  }

  const myApplications = user ? applications.filter((a) => a.candidateId === user.id) : [];
  const totalExperienceMonths = calculateTotalExperienceMonths(candidateProfile.experiences);

  return (
    <DataContext.Provider
      value={{
        loading,
        candidates,
        jobs,
        applications,
        candidateProfile,
        myApplications,
        totalExperienceMonths,
        updateCandidateStatus,
        deleteCandidate,
        createCandidate,
        createJob,
        updateJob,
        updateApplicationStatus,
        applyToJob,
        updateCandidateProfile: updateCandidateProfileData,
        addExperience,
        updateExperience,
        deleteExperience,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
