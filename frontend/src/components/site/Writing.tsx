import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import { formatDay } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getLatestArticles } from "@/services/lescracks";

interface WritingProps {
  locale: Locale;
  dict: Dictionary;
}

export async function Writing({ locale, dict }: WritingProps) {
  const articles = await getLatestArticles();
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {articles.map((a) => (
          <a
            key={a.url}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:bg-panel"
          >
            {a.coverUrl && (
              <Image
                src={a.coverUrl}
                alt=""
                width={1200}
                height={630}
                className="aspect-[1200/630] w-full border-b border-border object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{a.category}</p>
              <h3 className="mt-2 font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                {a.title}
              </h3>
              <p className="mt-auto pt-4 text-sm text-muted">
                {formatDay(a.publishedAt, locale)} · {a.readingMinutes} {dict.writing.minutes}
              </p>
            </div>
          </a>
        ))}
      </div>
      <a
        href="https://lescracks.com/blog"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        {dict.writing.all} →
      </a>
    </div>
  );
}
