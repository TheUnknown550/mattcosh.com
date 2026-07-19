"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import type { TimelineEntry, TimelineEntryType } from "@/types/timeline";
import { FilterTabs } from "@/components/common/FilterTabs";
import { TiltCard } from "@/components/common/TiltCard";
import { Reveal } from "@/components/common/Reveal";
import { assignLanes, laneOffsetIndex, toMonthIndex } from "@/lib/timelineLanes";

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

// Matches TONE_CLASSES' colour, for SVG `stroke="currentColor"`.
const TONE_TEXT_CLASSES = {
  signal: "text-signal",
  accent: "text-accent",
  neutral: "text-ink-muted",
} as const;

const SCROLL_STEP = 340;
const LANE_STEP = 42;
const NODE_SIZE = 36;
const GRAPH_PADDING = 20;

/**
 * A branch is only drawn for "work"/"project" entries whose date range
 * genuinely overlaps another one — education/awards/certifications are
 * point-in-time and always render on the trunk (branching them against a
 * multi-year education span would make nearly everything "concurrent").
 */
function isRangedEntry(
  entry: TimelineEntry,
): entry is TimelineEntry & { endSortDate: string | null } {
  return (entry.type === "work" || entry.type === "project") && entry.endSortDate !== undefined;
}

/** A smooth "git-graph" S-curve: trunk -> lane -> trunk, straight run between. */
function buildBranchPath(rightX: number, leftX: number, trunkY: number, laneY: number): string {
  const span = Math.max(rightX - leftX, 1);
  const curveSpan = Math.min(span * 0.35, 36);
  const outX = rightX - curveSpan;
  const inX = Math.min(leftX + curveSpan, outX);
  const midOut = (rightX + outX) / 2;
  const midIn = (inX + leftX) / 2;
  return `M ${rightX} ${trunkY} C ${midOut} ${trunkY}, ${midOut} ${laneY}, ${outX} ${laneY} L ${inX} ${laneY} C ${midIn} ${laneY}, ${midIn} ${trunkY}, ${leftX} ${trunkY}`;
}

/**
 * The Roadmap's centerpiece: a horizontal, click-and-drag-able "git graph"
 * of every milestone. Work/project entries that genuinely overlap in time
 * branch away from the main trunk and merge back in — the trunk itself
 * still carries the scroll-progress EKG highlight from before. Branch
 * curves are computed from measured card positions (not date-proportional
 * math) so they stay correct across breakpoints without a full Gantt-chart
 * layout rewrite.
 */
