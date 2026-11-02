"use client";

import { useLenis } from "@/components/motion/SmoothScroll";

export function BackToTop({ label }: { label: string }) {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }))}
      className="eyebrow group inline-flex items-center gap-3 transition-colors hover:text-accent"
    >
      {label}
      <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1">
        ↑
      </span>
    </button>
  );
}
