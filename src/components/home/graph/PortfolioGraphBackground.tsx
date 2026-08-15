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

/**
 * A quiet, non-interactive version of the portfolio graph that stays behind
 * every route. The home page owns the interactive explorer, so it is omitted
 * there to avoid rendering two graphs at once.
 */
export function PortfolioGraphBackground() {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);
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

  if (pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${
        isProjectsRoute
          ? "opacity-75 [mask-image:radial-gradient(ellipse_at_72%_50%,black_0%,black_58%,transparent_90%)]"
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
          backgroundCameraPose={isProjectsRoute ? PROJECTS_BACKGROUND_CAMERA : undefined}
        />
      </Canvas>
    </div>
  );
}
