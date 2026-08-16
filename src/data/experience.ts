import type { ExperienceEntry } from "@/types/experience";

/**
 * Reviewed from private source exports. Ordered most recent first.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "playtorium",
    company: "Playtorium Solutions Public Company Limited",
    title: "Intern — Full-Stack Developer",
    location: "Bangkok",
    startLabel: "Apr 2026",
    endLabel: "Present",
    sortDate: "2026-04",
    endSortDate: null,
    summary:
      "Building production features across the stack for client-facing products, from APIs and BFF logic to email workflows, inside an Agile team.",
    highlights: [
      "Shipped full-stack features spanning frontend UI, backend services, and API integrations for internal and client-facing projects.",
      "Built BFF logic and email notification flows to support real business workflows.",
      "Worked through sprint planning, code review, testing, and QA as part of an Agile delivery team.",
    ],
    skillsGained: ["Full-Stack Development", "API Integration", "BFF Design", "Testing & QA", "Agile Delivery"],
    whatILearned: [
      "How production teams turn requirements into maintainable, reliable software through planning, reviews, testing, and QA.",
      "How frontend, backend, API, and notification work must fit together to support a real business workflow.",
    ],
  },
  {
    id: "fastwork",
    company: "Fastwork.co",
    title: "Freelance Full-Stack Developer",
    location: "Remote",
    startLabel: "Dec 2025",
    endLabel: "Present",
    sortDate: "2025-12",
    endSortDate: null,
    summary:
      "Delivering freelance software and hardware projects for independent clients, from landing pages to full-stack apps and IoT circuit design.",
    highlights: [
      "Partnered with 5+ clients directly to scope requirements and deliver tailored technical solutions.",
      "Built responsive frontend websites and full-stack web apps from planning through deployment.",
      "Delivered IoT and circuit-design work alongside custom form systems with automated email notifications.",
    ],
    skillsGained: ["Client Discovery", "Full-Stack Delivery", "Deployment", "IoT & Circuit Design", "Client Communication"],
    whatILearned: [
      "How to turn an open-ended client request into a defined scope, practical delivery plan, and working solution.",
      "How to balance software, hardware, usability, and clear communication across independent client projects.",
    ],
  },
  {
    id: "cmu-ta",
    company: "Chiang Mai University",
    title: "Teaching Assistant (TA)",
    location: "Chiang Mai",
    startLabel: "Nov 2024",
    endLabel: "Apr 2026",
    sortDate: "2024-11",
    endSortDate: "2026-04",
    summary:
      "Supported 80+ students across Calculus II, Computer Algorithm Lab, and Information Systems & Network Engineering Lab.",
    highlights: [
      "Mentored 80+ students through programming, debugging, and algorithm-design problem solving.",
      "Led weekly review sessions for 25+ students to reinforce course material ahead of assignments.",
      "Guided lab sessions across two engineering courses, translating complex concepts into step-by-step explanations.",
    ],
    skillsGained: ["Technical Mentoring", "Algorithm Design", "Debugging", "Teaching", "Communication"],
    whatILearned: [
      "How to explain algorithms and programming concepts clearly to people with different levels of experience.",
      "How mentoring strengthens technical reasoning by requiring a structured, patient approach to problem solving.",
    ],
  },
  {
    id: "tlic",
    company: "Teaching and Learning Innovation Center, Chiang Mai University",
    title: "Summer Intern — IoT & Project Management",
    location: "Chiang Mai",
    startLabel: "Mar 2025",
    endLabel: "Jun 2025",
    sortDate: "2025-03",
    endSortDate: "2025-06",
    summary:
      "Three-month internship supporting IoT system setup, media-room automation, and Raspberry Pi-based workflows.",
    highlights: [
      "Shipped IoT and media-room automation improvements across 3 project areas.",
      "Built software to manage multiple isolated OBS user profiles for shared media-room workflows.",
      "Reconfigured IoT and wireless devices into a centralised room-management setup and built a usage-tracking dashboard.",
      "Recognised for strong performance and invited back for a second summer internship.",
    ],
    skillsGained: ["IoT Integration", "Raspberry Pi", "OBS Studio", "Workflow Automation", "Project Coordination"],
    whatILearned: [
      "How to deploy and improve technology in an active physical environment without disrupting the people who use it.",
      "How configuration isolation, automation, and operational visibility improve a shared media-room workflow.",
    ],
  },
];
