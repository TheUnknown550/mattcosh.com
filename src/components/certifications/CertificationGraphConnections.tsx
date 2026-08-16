"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CERTIFICATIONS_GRAPH_POSITION_EVENT,
  type ProjectGraphScreenPosition,
} from "@/components/home/graph/projectNodeProjection";
import { areScreenPortsEqual, type ScreenPort } from "@/lib/screenPorts";

type CardPort = ScreenPort;

/** Joins each credential card to the matching node emitted by the shared graph. */
export function CertificationGraphConnections() {
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

    window.addEventListener(CERTIFICATIONS_GRAPH_POSITION_EVENT, updateNodePositions);
    return () =>
      window.removeEventListener(CERTIFICATIONS_GRAPH_POSITION_EVENT, updateNodePositions);
  }, []);

  useLayoutEffect(() => {
    const frameRef = { current: null as number | null };

    const measureCardPorts = () => {
      const nextPorts: Record<string, CardPort> = {};
      const cards = document.querySelectorAll<HTMLElement>("[data-certification-card-node-id]");

      cards.forEach((card) => {
        const nodeId = card.dataset.certificationCardNodeId;
        const terminal = card.querySelector<SVGSVGElement>("[data-certification-card-node]");
        const terminalRect = terminal?.getBoundingClientRect();
        if (!nodeId || !terminalRect || terminalRect.bottom < 0 || terminalRect.top > window.innerHeight) {
          return;
        }

        nextPorts[nodeId] = {
          x: terminalRect.left + terminalRect.width / 2,
          y: terminalRect.top + terminalRect.height / 2,
        };
      });

      setCardPorts((previousPorts) =>
        areScreenPortsEqual(previousPorts, nextPorts)
          ? previousPorts
          : nextPorts,
      );
    };

    const scheduleMeasure = () => {
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        measureCardPorts();
      });
    };

    scheduleMeasure();
    const observer = new ResizeObserver(scheduleMeasure);
    document
      .querySelectorAll<HTMLElement>("[data-certification-card-node-id]")
      .forEach((card) => observer.observe(card));
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, true);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure, true);
    };
  }, []);

  const connections = useMemo(
    () =>
      Object.entries(cardPorts).flatMap(([id, port]) => {
        const node = nodePositions[id];
        if (!node?.visible) return [];
        return [{ id, node, port }];
      }),
    [cardPorts, nodePositions],
  );

  if (typeof document === "undefined" || connections.length === 0) return null;

  return createPortal(
    <svg
      aria-hidden="true"
      className="certification-graph-connections"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
    >
      {connections.map(({ id, node, port }) => (
        <g key={id}>
          <line
            x1={node.x}
            y1={node.y}
            x2={port.x}
            y2={port.y}
            className="certification-graph-connection"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r="3.5"
            className="certification-graph-source-node"
          />
        </g>
      ))}
    </svg>,
    document.body,
  );
}
