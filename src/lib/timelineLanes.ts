/**
 * Lane assignment for the Roadmap's branch graph — a greedy interval-graph
 * colouring (the same idea git-graph tools use to pick swimlanes) that
 * detects genuinely overlapping date ranges among "work"/"project" entries
 * and assigns each a lane number. Lane 0 is the trunk; lane 1+ means the
 * entry ran concurrently with something else and gets drawn as a branch.
 */

export interface RangedEntry {
  id: string;
  /** "YYYY-MM" */
  startSortDate: string;
  /** "YYYY-MM", or null if ongoing */
  endSortDate: string | null;
}

export function toMonthIndex(dateStr: string): number {
  const [year, month] = dateStr.split("-").map(Number);
  return year * 12 + (month || 1);
}

export function assignLanes(entries: RangedEntry[]): {
  laneById: Record<string, number>;
  laneCount: number;
} {
  const sorted = [...entries].sort(
    (a, b) => toMonthIndex(a.startSortDate) - toMonthIndex(b.startSortDate),
  );

  // laneOccupiedUntil[lane] = month index the current occupant of that lane
  // runs through. A lane is free for a new entry once its occupant's end is
  // at or before the new entry's start.
  const laneOccupiedUntil: number[] = [];
  const laneById: Record<string, number> = {};

  for (const entry of sorted) {
    const startMonth = toMonthIndex(entry.startSortDate);
    const endMonth = entry.endSortDate ? toMonthIndex(entry.endSortDate) : Infinity;

    let lane = laneOccupiedUntil.findIndex((occupiedUntil) => occupiedUntil <= startMonth);
    if (lane === -1) {
      lane = laneOccupiedUntil.length;
    }
    laneOccupiedUntil[lane] = endMonth;
    laneById[entry.id] = lane;
  }

  return { laneById, laneCount: laneOccupiedUntil.length };
}

/**
 * Alternates lanes outward from the trunk (0, -1, 1, -2, 2, ...) so the
 * graph grows in both directions rather than stacking one way.
 */
export function laneOffsetIndex(lane: number): number {
  if (lane === 0) return 0;
  const magnitude = Math.ceil(lane / 2);
  const direction = lane % 2 === 1 ? -1 : 1;
  return direction * magnitude;
}
