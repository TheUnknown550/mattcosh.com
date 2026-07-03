import type { Project } from "@/types/project";

/**
 * Real project data, sourced from content/linkedin-exports/Profile.csv.
 * Add more entries as case studies get written — see docs/project-data.md.
 */
export const projects: Project[] = [
  {
    slug: "cs-m-cardiac-monitor",
    title: "CS-M — Cardiac Self-Monitoring Tool",
    shortDescription:
      "An AI-powered cardiac self-monitoring system that analyzes recorded heart sounds with a recurrent neural network to flag patterns linked to heart disease — combining custom recording hardware, signal processing, and a mobile app.",
    category: "AI/ML",
    status: "Completed",
    year: "2022–2024",
    techStack: [
      "Signal Processing",
      "RNN",
      "Raspberry Pi",
      "Mobile App",
      "Embedded Hardware",
    ],
    featured: true,
    recognitions: [
      "Microsoft Imagine Cup — World Runner-Up",
      "Intel AI Global Impact Festival",
      "Regeneron ISEF",
    ],
    githubUrl: "https://github.com/TheUnknown550",
  },
];
