import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { honors } from "@/data/honors";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

export type PortfolioGraphNodeType =
  | "core"
  | "project"
  | "experience"
  | "education"
  | "skill"
  | "certification"
  | "award";

export type GraphPosition = [number, number, number];

export interface PortfolioGraphNode {
  id: string;
  type: PortfolioGraphNodeType;
  title: string;
  eyebrow: string;
  description: string;
  position: GraphPosition;
  href?: string;
  actionLabel?: string;
}

export interface PortfolioGraphEdge {
  source: string;
  target: string;
}

export interface GraphClusterLabel {
  id: string;
  type: Exclude<PortfolioGraphNodeType, "core">;
  title: string;
  position: GraphPosition;
}

export interface GraphFocusStop {
  id: string;
  label: string;
  nodeTypes: PortfolioGraphNodeType[];
  featuredNodeId: string;
  cameraPosition: GraphPosition;
  cameraTarget: GraphPosition;
}

export const GRAPH_NODE_COLORS: Record<PortfolioGraphNodeType, string> = {
  core: "#f4f6f8",
  project: "#2dd9c9",
  experience: "#ff8a5b",
  education: "#82aaff",
  skill: "#65c7f2",
  certification: "#c792ea",
  award: "#ffd166",
};

const CLUSTER_CENTERS: Record<PortfolioGraphNodeType, GraphPosition> = {
  core: [0, 0.35, 0],
  skill: [0, -3.25, 2.7],
  project: [5.15, -0.2, -4.2],
  experience: [-5.15, -0.25, 3.6],
  education: [-4.85, 3.8, -3.2],
  certification: [4.9, -3.85, 3],
  award: [4.95, 3.65, 2.2],
};

const CLUSTER_SPREAD: Record<PortfolioGraphNodeType, [number, number, number]> = {
  core: [0, 0, 0],
  skill: [1.05, 0.85, 1.8],
  project: [1.3, 1.05, 2],
  experience: [1.15, 1.1, 1.6],
  education: [0.9, 1.15, 1.4],
  certification: [1.1, 0.95, 1.8],
  award: [0.95, 1.05, 2],
};

const CLUSTER_COLUMNS: Record<PortfolioGraphNodeType, number> = {
  core: 1,
  skill: 3,
  project: 3,
  experience: 2,
  education: 1,
  certification: 3,
  award: 4,
};

export const graphClusterLabels: GraphClusterLabel[] = [
  {
    id: "projects",
    type: "project",
    title: "Projects",
    position: [5.15, 1.7, -4.2],
  },
  {
    id: "experience",
    type: "experience",
    title: "Experience",
    position: [-5.15, 1.65, 3.6],
  },
  {
    id: "education",
    type: "education",
    title: "Education",
    position: [-4.85, 5.45, -3.2],
  },
  {
    id: "awards",
    type: "award",
    title: "Awards",
    position: [4.95, 5.25, 2.2],
  },
  {
    id: "certifications",
    type: "certification",
    title: "Certifications",
    position: [4.9, -2.45, 3],
  },
  {
    id: "skills",
    type: "skill",
    title: "Skills",
    position: [0, -1.75, 2.7],
  },
];

function positionInCluster(
  type: PortfolioGraphNodeType,
  index: number,
  count: number,
): GraphPosition {
  if (type === "core") return CLUSTER_CENTERS.core;

  const [centerX, centerY, centerZ] = CLUSTER_CENTERS[type];
  const [gapX, gapY, depth] = CLUSTER_SPREAD[type];
  const columns = Math.min(CLUSTER_COLUMNS[type], count);
  const rows = Math.ceil(count / columns);
  const column = index % columns;
  const row = Math.floor(index / columns);
  const depthOffset = ((index * 2) % 5 - 2) * depth * 0.65;

  return [
    centerX + (column - (columns - 1) / 2) * gapX,
    centerY + ((rows - 1) / 2 - row) * gapY,
    centerZ + depthOffset,
  ];
}

