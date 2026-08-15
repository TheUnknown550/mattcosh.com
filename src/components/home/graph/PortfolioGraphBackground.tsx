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
  CERTIFICATIONS_GRAPH_POSITION_EVENT,
  EXPERIENCE_GRAPH_POSITION_EVENT,
  PROJECT_GRAPH_POSITION_EVENT,
  type ProjectGraphScreenPosition,
} from "./projectNodeProjection";
import {
  getGraphRouteForPath,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";

type BackgroundCameraPose = {
  position: GraphPosition;
  target: GraphPosition;
};

const PROJECTS_STOP = graphFocusStops.find((stop) => stop.id === "projects") ?? OVERVIEW_STOP;
const PROJECTS_BACKGROUND_CAMERA: BackgroundCameraPose = {
  // Keep the project cluster close and right-weighted, leaving the left rail
  // clear for cards while preserving the real graph coordinates.
  position: [1.25, 0.4, 3.4],
  target: [1.15, -0.2, -1.4],
};
const PROJECTS_COMPACT_BACKGROUND_CAMERA: BackgroundCameraPose = {
  // Wider framing keeps the network atmospheric on tablets and phones rather
  // than letting a single node dominate the available reading area.
  position: [0.75, 0.6, 5.8],
  target: [0.65, -0.2, -1.4],
};
const PROJECTS_SCROLL_END_CAMERA: BackgroundCameraPose = {
  // The project page opens on the right-side cluster, then eases into a
  // slightly wider, higher angle as the card rail is explored.
  position: [2.2, 0.7, 4.8],
  target: [1.65, -0.45, -1.5],
};
const PROJECTS_COMPACT_SCROLL_END_CAMERA: BackgroundCameraPose = {
  position: [1.65, 0.85, 7.15],
  target: [1.15, -0.45, -1.5],
};
const CERTIFICATIONS_STOP =
  graphFocusStops.find((stop) => stop.id === "certifications") ?? OVERVIEW_STOP;
const CERTIFICATIONS_BACKGROUND_CAMERA: BackgroundCameraPose = {
  // Frame the actual 3×3 certification cluster as the centre of the page.
  position: [4.75, -3.5, 10],
  target: [4.9, -3.85, 3],
};
const CERTIFICATIONS_COMPACT_BACKGROUND_CAMERA: BackgroundCameraPose = {
  position: [4.75, -3.5, 12.4],
  target: [4.9, -3.85, 3],
};
const CERTIFICATIONS_SCROLL_END_CAMERA: BackgroundCameraPose = {
  // Move through the middle certification cluster instead of leaving it as a
  // static backdrop while the surrounding cards pass by.
  position: [5.55, -3.1, 8.7],
  target: [5.2, -3.7, 2.9],
};
const CERTIFICATIONS_COMPACT_SCROLL_END_CAMERA: BackgroundCameraPose = {
  position: [5.5, -3.1, 10.6],
  target: [5.2, -3.7, 2.9],
};
const SKILLS_STOP = graphFocusStops.find((stop) => stop.id === "skills") ?? OVERVIEW_STOP;
const SKILLS_BACKGROUND_CAMERA: BackgroundCameraPose = {
  position: [0, -2.7, 9.35],
  target: [0, -3.15, 0.2],
};
const SKILLS_COMPACT_BACKGROUND_CAMERA: BackgroundCameraPose = {
  position: [0, -2.7, 11.3],
  target: [0, -3.15, 0.2],
};
const OVERVIEW_BACKGROUND_CAMERA: BackgroundCameraPose = {
  position: [0, 0, 15.5],
  target: [0, 0.1, 0],
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
  from: BackgroundCameraPose,
  to: BackgroundCameraPose,
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

function interpolateScrollCameraPose(
  from: BackgroundCameraPose,
  to: BackgroundCameraPose,
  progress: number,
): BackgroundCameraPose {
  if (progress <= 0) return from;
  if (progress >= 1) return to;

  // A small arc avoids the mechanical feeling of a straight camera pan. The
  // scene rig supplies the final damping, while this pose remains completely
  // reversible when the reader scrolls back toward the top of the page.
  const easedProgress = progress * progress * (3 - 2 * progress);
  const arcProgress = Math.sin(easedProgress * Math.PI);
  const position = interpolatePosition(from.position, to.position, easedProgress);
  const target = interpolatePosition(from.target, to.target, easedProgress);

  return {
    position: [
      position[0] + 0.12 * arcProgress,
      position[1] + 0.08 * arcProgress,
      position[2] + 0.35 * arcProgress,
    ],
    target: [
      target[0] + 0.06 * arcProgress,
      target[1] + 0.02 * arcProgress,
      target[2],
    ],
  };
}

/**
 * A quiet, non-interactive version of the portfolio graph that stays behind
 * every route. The home page owns the interactive explorer, so it is omitted
 * there to avoid rendering two graphs at once.
 */
export function PortfolioGraphBackground() {
  const pathname = usePathname();
  const { transition } = useRouteTransition();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [experienceScrollProgress, setExperienceScrollProgress] = useState(0);
  const [routeScroll, setRouteScroll] = useState({ pathname: "", progress: 0 });
  const currentRoute = getGraphRouteForPath(pathname);
  const destinationRoute = transition
    ? getGraphRouteForPath(transition.destinationPath)
    : null;
  const graphRoute = transition?.phase === "leaving" ? destinationRoute : currentRoute;
  const isRouteTransitioning = transition !== null && !reduceMotion;
  const isProjectsRoute = graphRoute === "projects";
  const isExperienceRoute = graphRoute === "experience";
  const isCertificationsRoute = graphRoute === "certifications";
  const isSkillsRoute = graphRoute === "skills";
  const isCurrentProjectsRoute = currentRoute === "projects";
  const isCurrentExperienceRoute = currentRoute === "experience";
  const isCurrentCertificationsRoute = currentRoute === "certifications";
  const reportProjectNodePositions = useCallback(
    (positions: ProjectGraphScreenPosition[]) => {
      if (!isCurrentProjectsRoute) return;
      window.dispatchEvent(
        new CustomEvent<ProjectGraphScreenPosition[]>(PROJECT_GRAPH_POSITION_EVENT, {
          detail: positions,
        }),
      );
    },
    [isCurrentProjectsRoute],
  );
  const reportExperienceNodePositions = useCallback(
    (positions: ProjectGraphScreenPosition[]) => {
      if (!isCurrentExperienceRoute) return;
      window.dispatchEvent(
        new CustomEvent<ProjectGraphScreenPosition[]>(EXPERIENCE_GRAPH_POSITION_EVENT, {
          detail: positions,
        }),
      );
    },
    [isCurrentExperienceRoute],
  );
  const reportCertificationNodePositions = useCallback(
    (positions: ProjectGraphScreenPosition[]) => {
      if (!isCurrentCertificationsRoute) return;
      window.dispatchEvent(
        new CustomEvent<ProjectGraphScreenPosition[]>(CERTIFICATIONS_GRAPH_POSITION_EVENT, {
          detail: positions,
        }),
      );
    },
    [isCurrentCertificationsRoute],
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
    if (!isCurrentExperienceRoute) return;

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
  }, [isCurrentExperienceRoute]);

  useEffect(() => {
    if (!isCurrentProjectsRoute && !isCurrentCertificationsRoute) {
      return;
    }

    const updateCameraProgress = () => {
      const scrollRange = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const nextProgress =
        scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;

      setRouteScroll((current) => {
        if (
          current.pathname === pathname &&
          Math.abs(current.progress - nextProgress) < 0.002
        ) {
          return current;
        }

        return { pathname, progress: nextProgress };
      });
    };

    updateCameraProgress();
    window.addEventListener("scroll", updateCameraProgress, { passive: true });
    window.addEventListener("resize", updateCameraProgress);
    return () => {
      window.removeEventListener("scroll", updateCameraProgress);
      window.removeEventListener("resize", updateCameraProgress);
    };
  }, [isCurrentCertificationsRoute, isCurrentProjectsRoute, pathname]);

  // Home owns the interactive graph. Keep this background graph alive only
  // while leaving home so the camera can hand off to the destination; on the
  // return journey, let GraphJourney be the single source of truth again.
  if (pathname === "/" && transition?.phase !== "leaving") return null;

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
  const routeScrollProgress = routeScroll.pathname === pathname ? routeScroll.progress : 0;
  const projectsCamera = interpolateScrollCameraPose(
    isCompactViewport ? PROJECTS_COMPACT_BACKGROUND_CAMERA : PROJECTS_BACKGROUND_CAMERA,
    isCompactViewport ? PROJECTS_COMPACT_SCROLL_END_CAMERA : PROJECTS_SCROLL_END_CAMERA,
    reduceMotion ? 0 : routeScrollProgress,
  );
  const certificationsCamera = interpolateScrollCameraPose(
    isCompactViewport
      ? CERTIFICATIONS_COMPACT_BACKGROUND_CAMERA
      : CERTIFICATIONS_BACKGROUND_CAMERA,
    isCompactViewport
      ? CERTIFICATIONS_COMPACT_SCROLL_END_CAMERA
      : CERTIFICATIONS_SCROLL_END_CAMERA,
    reduceMotion ? 0 : routeScrollProgress,
  );
  const skillsCamera = isCompactViewport
    ? SKILLS_COMPACT_BACKGROUND_CAMERA
    : SKILLS_BACKGROUND_CAMERA;
  const backgroundClassName = isRouteTransitioning
    ? "opacity-95 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_62%,transparent_96%)]"
    : isProjectsRoute
      ? "opacity-30 sm:opacity-55 2xl:opacity-75 [mask-image:radial-gradient(ellipse_at_72%_50%,black_0%,black_58%,transparent_90%)]"
      : isExperienceRoute
        ? "opacity-30 sm:opacity-55 2xl:opacity-75 [mask-image:radial-gradient(ellipse_at_28%_50%,black_0%,black_58%,transparent_90%)]"
        : isCertificationsRoute
          ? "opacity-35 sm:opacity-65 2xl:opacity-80 [mask-image:radial-gradient(circle_at_center,black_0%,black_48%,transparent_86%)]"
          : isSkillsRoute
            ? "opacity-25 sm:opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_52%,transparent_90%)]"
            : "opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500 ease-out ${backgroundClassName}`}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 5.5, 18], fov: 43 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <PortfolioGraphScene
          activeStop={
            isProjectsRoute
              ? PROJECTS_STOP
              : isExperienceRoute
                ? experienceStop
                : isCertificationsRoute
                  ? CERTIFICATIONS_STOP
                  : isSkillsRoute
                    ? SKILLS_STOP
                    : OVERVIEW_STOP
          }
          onSelect={() => undefined}
          onExplore={() => undefined}
          isExplorer={false}
          reduceMotion={reduceMotion}
          onProjectNodePositions={
            isCurrentProjectsRoute ? reportProjectNodePositions : undefined
          }
          onExperienceNodePositions={
            isCurrentExperienceRoute ? reportExperienceNodePositions : undefined
          }
          onCertificationNodePositions={
            isCurrentCertificationsRoute ? reportCertificationNodePositions : undefined
          }
          backgroundCameraPose={
            isProjectsRoute
              ? projectsCamera
              : isExperienceRoute
                ? experienceCamera
                : isCertificationsRoute
                  ? certificationsCamera
                  : isSkillsRoute
                    ? skillsCamera
                    : OVERVIEW_BACKGROUND_CAMERA
          }
        />
      </Canvas>
    </div>
  );
}
