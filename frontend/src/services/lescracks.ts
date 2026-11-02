import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Article } from "@/services/types";

const SITE = "https://lescracks.com";

interface LesCracksArticle {
  slug: string;
  title: string;
  description: string;
  categoryName: string;
  readingMinutes: number;
  publishedAt: string;
  coverImage: string | null;
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  try {
    const response = await fetch(`${SITE}/api/resources?size=${limit}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`LesCracks responded with ${response.status}`);
    const page = (await response.json()) as { content: LesCracksArticle[] };
    cacheLife("hours");
    return page.content.map((a) => ({
      title: a.title,
      description: a.description,
      url: `${SITE}/blog/${a.slug}`,
      category: a.categoryName,
      readingMinutes: a.readingMinutes,
      publishedAt: a.publishedAt,
      coverUrl: a.coverImage ? `${SITE}${a.coverImage}` : null,
    }));
  } catch {
    cacheLife("seconds");
    return [];
  }
}
