import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDay } from "@/lib/format";
import { adminApi } from "@/services/adminApi";
import { deleteMessage, markMessage } from "./actions";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Messages" />
      <Suspense fallback={<Skeleton className="h-64" />}>
        <MessageList />
      </Suspense>
    </>
  );
}

async function MessageList() {
  const messages = await adminApi.listMessages();
  if (messages.length === 0) return <p className="text-muted">Aucun message pour l&apos;instant.</p>;
  return (
    <ul className="max-w-3xl space-y-4">
      {messages.map((m) => (
        <li key={m.id} className={`rounded-xl border p-5 ${m.read ? "border-border" : "border-fg"}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">
              {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-success" aria-label="Non lu" />}
              {m.name} ·{" "}
              <a href={`mailto:${m.email}`} className="text-muted hover:underline">
                {m.email}
              </a>
            </p>
            <time dateTime={m.created_at} className="text-sm text-muted">
              {formatDay(m.created_at, "fr")}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{m.body}</p>
          <div className="mt-4 flex gap-5">
            <form action={markMessage.bind(null, m.id, !m.read)}>
              <button type="submit" className="text-sm text-muted hover:text-fg">
                {m.read ? "Marquer non lu" : "Marquer lu"}
              </button>
            </form>
            <ConfirmButton action={deleteMessage.bind(null, m.id)} confirmation="Supprimer ce message ?">
              Supprimer
            </ConfirmButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
