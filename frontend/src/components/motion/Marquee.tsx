"use client";

import { type ReactNode, useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one loop at rest. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * An endless band. It speeds up with the scroll velocity and turns with the scroll direction.
 * The content is rendered twice so the loop has no seam; the copy is hidden from assistive tech.
 */
export function Marquee({ children, duration = 40, reverse = false, className = "" }: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = scope.current?.firstElementChild;
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const base = reverse ? -1 : 1;
        const loop = gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
        // Start far into the endless timeline, so it can also play backwards.
        loop.totalTime(duration * 1000);
        loop.timeScale(base);
        const trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const speed = base * self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
            gsap.to(loop, {
              timeScale: speed * boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: speed, duration: 1.2, ease: "power2.out", overwrite: true });
              },
            });
          },
        });
        return () => trigger.kill();
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={`overflow-hidden ${className}`}>
      <div className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
