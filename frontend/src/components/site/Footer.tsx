import { cacheLife } from "next/cache";
import type { Dictionary } from "@/lib/dictionaries";
import { getProfile } from "@/services/api";

interface FooterProps {
  dict: Dictionary;
}

export async function Footer({ dict }: FooterProps) {
  "use cache";
  cacheLife("days");
  const profile = await getProfile();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} Brandon Kamga · {dict.footer.built}
        </p>
        <ul className="flex flex-wrap gap-5">
          {profile?.socials.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
