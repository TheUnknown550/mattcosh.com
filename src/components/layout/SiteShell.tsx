import type { ReactNode } from "react";
import Link from "next/link";

interface SiteShellProps {
  children: ReactNode;
}

/**
 * Minimal page shell (header/main/footer). Not final navigation or styling —
 * just enough structure for pages to render inside during initialisation.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <header className="p-4">
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="p-4 text-sm text-gray-500">
        Placeholder footer.
      </footer>
    </>
  );
}
