"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { useSection } from "@/components/motion/useSection";
import { Clock } from "@/components/site/Clock";
import type { Locale } from "@/lib/i18n";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import type { SocialLink } from "@/services/types";

export interface NavLabels {
  about: string;
  method: string;
  projects: string;
  skills: string;
  writing: string;
  contact: string;
  language: string;
  languageLabel: string;
  skip: string;
  menu: string;
  close: string;
  local: string;
  elsewhere: string;
  home: string;
}

interface SiteNavProps {
  locale: Locale;
  labels: NavLabels;
  socials: SocialLink[];
}

const SECTIONS = ["about", "method", "projects", "skills", "writing", "contact"] as const;

/**
 * The bar stays legible over black and paper sections alike (mix-blend-difference). Its menu
 * opens full screen: a curtain drops, numbered links rise one after the other.
 */
export function SiteNav({ locale, labels, socials }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const dockToggle = useRef<HTMLButtonElement>(null);
  const section = useSection();
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const home = `/${locale}`;
  const other: Locale = locale === "en" ? "fr" : "en";
  const switchHref = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${other}`);

  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        timeline.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 })
          .from(el.querySelectorAll("[data-menu-link]"), { yPercent: 110, duration: 1, stagger: 0.05, ease: "expo.out" }, 0.45)
          .from(el.querySelectorAll("[data-menu-fade]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 0.6);
        return () => {
          timeline.current = null;
        };
      });
    },
    { scope: overlay },
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    main?.toggleAttribute("inert", open);
    footer?.toggleAttribute("inert", open);
    if (open) {
      lenis?.stop();
      el.hidden = false;
      timeline.current?.timeScale(1).play();
      el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      const tl = timeline.current;
      if (tl && tl.progress() > 0) {
        tl.timeScale(1.6).reverse().eventCallback("onReverseComplete", () => {
          el.hidden = true;
        });
      } else {
        el.hidden = true;
      }
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        const wide = window.matchMedia("(min-width: 768px)").matches;
        (wide ? toggle : dockToggle).current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // On the home page, menu links glide to their section instead of navigating.
  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname !== home) {
      close();
      return;
    }
    event.preventDefault();
    close();
    const target = document.getElementById(id);
    if (!target) return;
    window.setTimeout(() => {
      if (lenis) lenis.scrollTo(target, { duration: 1.8 });
      else target.scrollIntoView();
      history.replaceState(null, "", `#${id}`);
    }, 350);
  };

  return (
    <>
      <a
        href="#main"
        className="eyebrow sr-only z-[60] bg-accent px-4 py-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {labels.skip}
      </a>

      <header className="gutter fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto] items-center py-5 text-white mix-blend-difference md:grid-cols-3">
        <Link href={home} aria-label={labels.home} className="group flex items-center gap-3 justify-self-start">
          <span className="grid size-10 place-items-center border border-current font-mono text-xs font-bold tracking-tight transition-colors group-hover:bg-white group-hover:text-black">
            BK
          </span>
          <span className="eyebrow hidden sm:inline">Brandon Kamga</span>
        </Link>
        <p className="eyebrow hidden justify-self-center md:block">
          {labels.local} <Clock className="ml-2" />
        </p>
        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href={switchHref}
            hrefLang={other}
            aria-label={labels.languageLabel}
            className="eyebrow grid h-10 place-items-center px-3 transition-opacity hover:opacity-60"
          >
            {labels.language}
          </Link>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="eyebrow group hidden h-10 items-center gap-3 border border-current px-4 transition-colors hover:bg-white hover:text-black md:flex"
          >
            <span>{open ? labels.close : labels.menu}</span>
            <span aria-hidden className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "top-1/2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={overlay}
        id="site-menu"
        hidden
        className="gutter fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black pb-28 pt-28 text-white md:pb-8"
      >
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <nav aria-label="Main" className="flex flex-1 flex-col justify-center">
          <ol className="group/menu">
            {SECTIONS.map((id, i) => (
              <li key={id} className="overflow-hidden border-b border-white/10 first:border-t">
                <a
                  data-menu-link
                  href={pathname === home ? `#${id}` : `${home}#${id}`}
                  onClick={(event) => go(event, id)}
                  className="group flex items-baseline gap-4 py-2 transition-opacity duration-500 group-hover/menu:opacity-35 hover:!opacity-100 md:gap-8"
                >
                  <span className="eyebrow w-8 text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {/* Two stacked copies roll up on hover: white out, outlined gold in. */}
                  <span className="relative block overflow-hidden pt-[0.16em] text-[clamp(2.4rem,min(8.5vw,10.5vh),8rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em]">
                    <span className="block transition-transform duration-700 ease-out-expo group-hover:-translate-y-[120%]">
                      {labels[id]}
                    </span>
                    <span
                      aria-hidden
                      className="text-outline-accent absolute inset-0 block translate-y-full pt-[0.16em] transition-transform duration-700 ease-out-expo group-hover:translate-y-0"
                    >
                      {labels[id]}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-3">
          <p data-menu-fade className="eyebrow text-white/60">
            {labels.local} — <Clock />
          </p>
          <ul data-menu-fade className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-2 md:justify-end">
            {socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phones: a floating dock within thumb reach, showing where you are in the page. */}
      <div className="fixed inset-x-4 bottom-4 z-50 flex items-center gap-3 rounded-full border border-white/15 bg-black/80 p-1.5 pl-2 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md md:hidden">
        <span aria-hidden className="relative grid size-11 shrink-0 place-items-center">
          <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
            <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={125.7}
              strokeDashoffset={125.7 * (1 - section.progress)}
            />
          </svg>
          <span className="eyebrow tabular-nums">{section.index}</span>
        </span>
        <span aria-live="polite" className="eyebrow min-w-0 flex-1 truncate">
          {open ? labels.menu : sectionLabel(section.index, labels)}
        </span>
        <button
          ref={dockToggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? labels.close : labels.menu}
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-black transition-transform active:scale-90"
        >
          <span aria-hidden className="relative block h-2.5 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "top-1/2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
            />
          </span>
        </button>
      </div>
    </>
  );
}

function sectionLabel(index: string, labels: NavLabels): string {
  const position = Number(index);
  return position >= 1 && position <= SECTIONS.length ? labels[SECTIONS[position - 1]] : "Brandon Kamga";
}
