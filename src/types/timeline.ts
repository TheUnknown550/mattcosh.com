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
  description: string;
  tags?: string[];
  link?: { label: string; href: string };
}
