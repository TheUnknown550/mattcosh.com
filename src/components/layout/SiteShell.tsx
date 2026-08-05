import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { CommandPalette } from "@/components/common/CommandPalette";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";

interface SiteShellProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/certifications", label: "Certifications" },
  { href: "/roadmap", label: "Roadmap" },
];

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-void/95 backdrop-blur">
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2.5 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink"
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-signal bg-surface">
              <Image
                src="/img/profile.png"
                alt=""
                fill
                sizes="56px"
                className="object-contain"
              />
            </span>
            mattcosh.com
          </Link>
          <DesktopNav links={NAV_LINKS} />
          <MobileNav links={NAV_LINKS} />
        </div>
      </header>
      <main className="flex-1 px-6 lg:px-8">{children}</main>
      <footer className="mx-auto w-full max-w-6xl border-t border-line px-6 py-6 font-mono text-xs uppercase tracking-wide text-ink-muted lg:px-8">
        © {new Date().getFullYear()} Matt Cosh
      </footer>
      <CommandPalette />
    </>
  );
}
