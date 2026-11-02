import { notFound } from "next/navigation";
import { Suspense } from "react";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Hero } from "@/components/site/Hero";
import { Method } from "@/components/site/Method";
import { Projects } from "@/components/site/Projects";
import { Toolbox } from "@/components/site/Toolbox";
import { Writing } from "@/components/site/Writing";
import { Skeleton } from "@/components/ui/Skeleton";
import { type Dictionary, getDictionary } from "@/lib/dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { getProfile } from "@/services/api";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      {/* The fallback is the hero itself, without profile details: the name paints at once. */}
      <Suspense fallback={<Hero dict={dict} profile={null} />}>
        <HeroWithProfile dict={dict} />
      </Suspense>
      <Suspense fallback={<Placeholder light />}>
        <About locale={lang} dict={dict} />
      </Suspense>
      <Method dict={dict} />
      <Suspense fallback={<Placeholder />}>
        <Projects locale={lang} dict={dict} />
      </Suspense>
      <Suspense fallback={<Placeholder light />}>
        <Toolbox dict={dict} />
      </Suspense>
      <Suspense fallback={<Placeholder light />}>
        <Writing locale={lang} dict={dict} />
      </Suspense>
      <Suspense fallback={<ContactSection locale={lang} dict={dict} withProfile={false} />}>
        <ContactSection locale={lang} dict={dict} withProfile />
      </Suspense>
    </>
  );
}

interface SectionProps {
  locale: Locale;
  dict: Dictionary;
}

async function HeroWithProfile({ dict }: { dict: Dictionary }) {
  return <Hero dict={dict} profile={await getProfile()} />;
}

async function ContactSection({ locale, dict, withProfile }: SectionProps & { withProfile: boolean }) {
  return <Contact locale={locale} dict={dict} profile={withProfile ? await getProfile() : null} />;
}

function Placeholder({ light = false }: { light?: boolean }) {
  return (
    <div className={`gutter py-24 ${light ? "mode-light" : ""}`}>
      <Skeleton className="h-[60vh]" />
    </div>
  );
}
