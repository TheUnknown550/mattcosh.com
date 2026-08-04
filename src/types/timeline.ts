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
   * entries (education, work, and projects). Absent for point-in-time
   * awards and certifications, which the Roadmap graph renders on the trunk.
   */
  endSortDate?: string | null;
  description: string;
  tags?: string[];
  link?: { label: string; href: string };
}
