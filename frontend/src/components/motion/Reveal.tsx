"use client";

import { type ElementType, type ReactNode, useRef } from "react";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";

interface RevealProps {
  as?: ElementType;
  className?: string;
  id?: string;
  /** Section number shown by the side gauge. */
  index?: string;
  children: ReactNode;
}

/**
 * Animates the marked elements inside it as they scroll into view:
 *   data-split      lines rise out of a mask
 *   data-words      words light up one after the other while scrolling (a manifesto)
 *   data-fade       fades and rises; data-fade-stagger does it child by child
 *   data-line       a rule draws itself from the left
 * Content is server-rendered and visible without scripts or with reduced motion.
 */
export function Reveal({ as: Tag = "div", className, id, index, children }: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        for (const el of root.querySelectorAll<HTMLElement>("[data-split]")) {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (split) =>
              gsap.from(split.lines, {
                yPercent: 110,
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        }
        for (const el of root.querySelectorAll<HTMLElement>("[data-words]")) {
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (split) =>
              gsap.fromTo(
                split.words,
                { opacity: 0.14 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
                },
              ),
          });
        }
        for (const el of root.querySelectorAll<HTMLElement>("[data-fade]")) {
          gsap.from(el, { y: 40, opacity: 0, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        }
        for (const el of root.querySelectorAll<HTMLElement>("[data-fade-stagger]")) {
          gsap.from(el.children, {
            y: 40,
            opacity: 0,
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        }
        for (const el of root.querySelectorAll<HTMLElement>("[data-line]")) {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.6,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        }
      });
    },
    { scope },
  );

  return (
    <Tag ref={scope} id={id} data-index={index} className={className}>
      {children}
    </Tag>
  );
}
