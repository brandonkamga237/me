"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { gsap, MOTION, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** The smooth scroller, or null when motion is reduced (the page then scrolls natively). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/** Smooth, inertial scrolling that drives every ScrollTrigger from the same clock. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const instance = new Lenis({ lerp: 0.1, anchors: { offset: 0 }, autoRaf: false });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Shared on the next frame, once it drives the ticker.
    const frame = requestAnimationFrame(() => setLenis(instance));
    return () => {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Sections stream in after the first paint and change the page height: measure again.
  useEffect(() => {
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // A new page starts at the top (or at its #section), and pinned sections measure themselves again.
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    lenis?.scrollTo(target ?? 0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext value={lenis}>{children}</LenisContext>;
}
