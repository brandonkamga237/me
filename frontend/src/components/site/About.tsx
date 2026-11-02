import { t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getProfile } from "@/services/api";

interface AboutProps {
  locale: Locale;
}

export async function About({ locale }: AboutProps) {
  const profile = await getProfile();
  if (!profile) return null;
  return (
    <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
      {t(profile.bio, locale)
        .split(/\n{2,}/)
        .map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
    </div>
  );
}
