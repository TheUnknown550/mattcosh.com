"use client";

import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  graphFocusStops,
  type GraphPosition,
} from "@/data/portfolioGraph";
import { OVERVIEW_STOP } from "./constants";
import { PortfolioGraphScene } from "./PortfolioGraphScene";
import {
  EXPERIENCE_GRAPH_POSITION_EVENT,
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
const EXPERIENCE_STOP = graphFocusStops.find((stop) => stop.id === "experience") ?? OVERVIEW_STOP;
const EXPERIENCE_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  // Keep the experience cluster legible without letting one node fill the
  // entire left side of wide displays. The extra distance keeps all four
  // visible, while the lower target moves the group into the upper-left area.
  position: [-3.7, 0.55, 8.2],
  target: [-3.8, -0.8, 0.5],
};
const EXPERIENCE_COMPACT_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  position: [-3.7, 0.7, 9.8],
  target: [-3.8, -0.8, 0.5],
};
const EDUCATION_STOP = graphFocusStops.find((stop) => stop.id === "education") ?? OVERVIEW_STOP;
const EDUCATION_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  // Shift the shot right so the Education anchors sit farther left on screen,
  // using the available left-side space instead of leaving it empty.
  position: [-2.7, 4.1, 7.35],
  target: [-2.85, 3.8, -0.2],
};
const EDUCATION_COMPACT_BACKGROUND_CAMERA: { position: GraphPosition; target: GraphPosition } = {
  position: [-2.7, 4.3, 9],
  target: [-2.85, 3.8, -0.2],
};
function interpolatePosition(
  from: GraphPosition,
  to: GraphPosition,
  progress: number,
): GraphPosition {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
    from[2] + (to[2] - from[2]) * progress,
  ];
}

function interpolateCameraPose(
  from: { position: GraphPosition; target: GraphPosition },
  to: { position: GraphPosition; target: GraphPosition },
  progress: number,
): { position: GraphPosition; target: GraphPosition } {
  if (progress <= 0) return from;
  if (progress >= 1) return to;

  // A camera move needs more than a straight vertical pan. It pulls back and
  // rises between the two clusters so both node groups have room on screen,
  // then eases back into the incoming section. Using the same progress value
  // makes the movement run in reverse when the reader scrolls back up.
  const easedProgress = progress * progress * (3 - 2 * progress);
  const revealProgress = Math.sin(easedProgress * Math.PI);
  const position = interpolatePosition(from.position, to.position, easedProgress);
  const target = interpolatePosition(from.target, to.target, easedProgress);

  return {
    position: [
      position[0] + 0.65 * revealProgress,
      position[1] + 0.5 * revealProgress,
      position[2] + 3.4 * revealProgress,
    ] as GraphPosition,
    target: [
      target[0] + 0.2 * revealProgress,
      target[1] + 0.1 * revealProgress,
      target[2],
    ] as GraphPosition,
  };
}

/**
 * A quiet, non-interactive version of the portfolio graph that stays behind
 * every route. The home page owns the interactive explorer, so it is omitted
 * there to avoid rendering two graphs at once.
 */
export function PortfolioGraphBackground() {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [experienceScrollProgress, setExperienceScrollProgress] = useState(0);
  const isProjectsRoute = pathname === "/projects";
  const isExperienceRoute = pathname === "/experience";
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
  const reportExperienceNodePositions = useCallback(
    (positions: ProjectGraphScreenPosition[]) => {
      if (!isExperienceRoute) return;
      window.dispatchEvent(
        new CustomEvent<ProjectGraphScreenPosition[]>(EXPERIENCE_GRAPH_POSITION_EVENT, {
          detail: positions,
        }),
      );
    },
    [isExperienceRoute],
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

  useEffect(() => {
    if (!isExperienceRoute) return;

    const transitionSection = document.getElementById("experience-transition");
    if (!transitionSection) return;

    const updateFocus = () => {
      const transitionRect = transitionSection.getBoundingClientRect();
      // The blank transition corridor gives the camera a full half-viewport
      // to travel between clusters. At every point, one cluster is active.
      const start = window.innerHeight * 0.82;
      const end = window.innerHeight * 0.18 - transitionRect.height;
      const nextProgress = Math.min(
        1,
        Math.max(0, (start - transitionRect.top) / (start - end)),
      );
      setExperienceScrollProgress((current) =>
        Math.abs(current - nextProgress) < 0.002 ? current : nextProgress,
      );
    };

    updateFocus();
    window.addEventListener("scroll", updateFocus, { passive: true });
    window.addEventListener("resize", updateFocus);
    return () => {
      window.removeEventListener("scroll", updateFocus);
      window.removeEventListener("resize", updateFocus);
    };
  }, [isExperienceRoute]);

  if (pathname === "/") return null;

  const experienceStop =
    experienceScrollProgress < 0.5 ? EXPERIENCE_STOP : EDUCATION_STOP;
  const experienceCamera = interpolateCameraPose(
    isCompactViewport
      ? EXPERIENCE_COMPACT_BACKGROUND_CAMERA
      : EXPERIENCE_BACKGROUND_CAMERA,
    isCompactViewport
      ? EDUCATION_COMPACT_BACKGROUND_CAMERA
      : EDUCATION_BACKGROUND_CAMERA,
    experienceScrollProgress,
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${
        isProjectsRoute
          ? "opacity-30 sm:opacity-55 2xl:opacity-75 [mask-image:radial-gradient(ellipse_at_72%_50%,black_0%,black_58%,transparent_90%)]"
          : isExperienceRoute
            ? "opacity-30 sm:opacity-55 2xl:opacity-75 [mask-image:radial-gradient(ellipse_at_28%_50%,black_0%,black_58%,transparent_90%)]"
          : "opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      }`}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 5.5, 18], fov: 43 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <PortfolioGraphScene
          activeStop={
            isProjectsRoute ? PROJECTS_STOP : isExperienceRoute ? experienceStop : OVERVIEW_STOP
          }
          onSelect={() => undefined}
          onExplore={() => undefined}
          isExplorer={false}
          reduceMotion={reduceMotion}
          onProjectNodePositions={isProjectsRoute ? reportProjectNodePositions : undefined}
          onExperienceNodePositions={
            isExperienceRoute ? reportExperienceNodePositions : undefined
          }
          backgroundCameraPose={
            isProjectsRoute
              ? isCompactViewport
                ? PROJECTS_COMPACT_BACKGROUND_CAMERA
                : PROJECTS_BACKGROUND_CAMERA
              : isExperienceRoute
                ? experienceCamera
                : undefined
          }
        />
      </Canvas>
    </div>
  );
}
