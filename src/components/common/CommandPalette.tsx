"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  action: (navigate: (href: string) => void) => void;
}

const ITEMS: CommandItem[] = [
  { id: "home", label: "Home", hint: "/", action: (nav) => nav("/") },
  { id: "projects", label: "Projects", hint: "/projects", action: (nav) => nav("/projects") },
  { id: "experience", label: "Experience", hint: "/experience", action: (nav) => nav("/experience") },
  { id: "skills", label: "Skills", hint: "/skills", action: (nav) => nav("/skills") },
  {
    id: "certifications",
    label: "Certifications",
    hint: "/certifications",
    action: (nav) => nav("/certifications"),
  },
  { id: "roadmap", label: "Roadmap", hint: "/roadmap", action: (nav) => nav("/roadmap") },
  {
    id: "github",
    label: "Open GitHub",
    hint: "github.com/TheUnknown550 ↗",
    action: () => window.open("https://github.com/TheUnknown550", "_blank", "noopener,noreferrer"),
  },
];

/**
 * Global ⌘K / Ctrl+K quick-nav palette, mounted once in SiteShell. Owns its
 * own visibility so any page can trigger it without prop drilling.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);

  const filtered = ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    // Reset search state as part of the transition to open, rather than in
    // a effect keyed on `open` — keeps the state change tied to the event
    // that caused it instead of syncing after the fact.
    function openPalette() {
      setQuery("");
      setActiveIndex(0);
      setOpen(true);
    }
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        if (openRef.current) {
          setOpen(false);
        } else {
          openPalette();
        }
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function runItem(item: CommandItem | undefined) {
    if (!item) return;
    item.action((href) => router.push(href));
    setOpen(false);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runItem(filtered[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="animate-palette-in fixed inset-0 z-50 flex items-start justify-center bg-void/70 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-line bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Jump to a page…"
          className="w-full border-b border-line bg-transparent px-5 py-4 font-mono text-sm text-ink outline-none placeholder:text-ink-muted"
        />
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-4 text-sm text-ink-muted">No matches.</li>
          )}
          {filtered.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => runItem(item)}
                className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors ${
                  index === activeIndex ? "bg-signal/10 text-ink" : "text-ink-muted"
                }`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-ink-muted">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
