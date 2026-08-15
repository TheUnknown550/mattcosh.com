"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  EXPERIENCE_GRAPH_POSITION_EVENT,
  type ProjectGraphScreenPosition,
} from "@/components/home/graph/projectNodeProjection";

type CardPort = { x: number; y: number };

/**
 * Uses the actual projected points from the shared Three.js graph and joins
 * them to the small node glyph attached to each visible Experience card.
 */
export function ExperienceGraphConnections() {
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

    window.addEventListener(EXPERIENCE_GRAPH_POSITION_EVENT, updateNodePositions);
    return () => window.removeEventListener(EXPERIENCE_GRAPH_POSITION_EVENT, updateNodePositions);
  }, []);

  useLayoutEffect(() => {
    const measureCardPorts = () => {
      const nextPorts: Record<string, CardPort> = {};
      const cards = document.querySelectorAll<HTMLElement>("[data-graph-card-node-id]");

      cards.forEach((card) => {
        const nodeId = card.dataset.graphCardNodeId;
        const nodeIcon = card.querySelector<SVGSVGElement>("[data-experience-card-node]");
        const iconRect = nodeIcon?.getBoundingClientRect();
        if (!nodeId || !iconRect || iconRect.bottom < 0 || iconRect.top > window.innerHeight) return;

        // Keep connectors attached only while the card's node is in the main
        // reading area. This leaves the half-page section corridor clear while
        // the camera travels from Experience to Education.
        const iconCenterY = iconRect.top + iconRect.height / 2;
        if (
          iconCenterY < window.innerHeight * 0.14 ||
          iconCenterY > window.innerHeight * 0.86
        ) {
          return;
        }

        nextPorts[nodeId] = {
          x: iconRect.left + iconRect.width / 2,
          y: iconCenterY,
        };
      });

      setCardPorts(nextPorts);
    };

    const frame = requestAnimationFrame(measureCardPorts);
    const observer = new ResizeObserver(measureCardPorts);
    document
      .querySelectorAll<HTMLElement>("[data-graph-card-node-id]")
      .forEach((card) => observer.observe(card));
    window.addEventListener("resize", measureCardPorts);
    window.addEventListener("scroll", measureCardPorts, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measureCardPorts);
      window.removeEventListener("scroll", measureCardPorts, true);
    };
  }, []);

  const connections = useMemo(
    () =>
      Object.entries(cardPorts).flatMap(([id, port]) => {
        const node = nodePositions[id];
        if (!node?.visible) return [];
        return [{ id, node, port, isEducation: id.startsWith("education-") }];
      }),
    [cardPorts, nodePositions],
  );

  if (typeof document === "undefined" || connections.length === 0) return null;

  return createPortal(
    <svg
      aria-hidden="true"
      className="experience-graph-connections"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
    >
      {connections.map(({ id, node, port, isEducation }) => (
        <g key={id} className={isEducation ? "is-education" : undefined}>
          <line
            x1={node.x}
            y1={node.y}
            x2={port.x}
            y2={port.y}
            className="experience-graph-connection"
          />
          <circle cx={node.x} cy={node.y} r="3.5" className="experience-graph-source-node" />
        </g>
      ))}
    </svg>,
    document.body,
  );
}
