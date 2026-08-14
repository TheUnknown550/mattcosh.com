"use client";

import { useEffect, useRef, useState } from "react";

const contactLinks = [
  { href: "https://github.com/TheUnknown550", label: "GitHub" },
  { href: "https://www.linkedin.com/in/matt-cosh", label: "LinkedIn" },
];

export function ContactMenu({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = mobile ? "contact-menu-mobile" : "contact-menu-desktop";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={
          mobile
            ? `flex w-full items-center justify-between rounded-md px-2 py-3 text-left transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal ${
                open ? "bg-void text-ink" : ""
              }`
            : "group relative flex items-center gap-1 pb-1 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
        }
      >
        <span>Contact</span>
        <span
          aria-hidden="true"
          className={`text-xs transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        >
          &#x2193;
        </span>
        {!mobile && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
          />
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={
            mobile
              ? "ml-2 border-l border-line pl-3"
              : "absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-44 rounded-md border border-line bg-surface/95 p-2 shadow-2xl shadow-void/40 backdrop-blur-md"
          }
        >
          {contactLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={
                mobile
                  ? "flex items-center justify-between rounded-md px-2 py-2 text-sm text-ink-muted transition-colors hover:bg-void hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                  : "flex items-center justify-between rounded-sm px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-void hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              }
            >
              {link.label}
              <span aria-hidden="true" className="ml-5 text-xs text-signal">
                &#x2197;
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
