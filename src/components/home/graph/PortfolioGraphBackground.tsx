"use client";

import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { graphFocusStops, type GraphPosition } from "@/data/portfolioGraph";
import { OVERVIEW_STOP } from "./constants";
import { PortfolioGraphScene } from "./PortfolioGraphScene";
import {
  PROJECT_GRAPH_POSITION_EVENT,
  type ProjectGraphScreenPosition,
} from "./projectNodeProjection";

const PROJECTS_STOP = graphFocusStops.find((stop) => stop.id === "projects") ?? OVERVIEW_STOP;
const PROJECTS_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  // Keep the project cluster close and right-weighted, leaving the left rail
  // clear for cards while preserving the real graph coordinates.
  position: [1.25, 0.4, 3.4],
  target: [1.15, -0.2, -1.4],
};
const PROJECTS_COMPACT_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  // Wider framing keeps the network atmospheric on tablets and phones rather
  // than letting a single node dominate the available reading area.
  position: [0.75, 0.6, 5.8],
  target: [0.65, -0.2, -1.4],
};

/**
 * A quiet, non-interactive version of the portfolio graph that stays behind
 * every route. The home page owns the interactive explorer, so it is omitted
 * there to avoid rendering two graphs at once.
 */
export function PortfolioGraphBackground() {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const isProjectsRoute = pathname === "/projects";
  const reportProjectNodePositions = useCallback(
    (positions: ProjectGraphScreenPosition[]) => {
      if (!isProjectsRoute) return;
      window.dispatchEvent(
        new CustomEvent<ProjectGraphScreenPosition[]>(PROJECT_GRAPH_POSITION_EVENT, {
          detail: positions,
        }),
      );
    },
    [isProjectsRoute],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1535px)");
    const updateViewport = () => setIsCompactViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${
        isProjectsRoute
          ? "opacity-30 sm:opacity-55 2xl:opacity-75 [mask-image:radial-gradient(ellipse_at_72%_50%,black_0%,black_58%,transparent_90%)]"
          : "opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      }`}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 5.5, 18], fov: 43 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <PortfolioGraphScene
          activeStop={isProjectsRoute ? PROJECTS_STOP : OVERVIEW_STOP}
          onSelect={() => undefined}
          onExplore={() => undefined}
          isExplorer={false}
          reduceMotion={reduceMotion}
          onProjectNodePositions={isProjectsRoute ? reportProjectNodePositions : undefined}
          backgroundCameraPose={
            isProjectsRoute
              ? isCompactViewport
                ? PROJECTS_COMPACT_BACKGROUND_CAMERA
                : PROJECTS_BACKGROUND_CAMERA
              : undefined
          }
        />
      </Canvas>
    </div>
  );
}
