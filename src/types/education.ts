export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  startLabel: string;
  endLabel: string;
  sortDate: string;
  /** "YYYY-MM", or null when the end date is not known. Used by the Roadmap's branch graph. */
  endSortDate: string | null;
  notes?: string;
}
