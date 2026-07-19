export type TimelineEntryType =
  | "education"
  | "work"
  | "project"
  | "award"
  | "certification";

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  subtitle?: string;
  dateLabel: string;
  sortDate: string;
  /**
   * "YYYY-MM" end date, null if ongoing — only set for "work"/"project"
   * entries (the types with a real duration). Absent for point-in-time
   * entries (education/award/certification), which the Roadmap's branch
   * graph renders on the trunk rather than lane-assigning.
   */
  endSortDate?: string | null;
  description: string;
  tags?: string[];
  link?: { label: string; href: string };
}
