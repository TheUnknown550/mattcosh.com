import type { Project } from "@/types/project";

/**
 * Real project data, sourced from content/linkedin-exports/Projects.csv.
 * Ordered most recent first — see docs/project-data.md.
 */
export const projects: Project[] = [
  {
    slug: "cs-m-cardiac-monitor",
    title: "CS-M — Cardiac Self-Monitoring Tool",
    shortDescription:
      "An AI-powered cardiac self-monitoring system that analyzes recorded heart sounds with a recurrent neural network to flag patterns linked to heart disease — combining custom recording hardware, signal processing, and a mobile app.",
    category: "AI/ML",
    status: "Completed",
    year: "2021–2023",
    startSortDate: "2021-05",
    endSortDate: "2023-12",
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
  {
    slug: "co2-emission-gtfs",
    title: "CO₂ Emission Visualization from GTFS Data",
    shortDescription:
      "A research-driven urban analytics tool that simulates and visualizes public-transit carbon emissions with particle-based dispersion modeling over Deck.GL and Chart.js.",
    category: "Research",
    status: "Completed",
    year: "2025",
    startSortDate: "2025-07",
    endSortDate: "2025-09",
    techStack: ["GTFS", "Deck.GL", "Chart.js", "Data Visualization"],
    featured: false,
    recognitions: [
      "31st Tri-U International Joint Seminar — Workshop Presentation Award",
    ],
  },
  {
    slug: "obs-multi-user-manager",
    title: "OBS Multi-User Management System",
    shortDescription:
      "A profile-switching system for OBS Studio that gives every user of a shared university media room an isolated, one-click configuration.",
    category: "Other",
    status: "Completed",
    year: "2025",
    startSortDate: "2025-03",
    endSortDate: "2025-05",
    techStack: ["OBS Studio", "Session Management", "System Integration", "Automation"],
    featured: false,
  },
  {
    slug: "mattcosh-website",
    title: "mattcosh.com — This Portfolio",
    shortDescription:
      "The site you're on right now — a hand-built, data-driven portfolio presenting my projects, experience, and timeline for recruiters and collaborators.",
    category: "Full-Stack",
    status: "In Progress",
    year: "2025–2026",
    startSortDate: "2025-08",
    endSortDate: null,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React Three Fiber"],
    featured: false,
    liveUrl: "https://mattcosh.com",
    githubUrl: "https://github.com/TheUnknown550",
  },
  {
    slug: "isnear",
    title: "IsNear — Proximity Social Network",
    shortDescription:
      "A proximity-based social networking MVP that helps people discover and connect with others nearby through real-time geolocation and privacy-first profile controls.",
    category: "Full-Stack",
    status: "Completed",
    year: "2024",
    startSortDate: "2024-07",
    endSortDate: "2024-12",
    techStack: ["Geolocation", "Real-Time Matching", "Privacy Controls", "MVP"],
    featured: false,
  },
  {
    slug: "gc-fit",
    title: "GC-Fit — Computer Vision Fitness Coach",
    shortDescription:
      "A real-time fitness app that uses OpenCV and MediaPipe pose estimation to recognize exercises and flag improper form as you train.",
    category: "AI/ML",
    status: "Completed",
    year: "2022",
    startSortDate: "2022-10",
    endSortDate: "2022-12",
    techStack: ["OpenCV", "MediaPipe", "Pose Estimation", "Python"],
    featured: false,
  },
  {
    slug: "i-thanke",
    title: "I-THANKe — Physical Therapy Motion Tracking",
    shortDescription:
      "A Unity-based physical therapy app that uses neural-network posture detection and gamification to help patients perform recovery exercises correctly and stay engaged.",
    category: "AI/ML",
    status: "Completed",
    year: "2021",
    startSortDate: "2021-06",
    endSortDate: "2021-12",
    techStack: ["Unity", "Neural Networks", "Motion Tracking", "Gamification"],
    featured: false,
  },
];
