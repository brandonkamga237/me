"use client";

import { useRef } from "react";
import { DESKTOP_MOTION, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface Step {
  label: string;
  title: string;
  text: string;
}

interface MethodStepperProps {
  steps: Step[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The steps of the method, one at a time: the section pins, an odometer counts 01 → 04 and each
 * step slides in as you scroll. On small screens or with reduced motion, the steps are a list.
 */
export function MethodStepper({ steps }: MethodStepperProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-step]", root);
        const segments = gsap.utils.toArray<HTMLElement>("[data-segment]", root);
        const odometer = root.querySelector("[data-odometer]");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: 1 },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (steps.length - 0.5)}`,
            pin: true,
            scrub: 1,
            snap: { snapTo: "labels", duration: 0.6, ease: "power2.inOut" },
          },
        });
        timeline.addLabel("step0");
        segments.forEach((segment, i) => {
          if (i === 0) timeline.fromTo(segment, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        });
        items.forEach((item, i) => {
          if (i === 0) return;
          const at = `step${i}`;
          timeline
            .addLabel(at, "+=0.4")
            .to(items[i - 1], { yPercent: -25, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, at)
            .fromTo(item, { yPercent: 25, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, `${at}+=0.45`)
            .to(odometer, { yPercent: (-100 * i) / steps.length }, at)
            .fromTo(segments[i], { scaleX: 0 }, { scaleX: 1, ease: "none" }, at);
        });
        timeline.to({}, { duration: 0.4 });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    },
    { scope, dependencies: [steps.length] },
  );

  return (
    <div ref={scope} className="gutter flex flex-col justify-center py-16 md:min-h-dvh md:py-24">
      <div className="md:corners grid gap-12 md:grid-cols-12 md:items-center md:gap-8 md:p-12">
        {/* The odometer: one number per step, stacked, the window shows one. */}
        <div aria-hidden className="hidden h-[0.8em] overflow-hidden text-[clamp(8rem,20vw,19rem)] leading-[0.8] md:col-span-5 md:motion-safe:block">
          <div data-odometer className="flex flex-col">
            {steps.map((_, i) => (
              <span key={i} className="display text-outline-accent block h-[0.8em] tabular-nums">
                {pad(i + 1)}
              </span>
            ))}
          </div>
        </div>
        {/* Phones: each step is a card that sticks and stacks over the previous one. */}
        <ol className="grid gap-6 md:col-span-7 md:gap-12 md:motion-safe:grid-cols-1 md:motion-safe:grid-rows-1">
          {steps.map((step, i) => (
            <li
              key={step.label}
              data-step
              style={{ top: `calc(5.5rem + ${i} * 1rem)` }}
              className={`grid content-center gap-5 max-md:sticky max-md:min-h-[24rem] max-md:rounded-[1.75rem] max-md:border max-md:border-border-strong max-md:bg-panel max-md:p-7 max-md:shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.9)] md:motion-safe:col-start-1 md:motion-safe:row-start-1 ${i > 0 ? "md:motion-safe:invisible" : ""}`}
            >
              <span aria-hidden className="display text-outline-accent text-[5.5rem] leading-[0.8] tabular-nums md:text-[7rem] md:motion-safe:hidden">
                {pad(i + 1)}
              </span>
              <p className="eyebrow flex items-center gap-3 text-accent-ink">
                <span className="tabular-nums">
                  {pad(i + 1)} / {pad(steps.length)}
                </span>
                <span className="h-px w-8 bg-current" />
                {step.label}
              </p>
              <h3 className="text-[clamp(1.9rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                {step.title}
              </h3>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden className="mt-8 hidden gap-2 md:motion-safe:flex">
        {steps.map((step) => (
          <span key={step.label} className="relative h-px flex-1 bg-border">
            <span data-segment className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
