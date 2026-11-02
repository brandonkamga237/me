"use client";

import { type ReactNode, useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Pulls its content towards the pointer while it hovers, then springs back. */
export function Magnetic({ children, strength = 0.35, className = "" }: MagneticProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and (pointer: fine)`, () => {
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          x((event.clientX - rect.left - rect.width / 2) * strength);
          y((event.clientY - rect.top - rect.height / 2) * strength);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope },
  );

  return (
    <span ref={scope} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
