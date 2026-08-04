"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

/** Cycled by lane number, VS Code Git Graph-style — lane 0 (trunk) is always the signal teal. */
const TYPE_COLOR: Record<TimelineEntryType, string> = {
  education: "#82aaff",
  work: "#ff5a1f",
  project: "#2dd9c9",
  award: "#ffcb6b",
  certification: "#c792ea",
};

const LANE_STEP = 36;
const NODE_SIZE = 32;
const GRAPH_PADDING = 16;
/** Vertical distance from a row's top edge to its node's center — lines it up with the card's title. */
const NODE_ANCHOR_OFFSET = 26;

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

/**
 * A "git-graph" merge curve: starts exactly at the entry's own node
 * (off-trunk, in its lane — there's nothing to draw below it, since a
 * timeline entry has no earlier "parent" commit), runs straight up the lane,
 * then a single smooth symmetric bend sweeps it into the trunk at the merge
 * row (both ends of the bend have a vertical tangent, so it reads as one
 * continuous round curve rather than a sharp corner).
 */
function buildBranchPath(trunkX: number, laneX: number, bottomY: number, topY: number): string {
  const span = Math.max(bottomY - topY, 1);
  const curveSpan = Math.min(span * 0.35, 36);
  const bendStartY = Math.min(topY + curveSpan, bottomY);
  const midY = (topY + bendStartY) / 2;
  return `M ${trunkX} ${topY} C ${trunkX} ${midY}, ${laneX} ${midY}, ${laneX} ${bendStartY} L ${laneX} ${bottomY}`;
}

/**
 * The Roadmap's centerpiece: a vertical, multi-coloured "git graph" of every
 * milestone, in the spirit of VS Code's Git Graph extension. Work/project
 * entries that genuinely overlap in time branch away from the main trunk
 * (each lane gets its own colour) and merge back in; everything else renders
 * on the trunk. Branch curves are computed from measured card positions (not
 * date-proportional math) so they stay correct regardless of card height.
 */
