import { formatMonth } from "@/lib/format";

export function formMonth(isoDate: string): string {
  return formatMonth(isoDate, "fr");
}
