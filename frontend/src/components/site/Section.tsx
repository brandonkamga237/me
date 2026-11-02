import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export function Section({ id, index, title, intro, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border py-20 sm:py-28">
      <div className="mb-12 grid gap-4 sm:grid-cols-[10rem_1fr]">
        <p className="font-mono text-sm text-muted">{index}</p>
        <div>
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
        </div>
      </div>
      <div className="sm:pl-[11rem]">{children}</div>
    </section>
  );
}
