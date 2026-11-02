"use client";

import { type ReactNode, useRef } from "react";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";

interface HeroMotionProps {
  children: ReactNode;
  className?: string;
}

/**
 * The hero's choreography. On arrival, the letters of each [data-hero-line] rise out of a mask and
 * the [data-hero-fade] details follow. On scroll, the two lines of the name drift apart sideways
 * and the details fade, as the next section slides over.
 */
export function HeroMotion({ children, className = "" }: HeroMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", root);
        const details = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", root);
        const splits = lines.map((line) => SplitText.create(line, { type: "chars", mask: "chars" }));

        // On a slow connection the CSS fallback has already shown the name: replaying would flash it.
        const late = performance.now() > 1200;
        const intro = gsap.timeline({ delay: 0.15, paused: late });
        intro.set(root.querySelectorAll("[data-intro]"), { visibility: "visible" });
        splits.forEach((split, i) => {
          intro.from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.045, ease: "expo.out" }, i * 0.12);
        });
        intro.from(details, { y: 24, opacity: 0, duration: 1, stagger: 0.06, ease: "power3.out" }, 0.55);
        // The portrait and stickers are slapped on one after the other.
        intro.from(
          root.querySelectorAll("[data-sticker]"),
          { scale: 0, opacity: 0, duration: 0.9, stagger: 0.09, ease: "back.out(2.2)" },
          0.75,
        );

        if (late) intro.progress(1);

        const scroll = { trigger: root, start: "top top", end: "bottom top", scrub: true };
        if (lines[0]) gsap.to(lines[0], { xPercent: -18, ease: "none", scrollTrigger: scroll });
        if (lines[1]) gsap.to(lines[1], { xPercent: 14, ease: "none", scrollTrigger: scroll });
        const photo = root.querySelector("[data-hero-photo]");
        if (photo) gsap.to(photo, { yPercent: -30, rotate: 6, ease: "none", scrollTrigger: scroll });
        gsap.to(details, { opacity: 0, y: -30, ease: "none", scrollTrigger: { ...scroll, end: "40% top" } });
        return () => splits.forEach((split) => split.revert());
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