export function PulseTimeline({ entries }: PulseTimelineProps) {
  const [selectedTypes, setSelectedTypes] = useState<TimelineEntryType[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const branchRefs = useRef<Map<string, SVGGeometryElement>>(new Map());
  const [nodeY, setNodeY] = useState<Record<string, number>>({});
  const [contentHeight, setContentHeight] = useState(0);

  // Memoized so its reference is stable across renders when selectedTypes/entries
  // haven't actually changed — it's a dependency of the position-measuring
  // effect below, and a fresh array reference on every render would retrigger
  // that effect every render (setNodeY -> re-render -> "changed" dependency
  // -> effect again), an infinite loop.
  const filtered = useMemo(
    () =>
      selectedTypes.length === 0
        ? entries
        : entries.filter((entry) => selectedTypes.includes(entry.type)),
    [selectedTypes, entries],
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
      { value: "All" as FilterValue, label: `All (${entries.length})`, tone: "#2dd9c9" },
      ...types
        .filter((type) => counts[type])
        .map((type) => ({
          value: type as FilterValue,
          label: `${TYPE_LABELS[type]} (${counts[type]})`,
          tone: TYPE_COLOR[type],
        })),
    ];
  }, [entries]);

  function toggleFilter(value: FilterValue) {
    if (value === "All") {
      setSelectedTypes([]);
      return;
    }
    setSelectedTypes((current) =>
      current.includes(value)
        ? current.filter((type) => type !== value)
        : [...current, value],
    );
  }

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
    const leftMost = Math.min(0, ...offsets);
    const rightMost = Math.max(0, ...offsets);
    const graphWidth = (rightMost - leftMost) * LANE_STEP + NODE_SIZE + GRAPH_PADDING * 2;
    const trunkX = -leftMost * LANE_STEP + GRAPH_PADDING + NODE_SIZE / 2;
    return { graphWidth, trunkX };
  }, [laneCount]);

  // Measures each row's actual rendered top position after layout, so the SVG
  // branch curves line up with the real (responsive) row positions instead of
  // guessed date-proportional math. Also captures total content height, since
  // the graph's trunk/fill/SVG need an explicit pixel height rather than a
  // percentage (which can't resolve against an auto-height flex parent).
  useLayoutEffect(() => {
    function measure() {
      const next: Record<string, number> = {};
      rowRefs.current.forEach((el, id) => {
        next[id] = el.offsetTop + NODE_ANCHOR_OFFSET;
      });
      setNodeY(next);
      setContentHeight(graphRef.current?.scrollHeight ?? 0);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filtered]);

  // Fills the trunk (EKG-style) as the page scrolls past it, and tracks a
  // glowing dot at the current read position — anchored to a fixed viewport
  // fraction rather than scroll-linked CSS animation-timeline, for broader
  // browser support.
  useEffect(() => {
    const graph = graphRef.current;
    const fill = fillRef.current;
    const dot = dotRef.current;
    if (!graph || !fill || !dot) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      fill.style.height = "100%";
      branchRefs.current.forEach((branch) => {
        branch.style.strokeDasharray = "none";
        branch.style.strokeDashoffset = "0";
        branch.style.opacity = "0.85";
      });
      return;
    }

    let raf = 0;
    function updateProgress() {
      if (!graph || !fill || !dot) return;
      const rect = graph.getBoundingClientRect();
      const anchor = window.innerHeight * 0.4;
      const progress = Math.min(Math.max(anchor - rect.top, 0), rect.height);
      fill.style.height = `${progress}px`;
      dot.style.top = `${progress}px`;
      dot.style.opacity = rect.height > 0 ? "1" : "0";

      branchRefs.current.forEach((branch) => {
        const totalLength = branch.getTotalLength();
        const startY = Number(branch.dataset.revealStart);
        const endY = Number(branch.dataset.revealEnd);
        const branchProgress =
          endY > startY
            ? Math.min(Math.max((progress - startY) / (endY - startY), 0), 1)
            : Number(progress >= endY);

        branch.style.strokeDasharray = `${totalLength}`;
        branch.style.strokeDashoffset = `${totalLength * (1 - branchProgress)}`;
        branch.style.opacity = "0.85";
      });
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
  }, [filtered.length, contentHeight]);

  function registerRow(id: string, el: HTMLDivElement | null) {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }

  function registerBranch(id: string, el: SVGGeometryElement | null) {
    if (el) branchRefs.current.set(id, el);
    else branchRefs.current.delete(id);
  }

  // For a branching entry that has actually finished, finds which row its
  // end date lands closest to — that's where its branch curve merges back
  // into the trunk. Still-ongoing entries never merge (see the branch-path
  // rendering below) — there's nothing to merge into yet. Only rows *above*
  // this one (i.e. strictly newer, since the feed is newest-first) are
  // considered: searching the whole list could pick a candidate that's
  // actually older than this entry's own row, which would leave the branch
  // with nowhere sensible to merge into and no line drawn at all.
  function findMergeTargetId(
    entry: TimelineEntry & { endSortDate: string },
    entryIndex: number,
  ): string | null {
    const targetMonth = toMonthIndex(entry.endSortDate);
    let bestId: string | null = null;
    let bestDiff = Infinity;
    for (let i = 0; i < entryIndex; i++) {
      const candidate = filtered[i];
      const diff = Math.abs(toMonthIndex(candidate.sortDate) - targetMonth);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestId = candidate.id;
      }
    }
    return bestId;
  }

  // A ranged entry only stays in its assigned lane if it can actually be
  // drawn as a proper branch — either still-open (draws the straight
  // unmerged line) or with a real merge target above it. Otherwise there's
  // nothing sensible to connect it to, so it falls back onto the trunk
  // rather than floating in a lane with no line at all.
  function getEffectiveLane(entry: TimelineEntry, index: number): number {
    const lane = laneById[entry.id] ?? 0;
    if (lane === 0 || !isRangedEntry(entry)) return lane;
    const endSortDate = entry.endSortDate;
    if (endSortDate === null) return lane;
    return findMergeTargetId({ ...entry, endSortDate }, index) === null ? 0 : lane;
  }

  return (
    <div>
      <FilterTabs
        options={options}
        value="All"
        onChange={() => setSelectedTypes([])}
        selectedValues={
          selectedTypes.length === 0 ? ["All"] : selectedTypes
        }
        onToggle={toggleFilter}
      />

      <div ref={graphRef} className="relative mt-10 flex flex-col gap-6">
        <div
          aria-hidden="true"
          className="absolute top-0 w-px bg-line"
          style={{ left: geometry.trunkX, height: contentHeight }}
        />
        <div
          ref={fillRef}
          aria-hidden="true"
          className="absolute top-0 w-px bg-signal shadow-[0_0_10px_rgba(45,217,201,0.6)]"
          style={{ left: geometry.trunkX, height: 0 }}
        />
        <div
          ref={dotRef}
          aria-hidden="true"
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_12px_rgba(45,217,201,0.8)]"
          style={{ left: geometry.trunkX, top: 0 }}
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          style={{ width: geometry.graphWidth, height: contentHeight }}
        >
          {filtered.map((entry, index) => {
            const y = nodeY[entry.id];
            if (y === undefined) return null;
            const lane = getEffectiveLane(entry, index);
            const x = geometry.trunkX + laneOffsetIndex(lane) * LANE_STEP;
            const color = TYPE_COLOR[entry.type];
            return (
              <line
                key={`stem-${entry.id}`}
                x1={x}
                y1={y}
                x2={geometry.graphWidth}
                y2={y}
                stroke={color}
                strokeWidth={1}
                strokeOpacity={0.4}
                strokeLinecap="round"
              />
            );
          })}
          {filtered.map((entry, index) => {
            if (!isRangedEntry(entry)) return null;
            const lane = getEffectiveLane(entry, index);
            if (lane === 0) return null;
            const bottomY = nodeY[entry.id];
            if (bottomY === undefined) return null;
            const laneX = geometry.trunkX + laneOffsetIndex(lane) * LANE_STEP;
            const color = TYPE_COLOR[entry.type];

            // Still ongoing — nothing has been "merged" yet, so the lane
            // stays open: a straight, unmerged line running off the top of
            // the graph rather than curving into a single trunk point.
            if (entry.endSortDate === null) {
              return (
                <line
                  key={`branch-${entry.id}`}
                  ref={(el) => registerBranch(entry.id, el)}
                  data-reveal-start={0}
                  data-reveal-end={bottomY}
                  x1={laneX}
                  y1={0}
                  x2={laneX}
                  y2={bottomY}
                  className="roadmap-branch"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeOpacity={0.85}
                />
              );
            }

            // getEffectiveLane already confirmed this returns a real target
            // (that's precisely what keeps `lane` non-zero here).
            const mergeTargetId = findMergeTargetId(
              entry as TimelineEntry & { endSortDate: string },
              index,
            );
            const topY = mergeTargetId ? nodeY[mergeTargetId] : undefined;
            if (topY === undefined || topY >= bottomY) return null;
            return (
              <path
                key={`branch-${entry.id}`}
                ref={(el) => registerBranch(entry.id, el)}
                data-reveal-start={topY}
                data-reveal-end={bottomY}
                d={buildBranchPath(geometry.trunkX, laneX, bottomY, topY)}
                fill="none"
                className="roadmap-branch"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeOpacity={0.85}
              />
            );
          })}
        </svg>

        {filtered.map((entry, index) => {
          const y = nodeY[entry.id];
          const lane = getEffectiveLane(entry, index);
          const x = geometry.trunkX + laneOffsetIndex(lane) * LANE_STEP;
          const color = TYPE_COLOR[entry.type];
          return (
            <div
              key={`node-${entry.id}`}
              aria-hidden="true"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y ?? 0, opacity: y === undefined ? 0 : 1 }}
            >
              <span
                className="animate-dot-pulse flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold"
                style={{
                  borderColor: color,
                  backgroundColor: `${color}1a`,
                  color,
                }}
              >
                {TYPE_GLYPH[entry.type]}
              </span>
            </div>
          );
        })}

        {filtered.map((entry) => (
          <div
            key={entry.id}
            ref={(el) => registerRow(entry.id, el)}
            style={{ paddingLeft: geometry.graphWidth }}
          >
            <Reveal>
              <TiltCard className="rounded-lg">
                <div
                  className="rounded-lg border border-line border-l-2 bg-surface p-5 transition-colors duration-300 hover:border-signal"
                  style={{ borderLeftColor: TYPE_COLOR[entry.type] }}
                >
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: TYPE_COLOR[entry.type] }}
                    />
                    <span style={{ color: TYPE_COLOR[entry.type] }}>
                      {TYPE_LABELS[entry.type]}
                    </span>
                    <span aria-hidden="true">·</span>
                    {entry.dateLabel}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold text-ink sm:text-lg">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="mt-1 text-sm text-ink-muted">{entry.subtitle}</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
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
                        className="mt-4 inline-flex font-mono text-xs uppercase tracking-wide transition-colors hover:text-accent"
                        style={{ color: TYPE_COLOR[entry.type] }}
                      >
                        {entry.link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={entry.link.href}
                        className="mt-4 inline-flex font-mono text-xs uppercase tracking-wide transition-colors hover:text-accent"
                        style={{ color: TYPE_COLOR[entry.type] }}
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
  );
}
