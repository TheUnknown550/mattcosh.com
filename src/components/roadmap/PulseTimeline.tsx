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

const SCROLL_STEP = 340;

/**
 * The Roadmap page's centerpiece: a horizontal line that "draws" itself as
 * the row scrolls (an EKG-style live trace, tying back to the CS-M cardiac
 * motif used elsewhere on the site), with milestone cards running left to
 * right. Progress is driven imperatively via refs (not React state) so the
 * scroll handler doesn't re-render the full card list every frame.
 */
export function PulseTimeline({ entries }: PulseTimelineProps) {
  const [filter, setFilter] = useState<FilterValue>("All");
  const scrollerRef = useRef<HTMLDivElement>(null);
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

  // Jump back to the start whenever the filtered set changes — the previous
  // scroll offset has no meaning against a different set of cards.
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [filter]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const fill = fillRef.current;
    const dot = dotRef.current;
    if (!scroller || !fill || !dot) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      fill.style.width = "100%";
      return;
    }

    // Driven by real scroll/resize events (rAF-throttled per event) rather
    // than a perpetual rAF loop, so it doesn't depend on an animation loop
    // being scheduled while nothing is actually moving.
    let raf = 0;
    function updateProgress() {
      if (!scroller || !fill || !dot) return;
      // Position relative to the scroller's own content, not a percentage —
      // both elements scroll along with the cards, so this keeps the fill's
      // trailing edge (and the dot) pinned to the right edge of whatever is
      // currently visible, revealing more of the line as you scroll right.
      const edge = scroller.scrollLeft + scroller.clientWidth;
      fill.style.width = `${edge}px`;
      dot.style.left = `${edge}px`;
      dot.style.opacity = scroller.scrollWidth > scroller.clientWidth ? "1" : "0";
    }
    function onScrollOrResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    }

    updateProgress();
    scroller.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [filtered.length]);

  function scrollByStep(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs options={options} value={filter} onChange={setFilter} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label="Scroll to earlier milestones"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-signal hover:text-ink"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label="Scroll to later milestones"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-signal hover:text-ink"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Roadmap timeline, scrollable horizontally"
        tabIndex={0}
        className="mt-10 snap-x snap-proximity overflow-x-auto overflow-y-hidden pb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        <div className="relative flex w-max items-start gap-8 px-1">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-5 h-px bg-line"
          />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute left-0 top-5 h-px bg-signal shadow-[0_0_10px_rgba(45,217,201,0.6)]"
            style={{ width: 0 }}
          />
          <div
            ref={dotRef}
            aria-hidden="true"
            className="absolute top-5 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_12px_rgba(45,217,201,0.8)]"
            style={{ left: 0 }}
          />

          {filtered.map((entry) => {
            const tone = TONE_CLASSES[TYPE_TONE[entry.type]];
            return (
              <div
                key={entry.id}
                className="flex w-64 shrink-0 snap-start flex-col items-center sm:w-72"
              >
                <div className="flex h-10 items-center justify-center">
                  <span
                    className={`animate-dot-pulse flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold sm:h-9 sm:w-9 ${tone}`}
                  >
                    {TYPE_GLYPH[entry.type]}
                  </span>
                </div>

                <Reveal className="mt-4 w-full">
                  <TiltCard className="rounded-lg">
                    <div className="rounded-lg border border-line bg-surface p-5 transition-colors duration-300 hover:border-signal">
                      <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                        {entry.dateLabel}
                      </p>
                      <h3 className="mt-2 font-display text-base font-semibold text-ink sm:text-lg">
                        {entry.title}
                      </h3>
                      {entry.subtitle && (
                        <p className="mt-1 text-sm text-ink-muted">{entry.subtitle}</p>
                      )}
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-muted">
                        {entry.description}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                          {entry.tags.slice(0, 3).map((tag) => (
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
