import type { EducationEntry } from "@/types/education";

interface EducationCardProps {
  entry: EducationEntry;
}

export function EducationCard({ entry }: EducationCardProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{entry.school}</h3>
        <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-signal">
          {entry.startLabel} — {entry.endLabel}
        </p>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{entry.degree}</p>
      {entry.notes && (
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{entry.notes}</p>
      )}
    </div>
  );
}
