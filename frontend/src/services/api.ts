import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError, apiFetch } from "@/services/http";
import type { Experience, Profile, Project, Skill } from "@/services/types";

/** Cache tags of the public content; admin actions expire them after a change. */
export const contentTags = {
  profile: "profile",
  projects: "projects",
  experiences: "experiences",
  skills: "skills",
} as const;

async function read<T>(path: string, tag: string, fallback: T): Promise<T> {
  "use cache";
  cacheTag(tag);
  try {
    const data = await apiFetch<T>(path);
    cacheLife("max");
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      cacheLife("max");
      return fallback;
    }
    // The API is unreachable (a build without it, an outage): a short life makes the next request retry.
    cacheLife("seconds");
    return fallback;
  }
}

export function getProfile(): Promise<Profile | null> {
  return read<Profile | null>("/api/profile", contentTags.profile, null);
}

export function getProjects(): Promise<Project[]> {
  return read<Project[]>("/api/projects", contentTags.projects, []);
}

export function getProject(slug: string): Promise<Project | null> {
  return read<Project | null>(`/api/projects/${encodeURIComponent(slug)}`, contentTags.projects, null);
}

export function getExperiences(): Promise<Experience[]> {
  return read<Experience[]>("/api/experiences", contentTags.experiences, []);
}

export function getSkills(): Promise<Skill[]> {
  return read<Skill[]>("/api/skills", contentTags.skills, []);
}
