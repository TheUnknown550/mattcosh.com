"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
 * A self-contained navigation dialog for phones and tablets. Rendering it in
 * a portal keeps it independent of the sticky header's stacking context, so
 * opening the menu cannot stretch, clip, or otherwise disturb the header.
 */
export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });

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
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [open]);

  const dialog = open
    ? createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-void/85 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-site-navigation"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="animate-palette-in relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-y-auto rounded-xl border border-line bg-surface/95 shadow-2xl shadow-void/70 backdrop-blur-xl sm:max-h-[min(38rem,calc(100dvh-3rem))]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                  Navigate
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-ink">Choose a section</p>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              >
                <span aria-hidden="true" className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="p-3 font-mono text-sm uppercase tracking-wide">
              {links.map((link, index) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-lg px-4 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal ${
                      isActive
                        ? "bg-signal/10 text-ink"
                        : "text-ink-muted hover:bg-void hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[10px] text-signal/80">0{index + 1}</span>
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-signal opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-line p-3 font-mono text-sm uppercase tracking-wide">
              <ContactMenu mobile />
            </div>
          </nav>
        </div>,
        document.body,
      )
    : null;

  return (
    <div data-site-mobile-nav className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={open ? "mobile-site-navigation" : undefined}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
      >
        <span className="relative block h-3 w-4" aria-hidden="true">
          <span className="absolute left-0 top-0 h-px w-4 bg-current" />
          <span className="absolute left-0 top-1.5 h-px w-4 bg-current" />
          <span className="absolute left-0 top-3 h-px w-4 bg-current" />
        </span>
      </button>
      {dialog}
    </div>
  );
}
