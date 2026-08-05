import { experience } from "@/data/experience";
import type { ExperienceEntry } from "@/types/experience";

export function getAllExperience(): ExperienceEntry[] {
  return experience;
}

export function getExperienceById(id: string): ExperienceEntry | undefined {
  return experience.find((entry) => entry.id === id);
}
