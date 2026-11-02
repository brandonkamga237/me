import { BackToTop } from "@/components/site/BackToTop";
import { Clock } from "@/components/site/Clock";
import type { Dictionary } from "@/lib/dictionaries";

/** The name set across the full width, and the last details. */
export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="gutter relative overflow-hidden border-t border-border bg-bg pb-6 pt-16">
      <p aria-hidden className="display select-none whitespace-nowrap text-center text-[12.2vw] text-outline">
        Brandon Kamga
      </p>
      <div className="eyebrow mt-10 grid gap-4 text-muted md:grid-cols-3 md:items-center">
        <p>© Brandon Kamga — {dict.footer.built}</p>
        <p className="md:justify-self-center">
          {dict.nav.local} <Clock className="ml-2 text-fg" />
        </p>
        <div className="flex gap-6 md:justify-self-end">
          <a
            href="https://github.com/brandonkamga237/me"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {dict.footer.source} ↗
          </a>
          <BackToTop label={dict.footer.top} />
        </div>
      </div>
    </footer>
  );
}
