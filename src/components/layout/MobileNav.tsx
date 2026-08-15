"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactMenu } from "./ContactMenu";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
}

/**
 * Hamburger toggle + dropdown panel, visible only below the `md` breakpoint
 * (the inline header nav in SiteShell handles `md` and up). Must be
 * rendered inside a `position: relative` header — the panel uses
 * `top-full` to anchor to the header's bottom edge, so it stays correct
 * regardless of header height instead of a hardcoded pixel offset.
 */
export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    function handleBreakpointChange() {
      if (desktopQuery.matches) setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleBreakpointChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [open]);

  return (
    <div data-site-mobile-nav className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="relative z-40 flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-signal"
      >
        <span className="relative block h-3 w-4" aria-hidden="true">
          <span
            className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-200 motion-reduce:transition-none ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-3 h-px w-4 bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <>
          <div
            role="presentation"
            aria-hidden="true"
            className="animate-palette-in fixed inset-0 z-30 bg-void/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav
            className="animate-palette-in absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-line bg-surface px-6 py-6 font-mono text-sm uppercase tracking-wide text-ink-muted"
          >
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-md px-2 py-3 transition-colors hover:text-ink ${
                    isActive ? "bg-void text-ink" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <ContactMenu mobile />
          </nav>
        </>
      )}
    </div>
  );
}
