export const PROJECT_GRAPH_POSITION_EVENT = "portfolio-project-node-positions";
export const EXPERIENCE_GRAPH_POSITION_EVENT = "portfolio-experience-node-positions";

export interface ProjectGraphScreenPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}
