import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { CommandPalette } from "@/components/common/CommandPalette";
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
          <nav className="hidden items-center gap-6 font-mono text-sm uppercase tracking-wide text-ink-muted md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative pb-1 transition-colors hover:text-ink"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </Link>
            ))}
            <a
              href="https://github.com/TheUnknown550"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative pb-1 transition-colors hover:text-ink"
            >
              GitHub ↗
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </a>
          </nav>
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
