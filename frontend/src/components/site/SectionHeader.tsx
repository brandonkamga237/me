import type { ReactNode } from "react";

interface SectionHeaderProps {
  id: string;
  index: string;
  label: string;
  /** The display title: its first word is solid, the rest outlined. */
  title: string;
  intro?: string;
  aside?: ReactNode;
}

/** (02) — LABEL, a rule, then a display title set across the width. Animated by an enclosing Reveal. */
export function SectionHeader({ id, index, label, title, intro, aside }: SectionHeaderProps) {
  const [first, ...rest] = title.split(" ");
  return (
    <header className="mb-14 md:mb-20">
      <div className="mb-8 flex items-center gap-4">
        <p className="eyebrow shrink-0 text-accent-ink">
          ({index}) — {label}
        </p>
        <span data-line className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2
          id={`${id}-title`}
          data-split
          className="display text-[clamp(3.2rem,10.5vw,10.5rem)] lg:col-span-8"
        >
          {first}
          {rest.length > 0 && (
            <>
              {" "}
              <span className="text-outline">{rest.join(" ")}</span>
            </>
          )}
        </h2>
        {(intro || aside) && (
          <div data-fade className="grid gap-6 lg:col-span-4 lg:pb-3">
            {intro && (
              <p className="max-w-md border-l border-accent pl-4 text-base leading-relaxed text-muted">{intro}</p>
            )}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
