"use client";

import { useSection } from "@/components/motion/useSection";

const TICKS = 24;

/** The side gauge: graduations that fill with the page, and the index of the section in view. */
export function ScrollHud() {
  const { index, total, progress } = useSection();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 text-white mix-blend-difference lg:flex"
    >
      <span className="eyebrow tabular-nums">{index}</span>
      <div className="flex flex-col items-end gap-[7px]">
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className="block h-px bg-current transition-opacity duration-300"
            style={{ width: i % 6 === 0 ? 16 : 8, opacity: 0.25 + 0.75 * Math.min(1, Math.max(0, progress * TICKS - i)) }}
          />
        ))}
      </div>
      <span className="eyebrow tabular-nums opacity-50">{String(total).padStart(2, "0")}</span>
    </div>
  );
}
