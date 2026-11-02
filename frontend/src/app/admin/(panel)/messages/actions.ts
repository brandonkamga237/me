"use server";

import { refresh } from "next/cache";
import { adminApi } from "@/services/adminApi";

export async function markMessage(id: string, read: boolean): Promise<void> {
  await adminApi.markMessage(id, read);
  refresh();
}

export async function deleteMessage(id: string): Promise<void> {
  await adminApi.deleteMessage(id);
  refresh();
}
