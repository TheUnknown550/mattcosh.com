export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  location: string;
  startLabel: string;
  endLabel: string;
  sortDate: string;
  /** "YYYY-MM", or null if still ongoing ("Present") — used to detect
   * concurrency with other roles/projects for the Roadmap's branch graph. */
  endSortDate: string | null;
  summary: string;
  highlights: string[];
}
