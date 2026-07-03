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
  techStack: string[];
  featured: boolean;
  recognitions?: string[];
  coverImage?: string;
  modelPath?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyPath?: string;
}
