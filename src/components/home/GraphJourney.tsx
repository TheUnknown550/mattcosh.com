"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { GraphOverlay } from "./graph/GraphOverlay";
import { PortfolioGraphScene } from "./graph/PortfolioGraphScene";
import { useGraphScrollFocus } from "./graph/useGraphScrollFocus";
import { useGraphExplorer } from "./graph/useGraphExplorer";

export function GraphJourney() {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
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
  const sceneActiveStop = isExplorer ? activeStop : scrollFocus.activeStop;
  const highlightsProgress = isExplorer
    ? 0
    : (scrollFocus.sectionProgressByKey.highlights ?? 0);

  return (
    <section
      data-home-snap
      className={
        isExplorer
          ? "fixed inset-0 z-50 h-svh bg-void"
          : "relative min-h-[calc(100svh-77px)]"
      }
      aria-label="Portfolio graph"
    >
      <div
        className={
          isExplorer
            ? "relative h-svh overflow-hidden"
            : "relative h-[calc(100svh-77px)]"
        }
      >
        <div
          className={
            isExplorer
              ? "absolute inset-0 z-0 overflow-hidden"
              : "fixed inset-x-0 top-[77px] bottom-0 z-0 overflow-hidden"
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
            dpr={[1, 1.5]}
            camera={{ position: [8, 5.5, 18], fov: 43 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
            className="absolute inset-0"
            onPointerDown={(event) => {
              pointerStart.current = {
                x: event.nativeEvent.clientX,
                y: event.nativeEvent.clientY,
              };
            }}
            onPointerUp={(event) => {
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
              selectedNodeId={isNodeFocused ? selectedNode.id : undefined}
              selectedNode={isNodeFocused ? selectedNode : undefined}
              onSelect={focusNode}
              onExplore={enterExplorer}
              isExplorer={isExplorer}
              reduceMotion={reduceMotion}
              scrollFocusFromNodeId={
                isExplorer ? undefined : scrollFocus.fromNodeId
              }
              scrollFocusToNodeId={
                isExplorer ? undefined : scrollFocus.toNodeId
              }
              scrollFocusProgress={isExplorer ? 0 : scrollFocus.progress}
              overviewProgress={highlightsProgress}
            />
          </Canvas>
        </div>
        <GraphOverlay
          activeStop={activeStop}
          isExplorer={isExplorer}
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
    </section>
  );
}
