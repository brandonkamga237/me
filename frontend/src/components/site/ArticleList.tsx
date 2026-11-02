"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

export interface ArticleRow {
  url: string;
  title: string;
  category: string;
  meta: string;
  coverUrl: string | null;
}

interface ArticleListProps {
  articles: ArticleRow[];
}

/** Article rows; on a desktop pointer, the cover of the hovered row floats along with the cursor. */
export function ArticleList({ articles }: ArticleListProps) {
  const scope = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const card = preview.current;
      if (!root || !card) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and (pointer: fine) and (min-width: 768px)`, () => {
        gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0, rotate: -6 });
        const x = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3.out" });
        const y = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          x(event.clientX - rect.left);
          y(event.clientY - rect.top);
        };
        const enter = () => gsap.to(card, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "power3.out" });
        const leave = () => gsap.to(card, { autoAlpha: 0, scale: 0.6, rotate: -6, duration: 0.4, ease: "power3.in" });
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerenter", enter);
        root.addEventListener("pointerleave", leave);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerenter", enter);
          root.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative" onPointerLeave={() => setActive(null)}>
      <ol className="border-t border-border">
        {articles.map((a, i) => (
          <li key={a.url} onPointerEnter={() => setActive(i)} className="border-b border-border">
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3 py-7 md:grid-cols-[4rem_1fr_14rem_auto] md:py-9"
            >
              <span className="eyebrow tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.35rem,2.6vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.03em] transition-[color,translate] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent-ink">
                {a.title}
              </span>
              <span className="col-start-2 eyebrow text-muted md:col-start-auto">
                {a.category}
                <span className="mt-1.5 block normal-case tracking-normal">{a.meta}</span>
              </span>
              <span
                aria-hidden
                className="row-start-1 col-start-3 grid size-11 place-items-center rounded-full border border-border-strong transition-[background-color,color,rotate] duration-500 group-hover:-rotate-45 group-hover:bg-fg group-hover:text-bg md:col-start-4"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden aspect-[1200/630] w-[22rem] overflow-hidden rounded-xl bg-panel shadow-2xl md:block"
      >
        {articles.map(
          (a, i) =>
            a.coverUrl && (
              <Image
                key={a.url}
                src={a.coverUrl}
                alt=""
                fill
                sizes="22rem"
                className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
              />
            ),
        )}
      </div>
    </div>
  );
}
