"use client";

import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

/**
 * A gold ring that trails the pointer and grows over links and buttons. The native cursor stays:
 * the ring only adds feedback, on devices with a fine pointer.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ring.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION} and (pointer: fine)`, () => {
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        x(event.clientX);
        y(event.clientY);
        const hover = (event.target as Element | null)?.closest("a, button, [data-cursor]");
        gsap.to(el, { scale: hover ? 2.4 : 1, opacity: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      };
      const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-7 rounded-full border border-accent mix-blend-difference [@media(pointer:fine)]:block"
    />
  );
}
