import type { Metadata } from "next";
import { dmSans, jetbrainsMono } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
