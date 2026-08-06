import { Vector3 } from "three";
import {
  getPortfolioGraphNode,
  graphFocusStops,
  type PortfolioGraphNodeType,
} from "@/data/portfolioGraph";

export const HOME_CAMERA_DIRECTION = new Vector3(8, 5.5, 18);
export const HOME_CAMERA_TARGET = new Vector3(0, 0.1, 0);
export const CORE_POSITION = new Vector3(
  ...getPortfolioGraphNode("core-matt-cosh")!.position,
);
export const OVERVIEW_STOP = graphFocusStops[0];
export const EXPLORER_START_NODE_ID = "project-cs-m-cardiac-monitor";

export const GRAPH_TYPE_LABELS: Record<PortfolioGraphNodeType, string> = {
  core: "All nodes",
  project: "Projects",
  experience: "Experience",
  education: "Education",
  skill: "Skills",
  certification: "Certifications",
  award: "Awards",
};

export const DENSE_CLUSTER_TYPES: PortfolioGraphNodeType[] = [
  "project",
  "experience",
  "education",
  "skill",
  "certification",
  "award",
];
