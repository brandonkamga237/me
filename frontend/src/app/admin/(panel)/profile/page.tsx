import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { CheckboxField, LocalizedField, TextAreaField, TextField } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";
import { saveProfile } from "./actions";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profil" />
      <Suspense fallback={<Skeleton className="h-[40rem] max-w-3xl" />}>
        <ProfileForm />
      </Suspense>
    </>
  );
}

async function ProfileForm() {
  const profile = await adminApi.getProfile();
  return (
    <AdminForm action={saveProfile}>
      <TextField name="name" label="Nom" defaultValue={profile?.name ?? "Brandon Kamga"} />
      <LocalizedField name="headline" label="Titre" defaultValue={profile?.headline} />
      <LocalizedField name="bio" label="Présentation" defaultValue={profile?.bio} multiline />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="location" label="Ville" defaultValue={profile?.location} />
        <TextField name="email" label="E-mail public" type="email" defaultValue={profile?.email} />
      </div>
      <TextField name="resume_url" label="Lien du CV" type="url" defaultValue={profile?.resume_url} />
      <TextAreaField
        name="socials"
        label="Liens"
        rows={5}
        hint="Un lien par ligne : Libellé | https://…"
        defaultValue={profile?.socials.map((s) => `${s.label} | ${s.url}`).join("\n")}
      />
      <CheckboxField name="available" label="Ouvert aux opportunités" defaultChecked={profile?.available ?? true} />
    </AdminForm>
  );
}
