import type { Project } from "@/types/project";

/**
 * Placeholder project data.
 * Replace with real projects as they are ready — see docs/project-data.md.
 */
export const projects: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    shortDescription:
      "A placeholder project used to test the portfolio structure.",
    category: "Other",
    status: "In Progress",
    year: "2026",
    techStack: ["Next.js", "TypeScript"],
    featured: true,
    coverImage: "/projects/example-project/cover.png",
    modelPath: "/models/example-model.glb",
    caseStudyPath: "content/projects/example-project.mdx",
  },
  {
    slug: "second-example-project",
    title: "Second Example Project",
    shortDescription:
      "A second placeholder project, used to verify list and grid rendering with multiple entries.",
    category: "AI/ML",
    status: "Completed",
    year: "2025",
    techStack: ["Python", "PyTorch"],
    featured: false,
  },
];
