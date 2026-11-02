import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField } from "@/components/admin/fields";
import { signIn } from "./actions";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="bg-grid grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">brandonkamga.com</p>
        <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">Administration</h1>
        <AdminForm action={signIn} submitLabel="Se connecter">
          <TextField name="email" label="E-mail" type="email" autoComplete="username" required />
          <TextField name="password" label="Mot de passe" type="password" autoComplete="current-password" required />
        </AdminForm>
      </div>
    </main>
  );
}