const SKILL_MATCHERS: Array<{ id: string; terms: string[] }> = [
  {
    id: "ai-machine-learning",
    terms: [
      "ai",
      "machine learning",
      "neural",
      "rnn",
      "opencv",
      "mediapipe",
      "computer vision",
      "pose",
    ],
  },
  {
    id: "web-software-development",
    terms: [
      "react",
      "typescript",
      "javascript",
      "node",
      "express",
      "full-stack",
      "api",
      "web",
      "database",
      "postgres",
      "next.js",
      "testing",
      "agile",
    ],
  },
  {
    id: "systems-iot-networking",
    terms: [
      "iot",
      "raspberry",
      "embedded",
      "hardware",
      "signal processing",
      "network",
      "cybersecurity",
      "cabling",
      "obs",
      "automation",
    ],
  },
  {
    id: "programming-languages",
    terms: ["python", "java", "c (", "programming"],
  },
  {
    id: "research-product",
    terms: [
      "research",
      "gtfs",
      "data",
      "chart",
      "deck.gl",
      "simulation",
      "science",
      "analysis",
    ],
  },
  {
    id: "creative-tools",
    terms: ["unity", "game", "video", "media"],
  },
  {
    id: "leadership-communication",
    terms: [
      "teaching",
      "mentoring",
      "communication",
      "project management",
      "client",
      "leadership",
      "presentation",
      "coordination",
      "agile",
    ],
  },
];

function relatedSkillIds(...values: string[]) {
  const searchableText = values.join(" ").toLowerCase();
  const matches = SKILL_MATCHERS.filter(({ terms }) =>
    terms.some((term) => searchableText.includes(term)),
  ).map(({ id }) => `skill-${id}`);

  return matches.length > 0
    ? matches.slice(0, 2)
    : ["skill-web-software-development"];
}

function uniqueEdges(edges: PortfolioGraphEdge[]) {
  const seen = new Set<string>();

  return edges.filter(({ source, target }) => {
    const key = [source, target].sort().join("::");
    if (seen.has(key) || source === target) return false;
    seen.add(key);
    return true;
  });
}

const coreNode: PortfolioGraphNode = {
  id: "core-matt-cosh",
  type: "core",
  title: "Matt Cosh",
  eyebrow: "Portfolio core",
  description:
    "A connected map of my work across applied AI, full-stack software, IoT, research, and network engineering.",
  position: CLUSTER_CENTERS.core,
};

const skillNodes: PortfolioGraphNode[] = skills.map((group, index) => ({
  id: `skill-${SKILL_MATCHERS[index].id}`,
  type: "skill",
  title: group.category,
  eyebrow: `${group.skills.length} skills`,
  description: group.skills.slice(0, 4).join(" · "),
  position: positionInCluster("skill", index, skills.length),
  href: "/skills",
  actionLabel: "View skills",
}));

const projectNodes: PortfolioGraphNode[] = projects.map((project, index) => ({
  id: `project-${project.slug}`,
  type: "project",
  title: project.title,
  eyebrow: `${project.category} · ${project.year}`,
  description: project.shortDescription,
  position: positionInCluster("project", index, projects.length),
  href: `/projects/${project.slug}`,
  actionLabel: "View project",
}));

const experienceNodes: PortfolioGraphNode[] = experience.map((entry, index) => ({
  id: `experience-${entry.id}`,
  type: "experience",
  title: entry.title,
  eyebrow: `${entry.company} · ${entry.startLabel} — ${entry.endLabel}`,
  description: entry.summary,
  position: positionInCluster("experience", index, experience.length),
  href: `/experience/${entry.id}`,
  actionLabel: "View experience",
}));

const educationNodes: PortfolioGraphNode[] = education.map((entry, index) => ({
  id: `education-${entry.id}`,
  type: "education",
  title: entry.school,
  eyebrow: `${entry.startLabel} — ${entry.endLabel}`,
  description: entry.notes ?? entry.degree,
  position: positionInCluster("education", index, education.length),
  href: "/experience",
  actionLabel: "View education",
}));

const certificationNodes: PortfolioGraphNode[] = certifications.map((cert, index) => ({
  id: `certification-${cert.id}`,
  type: "certification",
  title: cert.name,
  eyebrow: `${cert.authority} · ${cert.issuedLabel}`,
  description: `Credential issued by ${cert.authority}.`,
  position: positionInCluster("certification", index, certifications.length),
  href: cert.url ?? "/certifications",
  actionLabel: cert.url ? "Open credential" : "View certifications",
}));

const awardNodes: PortfolioGraphNode[] = honors.map((honor, index) => ({
  id: `award-${honor.id}`,
  type: "award",
  title: honor.title,
  eyebrow: honor.dateLabel,
  description: honor.description,
  position: positionInCluster("award", index, honors.length),
  href: honor.relatedProjectSlug
    ? `/projects/${honor.relatedProjectSlug}`
    : "/roadmap",
  actionLabel: honor.relatedProjectSlug ? "View related project" : "View roadmap",
}));

