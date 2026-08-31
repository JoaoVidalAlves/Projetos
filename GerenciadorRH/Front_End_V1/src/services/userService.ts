import type { CandidateProfile, Experience } from "../types";
import { seedCandidateProfile } from "../utils/mockDatabase";
import { simulateLatency, generateId } from "./api";

let profileStore: CandidateProfile = { ...seedCandidateProfile, experiences: [...seedCandidateProfile.experiences] };

export async function getCandidateProfile(): Promise<CandidateProfile> {
  return simulateLatency({ ...profileStore, experiences: [...profileStore.experiences] });
}

export type UpdateProfileInput = Partial<Omit<CandidateProfile, "id" | "experiences">>;

export async function updateCandidateProfile(input: UpdateProfileInput): Promise<CandidateProfile> {
  profileStore = { ...profileStore, ...input };
  return simulateLatency({ ...profileStore, experiences: [...profileStore.experiences] });
}

export type NewExperienceInput = Omit<Experience, "id" | "candidateId">;

export async function addExperience(input: NewExperienceInput): Promise<Experience> {
  const created: Experience = { ...input, id: generateId("exp-"), candidateId: profileStore.id };
  profileStore = { ...profileStore, experiences: [...profileStore.experiences, created] };
  return simulateLatency(created);
}

export async function updateExperience(id: string, input: Partial<NewExperienceInput>): Promise<Experience | undefined> {
  profileStore = {
    ...profileStore,
    experiences: profileStore.experiences.map((e) => (e.id === id ? { ...e, ...input } : e)),
  };
  return simulateLatency(profileStore.experiences.find((e) => e.id === id));
}

export async function deleteExperience(id: string): Promise<void> {
  profileStore = { ...profileStore, experiences: profileStore.experiences.filter((e) => e.id !== id) };
  return simulateLatency(undefined);
}
