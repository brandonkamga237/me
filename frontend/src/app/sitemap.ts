import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { locales } from "@/lib/i18n";
import { getProjects } from "@/services/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const paths = ["", ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.map((path) => ({
    url: `${env.siteUrl}/en${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${env.siteUrl}/${l}${path}`])) },
  }));
}
