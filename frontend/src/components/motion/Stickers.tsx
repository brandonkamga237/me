"use client";

import { type ReactNode, useRef } from "react";
import { Draggable, gsap, MOTION, useGSAP } from "@/lib/gsap";

interface StickersProps {
  children: ReactNode;
  className?: string;
}

/**
 * Makes every [data-sticker] inside it draggable, by mouse or finger, within its bounds. A thrown
 * sticker glides on with inertia; the one picked up comes to the front.
 */
export function Stickers({ children, className = "" }: StickersProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const glide = window.matchMedia(MOTION).matches;
      let top = 20;
      const draggables = Draggable.create(root.querySelectorAll<HTMLElement>("[data-sticker]"), {
        type: "x,y",
        bounds: root,
        inertia: glide,
        edgeResistance: 0.7,
        allowNativeTouchScrolling: false,
        zIndexBoost: false,
        onPress() {
          top += 1;
          gsap.set(this.target, { zIndex: top });
          if (glide) gsap.to(this.target, { scale: 1.08, duration: 0.3, ease: "back.out(3)" });
        },
        onRelease() {
          if (glide) gsap.to(this.target, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        },
      });
      return () => draggables.forEach((d) => d.kill());
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
