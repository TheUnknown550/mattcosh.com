import type { ReactNode } from "react";
import Link from "next/link";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          Matt Cosh
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm uppercase tracking-wide text-ink-muted">
          <Link
            href="/projects"
            className="group relative pb-1 transition-colors hover:text-ink"
          >
            Projects
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
            />
          </Link>
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
      </header>
      <main className="flex-1 px-6 lg:px-8">{children}</main>
      <footer className="mx-auto w-full max-w-6xl border-t border-line px-6 py-6 font-mono text-xs uppercase tracking-wide text-ink-muted lg:px-8">
        © {new Date().getFullYear()} Matt Cosh
      </footer>
    </>
  );
}
