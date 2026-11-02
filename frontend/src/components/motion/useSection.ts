"use client";

import { useEffect, useState } from "react";

export interface SectionState {
  /** The data-index of the section crossing the middle of the screen, e.g. "03". */
  index: string;
  /** How many sections take part. */
  total: number;
  /** Scroll progress through the whole page, 0 to 1. */
  progress: number;
}

/** Follows the [data-index] sections while scrolling, for the side gauge and the mobile dock. */
export function useSection(): SectionState {
  const [state, setState] = useState<SectionState>({ index: "00", total: 0, progress: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-index]")];
      const middle = window.innerHeight / 2;
      const current = sections.findLast((s) => s.getBoundingClientRect().top <= middle);
      const next = {
        index: current?.dataset.index ?? "00",
        total: sections.length,
        progress: max > 0 ? Math.min(1, window.scrollY / max) : 0,
      };
      setState((prev) =>
        prev.index === next.index && prev.total === next.total && Math.abs(prev.progress - next.progress) < 0.002
          ? prev
          : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return state;
}
