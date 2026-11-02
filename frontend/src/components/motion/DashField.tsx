"use client";

import { useEffect, useRef } from "react";
import { MOTION, ScrollTrigger } from "@/lib/gsap";

type Shape = "disc" | "ring";

interface DashFieldProps {
  /** The shape the dashes draw at rest; scrolling through the section morphs it into the other. */
  shape?: Shape;
  /** Centre of the shape, as fractions of the canvas, on wide and narrow screens (pass constants). */
  center?: { x: number; y: number };
  mobileCenter?: { x: number; y: number };
  className?: string;
}

// Module-level, so the effect only restarts when a caller passes a different point.
const DEFAULT_CENTER = { x: 0.7, y: 0.48 };
const DEFAULT_MOBILE_CENTER = { x: 0.5, y: 0.36 };
const GOLD = "212, 175, 55";
const WHITE = "255, 255, 255";
const BUCKETS = 6;

/**
 * A field of short dashes that draw a shape, swirl around it and lean towards the pointer.
 * Canvas 2D, a few thousand strokes per frame, paused whenever it is off screen.
 */
export function DashField({
  shape = "disc",
  center = DEFAULT_CENTER,
  mobileCenter = DEFAULT_MOBILE_CENTER,
  className = "",
}: DashFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const animate = window.matchMedia(MOTION).matches;

    let width = 0;
    let height = 0;
    let spacing = 18;
    let frame = 0;
    let visible = true;
    let morph = 0;
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      spacing = width < 768 ? 16 : 19;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!animate) draw(0);
    };

    const intensity = (r: number, angle: number, time: number, m: number): number => {
      const wobble = 0.07 * Math.sin(angle * 3 + time * 0.9) + 0.04 * Math.sin(angle * 5 - time * 1.3);
      const rr = r + wobble;
      const disc = 1 - smoothstep(0.55, 1.02, rr);
      const ring = 1 - smoothstep(0.0, 0.2, Math.abs(rr - 0.86));
      const [from, to] = shape === "disc" ? [disc, ring] : [ring, disc];
      return from + (to - from) * m;
    };

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const narrow = width < 768;
      const c = narrow ? mobileCenter : center;
      const cx = width * c.x;
      const cy = height * c.y - morph * height * 0.08;
      const radius = Math.min(width, height) * (narrow ? 0.42 : 0.4) * (1 + morph * 0.15);

      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.sy += (pointer.y - pointer.sy) * 0.12;

      // Strokes are grouped by opacity so each group is a single path.
      const gold: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());
      const white: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.hypot(dx, dy) / radius;
          if (r > 1.35) continue;
          const angle = Math.atan2(dy, dx);
          let value = intensity(r, angle, time, morph);

          const px = x - pointer.sx;
          const py = y - pointer.sy;
          const near = Math.max(0, 1 - Math.hypot(px, py) / 160);
          value = Math.min(1, value + near * 0.5);
          if (value < 0.04) continue;

          // Dashes follow the swirl around the centre, and turn towards the pointer when it is close.
          const swirl = angle + Math.PI / 2 + 0.55 * Math.sin(time * 0.6 + r * 4);
          const toPointer = Math.atan2(py, px);
          const dir = swirl + shortestAngle(swirl, toPointer) * near;
          const length = 2 + 6.5 * value;
          const hx = (Math.cos(dir) * length) / 2;
          const hy = (Math.sin(dir) * length) / 2;

          const bucket = Math.min(BUCKETS - 1, Math.floor(value * BUCKETS));
          const target = (x * 7 + y * 13) % 5 === 0 || value > 0.72 ? gold : white;
          const path = target[bucket];
          path.moveTo(x - hx, y - hy);
          path.lineTo(x + hx, y + hy);
        }
      }

      ctx.lineCap = "round";
      ctx.lineWidth = 1.4;
      for (let i = 0; i < BUCKETS; i++) {
        const alpha = (i + 1) / BUCKETS;
        ctx.strokeStyle = `rgba(${WHITE}, ${alpha * 0.45})`;
        ctx.stroke(white[i]);
        ctx.strokeStyle = `rgba(${GOLD}, ${0.25 + alpha * 0.75})`;
        ctx.stroke(gold[i]);
      }
    }

    const loop = (now: number) => {
      draw(now / 1000);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (!animate) return () => resizeObserver.disconnect();

    const section = canvas.parentElement ?? canvas;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        morph = self.progress;
      },
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      trigger.kill();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [shape, center, mobileCenter]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function shortestAngle(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
