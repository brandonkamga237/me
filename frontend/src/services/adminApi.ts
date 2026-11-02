import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { ApiError, apiFetch } from "@/services/http";
import type {
  Experience,
  ExperienceInput,
  Message,
  Profile,
  Project,
  ProjectInput,
  Skill,
  SkillInput,
} from "@/services/types";

type Options = Parameters<typeof apiFetch>[1];

async function call<T>(path: string, options: Options = {}): Promise<T> {
  const token = await getSessionToken();
  if (!token) redirect("/admin/login");
  try {
    return await apiFetch<T>(path, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/admin/login?expired=1");
    throw error;
  }
}

export async function login(email: string, password: string, forwardedFor: string | null) {
  return apiFetch<{ access_token: string; expires_at: string }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    forwardedFor,
  });
}

export const adminApi = {
  me: () => call<{ email: string; expires_at: string }>("/api/auth/me"),

  getProfile: async (): Promise<Profile | null> => {
    try {
      return await call<Profile>("/api/profile");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
  saveProfile: (body: Profile) => call<Profile>("/api/admin/profile", { method: "PUT", body }),

  listProjects: () => call<Project[]>("/api/admin/projects"),
  getProject: (id: string) => call<Project>(`/api/admin/projects/${encodeURIComponent(id)}`),
  createProject: (body: ProjectInput) => call<Project>("/api/admin/projects", { method: "POST", body }),
  updateProject: (id: string, body: ProjectInput) =>
    call<Project>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "PUT", body }),
  deleteProject: (id: string) => call<void>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listExperiences: () => call<Experience[]>("/api/experiences"),
  createExperience: (body: ExperienceInput) => call<Experience>("/api/admin/experiences", { method: "POST", body }),
  updateExperience: (id: string, body: ExperienceInput) =>
    call<Experience>(`/api/admin/experiences/${encodeURIComponent(id)}`, { method: "PUT", body }),
  deleteExperience: (id: string) =>
    call<void>(`/api/admin/experiences/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listSkills: () => call<Skill[]>("/api/skills"),
  createSkill: (body: SkillInput) => call<Skill>("/api/admin/skills", { method: "POST", body }),
  updateSkill: (id: string, body: SkillInput) =>
    call<Skill>(`/api/admin/skills/${encodeURIComponent(id)}`, { method: "PUT", body }),
  deleteSkill: (id: string) => call<void>(`/api/admin/skills/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listMessages: () => call<Message[]>("/api/admin/messages"),
  markMessage: (id: string, read: boolean) =>
    call<Message>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "PATCH", body: { read } }),
  deleteMessage: (id: string) => call<void>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
