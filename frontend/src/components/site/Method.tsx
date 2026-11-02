import { MethodStepper } from "@/components/motion/MethodStepper";
import { Reveal } from "@/components/motion/Reveal";
import type { Dictionary } from "@/lib/dictionaries";

/** METH/ODE: a display title, then the steps, pinned one at a time while scrolling. */
export function Method({ dict }: { dict: Dictionary }) {
  return (
    <section id="method" data-index="02" aria-labelledby="method-title" className="relative bg-bg">
      <Reveal className="gutter pt-24 md:pt-36">
        <div className="mb-8 flex items-center gap-4">
          <p className="eyebrow shrink-0 text-accent-ink">(02) — {dict.method.title}</p>
          <span data-line className="h-px flex-1 bg-border" />
        </div>
        <h2 id="method-title" data-split className="display text-[clamp(4rem,16vw,17rem)]">
          {dict.method.solid}
          <span className="text-outline">{dict.method.outline}</span>
        </h2>
      </Reveal>
      <MethodStepper steps={dict.method.steps} />
    </section>
  );
}
