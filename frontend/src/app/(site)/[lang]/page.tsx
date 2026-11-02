import { Suspense } from "react";
import { About } from "@/components/site/About";
import { ContactForm } from "@/components/site/ContactForm";
import { ExperienceList } from "@/components/site/ExperienceList";
import { Hero } from "@/components/site/Hero";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { Section } from "@/components/site/Section";
import { SkillGroups } from "@/components/site/SkillGroups";
import { Writing } from "@/components/site/Writing";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Suspense fallback={<Skeleton className="my-20 h-96" />}>
        <Hero locale={lang} dict={dict} />
      </Suspense>
      <Section id="about" index="01" title={dict.about.title}>
        <Suspense fallback={<Skeleton className="h-40" />}>
          <About locale={lang} />
        </Suspense>
      </Section>
      <Section id="experience" index="02" title={dict.experience.title}>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <ExperienceList locale={lang} dict={dict} />
        </Suspense>
      </Section>
      <Section id="projects" index="03" title={dict.projects.title} intro={dict.projects.intro}>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <ProjectGrid locale={lang} dict={dict} />
        </Suspense>
      </Section>
      <Section id="skills" index="04" title={dict.skills.title}>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <SkillGroups dict={dict} />
        </Suspense>
      </Section>
      <Section id="writing" index="05" title={dict.writing.title} intro={dict.writing.intro}>
        <Suspense fallback={<Skeleton className="h-72" />}>
          <Writing locale={lang} dict={dict} />
        </Suspense>
      </Section>
      <Section id="contact" index="06" title={dict.contact.title} intro={dict.contact.intro}>
        <ContactForm locale={lang} labels={dict.contact} />
      </Section>
    </>
  );
}
