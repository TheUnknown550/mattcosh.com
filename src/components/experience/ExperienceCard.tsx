"use client";

import { useState } from "react";
import type { ExperienceEntry } from "@/types/experience";

interface ExperienceCardProps {
  entry: ExperienceEntry;
}

/**
 * Role card with an expandable highlight list, animated via a CSS grid-rows
 * trick (0fr -> 1fr) so the panel height transitions without measuring it in JS.
 */
export function ExperienceCard({ entry }: ExperienceCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-line bg-surface p-6 transition-colors duration-300 hover:border-signal">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{entry.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {entry.company} · {entry.location}
          </p>
        </div>
        <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-signal">
          {entry.startLabel} — {entry.endLabel}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{entry.summary}</p>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:text-accent"
      >
        <span
          aria-hidden="true"
          className={`inline-block transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-90" : ""
          }`}
        >
          →
        </span>
        {open ? "Hide details" : "Show details"}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="text-signal">▸</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
