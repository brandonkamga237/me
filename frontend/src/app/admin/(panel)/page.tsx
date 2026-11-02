import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Tableau de bord" />
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Overview />
      </Suspense>
    </>
  );
}

async function Overview() {
  const [me, profile, projects, experiences, skills, messages] = await Promise.all([
    adminApi.me(),
    adminApi.getProfile(),
    adminApi.listProjects(),
    adminApi.listExperiences(),
    adminApi.listSkills(),
    adminApi.listMessages(),
  ]);
  const unread = messages.filter((m) => !m.read).length;
  const tiles = [
    ["/admin/projects", "Projets publiés", `${projects.filter((p) => p.published).length} / ${projects.length}`],
    ["/admin/experiences", "Expériences", experiences.length],
    ["/admin/skills", "Compétences", skills.length],
    ["/admin/messages", "Messages non lus", unread],
  ] as const;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">Connecté en tant que {me.email}.</p>
      {!profile && (
        <p className="rounded-lg border border-border bg-panel p-4 text-sm">
          Le profil n&apos;est pas encore rempli : le site affiche une page presque vide.{" "}
          <Link href="/admin/profile" className="underline">
            Le remplir
          </Link>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(([href, label, value]) => (
          <Link key={href} href={href} className="rounded-xl border border-border p-5 hover:bg-panel">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
