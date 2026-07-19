import type { SkillGroup } from "@/types/skill";

/**
 * Grouped from content/linkedin-exports/Skills.csv for readable display —
 * the raw export is a flat, unordered list of ~65 skills.
 */
export const skills: SkillGroup[] = [
  {
    category: "AI & Machine Learning",
    skills: [
      "Artificial Intelligence (AI)",
      "AI/ML Development",
      "Machine Learning",
      "Neural Networks",
      "Recurrent Neural Networks (RNN)",
      "Computer Vision",
      "MediaPipe",
      "Prompt Engineering",
      "Data Analysis",
    ],
  },
  {
    category: "Web & Software Development",
    skills: [
      "Full-Stack Development",
      "Front-End Development",
      "Back-End Web Development",
      "Web Development",
      "Web Applications",
      "Website",
      "React.js",
      "React Native",
      "Mobile Applications",
      "Responsive Web Design",
      "API Development",
      "Database Development",
      "Databases",
      "Git",
      "Version Control",
      "Debugging",
      "Testing",
      "Agile Development",
    ],
  },
  {
    category: "Systems, IoT & Networking",
    skills: [
      "Internet of Things (IoT)",
      "Home Automation",
      "Raspberry Pi",
      "Hardware Development",
      "Signal Processing",
      "Network Administration",
      "Network Security",
      "Network Design",
      "Cybersecurity",
    ],
  },
  {
    category: "Programming Languages",
    skills: ["Python (Programming Language)", "JavaScript", "Java", "C (Programming Language)"],
  },
  {
    category: "Research & Product",
    skills: [
      "Research and Development (R&D)",
      "Scientific Computing",
      "Computer Simulations",
      "GTFS",
      "Deck.GL",
      "Algorithms",
      "Science",
      "Market Research",
      "Product Analysis",
      "Price Analysis (Marketing)",
      "Business Strategy",
      "Business Analysis",
    ],
  },
  {
    category: "Creative & Tools",
    skills: ["Unity", "Game Development", "Video Editing"],
  },
  {
    category: "Leadership & Communication",
    skills: [
      "Project Management",
      "Project Planning",
      "Educational Leadership",
      "Leadership",
      "Communication",
      "Presentation Skills",
      "Problem Solving",
      "Collaborative Problem Solving",
      "User-centered Design",
    ],
  },
];
