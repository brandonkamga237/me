import Link from "next/link";

// Rendered for unknown pages under a language; the copy covers both since the segment may be invalid.
export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Page not found · Page introuvable</h1>
      <Link href="/" className="mt-8 inline-block rounded-full border border-border px-5 py-2.5 text-sm hover:bg-panel">
        Home · Accueil
      </Link>
    </div>
  );
}
