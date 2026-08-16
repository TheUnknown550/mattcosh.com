import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Matt Cosh",
  description:
    "Software developer building applied AI, full-stack, AIoT, and networking projects.",
  icons: {
    icon: [{ url: "/icon?v=portrait", type: "image/png", sizes: "512x512" }],
    shortcut: "/icon?v=portrait",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
