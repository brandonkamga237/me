import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollHud } from "@/components/motion/ScrollHud";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { type NavLabels, SiteNav } from "@/components/site/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { env } from "@/lib/env";
import { dmSans, jetbrainsMono } from "@/lib/fonts";
import { hasLocale, type Locale, locales } from "@/lib/i18n";
import { getProfile } from "@/services/api";
import "../../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const viewport: Viewport = { themeColor: "#000000" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang: locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // The link preview shown by WhatsApp, LinkedIn, X…; pages without their own inherit it.
  const image = { url: `/og/brandon-kamga-${locale}.jpg`, width: 1200, height: 630, alt: dict.meta.title };
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: dict.meta.title, template: `%s · Brandon Kamga` },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "Brandon Kamga",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description, images: [image] },
  };
}

// Marks that scripts run, before the first paint, so the hero can wait for its intro.
const MOTION_FLAG = "document.documentElement.classList.add('motion')";

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale} className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body className="min-h-dvh font-sans">
        <SmoothScroll>
          <Suspense fallback={<SiteNav locale={locale} labels={dict.nav} socials={[]} />}>
            <Nav locale={locale} labels={dict.nav} />
          </Suspense>
          <main id="main">{children}</main>
          <Footer dict={dict} />
          <ScrollHud />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}

async function Nav({ locale, labels }: { locale: Locale; labels: NavLabels }) {
  const profile = await getProfile();
  return <SiteNav locale={locale} labels={labels} socials={profile?.socials ?? []} />;
}
