"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MOUSE,
  TOUCH,
  Vector3,
} from "three";
import type { Mesh } from "three";
import {
  GRAPH_NODE_COLORS,
  getPortfolioGraphNode,
  graphClusterLabels,
  graphFocusStops,
  portfolioGraphEdges,
  portfolioGraphNodes,
  type GraphFocusStop,
  type PortfolioGraphNode,
} from "@/data/portfolioGraph";

const HOME_CAMERA_POSITION = new Vector3(0, 0, 16.75);
const HOME_CAMERA_TARGET = new Vector3(0, 0.1, 0);
const OVERVIEW_STOP = graphFocusStops[0];
const PROJECT_NODES = portfolioGraphNodes.filter((node) => node.type === "project");

function SignalPacket({
  source,
  target,
  index,
  reduceMotion,
}: {
  source: PortfolioGraphNode;
  target: PortfolioGraphNode;
  index: number;
  reduceMotion: boolean;
}) {
  const packet = useRef<Mesh>(null);
  const [start, end] = useMemo(
    () => [new Vector3(...source.position), new Vector3(...target.position)],
    [source, target],
  );

  useFrame(({ clock }) => {
    if (!packet.current || reduceMotion) return;

    const progress =
      (Math.sin(clock.elapsedTime * (0.58 + (index % 3) * 0.08) + index * 1.5) +
        1) /
      2;
    packet.current.position.lerpVectors(start, end, progress);
  });

  return (
    <mesh ref={packet} position={start} scale={0.052}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={index % 5 === 0 ? "#ff5a1f" : "#2dd9c9"}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}

function GraphNode({
  node,
  activeStop,
  isSelected,
  isConnectedToSelection,
  onSelect,
  onExplore,
  reduceMotion,
}: {
  node: PortfolioGraphNode;
  activeStop: GraphFocusStop;
  isSelected: boolean;
  isConnectedToSelection: boolean;
  onSelect: (id: string) => void;
  onExplore: () => void;
  reduceMotion: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const position = useMemo(() => new Vector3(...node.position), [node.position]);
  const isInFocus = activeStop.nodeTypes.includes(node.type);

  useFrame((_, delta) => {
    if (!mesh.current) return;

    const targetOpacity =
      activeStop.id === "overview" || isInFocus || isSelected || isConnectedToSelection
        ? 1
        : 0.2;
    const material = mesh.current.material;

    if ("opacity" in material) {
      material.opacity = MathUtils.damp(
        material.opacity,
        targetOpacity,
        reduceMotion ? 100 : 5,
        delta,
      );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={(event) => {
          event.stopPropagation();
          onExplore();
          onSelect(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <icosahedronGeometry args={[0.12, 1]} />
        <meshBasicMaterial
          color={GRAPH_NODE_COLORS[node.type]}
          transparent
          opacity={activeStop.id === "overview" || isInFocus ? 1 : 0.2}
          depthWrite={false}
        />
      </mesh>
      {isSelected && (
        <mesh scale={1.72}>
          <icosahedronGeometry args={[0.12, 1]} />
          <meshBasicMaterial
            color={GRAPH_NODE_COLORS[node.type]}
            transparent
            opacity={0.72}
            wireframe
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function GraphClusterLabel({
  label,
  activeStop,
}: {
  label: (typeof graphClusterLabels)[number];
  activeStop: GraphFocusStop;
}) {
  const isFocused = activeStop.nodeTypes.includes(label.type);
  const opacity = activeStop.id === "overview" || isFocused ? 1 : 0.2;

  return (
    <Html position={label.position} center style={{ pointerEvents: "none" }}>
      <div
        className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity duration-500"
        style={{ color: GRAPH_NODE_COLORS[label.type], opacity }}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: GRAPH_NODE_COLORS[label.type] }}
        />
        {label.title}
      </div>
    </Html>
  );
}

function HomeCameraRig({
  isExplorer,
  reduceMotion,
}: {
  isExplorer: boolean;
  reduceMotion: boolean;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isExplorer) return;

    const smoothing = reduceMotion ? 1 : 1 - Math.exp(-4 * delta);
    camera.position.lerp(HOME_CAMERA_POSITION, smoothing);
    camera.lookAt(HOME_CAMERA_TARGET);
  });

  return null;
}

function PortfolioGraphScene({
  activeStop,
  selectedNodeId,
  onSelect,
  onExplore,
  isExplorer,
  reduceMotion,
}: {
  activeStop: GraphFocusStop;
  selectedNodeId: string;
  onSelect: (id: string) => void;
  onExplore: () => void;
  isExplorer: boolean;
  reduceMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const nodesById = useMemo(
    () => new Map(portfolioGraphNodes.map((node) => [node.id, node])),
    [],
  );
  const selectedConnections = useMemo(
    () =>
      new Set(
        portfolioGraphEdges
          .filter(
            ({ source, target }) =>
              source === selectedNodeId || target === selectedNodeId,
          )
          .flatMap(({ source, target }) => [source, target]),
      ),
    [selectedNodeId],
  );
  const edgeGeometry = useMemo(() => {
    const positions = portfolioGraphEdges.flatMap(({ source, target }) => {
      const sourceNode = nodesById.get(source);
      const targetNode = nodesById.get(target);
      return sourceNode && targetNode
        ? [...sourceNode.position, ...targetNode.position]
        : [];
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, [nodesById]);
  const activeEdgeGeometry = useMemo(() => {
    const positions = portfolioGraphEdges.flatMap(({ source, target }) => {
      const sourceNode = nodesById.get(source);
      const targetNode = nodesById.get(target);
      const touchesFocus =
        sourceNode &&
        targetNode &&
        (activeStop.nodeTypes.includes(sourceNode.type) ||
          activeStop.nodeTypes.includes(targetNode.type));

      return touchesFocus && sourceNode && targetNode
        ? [...sourceNode.position, ...targetNode.position]
        : [];
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, [activeStop, nodesById]);
  const signalEdges = useMemo(
    () =>
      portfolioGraphEdges
        .filter((_, index) => index % 7 === 0)
        .map(({ source, target }) => ({
          source: nodesById.get(source),
          target: nodesById.get(target),
        }))
        .filter(
          (edge): edge is { source: PortfolioGraphNode; target: PortfolioGraphNode } =>
            Boolean(edge.source && edge.target),
        ),
    [nodesById],
  );

  useEffect(
    () => () => {
      edgeGeometry.dispose();
      activeEdgeGeometry.dispose();
    },
    [activeEdgeGeometry, edgeGeometry],
  );

  useFrame(({ clock }, delta) => {
    if (!group.current || reduceMotion) return;

    const overviewDrift = isExplorer
      ? 0
      : activeStop.id === "overview"
        ? 0.022
        : 0.012;
    const verticalDrift = isExplorer ? 0 : 0.018;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      Math.sin(clock.elapsedTime * 0.12) * overviewDrift,
      1.8,
      delta,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      Math.sin(clock.elapsedTime * 0.09) * verticalDrift,
      1.8,
      delta,
    );
  });

  return (
    <>
      <HomeCameraRig isExplorer={isExplorer} reduceMotion={reduceMotion} />
      {isExplorer && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.07}
          enablePan
          enableRotate
          enableZoom={false}
          screenSpacePanning
          mouseButtons={{
            LEFT: MOUSE.ROTATE,
            MIDDLE: MOUSE.PAN,
            RIGHT: MOUSE.PAN,
          }}
          touches={{
            ONE: TOUCH.ROTATE,
            TWO: TOUCH.DOLLY_PAN,
          }}
          target={[0, 0.1, 0]}
        />
      )}
      <group ref={group}>
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial
            color="#354052"
            transparent
            opacity={activeStop.id === "overview" ? 0.48 : 0.3}
            depthWrite={false}
          />
        </lineSegments>
        <lineSegments geometry={activeEdgeGeometry}>
          <lineBasicMaterial
            color="#2dd9c9"
            transparent
            opacity={activeStop.id === "overview" ? 0.1 : 0.68}
            depthWrite={false}
          />
        </lineSegments>
        {portfolioGraphNodes.map((node) => (
          <GraphNode
            key={node.id}
            node={node}
            activeStop={activeStop}
            isSelected={node.id === selectedNodeId}
            isConnectedToSelection={selectedConnections.has(node.id)}
            onSelect={onSelect}
            onExplore={onExplore}
            reduceMotion={reduceMotion}
          />
        ))}
        {graphClusterLabels.map((label) => (
          <GraphClusterLabel
            key={label.id}
            label={label}
            activeStop={activeStop}
          />
        ))}
        {signalEdges.map(({ source, target }, index) => (
          <SignalPacket
            key={`${source.id}-${target.id}`}
            source={source}
            target={target}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </group>
    </>
  );
}

function GraphDetailPanel({ node }: { node: PortfolioGraphNode }) {
  return (
    <aside className="pointer-events-auto w-full max-w-sm rounded-xl border border-line/90 bg-surface/95 p-5 shadow-2xl shadow-void/40 backdrop-blur-md">
      <p
        className="font-mono text-[11px] uppercase tracking-wide"
        style={{ color: GRAPH_NODE_COLORS[node.type] }}
      >
        {node.eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
        {node.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {node.description}
      </p>
      {node.href && node.actionLabel && (
        <Link
          href={node.href}
          className="group mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-signal transition-colors hover:text-ink"
        >
          {node.actionLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      )}
    </aside>
  );
}

function GraphLegend({ activeStop }: { activeStop: GraphFocusStop }) {
  return (
    <div className="pointer-events-none hidden items-center gap-3 font-mono text-[10px] uppercase tracking-wide text-ink-muted lg:flex">
      <span className="h-px w-10 bg-line" />
      <span>{activeStop.label}</span>
    </div>
  );
}

export function GraphJourney() {
  const [isExplorer, setIsExplorer] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(
    OVERVIEW_STOP.featuredNodeId,
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const selectedNode =
    getPortfolioGraphNode(selectedNodeId) ??
    getPortfolioGraphNode(OVERVIEW_STOP.featuredNodeId)!;
  const activeStop =
    (isExplorer
      ? graphFocusStops.find(
          (stop) =>
            stop.id !== "overview" && stop.nodeTypes.includes(selectedNode.type),
        )
      : undefined) ?? OVERVIEW_STOP;
  const selectedProjectIndex = PROJECT_NODES.findIndex(
    (node) => node.id === selectedNode.id,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const selectAdjacentProject = (direction: -1 | 1) => {
    const currentIndex =
      selectedProjectIndex >= 0
        ? selectedProjectIndex
        : direction > 0
          ? -1
          : 0;
    const nextIndex =
      (currentIndex + direction + PROJECT_NODES.length) % PROJECT_NODES.length;

    setSelectedNodeId(PROJECT_NODES[nextIndex].id);
    setIsExplorer(true);
  };

  const showHeroCopy = !isExplorer;

  return (
    <section className="relative min-h-svh" aria-label="Portfolio graph">
      <div className="relative h-svh overflow-hidden">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 16.75], fov: 43 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          className="absolute inset-0"
          onPointerDown={() => {
            if (!isExplorer) setIsExplorer(true);
          }}
        >
          <PortfolioGraphScene
            activeStop={activeStop}
            selectedNodeId={selectedNode.id}
            onSelect={setSelectedNodeId}
            onExplore={() => setIsExplorer(true)}
            isExplorer={isExplorer}
            reduceMotion={reduceMotion}
          />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 mx-auto max-w-[96rem] px-6 lg:px-10">
          <div
            className={`absolute right-6 bottom-20 left-6 w-auto transition-all duration-700 ease-out sm:right-auto sm:w-[min(23rem,48vw)] lg:top-1/2 lg:bottom-auto lg:left-10 lg:w-[min(23rem,30vw)] lg:-translate-y-1/2 ${
              showHeroCopy
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <p className="font-mono text-xs uppercase tracking-wide text-signal">
              Software developer — Chiang Mai, Thailand
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.35rem,4.6vw,5.25rem)] font-semibold leading-[0.98] tracking-tight text-ink">
              I turn signals into systems.
            </h1>
            <p className="mt-6 hidden max-w-md text-base leading-relaxed text-ink-muted sm:block sm:text-lg">
              Explore the connected work behind my experience in applied AI,
              full-stack software, IoT, research, and network engineering.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-sm uppercase tracking-wide text-void transition-colors hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                View projects <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-void/70 px-5 py-3 font-mono text-sm uppercase tracking-wide text-ink backdrop-blur-sm transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                See the roadmap
              </Link>
            </div>
          </div>

          <div
            className={`absolute top-1/2 right-6 hidden w-36 -translate-y-1/2 transition-all duration-700 ease-out lg:right-10 lg:block lg:w-52 ${
              showHeroCopy
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-full border border-ink bg-surface shadow-2xl shadow-void/40">
              <Image
                src="/img/profile.png"
                alt="Portrait of Matt Cosh"
                fill
                priority
                sizes="(min-width: 1024px) 208px, 176px"
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Building systems that connect
            </p>
          </div>

          {!showHeroCopy && (
            <>
              <button
                type="button"
                onClick={() => {
                  setSelectedNodeId(OVERVIEW_STOP.featuredNodeId);
                  setIsExplorer(false);
                }}
                className="pointer-events-auto absolute top-6 left-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal lg:top-8 lg:left-10"
              >
                <span aria-hidden="true">←</span>
                Overview
              </button>
              <p className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-wide text-ink-muted lg:top-8 lg:right-10">
                Drag to orbit · right-drag to move
              </p>
              <div className="absolute right-6 bottom-20 left-6 flex flex-col items-start justify-between gap-5 sm:left-auto sm:w-[min(24rem,36vw)] lg:right-10">
                <GraphDetailPanel node={selectedNode} />
                <GraphLegend activeStop={activeStop} />
              </div>
              <button
                type="button"
                onClick={() => selectAdjacentProject(-1)}
                className="pointer-events-auto absolute bottom-6 left-6 inline-flex h-11 items-center gap-3 rounded-md border border-line bg-void/80 px-4 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:bottom-8 lg:left-10"
                aria-label="Previous project"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ←
                </span>
                <span className="hidden sm:inline">Previous project</span>
              </button>
              <p className="absolute bottom-9 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-wide text-ink-muted sm:block">
                Projects {Math.max(selectedProjectIndex, 0) + 1} / {PROJECT_NODES.length}
              </p>
              <button
                type="button"
                onClick={() => selectAdjacentProject(1)}
                className="pointer-events-auto absolute right-6 bottom-6 inline-flex h-11 items-center gap-3 rounded-md border border-line bg-void/80 px-4 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:right-10 lg:bottom-8"
                aria-label="Next project"
              >
                <span className="hidden sm:inline">Next project</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </button>
            </>
          )}

          <p
            className={`absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-wide text-ink-muted transition-opacity duration-500 lg:left-10 ${
              showHeroCopy ? "opacity-100" : "opacity-0"
            }`}
          >
            Click the graph to explore →
          </p>
        </div>
      </div>
    </section>
  );
}
