import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  back?: { href: string; label: string };
  action?: { href: string; label: string };
  children?: ReactNode;
}

export function PageHeader({ title, back, action, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="text-sm text-muted hover:text-fg">
          ← {back.label}
        </Link>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {action && (
          <Link href={action.href} className="rounded-lg bg-fg px-4 py-2 text-sm font-medium text-bg hover:opacity-85">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
