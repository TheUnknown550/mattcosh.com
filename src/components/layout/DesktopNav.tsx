"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactMenu } from "./ContactMenu";

interface NavLink {
  href: string;
  label: string;
}

interface DesktopNavProps {
  links: NavLink[];
}

export function DesktopNav({ links }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      data-site-desktop-nav
      className="hidden items-center gap-6 font-mono text-sm uppercase tracking-wide md:flex"
    >
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative pb-1 transition-colors ${
              isActive ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
      {pathname === "/" ? (
        <ContactMenu />
      ) : (
      <a
        href="https://github.com/TheUnknown550"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative pb-1 text-ink-muted transition-colors hover:text-ink"
      >
        GitHub ↗
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
        />
      </a>
      )}
    </nav>
  );
}
