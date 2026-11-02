import { DashField } from "@/components/motion/DashField";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Profile } from "@/services/types";

interface ContactProps {
  locale: Locale;
  dict: Dictionary;
  profile: Profile | null;
}

const RING_CENTER = { x: 0.82, y: 0.3 };
const RING_MOBILE_CENTER = { x: 0.85, y: 0.12 };

/** The closing call: a giant LET'S/TALK, the form, and the other ways to reach me. */
export function Contact({ locale, dict, profile }: ContactProps) {
  const [solid, outline] = dict.contact.big;
  // The seed ships a placeholder address; it only shows once a real one is set in the admin.
  const email = profile?.email && !profile.email.endsWith("@example.com") ? profile.email : null;

  return (
    <Reveal
      as="section"
      id="contact"
      index="06"
      className="relative isolate z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-bg pb-20 pt-24 md:pt-36"
    >
      <DashField shape="ring" center={RING_CENTER} mobileCenter={RING_MOBILE_CENTER} className="-z-10 opacity-70" />
      <div className="gutter">
        <div className="mb-8 flex items-center gap-4">
          <p className="eyebrow shrink-0 text-accent-ink">(06) — {dict.nav.contact}</p>
          <span data-line className="h-px flex-1 bg-border" />
        </div>
        <h2 id="contact-title" data-split className="display text-[clamp(4rem,17vw,18rem)]">
          {solid}
          <br />
          <span className="text-outline-accent">{outline}</span>
        </h2>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
          <div data-fade className="grid content-start gap-10 md:col-span-4">
            <p className="max-w-sm text-xl leading-snug">{dict.contact.intro}</p>
            {email && (
              <div className="grid gap-2">
                <p className="eyebrow text-muted">{dict.contact.direct}</p>
                <a href={`mailto:${email}`} className="text-xl underline-offset-4 transition-colors hover:text-accent hover:underline">
                  {email}
                </a>
              </div>
            )}
          </div>
          <div data-fade className="md:col-span-7 md:col-start-6">
            <ContactForm locale={locale} labels={dict.contact} />
          </div>
        </div>

        {profile && profile.socials.length > 0 && (
          <div className="mt-24 md:mt-32">
            <p className="eyebrow mb-6 text-muted">{dict.contact.elsewhere}</p>
            <ul data-fade-stagger className="border-t border-border">
              {profile.socials.map((s, i) => (
                <li key={s.url} className="border-b border-border">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 py-6 md:gap-10"
                  >
                    <span className="eyebrow w-8 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[clamp(1.8rem,4vw,3.6rem)] font-semibold uppercase leading-none tracking-[-0.04em] transition-[color,translate] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent">
                      {s.label}
                    </span>
                    <span
                      aria-hidden
                      className="grid size-12 place-items-center rounded-full border border-border-strong transition-[background-color,color,rotate] duration-500 group-hover:-rotate-45 group-hover:bg-accent group-hover:text-black"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
