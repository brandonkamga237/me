import Link from "next/link";
import { signOut } from "@/app/admin/login/actions";

const links = [
  ["/admin", "Tableau de bord"],
  ["/admin/profile", "Profil"],
  ["/admin/projects", "Projets"],
  ["/admin/experiences", "Parcours"],
  ["/admin/skills", "Compétences"],
  ["/admin/messages", "Messages"],
] as const;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="grid min-h-dvh md:grid-cols-[15rem_1fr]">
      <aside className="flex flex-col border-b border-border bg-panel p-5 md:border-b-0 md:border-r">
        <p className="font-semibold tracking-tight">Brandon Kamga</p>
        <p className="font-mono text-xs text-muted">administration</p>
        <nav aria-label="Administration" className="mt-6 flex flex-wrap gap-1 md:flex-col">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm text-muted hover:bg-bg hover:text-fg">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex items-center justify-between gap-4 text-sm md:mt-auto">
          <Link href="/" target="_blank" className="text-muted hover:text-fg">
            Voir le site ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-muted hover:text-fg">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
}
