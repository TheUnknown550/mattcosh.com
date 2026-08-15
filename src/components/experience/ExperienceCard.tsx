import Link from "next/link";
import type { ExperienceEntry } from "@/types/experience";
import { TiltCard } from "@/components/common/TiltCard";
import { ExperienceCardNodeIcon } from "./ExperienceCardNodeIcon";

interface ExperienceCardProps {
  entry: ExperienceEntry;
}

/** A single, fully clickable overview card for an experience detail page. */
export function ExperienceCard({ entry }: ExperienceCardProps) {
  return (
    <TiltCard className="relative rounded-lg" maxTiltDeg={1.5}>
      <Link
        href={`/experience/${entry.id}`}
        data-graph-card-node-id={`experience-${entry.id}`}
        className="group relative block min-w-0 rounded-lg border border-line bg-surface/85 p-5 backdrop-blur-[2px] transition-colors duration-300 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      >
        <ExperienceCardNodeIcon
          className="-left-8 top-1/2 -translate-y-1/2 text-accent"
          data-experience-card-node
        />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="break-words font-display text-lg font-semibold text-ink">{entry.title}</h3>
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
    </TiltCard>
  );
}
