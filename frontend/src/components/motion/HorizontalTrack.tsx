"use client";

import { type ReactNode, useRef } from "react";
import { DESKTOP_MOTION, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface HorizontalTrackProps {
  children: ReactNode;
  className?: string;
  id?: string;
  index?: string;
}

/**
 * Pins the section and turns vertical scrolling into horizontal travel along its [data-track].
 * Inside, [data-parallax] elements drift against the travel and [data-track-progress] fills up.
 * On small screens or with reduced motion, the panels simply stack.
 */
export function HorizontalTrack({ children, className = "", id, index }: HorizontalTrackProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      const track = section?.querySelector<HTMLElement>("[data-track]");
      if (!section || !track) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        const bar = section.querySelector("[data-track-progress]");
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true },
            },
          );
        }
        for (const el of section.querySelectorAll<HTMLElement>("[data-parallax]")) {
          gsap.fromTo(
            el,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                containerAnimation: travel,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id={id} data-index={index} className={className}>
      {children}
    </section>
  );
}
