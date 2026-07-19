"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TimelineEntry, TimelineEntryType } from "@/types/timeline";
import { FilterTabs } from "@/components/common/FilterTabs";
import { TiltCard } from "@/components/common/TiltCard";
import { Reveal } from "@/components/common/Reveal";

interface PulseTimelineProps {
  entries: TimelineEntry[];
}

type FilterValue = "All" | TimelineEntryType;

const TYPE_LABELS: Record<TimelineEntryType, string> = {
  education: "Education",
  work: "Work",
  project: "Projects",
  award: "Awards",
  certification: "Certifications",
};

const TYPE_GLYPH: Record<TimelineEntryType, string> = {
  education: "E",
  work: "W",
  project: "P",
  award: "★",
  certification: "C",
};

const TYPE_TONE: Record<TimelineEntryType, keyof typeof TONE_CLASSES> = {
  education: "neutral",
  work: "signal",
  project: "signal",
  award: "accent",
  certification: "neutral",
};

const TONE_CLASSES = {
  signal: "border-signal/50 bg-signal/10 text-signal",
  accent: "border-accent/50 bg-accent/10 text-accent",
  neutral: "border-line bg-surface text-ink-muted",
} as const;

/**
 * The Roadmap page's centerpiece: a vertical line that "draws" itself as the
 * page scrolls (an EKG-style live trace, tying back to the CS-M cardiac
 * motif used elsewhere on the site), with milestone nodes running alongside
 * it. Progress is driven imperatively via refs (not React state) so the
 * scroll loop doesn't re-render the full node list every frame.
 */
export function PulseTimeline({ entries }: PulseTimelineProps) {
  const [filter, setFilter] = useState<FilterValue>("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "All" ? entries : entries.filter((entry) => entry.type === filter);

  const options = useMemo(() => {
    const counts = entries.reduce<Partial<Record<TimelineEntryType, number>>>(
      (acc, entry) => {
        acc[entry.type] = (acc[entry.type] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const types = Object.keys(TYPE_LABELS) as TimelineEntryType[];
    return [
      { value: "All" as FilterValue, label: `All (${entries.length})` },
      ...types
        .filter((type) => counts[type])
        .map((type) => ({
          value: type as FilterValue,
          label: `${TYPE_LABELS[type]} (${counts[type]})`,
        })),
    ];
  }, [entries]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (fillRef.current) fillRef.current.style.height = "100%";
      return;
    }

    // Driven by real scroll/resize events (rAF-throttled per event) rather
    // than a perpetual rAF loop, so it doesn't depend on an animation loop
    // being scheduled while nothing is actually moving.
    let raf = 0;
    function updateProgress() {
      const container = containerRef.current;
      const fill = fillRef.current;
      const dot = dotRef.current;
      if (!container || !fill || !dot) return;
      const rect = container.getBoundingClientRect();
      const anchor = window.innerHeight * 0.4;
      const pct = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      fill.style.height = `${pct * 100}%`;
      dot.style.top = `${pct * 100}%`;
      dot.style.opacity = pct > 0 && pct < 1 ? "1" : "0";
    }
    function onScrollOrResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    }

    updateProgress();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div>
      <FilterTabs options={options} value={filter} onChange={setFilter} />

      <div ref={containerRef} className="relative mt-12">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-4 w-px bg-line sm:left-5"
        />
        <div
          ref={fillRef}
          aria-hidden="true"
          className="absolute top-0 left-4 w-px bg-signal shadow-[0_0_10px_rgba(45,217,201,0.6)] sm:left-5"
          style={{ height: 0 }}
        />
        <div
          ref={dotRef}
          aria-hidden="true"
          className="absolute left-4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_12px_rgba(45,217,201,0.8)] sm:left-5"
          style={{ top: 0 }}
        />

        <ul className="flex flex-col gap-8">
          {filtered.map((entry) => {
            const tone = TONE_CLASSES[TYPE_TONE[entry.type]];
            return (
              <li
                key={entry.id}
                className="relative grid grid-cols-[2rem_1fr] gap-4 sm:grid-cols-[2.5rem_1fr] sm:gap-6"
              >
                <div className="flex justify-center pt-1">
                  <span
                    className={`animate-dot-pulse flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold sm:h-9 sm:w-9 ${tone}`}
                  >
                    {TYPE_GLYPH[entry.type]}
                  </span>
                </div>

                <Reveal>
                  <TiltCard className="rounded-lg">
                    <div className="rounded-lg border border-line bg-surface p-5 transition-colors duration-300 hover:border-signal">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
                          {entry.title}
                        </h3>
                        <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                          {entry.dateLabel}
                        </p>
                      </div>
                      {entry.subtitle && (
                        <p className="mt-1 text-sm text-ink-muted">{entry.subtitle}</p>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {entry.description}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                          {entry.tags.slice(0, 4).map((tag) => (
                            <li key={tag} className="rounded-full border border-line px-2.5 py-1">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      {entry.link &&
                        (entry.link.href.startsWith("http") ? (
                          <a
                            href={entry.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex font-mono text-xs uppercase tracking-wide text-signal transition-colors hover:text-accent"
                          >
                            {entry.link.label} ↗
                          </a>
                        ) : (
                          <Link
                            href={entry.link.href}
                            className="mt-4 inline-flex font-mono text-xs uppercase tracking-wide text-signal transition-colors hover:text-accent"
                          >
                            {entry.link.label} →
                          </Link>
                        ))}
                    </div>
                  </TiltCard>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
