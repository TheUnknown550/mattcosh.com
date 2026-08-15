"use client";

import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  graphFocusStops,
  type PortfolioGraphNode,
} from "@/data/portfolioGraph";
import {
  getGraphRouteForPath,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";
import { GraphOverlay } from "./graph/GraphOverlay";
import { GraphNodeModal } from "./graph/GraphNodeModal";
import { PortfolioGraphScene } from "./graph/PortfolioGraphScene";
import { useGraphScrollFocus } from "./graph/useGraphScrollFocus";
import { useGraphExplorer } from "./graph/useGraphExplorer";

export function GraphJourney() {
  const pathname = usePathname();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [modalNode, setModalNode] = useState<PortfolioGraphNode | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const { transition } = useRouteTransition();
  const isLandingPage = pathname === "/";
  const {
    activeStop,
    clearFocus,
    enterExplorer,
    exitExplorer,
    isExplorer,
    isNodeFocused,
    navigationLabel,
    navigationNodes,
    reduceMotion,
    selectedNavigationIndex,
    selectedNode,
    selectAdjacentNode,
    focusNode,
  } = useGraphExplorer();
  const scrollFocus = useGraphScrollFocus();
  const staticGraph = isMobileViewport || reduceMotion;
  const isHomeArrival =
    transition?.phase === "entering" && transition.destinationPath === "/";
  const isReturningHome = transition?.destinationPath === "/";
  const transitionStop =
    transition?.phase === "leaving"
      ? graphFocusStops.find(
          (stop) => stop.id === getGraphRouteForPath(transition.destinationPath),
        )
      : isHomeArrival
        ? graphFocusStops.find((stop) => stop.id === "overview")
        : undefined;
  const explorerIsActive = isLandingPage && isExplorer && !isMobileViewport;
  const overviewStop = graphFocusStops.find((stop) => stop.id === "overview")!;
  const sceneActiveStop =
    transitionStop ??
    (isLandingPage
      ? explorerIsActive
        ? activeStop
        : scrollFocus.activeStop
      : overviewStop);
  const isRouteTraveling = transition?.phase === "leaving";
  const highlightsProgress = isExplorer
    ? 0
    : (scrollFocus.sectionProgressByKey.highlights ?? 0);
  const isHighlightsOverview = !isExplorer && highlightsProgress > 0.45;
  const closeModal = useCallback(() => setModalNode(null), []);
  const openNodeModal = useCallback(
    (node: PortfolioGraphNode) => setModalNode(node),
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isLandingPage || !isExplorer) return;

    const resetExplorer = window.setTimeout(exitExplorer, 0);
    return () => window.clearTimeout(resetExplorer);
  }, [exitExplorer, isExplorer, isLandingPage]);

  const isHomeGraphVisible = isLandingPage && !isReturningHome;

  return (
    <section
      data-home-snap
      data-graph-explorer={explorerIsActive ? "true" : undefined}
      data-graph-motion={staticGraph ? "static" : "animated"}
      className={
        explorerIsActive
          ? "fixed inset-0 z-50 h-svh bg-void"
          : isLandingPage
            ? "relative min-h-[calc(100svh-77px)]"
            : "pointer-events-none fixed inset-0 z-0 h-svh overflow-hidden opacity-0"
      }
      aria-hidden={!isLandingPage || undefined}
      aria-label={isLandingPage ? "Portfolio graph" : undefined}
    >
      <div
        className={
          explorerIsActive
            ? "relative h-svh overflow-hidden"
            : isLandingPage
              ? "relative h-[calc(100svh-77px)]"
              : "relative h-svh"
        }
      >
        <div
          className={
            explorerIsActive
              ? "absolute inset-0 z-0 overflow-hidden"
              : `fixed inset-x-0 top-[77px] bottom-0 z-0 overflow-hidden transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                  isHomeGraphVisible ? "opacity-100" : "opacity-0"
                }`
          }
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(110, 136, 151, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 136, 151, 0.14) 1px, transparent 1px)",
              backgroundPosition: "center center",
              backgroundSize: "10rem 10rem",
              maskImage:
                "radial-gradient(ellipse at center, black 15%, transparent 75%)",
            }}
          />
          <Canvas
            frameloop={staticGraph ? "demand" : "always"}
            dpr={isMobileViewport ? 1 : [1, 1.5]}
            camera={{ position: [8, 5.5, 18], fov: 43 }}
            gl={{
              alpha: true,
              antialias: !isMobileViewport,
              powerPreference: "high-performance",
            }}
            className="absolute inset-0"
            onPointerDown={isMobileViewport ? undefined : (event) => {
              pointerStart.current = {
                x: event.nativeEvent.clientX,
                y: event.nativeEvent.clientY,
              };
            }}
            onPointerUp={isMobileViewport ? undefined : (event) => {
              const start = pointerStart.current;
              pointerStart.current = null;
              if (!start) return;

              const deltaX = event.nativeEvent.clientX - start.x;
              const deltaY = event.nativeEvent.clientY - start.y;
              if (deltaX * deltaX + deltaY * deltaY > 64) return;

              if (isExplorer) {
                clearFocus();
              } else {
                enterExplorer();
              }
            }}
          >
            <PortfolioGraphScene
              activeStop={sceneActiveStop}
              selectedNodeId={explorerIsActive && isNodeFocused ? selectedNode.id : undefined}
              selectedNode={explorerIsActive && isNodeFocused ? selectedNode : undefined}
              onSelect={focusNode}
              onExplore={enterExplorer}
              isExplorer={explorerIsActive}
              reduceMotion={reduceMotion}
              scrollFocusFromNodeId={
                explorerIsActive || !isLandingPage ? undefined : scrollFocus.fromNodeId
              }
              scrollFocusToNodeId={
                explorerIsActive || !isLandingPage ? undefined : scrollFocus.toNodeId
              }
              scrollFocusProgress={explorerIsActive || !isLandingPage ? 0 : scrollFocus.progress}
              overviewProgress={highlightsProgress}
              backgroundCameraPose={
                transitionStop
                  ? {
                      position: transitionStop.cameraPosition,
                      target: transitionStop.cameraTarget,
                    }
                  : !isLandingPage
                    ? {
                        position: overviewStop.cameraPosition,
                        target: overviewStop.cameraTarget,
                      }
                    : undefined
              }
              onOpenModal={
                isLandingPage && isHighlightsOverview ? openNodeModal : undefined
              }
              staticMode={staticGraph}
            />
          </Canvas>
        </div>
        {isLandingPage && (
          <div
            className={`transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isRouteTraveling ? "opacity-0" : "opacity-100"
            }`}
          >
            <GraphOverlay
              activeStop={activeStop}
              isExplorer={explorerIsActive}
              isNodeFocused={isNodeFocused}
              navigationLabel={navigationLabel}
              navigationLength={navigationNodes.length}
              navigationPosition={Math.max(selectedNavigationIndex, 0) + 1}
              node={selectedNode}
              onExit={exitExplorer}
              onEnter={enterExplorer}
              onPrevious={() => selectAdjacentNode(-1)}
              onNext={() => selectAdjacentNode(1)}
            />
          </div>
        )}
        {isLandingPage && isHighlightsOverview && modalNode && (
          <GraphNodeModal node={modalNode} onClose={closeModal} />
        )}
      </div>
    </section>
  );
}