export function PulseTimeline({ entries }: PulseTimelineProps) {
  const [filter, setFilter] = useState<FilterValue>("All");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const draggedDistanceRef = useRef(0);
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [nodeX, setNodeX] = useState<Record<string, number>>({});

  // Memoized so its reference is stable across renders when filter/entries
  // haven't actually changed — it's a dependency of the position-measuring
  // effect below, and a fresh array reference on every render would retrigger
  // that effect every render (setNodeX -> re-render -> "changed" dependency
  // -> effect again), an infinite loop.
  const filtered = useMemo(
    () => (filter === "All" ? entries : entries.filter((entry) => entry.type === filter)),
    [filter, entries],
  );

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

  const { laneById, laneCount } = useMemo(() => {
    const ranged = filtered.filter(isRangedEntry);
    return assignLanes(
      ranged.map((entry) => ({
        id: entry.id,
        startSortDate: entry.sortDate,
        endSortDate: entry.endSortDate,
      })),
    );
  }, [filtered]);

  const geometry = useMemo(() => {
    const offsets = Array.from({ length: Math.max(laneCount, 1) }, (_, lane) =>
      laneOffsetIndex(lane),
    );
    const highest = Math.min(0, ...offsets);
    const lowest = Math.max(0, ...offsets);
    const graphHeight = (lowest - highest) * LANE_STEP + NODE_SIZE + GRAPH_PADDING * 2;
    const trunkY = -highest * LANE_STEP + GRAPH_PADDING + NODE_SIZE / 2;
    return { graphHeight, trunkY };
  }, [laneCount]);

  // Jump back to the start whenever the filtered set changes — the previous
  // scroll offset has no meaning against a different set of cards.
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [filter]);

  // Measures each card's actual rendered center X after layout, so the SVG
  // branch curves line up with the real (responsive) column positions
  // instead of guessed date-proportional math.
  useLayoutEffect(() => {
    function measure() {
      const next: Record<string, number> = {};
      columnRefs.current.forEach((el, id) => {
        next[id] = el.offsetLeft + el.offsetWidth / 2;
      });
      setNodeX(next);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filtered]);

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

  // Lets a plain vertical mouse wheel (not just shift+wheel or a trackpad's
  // horizontal gesture) drive the horizontal scroll — without this, wheel
  // input does nothing here and just scrolls the page instead, which reads
  // as the timeline being "stuck". Registered as a native, non-passive
  // listener because React's onWheel is passive by default and silently
  // ignores preventDefault().
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleWheel(event: WheelEvent) {
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const el = scrollerRef.current;
      if (!el) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", handleWheel);
  }, []);

  function scrollByStep(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });
  }

  // Click-and-drag panning for mouse users (touch already scrolls natively,
  // so this only engages for pointerType "mouse").
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isDraggingRef.current = true;
    draggedDistanceRef.current = 0;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = scroller.scrollLeft;
    scroller.classList.add("dragging");
    scroller.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const delta = event.clientX - dragStartXRef.current;
    draggedDistanceRef.current = Math.abs(delta);
    scroller.scrollLeft = dragStartScrollLeftRef.current - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.classList.remove("dragging");
    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  }

  // Swallows the click that would otherwise fire on a link/button under the
  // pointer right after a real drag, without affecting genuine clicks.
  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (draggedDistanceRef.current > 5) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function registerColumn(id: string, el: HTMLDivElement | null) {
    if (el) columnRefs.current.set(id, el);
    else columnRefs.current.delete(id);
  }

  // For a branching entry, finds which column its end date lands closest
  // to — that's where its branch curve merges back into the trunk. Ongoing
  // entries merge near the newest (leftmost) column, i.e. "now".
  function findMergeTargetId(entry: TimelineEntry & { endSortDate: string | null }): string {
    if (entry.endSortDate === null) return filtered[0]?.id ?? entry.id;
    const targetMonth = toMonthIndex(entry.endSortDate);
    let bestId = entry.id;
    let bestDiff = Infinity;
    for (const candidate of filtered) {
      const diff = Math.abs(toMonthIndex(candidate.sortDate) - targetMonth);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestId = candidate.id;
      }
    }
    return bestId;
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
        aria-label="Roadmap timeline, scrollable horizontally — click and drag, or scroll"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className="pulse-scroller mt-10 overflow-x-auto overflow-y-hidden pb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        <div className="relative flex w-max items-start gap-8 px-1">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 h-px bg-line"
            style={{ top: geometry.trunkY }}
          />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute left-0 h-px bg-signal shadow-[0_0_10px_rgba(45,217,201,0.6)]"
            style={{ width: 0, top: geometry.trunkY }}
          />
          <div
            ref={dotRef}
            aria-hidden="true"
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_12px_rgba(45,217,201,0.8)]"
            style={{ left: 0, top: geometry.trunkY }}
          />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 w-full"
            style={{ height: geometry.graphHeight }}
          >
            {filtered.map((entry) => {
              const x = nodeX[entry.id];
              if (x === undefined) return null;
              const lane = laneById[entry.id] ?? 0;
              const y = geometry.trunkY + laneOffsetIndex(lane) * LANE_STEP;
              return (
                <line
                  key={`stem-${entry.id}`}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={geometry.graphHeight}
                  className="text-line"
                  stroke="currentColor"
                  strokeWidth={1}
                />
              );
            })}
            {filtered.filter(isRangedEntry).map((entry) => {
              const lane = laneById[entry.id] ?? 0;
              if (lane === 0) return null;
              const rightX = nodeX[entry.id];
              const mergeTargetId = findMergeTargetId(entry);
              const leftX = nodeX[mergeTargetId];
              if (rightX === undefined || leftX === undefined || leftX >= rightX) return null;
              const laneY = geometry.trunkY + laneOffsetIndex(lane) * LANE_STEP;
              const toneText = TONE_TEXT_CLASSES[TYPE_TONE[entry.type]];
              return (
                <path
                  key={`branch-${entry.id}`}
                  d={buildBranchPath(rightX, leftX, geometry.trunkY, laneY)}
                  fill="none"
                  className={toneText}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
              );
            })}
          </svg>

          {filtered.map((entry) => {
            const x = nodeX[entry.id];
            const lane = laneById[entry.id] ?? 0;
            const y = geometry.trunkY + laneOffsetIndex(lane) * LANE_STEP;
            const tone = TONE_CLASSES[TYPE_TONE[entry.type]];
            return (
              <div
                key={`node-${entry.id}`}
                aria-hidden="true"
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: x ?? 0, top: y, opacity: x === undefined ? 0 : 1 }}
              >
                <span
                  className={`animate-dot-pulse flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-semibold ${tone}`}
                >
                  {TYPE_GLYPH[entry.type]}
                </span>
              </div>
            );
          })}

          {filtered.map((entry) => (
            <div
              key={entry.id}
              ref={(el) => registerColumn(entry.id, el)}
              className="flex w-64 shrink-0 flex-col sm:w-72"
              style={{ paddingTop: geometry.graphHeight }}
            >
              <Reveal className="w-full">
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
          ))}
        </div>
      </div>
    </div>
  );
}
