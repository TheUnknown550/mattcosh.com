export type ProjectCategory =
  | "AI/ML"
  | "Full-Stack"
  | "IoT"
  | "Robotics"
  | "Mobile"
  | "Research"
  | "Other";

export type ProjectStatus = "Completed" | "In Progress" | "Archived";

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  /** "YYYY-MM" — precise start, used for the Roadmap's branch graph
   * (concurrency detection) rather than the display-only `year` string. */
  startSortDate: string;
  /** "YYYY-MM", or null if still ongoing (status "In Progress"). */
  endSortDate: string | null;
  techStack: string[];
  featured: boolean;
  recognitions?: string[];
  coverImage?: string;
  modelPath?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyPath?: string;
}
