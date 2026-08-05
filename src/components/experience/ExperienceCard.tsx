import Link from "next/link";
import type { ExperienceEntry } from "@/types/experience";

interface ExperienceCardProps {
  entry: ExperienceEntry;
}

/** A single, fully clickable overview card for an experience detail page. */
export function ExperienceCard({ entry }: ExperienceCardProps) {
  return (
    <Link
      href={`/experience/${entry.id}`}
      className="group block rounded-lg border border-line bg-surface p-6 transition-colors duration-300 hover:border-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{entry.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {entry.company} · {entry.location}
          </p>
        </div>
        <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-signal">
          {entry.startLabel} – {entry.endLabel}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{entry.summary}</p>

      <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-signal transition-colors group-hover:text-accent">
        View experience
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </p>
    </Link>
  );
}
