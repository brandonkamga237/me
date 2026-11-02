import Link from "next/link";

// Rendered for unknown pages under a language; the copy covers both since the segment may be invalid.
export default function NotFound() {
  return (
    <div className="gutter flex min-h-dvh flex-col justify-center pb-16 pt-32">
      <p className="eyebrow text-accent">(404)</p>
      <h1 className="display text-outline mt-6 text-[clamp(6rem,30vw,30rem)]">404</h1>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="text-2xl tracking-[-0.02em]">Page not found · Page introuvable</p>
        <Link
          href="/"
          className="eyebrow inline-flex rounded-full bg-accent px-6 py-4 text-black transition-colors hover:bg-white"
        >
          Home · Accueil →
        </Link>
      </div>
    </div>
  );
}
