"use client";

import { Canvas } from "@react-three/fiber";
import { GraphOverlay } from "./graph/GraphOverlay";
import { PortfolioGraphScene } from "./graph/PortfolioGraphScene";
import { useGraphExplorer } from "./graph/useGraphExplorer";

export function GraphJourney() {
  const {
    activeStop,
    enterExplorer,
    exitExplorer,
    isExplorer,
    navigationLabel,
    navigationNodes,
    reduceMotion,
    selectedNavigationIndex,
    selectedNode,
    selectAdjacentNode,
    setSelectedNodeId,
  } = useGraphExplorer();

  return (
    <section className="relative min-h-svh" aria-label="Portfolio graph">
      <div className="relative h-svh overflow-hidden">
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
          onPointerDown={enterExplorer}
        >
          <PortfolioGraphScene
            activeStop={activeStop}
            selectedNodeId={selectedNode.id}
            selectedNode={selectedNode}
            onSelect={setSelectedNodeId}
            onExplore={enterExplorer}
            isExplorer={isExplorer}
            reduceMotion={reduceMotion}
          />
        </Canvas>
        <GraphOverlay
          activeStop={activeStop}
          isExplorer={isExplorer}
          navigationLabel={navigationLabel}
          navigationLength={navigationNodes.length}
          navigationPosition={Math.max(selectedNavigationIndex, 0) + 1}
          node={selectedNode}
          onExit={exitExplorer}
          onPrevious={() => selectAdjacentNode(-1)}
          onNext={() => selectAdjacentNode(1)}
        />
      </div>
    </section>
  );
}
