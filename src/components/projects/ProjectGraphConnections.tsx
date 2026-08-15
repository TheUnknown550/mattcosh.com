"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  PROJECT_GRAPH_POSITION_EVENT,
  type ProjectGraphScreenPosition,
} from "@/components/home/graph/projectNodeProjection";
import type { Project } from "@/types/project";

type CardPort = { x: number; y: number };

interface ProjectGraphConnectionsProps {
  cardRefs: RefObject<Map<string, HTMLDivElement>>;
  projects: Project[];
}

/**
 * Connects a project card to the exact on-screen position of its matching
 * Three.js node. The source coordinates are emitted by the background scene;
 * this component measures the actual icon in each DOM card as the endpoint.
 */
export function ProjectGraphConnections({
  cardRefs,
  projects,
}: ProjectGraphConnectionsProps) {
  const [nodePositions, setNodePositions] = useState<
    Record<string, ProjectGraphScreenPosition>
  >({});
  const [cardPorts, setCardPorts] = useState<Record<string, CardPort>>({});

  useEffect(() => {
    const updateNodePositions = (event: Event) => {
      const positions = (event as CustomEvent<ProjectGraphScreenPosition[]>).detail;
      if (!positions) return;
      setNodePositions(Object.fromEntries(positions.map((position) => [position.id, position])));
    };

    window.addEventListener(PROJECT_GRAPH_POSITION_EVENT, updateNodePositions);
    return () => window.removeEventListener(PROJECT_GRAPH_POSITION_EVENT, updateNodePositions);
  }, []);

  useLayoutEffect(() => {
    const measureCardPorts = () => {
      const nextPorts: Record<string, CardPort> = {};

      projects.forEach((project) => {
        const card = cardRefs.current?.get(project.slug);
        if (!card) return;
        const nodeIcon = card.querySelector<SVGSVGElement>("[data-project-card-node]");
        const rect = card.getBoundingClientRect();
        const iconRect = nodeIcon?.getBoundingClientRect();

        if (!iconRect || rect.top < 0 || rect.top > window.innerHeight) return;
        nextPorts[project.slug] = {
          x: iconRect.left + iconRect.width / 2,
          y: iconRect.top + iconRect.height / 2,
        };
      });

      setCardPorts(nextPorts);
    };

    const frame = requestAnimationFrame(measureCardPorts);
    const observer = new ResizeObserver(measureCardPorts);

    cardRefs.current?.forEach((card) => observer.observe(card));
    window.addEventListener("resize", measureCardPorts);
    window.addEventListener("scroll", measureCardPorts, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measureCardPorts);
      window.removeEventListener("scroll", measureCardPorts, true);
    };
  }, [cardRefs, projects]);

  const connections = useMemo(
    () =>
      projects.flatMap((project) => {
        const node = nodePositions[`project-${project.slug}`];
        const port = cardPorts[project.slug];
        if (!node?.visible || !port) return [];

        return [{ id: project.slug, node, port }];
      }),
    [cardPorts, nodePositions, projects],
  );

  if (typeof document === "undefined" || connections.length === 0) return null;

  return createPortal(
    <svg
      aria-hidden="true"
      className="project-graph-connections"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
    >
      {connections.map(({ id, node, port }) => (
        <g key={id}>
          <line
            x1={node.x}
            y1={node.y}
            x2={port.x}
            y2={port.y}
            className="project-graph-connection"
          />
          <circle cx={node.x} cy={node.y} r="3.5" className="project-graph-source-node" />
        </g>
      ))}
    </svg>,
    document.body,
  );
}
