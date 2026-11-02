export interface Localized {
  en: string;
  fr: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  headline: Localized;
  bio: Localized;
  location: string;
  email: string;
  available: boolean;
  resume_url: string | null;
  socials: SocialLink[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: Localized;
  description: Localized;
  stack: string[];
  repo_url: string | null;
  live_url: string | null;
  cover_url: string | null;
  featured: boolean;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: Localized;
  location: string;
  start: string;
  end: string | null;
  description: Localized;
  url: string | null;
}

export const skillCategories = ["language", "backend", "frontend", "data", "platform", "practice"] as const;
export type SkillCategory = (typeof skillCategories)[number];

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  position: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  body: string;
  created_at: string;
  read: boolean;
}

export interface Article {
  title: string;
  description: string;
  url: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  coverUrl: string | null;
}

export type ProjectInput = Omit<Project, "id" | "slug" | "created_at" | "updated_at"> & { slug: string | null };
export type ExperienceInput = Omit<Experience, "id">;
export type SkillInput = Omit<Skill, "id">;
