import { Reveal } from "@/components/motion/Reveal";
import { ArticleList } from "@/components/site/ArticleList";
import { SectionHeader } from "@/components/site/SectionHeader";
import type { Dictionary } from "@/lib/dictionaries";
import { formatDay } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getLatestArticles } from "@/services/lescracks";

interface WritingProps {
  locale: Locale;
  dict: Dictionary;
}

export async function Writing({ locale, dict }: WritingProps) {
  const articles = await getLatestArticles(4);
  return (
    <Reveal as="section" id="writing" index="05" className="mode-light gutter pb-24 md:pb-36">
      <SectionHeader
        id="writing"
        index="05"
        label={dict.nav.writing}
        title={dict.writing.title}
        intro={dict.writing.intro}
        aside={
          <a
            href="https://lescracks.com/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow group inline-flex items-center gap-3 justify-self-start text-fg"
          >
            <span className="border-b border-current pb-1 transition-colors group-hover:text-accent-ink">{dict.writing.all}</span>
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              ↗
            </span>
          </a>
        }
      />
      <ArticleList
        articles={articles.map((a) => ({
          url: a.url,
          title: a.title,
          category: a.category,
          meta: `${formatDay(a.publishedAt, locale)} · ${a.readingMinutes} ${dict.writing.minutes}`,
          coverUrl: a.coverUrl,
        }))}
      />
    </Reveal>
  );
}
