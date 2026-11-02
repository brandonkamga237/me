import { DashField } from "@/components/motion/DashField";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { Magnetic } from "@/components/motion/Magnetic";
import { Stickers } from "@/components/motion/Stickers";
import { CameroonFlag } from "@/components/site/CameroonFlag";
import { PhotoSticker } from "@/components/site/PhotoSticker";
import { Sticker } from "@/components/site/Sticker";
import type { Dictionary } from "@/lib/dictionaries";
import type { Profile } from "@/services/types";

interface HeroProps {
  dict: Dictionary;
  /** Null while the profile streams in, or when the API is unreachable: the name still shows. */
  profile: Profile | null;
}

const NAME_SIZE = "text-[clamp(4.2rem,20.5vw,22rem)]";

/** The name across the screen, the title beside it, and the portrait slapped on top with stickers. */
export function Hero({ dict, profile }: HeroProps) {
  const name = profile?.name ?? "Brandon Kamga";
  const words = name.trim().split(/\s+/);
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : "";
  const s = dict.hero.stickers;

  return (
    <section id="top" data-index="00" className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-bg">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <DashField shape="disc" />
      <HeroMotion className="gutter relative flex flex-1 flex-col pb-32 pt-24 md:pb-24 md:pt-28">
        <div className="flex items-start justify-between gap-6">
          <p data-hero-fade className="eyebrow text-muted">
            ({dict.hero.eyebrow}) <span className="text-fg">— 2026</span>
          </p>
          {profile && (
            <p data-hero-fade className="eyebrow inline-flex items-center gap-2.5 text-muted">
              <span
                className={`pulse-dot size-2 rounded-full ${profile.available ? "bg-success text-success" : "bg-muted text-muted"}`}
              />
              {profile.available ? dict.hero.available : dict.hero.unavailable}
            </p>
          )}
        </div>

        <Stickers className="relative my-6 flex flex-1 flex-col justify-start pb-6 md:my-4 md:justify-center md:pb-0">
          <h1 aria-label={`${name}, ${dict.hero.title}`} className="relative flex flex-col leading-none">
            <span data-hero-line data-intro className={`display block ${NAME_SIZE}`}>
              {first}
            </span>
            <span className="flex flex-col-reverse gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
              <span data-hero-fade className="block min-w-0 md:max-w-[28vw] md:shrink md:pb-[1.4vw]">
                <span className="block text-[clamp(1.7rem,2.8vw,2.9rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-accent">
                  {dict.hero.title}
                </span>
                <span className="eyebrow mt-3 block text-muted">{dict.hero.specialties}</span>
              </span>
              {last && (
                <span data-hero-line data-intro className={`display text-outline block shrink-0 self-end whitespace-nowrap ${NAME_SIZE}`}>
                  {last}
                </span>
              )}
            </span>
          </h1>

          {/* The portrait sits over the name; the wrapper drifts on scroll, the sticker drags. */}
          <div
            data-hero-photo
            className="relative z-10 mx-auto mt-12 w-[min(58vw,15rem)] md:pointer-events-none md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:w-[clamp(12rem,17vw,18rem)] md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <div data-intro className="pointer-events-auto">
              <PhotoSticker alt={name} priority sizes="(min-width: 768px) 19rem, 40vw" />
            </div>
          </div>

          <span data-intro className="absolute bottom-[46%] left-0 z-20 md:bottom-auto md:left-[24%] md:top-[2%]">
            <Sticker tilt={-7}>
              <span aria-hidden className="font-mono text-accent-ink">
                {"</>"}
              </span>
              {s.engineer}
            </Sticker>
          </span>
          <span data-intro className="absolute bottom-[36%] right-0 z-20 md:bottom-auto md:right-[7%] md:top-[3%]">
            <Sticker tone="gold" tilt={6}>
              ✦ {s.founder}
            </Sticker>
          </span>
          <span data-intro className="absolute right-[1%] top-[44%] z-20 hidden md:block">
            <Sticker tone="dark" tilt={-9} className="font-mono text-sm">
              {s.stack}
            </Sticker>
          </span>
          <span data-intro className="absolute bottom-[12%] left-0 z-20 md:bottom-[6%] md:left-[56%]">
            <Sticker tilt={-4}>
              <CameroonFlag /> {s.city}
            </Sticker>
          </span>
          {profile?.available && (
            <span data-intro className="absolute bottom-[2%] right-0 z-20 md:bottom-[2%] md:left-[30%] md:right-auto">
              <Sticker tone="dark" tilt={5}>
                <span className="size-2 rounded-full bg-success" /> {s.open}
              </Sticker>
            </span>
          )}
          <p
            data-hero-fade
            aria-hidden
            className="eyebrow absolute -bottom-6 right-0 hidden text-muted [@media(pointer:fine)]:md:block"
          >
            ↖ {dict.hero.drag}
          </p>
        </Stickers>

        <div className="grid grid-cols-[1fr_auto] items-end gap-6 md:grid-cols-3">
          <p data-hero-fade className="eyebrow text-muted">
            {dict.hero.founder}{" "}
            <a
              href="https://lescracks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              LesCracks ↗
            </a>
          </p>
          <a
            data-hero-fade
            href="#about"
            className="eyebrow hidden flex-col items-center gap-3 justify-self-center text-muted transition-colors hover:text-fg md:flex"
          >
            {dict.hero.scroll}
            <span aria-hidden className="relative block h-12 w-px bg-border">
              <span className="scroll-cue absolute inset-0 bg-accent" />
            </span>
          </a>
          <div data-hero-fade className="hidden justify-self-end md:block">
            <Magnetic>
              <a
                href="#contact"
                className="eyebrow grid size-24 place-items-center rounded-full bg-accent p-3 text-center text-black transition-colors hover:bg-white md:size-28"
              >
                {dict.hero.contact}
              </a>
            </Magnetic>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}