export const portfolioGraphNodes: PortfolioGraphNode[] = [
  coreNode,
  ...skillNodes,
  ...projectNodes,
  ...experienceNodes,
  ...educationNodes,
  ...certificationNodes,
  ...awardNodes,
];

const skillEdges = skillNodes.map(({ id }) => ({
  source: coreNode.id,
  target: id,
}));

const projectEdges = projects.flatMap((project) =>
  relatedSkillIds(project.title, project.category, ...project.techStack).map(
    (target) => ({ source: `project-${project.slug}`, target }),
  ),
);

const experienceEdges = experience.flatMap((entry) =>
  relatedSkillIds(entry.title, entry.summary, ...entry.skillsGained).map(
    (target) => ({ source: `experience-${entry.id}`, target }),
  ),
);

const educationEdges = education.flatMap((entry) => [
  { source: coreNode.id, target: `education-${entry.id}` },
  ...relatedSkillIds(entry.degree, entry.notes ?? "").map((target) => ({
    source: `education-${entry.id}`,
    target,
  })),
]);

const certificationEdges = certifications.flatMap((cert) =>
  relatedSkillIds(cert.name, cert.authority).map((target) => ({
    source: `certification-${cert.id}`,
    target,
  }),
  ),
);

const awardEdges = honors.flatMap((honor) => {
  const source = `award-${honor.id}`;

  if (honor.relatedProjectSlug) {
    return [{ source, target: `project-${honor.relatedProjectSlug}` }];
  }

  return relatedSkillIds(honor.title, honor.description).map((target) => ({
    source,
    target,
  }));
});

export const portfolioGraphEdges = uniqueEdges([
  ...skillEdges,
  ...projectEdges,
  ...experienceEdges,
  ...educationEdges,
  ...certificationEdges,
  ...awardEdges,
]);

export const graphFocusStops: GraphFocusStop[] = [
  {
    id: "overview",
    label: "The whole system",
    nodeTypes: [
      "core",
      "project",
      "experience",
      "education",
      "skill",
      "certification",
      "award",
    ],
    featuredNodeId: coreNode.id,
    cameraPosition: [0, 0, 16.75],
    cameraTarget: [0, 0.1, 0],
  },
  {
    id: "core",
    label: "The core",
    nodeTypes: ["core"],
    featuredNodeId: coreNode.id,
    cameraPosition: [0, 0.35, 5.8],
    cameraTarget: [0, 0.35, 0],
  },
  {
    id: "projects",
    label: "Projects",
    nodeTypes: ["project"],
    featuredNodeId: "project-cs-m-cardiac-monitor",
    cameraPosition: [5.15, 0.1, 7.5],
    cameraTarget: [5.15, -0.2, -0.3],
  },
  {
    id: "experience",
    label: "Experience",
    nodeTypes: ["experience"],
    featuredNodeId: "experience-playtorium",
    cameraPosition: [-5.15, -0.1, 7.5],
    cameraTarget: [-5.15, -0.25, 0.05],
  },
  {
    id: "skills",
    label: "Skills",
    nodeTypes: ["skill"],
    featuredNodeId: "skill-ai-machine-learning",
    cameraPosition: [0, -3.05, 7.15],
    cameraTarget: [0, -3.25, 0.25],
  },
  {
    id: "education",
    label: "Education",
    nodeTypes: ["education"],
    featuredNodeId: "education-cmu",
    cameraPosition: [-4.85, 3.75, 7.2],
    cameraTarget: [-4.85, 3.8, -0.2],
  },
  {
    id: "certifications",
    label: "Certifications",
    nodeTypes: ["certification"],
    featuredNodeId: "certification-daiot-helsinki",
    cameraPosition: [4.9, -3.75, 7.2],
    cameraTarget: [4.9, -3.85, -0.25],
  },
  {
    id: "recognition",
    label: "Recognition",
    nodeTypes: ["award"],
    featuredNodeId: "award-imagine-cup",
    cameraPosition: [4.95, 3.6, 7.35],
    cameraTarget: [4.95, 3.65, -0.35],
  },
];

export function getPortfolioGraphNode(id: string) {
  return portfolioGraphNodes.find((node) => node.id === id);
}
