"use client";

import { Billboard, Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MOUSE,
  TOUCH,
  Vector3,
} from "three";
import type { Mesh, PointsMaterial } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  GRAPH_NODE_COLORS,
  graphClusterLabels,
  portfolioGraphEdges,
  portfolioGraphNodes,
  type GraphPosition,
  type GraphFocusStop,
  type PortfolioGraphNode,
  type PortfolioGraphNodeType,
} from "@/data/portfolioGraph";
import {
  CORE_POSITION,
  DENSE_CLUSTER_TYPES,
  HOME_CAMERA_DIRECTION,
  HOME_CAMERA_TARGET,
} from "./constants";
import type { ProjectGraphScreenPosition } from "./projectNodeProjection";

const OVERVIEW_2D_VERTICAL_OFFSET = -1.25;

const OVERVIEW_2D_CLUSTER_CENTERS: Record<
  Exclude<PortfolioGraphNodeType, "core">,
  GraphPosition
> = {
  project: [-21.5, OVERVIEW_2D_VERTICAL_OFFSET, 0],
  award: [-12.9, OVERVIEW_2D_VERTICAL_OFFSET, 0],
  experience: [-4.3, OVERVIEW_2D_VERTICAL_OFFSET, 0],
  certification: [4.3, OVERVIEW_2D_VERTICAL_OFFSET, 0],
  education: [12.9, OVERVIEW_2D_VERTICAL_OFFSET, 0],
  skill: [21.5, OVERVIEW_2D_VERTICAL_OFFSET, 0],
};

const COMPACT_OVERVIEW_2D_CLUSTER_CENTERS: Record<
  Exclude<PortfolioGraphNodeType, "core">,
  GraphPosition
> = {
  project: [-5.5, 2.5, 0],
  award: [5.5, 2.5, 0],
  experience: [-5.5, -1.5, 0],
  certification: [5.5, -1.5, 0],
  education: [-5.5, -5.5, 0],
  skill: [5.5, -5.5, 0],
};

type TooltipPlacement = {
  horizontal: "left" | "center" | "right";
  vertical: "above" | "below";
};

function getOverview2DNodes(compact = false) {
  const clusterCenters = compact
    ? COMPACT_OVERVIEW_2D_CLUSTER_CENTERS
    : OVERVIEW_2D_CLUSTER_CENTERS;
  const rowSpacing = compact ? 1.1 : 1.85;
  const corePosition: GraphPosition = compact
    ? [0, -9, 0]
    : [0, -6.4 + OVERVIEW_2D_VERTICAL_OFFSET, 0];
  const nodesByType = new Map<PortfolioGraphNodeType, PortfolioGraphNode[]>();

  portfolioGraphNodes.forEach((node) => {
    const typeNodes = nodesByType.get(node.type) ?? [];
    typeNodes.push(node);
    nodesByType.set(node.type, typeNodes);
  });

  return portfolioGraphNodes.map((node) => {
    if (node.type === "core") {
      return { ...node, position: corePosition };
    }

    const typeNodes = nodesByType.get(node.type) ?? [];
    const nodeIndex = typeNodes.findIndex((typeNode) => typeNode.id === node.id);
    const columns = Math.min(3, typeNodes.length);
    const rows = Math.ceil(typeNodes.length / columns);
    const column = nodeIndex % columns;
    const row = Math.floor(nodeIndex / columns);
    const center = clusterCenters[node.type];

    return {
      ...node,
      position: [
        center[0] + (column - (columns - 1) / 2) * 1.05,
        center[1] + ((rows - 1) / 2 - row) * rowSpacing,
        center[2],
      ] as GraphPosition,
    };
  });
}

function getOverview2DLabels(compact = false) {
  const clusterCenters = compact
    ? COMPACT_OVERVIEW_2D_CLUSTER_CENTERS
    : OVERVIEW_2D_CLUSTER_CENTERS;
  const labelOffset = compact ? 2.1 : 4.8;
  return graphClusterLabels.map((label) => {
    const center = clusterCenters[label.type];
    return {
      ...label,
      position: [center[0], center[1] + labelOffset, center[2]] as GraphPosition,
    };
  });
}

function updateLineGeometry(
  geometry: BufferGeometry,
  edges: Array<{ source: string; target: string }>,
  baseNodesById: Map<string, PortfolioGraphNode>,
  overviewNodesById: Map<string, PortfolioGraphNode>,
  progress: number,
) {
  const position = geometry.getAttribute("position");
  if (!position) return;

  edges.forEach(({ source, target }, edgeIndex) => {
    const sourceNode = baseNodesById.get(source);
    const targetNode = baseNodesById.get(target);
    const overviewSource = overviewNodesById.get(source);
    const overviewTarget = overviewNodesById.get(target);
    if (!sourceNode || !targetNode || !overviewSource || !overviewTarget) return;

    const vertexIndex = edgeIndex * 2;
    position.setXYZ(
      vertexIndex,
      MathUtils.lerp(sourceNode.position[0], overviewSource.position[0], progress),
      MathUtils.lerp(sourceNode.position[1], overviewSource.position[1], progress),
      MathUtils.lerp(sourceNode.position[2], overviewSource.position[2], progress),
    );
    position.setXYZ(
      vertexIndex + 1,
      MathUtils.lerp(targetNode.position[0], overviewTarget.position[0], progress),
      MathUtils.lerp(targetNode.position[1], overviewTarget.position[1], progress),
      MathUtils.lerp(targetNode.position[2], overviewTarget.position[2], progress),
    );
  });

  position.needsUpdate = true;
}

function createLineGeometry(
  edges: Array<{ source: string; target: string }>,
  nodesById: Map<string, PortfolioGraphNode>,
) {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      edges.flatMap(({ source, target }) => {
        const sourceNode = nodesById.get(source);
        const targetNode = nodesById.get(target);
        return sourceNode && targetNode
          ? [...sourceNode.position, ...targetNode.position]
          : [];
      }),
      3,
    ),
  );
  return geometry;
}

function SignalPacket({
  source,
  target,
  overviewSource,
  overviewTarget,
  index,
  reduceMotion,
  layoutProgress,
}: {
  source: PortfolioGraphNode;
  target: PortfolioGraphNode;
  overviewSource: PortfolioGraphNode;
  overviewTarget: PortfolioGraphNode;
  index: number;
  reduceMotion: boolean;
  layoutProgress: RefObject<number>;
}) {
  const packet = useRef<Mesh>(null);
  const [start, end, overviewStart, overviewEnd] = useMemo(
    () => [
      new Vector3(...source.position),
      new Vector3(...target.position),
      new Vector3(...overviewSource.position),
      new Vector3(...overviewTarget.position),
    ],
    [overviewSource, overviewTarget, source, target],
  );
  const currentStart = useMemo(() => new Vector3(), []);
  const currentEnd = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    if (!packet.current) return;
    const layout = layoutProgress.current;
    currentStart.lerpVectors(start, overviewStart, layout);
    currentEnd.lerpVectors(end, overviewEnd, layout);
    if (reduceMotion) {
      packet.current.position.copy(currentStart);
      return;
    }
    const signalProgress =
      (Math.sin(clock.elapsedTime * (0.58 + (index % 3) * 0.08) + index * 1.5) +
        1) /
      2;
    packet.current.position.lerpVectors(currentStart, currentEnd, signalProgress);
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
  overviewNode,
  activeStop,
  isSelected,
  isConnectedToSelection,
  onSelect,
  onExplore,
  onOpenModal,
  reduceMotion,
  isScrollFocused,
  scrollFocusProgress,
  layoutProgress,
}: {
  node: PortfolioGraphNode;
  overviewNode: PortfolioGraphNode;
  activeStop: GraphFocusStop;
  isSelected: boolean;
  isConnectedToSelection: boolean;
  onSelect: (id: string) => void;
  onExplore: () => void;
  onOpenModal?: (node: PortfolioGraphNode) => void;
  reduceMotion: boolean;
  isScrollFocused: boolean;
  scrollFocusProgress: number;
  layoutProgress: RefObject<number>;
}) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const pulseRing = useRef<Mesh>(null);
  const focusOuterRing = useRef<Mesh>(null);
  const focusInnerRing = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<TooltipPlacement>({
    horizontal: "center",
    vertical: "above",
  });
  const position = useMemo(
    () => new Vector3(...node.position),
    [node.position],
  );
  const overviewPosition = useMemo(
    () => new Vector3(...overviewNode.position),
    [overviewNode.position],
  );
  const updateTooltipPlacement = (clientX: number, clientY: number) => {
    const horizontal =
      clientX < 260 ? "right" : clientX > window.innerWidth - 260 ? "left" : "center";
    const vertical = clientY < 210 ? "below" : "above";

    setTooltipPlacement((current) =>
      current.horizontal === horizontal && current.vertical === vertical
        ? current
        : { horizontal, vertical },
    );
  };
  const tooltipHorizontalClass =
    tooltipPlacement.horizontal === "left"
      ? "-translate-x-[55%]"
      : tooltipPlacement.horizontal === "right"
        ? "translate-x-[55%]"
        : "translate-x-0";
  const tooltipVerticalClass =
    tooltipPlacement.vertical === "below"
      ? "translate-y-[60%]"
      : "-translate-y-[60%]";
  const isInFocus = activeStop.nodeTypes.includes(node.type);
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (onOpenModal) {
      onOpenModal(node);
      return;
    }
    onExplore();
    onSelect(node.id);
  };
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    updateTooltipPlacement(
      event.nativeEvent.clientX,
      event.nativeEvent.clientY,
    );
    setIsHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    updateTooltipPlacement(
      event.nativeEvent.clientX,
      event.nativeEvent.clientY,
    );
  };
  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = "";
  };
  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.position.lerpVectors(
        position,
        overviewPosition,
        layoutProgress.current,
      );
    }
    if (!mesh.current) return;
    const targetOpacity =
      activeStop.id === "overview" ||
      isInFocus ||
      isSelected ||
      isConnectedToSelection
        ? 1
        : 0.2;
    const material = mesh.current.material;
    if ("opacity" in material)
      material.opacity = MathUtils.damp(
        material.opacity,
        targetOpacity,
        reduceMotion ? 100 : 5,
        delta,
      );

    const overviewScale = 1 + layoutProgress.current * 0.7;
    const focusScale =
      node.type === "core" && isScrollFocused
        ? 1 + scrollFocusProgress * 1.45
        : 1;
    const hoverScale = isHovered ? 1.18 : 1;
    const targetScale = focusScale * overviewScale * hoverScale;
    const scaleSmoothing = reduceMotion ? 100 : 5.5;
    const nextScale = MathUtils.damp(
      mesh.current.scale.x,
      targetScale,
      scaleSmoothing,
      delta,
    );
    mesh.current.scale.setScalar(nextScale);

    if (focusOuterRing.current && focusInnerRing.current) {
      const targetRingOpacity = isScrollFocused ? scrollFocusProgress : 0;
      const targetRingScale = 0.82 + scrollFocusProgress * 0.18;
      const ringSmoothing = reduceMotion ? 100 : 7;

      for (const ring of [focusOuterRing.current, focusInnerRing.current]) {
        ring.scale.setScalar(
          MathUtils.damp(ring.scale.x, targetRingScale, ringSmoothing, delta),
        );
        const ringMaterial = ring.material;
        if ("opacity" in ringMaterial) {
          ringMaterial.opacity = MathUtils.damp(
            ringMaterial.opacity,
            targetRingOpacity,
            ringSmoothing,
            delta,
          );
        }
      }
    }

    if (pulseRing.current) {
      const phase = reduceMotion
        ? 0.2
        : (clock.elapsedTime * 0.48) % 1;
      pulseRing.current.scale.setScalar(1 + phase * 2.2);
      const pulseMaterial = pulseRing.current.material;
      if ("opacity" in pulseMaterial)
        pulseMaterial.opacity =
          (isScrollFocused ? scrollFocusProgress : 0) * (1 - phase) * 0.72;
    }
  });
  return (
    <group ref={group} position={position}>
      {/*
       * Keep the visual node small, but give it a forgiving raycast target.
       * This is especially important in the wide stats overview, where the
       * individual graph nodes are deliberately spaced across the viewport.
       * It stays visible to the raycaster even though its material is fully
       * transparent.
       */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh
        ref={mesh}
      >
        <icosahedronGeometry args={[0.14, 1]} />
        <meshBasicMaterial
          color={GRAPH_NODE_COLORS[node.type]}
          transparent
          opacity={activeStop.id === "overview" || isInFocus ? 1 : 0.2}
          depthWrite={false}
        />
      </mesh>
      <Html
        position={[0, 0, 0]}
        center
        zIndexRange={[40, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          role="tooltip"
          aria-hidden={!isHovered}
          className={`w-56 rounded-md border border-line bg-surface/95 p-3 text-left shadow-[0_18px_45px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out ${tooltipHorizontalClass} ${tooltipVerticalClass} ${
            isHovered
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-1 scale-95 opacity-0"
          }`}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">
            {node.eyebrow}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-ink">
            {node.title}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
            {node.description}
          </p>
        </div>
      </Html>
      {node.type === "core" && (
        <Billboard>
          <mesh ref={focusOuterRing}>
            <torusGeometry args={[0.48, 0.012, 8, 64]} />
            <meshBasicMaterial
              color="#2dd9c9"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={focusInnerRing}>
            <torusGeometry args={[0.3, 0.01, 8, 64]} />
            <meshBasicMaterial
              color="#ff5a1f"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      )}
      {node.type === "core" && isScrollFocused && (
        <mesh
          ref={pulseRing}
          renderOrder={-1}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.4}
        >
          <torusGeometry args={[0.23, 0.018, 8, 48]} />
          <meshBasicMaterial
            color="#2dd9c9"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}
      {isSelected && (
        <mesh scale={1.72}>
          <icosahedronGeometry args={[0.14, 1]} />
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
  overviewLabel,
  activeStop,
  layoutProgress,
}: {
  label: (typeof graphClusterLabels)[number];
  overviewLabel: (typeof graphClusterLabels)[number];
  activeStop: GraphFocusStop;
  layoutProgress: RefObject<number>;
}) {
  const group = useRef<Group>(null);
  const position = useMemo(() => new Vector3(...label.position), [label.position]);
  const overviewPosition = useMemo(
    () => new Vector3(...overviewLabel.position),
    [overviewLabel.position],
  );
  const isFocused = activeStop.nodeTypes.includes(label.type);
  const opacity = activeStop.id === "overview" || isFocused ? 1 : 0.2;
  useFrame(() => {
    group.current?.position.lerpVectors(
      position,
      overviewPosition,
      layoutProgress.current,
    );
  });
  return (
    <group ref={group} position={position}>
      <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
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
    </group>
  );
}

function buildClusterPositions(nodes: PortfolioGraphNode[]) {
  const pointPositions: number[] = [];
  const linePositions: number[] = [];
  nodes.forEach((node, nodeIndex) => {
    const satellites: Vector3[] = [];
    const [x, y, z] = node.position;
    for (let satelliteIndex = 0; satelliteIndex < 5; satelliteIndex += 1) {
      const angle =
        (satelliteIndex / 5) * Math.PI * 2 + nodeIndex * 0.73 + 0.35;
      const radius = 0.14 + ((nodeIndex + satelliteIndex) % 4) * 0.055;
      const satellite = new Vector3(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
        z + Math.sin(angle * 1.7 + nodeIndex) * (0.16 + radius * 0.8),
      );
      satellites.push(satellite);
      pointPositions.push(satellite.x, satellite.y, satellite.z);
      linePositions.push(x, y, z, satellite.x, satellite.y, satellite.z);
      if (satelliteIndex > 0) {
        const previous = satellites[satelliteIndex - 1];
        linePositions.push(
          previous.x,
          previous.y,
          previous.z,
          satellite.x,
          satellite.y,
          satellite.z,
        );
      }
    }
    const first = satellites[0];
    const last = satellites[satellites.length - 1];
    linePositions.push(last.x, last.y, last.z, first.x, first.y, first.z);
  });
  return { pointPositions, linePositions };
}

function ClusterDensity({
  type,
  activeStop,
  baseNodes,
  overviewNodes,
  layoutProgress,
}: {
  type: PortfolioGraphNodeType;
  activeStop: GraphFocusStop;
  baseNodes: PortfolioGraphNode[];
  overviewNodes: PortfolioGraphNode[];
  layoutProgress: RefObject<number>;
}) {
  const pointMaterial = useRef<PointsMaterial>(null);
  const clusterPositions = useMemo(() => {
    const baseClusterNodes = baseNodes.filter((node) => node.type === type);
    const overviewById = new Map(overviewNodes.map((node) => [node.id, node]));
    const overviewClusterNodes = baseClusterNodes.map(
      (node) => overviewById.get(node.id) ?? node,
    );
    return {
      base: buildClusterPositions(baseClusterNodes),
      overview: buildClusterPositions(overviewClusterNodes),
    };
  }, [baseNodes, overviewNodes, type]);
  const { pointGeometry, lineGeometry } = useMemo(() => {
    const nextPointGeometry = new BufferGeometry();
    nextPointGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(clusterPositions.base.pointPositions, 3),
    );
    const nextLineGeometry = new BufferGeometry();
    nextLineGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(clusterPositions.base.linePositions, 3),
    );
    return { pointGeometry: nextPointGeometry, lineGeometry: nextLineGeometry };
  }, [clusterPositions]);
  useFrame(() => {
    const progress = layoutProgress.current;
    if (pointMaterial.current) {
      pointMaterial.current.size = MathUtils.lerp(0.055, 0.1, progress);
    }
    const pointPosition = pointGeometry.getAttribute("position");
    const linePosition = lineGeometry.getAttribute("position");
    if (pointPosition) {
      clusterPositions.base.pointPositions.forEach((value, index) => {
        pointPosition.array[index] = MathUtils.lerp(
          value,
          clusterPositions.overview.pointPositions[index],
          progress,
        );
      });
      pointPosition.needsUpdate = true;
    }
    if (linePosition) {
      clusterPositions.base.linePositions.forEach((value, index) => {
        linePosition.array[index] = MathUtils.lerp(
          value,
          clusterPositions.overview.linePositions[index],
          progress,
        );
      });
      linePosition.needsUpdate = true;
    }
  });
  const isFocused =
    activeStop.id === "overview" || activeStop.nodeTypes.includes(type);
  useEffect(
    () => () => {
      pointGeometry.dispose();
      lineGeometry.dispose();
    },
    [lineGeometry, pointGeometry],
  );
  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color={GRAPH_NODE_COLORS[type]}
          transparent
          opacity={isFocused ? 0.28 : 0.045}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={pointGeometry}>
        <pointsMaterial
          ref={pointMaterial}
          color={GRAPH_NODE_COLORS[type]}
          size={0.055}
          sizeAttenuation
          transparent
          opacity={isFocused ? 0.76 : 0.12}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function HomeCameraRig({
  isExplorer,
  reduceMotion,
  controls,
  hasScrollFocus,
  overviewProgress,
}: {
  isExplorer: boolean;
  reduceMotion: boolean;
  controls: RefObject<OrbitControlsImpl | null>;
  hasScrollFocus: boolean;
  overviewProgress: number;
}) {
  const { camera, size } = useThree();
  const hasLandingInteraction = useRef(false);
  const homeCameraPosition = useMemo(
    () =>
      HOME_CAMERA_DIRECTION.clone().setLength(
        size.width / size.height < 0.9 ? 36 : 22,
      ),
    [size.height, size.width],
  );
  const overviewCameraPosition = useMemo(
    () => new Vector3(0, 0, size.width / size.height < 0.9 ? 46 : 31),
    [size.height, size.width],
  );
  const homeCameraTarget = useMemo(() => new Vector3(...HOME_CAMERA_TARGET), []);
  const overviewCameraTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const currentCameraPosition = useMemo(() => new Vector3(), []);
  const currentCameraTarget = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (isExplorer) {
      hasLandingInteraction.current = false;
      return;
    }

    const orbitControls = controls.current;
    if (!orbitControls) return;
    const pauseHomeCamera = () => {
      hasLandingInteraction.current = true;
    };

    orbitControls.addEventListener("start", pauseHomeCamera);
    return () => orbitControls.removeEventListener("start", pauseHomeCamera);
  }, [controls, isExplorer]);

  useFrame((_, delta) => {
    if (!isExplorer && !hasLandingInteraction.current && !hasScrollFocus) {
      const layout = MathUtils.clamp(overviewProgress, 0, 1);
      currentCameraPosition.lerpVectors(
        homeCameraPosition,
        overviewCameraPosition,
        layout,
      );
      currentCameraTarget.lerpVectors(
        homeCameraTarget,
        overviewCameraTarget,
        layout,
      );
      const smoothing = reduceMotion ? 1 : 1 - Math.exp(-4 * delta);
      camera.position.lerp(currentCameraPosition, smoothing);
      camera.lookAt(currentCameraTarget);
    }
  });
  return null;
}

function getScrollFocusPose(
  node: PortfolioGraphNode,
  fallbackDirection: Vector3,
) {
  const target = new Vector3(...node.position);
  const orbitDirection =
    node.type === "core"
      ? fallbackDirection.clone().normalize()
      : target.clone().sub(CORE_POSITION).normalize();

  if (node.type !== "core") {
    orbitDirection.y += 0.12;
    orbitDirection.normalize();
  }

  const focusDistance =
    node.type === "core" ? 5.8 : node.type === "skill" ? 6.5 : 5.4;
  const position = target
    .clone()
    .addScaledVector(orbitDirection, focusDistance);

  return { position, target };
}

function ScrollFocusRig({
  controls,
  fromNode,
  toNode,
  progress,
  isExplorer,
  reduceMotion,
  overviewProgress,
}: {
  controls: RefObject<OrbitControlsImpl | null>;
  fromNode?: PortfolioGraphNode;
  toNode?: PortfolioGraphNode;
  progress: number;
  isExplorer: boolean;
  reduceMotion: boolean;
  overviewProgress: number;
}) {
  const { camera, size } = useThree();
  const defaultHomePosition = useMemo(
    () =>
      HOME_CAMERA_DIRECTION.clone().setLength(
        size.width / size.height < 0.9 ? 36 : 22,
      ),
    [size.height, size.width],
  );
  const overviewHomePosition = useMemo(
    () => new Vector3(0, 0, size.width / size.height < 0.9 ? 46 : 31),
    [size.height, size.width],
  );
  const homePosition = useMemo(() => new Vector3(), []);
  const defaultHomeTarget = useMemo(() => new Vector3(...HOME_CAMERA_TARGET), []);
  const overviewHomeTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const homeTarget = useMemo(() => new Vector3(), []);
  const fallbackDirection = useMemo(
    () => HOME_CAMERA_DIRECTION.clone().normalize(),
    [],
  );

  useFrame((_, delta) => {
    const orbitControls = controls.current;
    if (isExplorer || !orbitControls) return;

    const layout = MathUtils.clamp(overviewProgress, 0, 1);
    homePosition.lerpVectors(defaultHomePosition, overviewHomePosition, layout);
    homeTarget.lerpVectors(defaultHomeTarget, overviewHomeTarget, layout);

    const fromPose = fromNode
      ? getScrollFocusPose(fromNode, fallbackDirection)
      : { position: homePosition, target: homeTarget };
    const toPose = toNode
      ? getScrollFocusPose(toNode, fallbackDirection)
      : { position: homePosition, target: homeTarget };
    const target = fromPose.target.clone().lerp(toPose.target, progress);
    const position = fromPose.position.clone().lerp(toPose.position, progress);
    const smoothing = reduceMotion ? 1 : 1 - Math.exp(-5 * delta);

    orbitControls.target.lerp(target, smoothing);
    camera.position.lerp(position, smoothing);
    orbitControls.update();
  });

  return null;
}

function NodeFocusRig({
  node,
  isExplorer,
  reduceMotion,
  controls,
}: {
  node: PortfolioGraphNode;
  isExplorer: boolean;
  reduceMotion: boolean;
  controls: RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const lastNodeId = useRef("");
  const target = useRef(new Vector3(...node.position));
  const cameraTarget = useRef(new Vector3());
  const isFocusing = useRef(false);
  useEffect(() => {
    const orbitControls = controls.current;
    if (!isExplorer || !orbitControls) return;
    const releaseCamera = () => {
      isFocusing.current = false;
    };
    orbitControls.addEventListener("start", releaseCamera);
    return () => orbitControls.removeEventListener("start", releaseCamera);
  }, [controls, isExplorer]);
  useEffect(() => {
    if (!isExplorer) {
      lastNodeId.current = "";
      isFocusing.current = false;
      return;
    }
    if (lastNodeId.current === node.id || !controls.current) return;
    lastNodeId.current = node.id;
    target.current.set(...node.position);
    const orbitDirection =
      node.type === "core"
        ? camera.position.clone().sub(controls.current.target).normalize()
        : target.current.clone().sub(CORE_POSITION).normalize();
    if (node.type !== "core") {
      orbitDirection.y += 0.12;
      orbitDirection.normalize();
    }
    const focusDistance =
      node.type === "core" ? 9 : node.type === "skill" ? 6.5 : 5.4;
    cameraTarget.current
      .copy(target.current)
      .addScaledVector(orbitDirection, focusDistance);
    isFocusing.current = true;
  }, [camera, controls, isExplorer, node]);
  useFrame((_, delta) => {
    if (!isFocusing.current || !controls.current) return;
    const smoothing = reduceMotion ? 1 : 1 - Math.exp(-5.5 * delta);
    controls.current.target.lerp(target.current, smoothing);
    camera.position.lerp(cameraTarget.current, smoothing);
    controls.current.update();
    if (
      controls.current.target.distanceTo(target.current) < 0.015 &&
      camera.position.distanceTo(cameraTarget.current) < 0.02
    )
      isFocusing.current = false;
  });
  return null;
}

function ProjectNodeScreenProjector({
  group,
  nodesById,
  overviewNodesById,
  layoutProgress,
  onProjectNodePositions,
}: {
  group: RefObject<Group | null>;
  nodesById: Map<string, PortfolioGraphNode>;
  overviewNodesById: Map<string, PortfolioGraphNode>;
  layoutProgress: RefObject<number>;
  onProjectNodePositions: (positions: ProjectGraphScreenPosition[]) => void;
}) {
  const point = useMemo(() => new Vector3(), []);
  const lastEmission = useRef(0);

  useFrame(({ camera, clock, size }) => {
    if (!group.current || clock.elapsedTime - lastEmission.current < 1 / 12) return;
    lastEmission.current = clock.elapsedTime;
    group.current.updateMatrixWorld(true);
    camera.updateMatrixWorld();

    const positions = portfolioGraphNodes
      .filter((node) => node.type === "project")
      .map((node) => {
        const overviewNode = overviewNodesById.get(node.id) ?? nodesById.get(node.id) ?? node;
        point
          .set(...node.position)
          .lerp(new Vector3(...overviewNode.position), layoutProgress.current)
          .applyMatrix4(group.current!.matrixWorld)
          .project(camera);

        return {
          id: node.id,
          x: (point.x * 0.5 + 0.5) * size.width,
          y: (-point.y * 0.5 + 0.5) * size.height,
          visible: point.z > -1 && point.z < 1 && Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1,
        };
      });

    onProjectNodePositions(positions);
  });

  return null;
}

export function PortfolioGraphScene({
  activeStop,
  selectedNodeId,
  selectedNode,
  onSelect,
  onExplore,
  onOpenModal,
  isExplorer,
  reduceMotion,
  scrollFocusFromNodeId,
  scrollFocusToNodeId,
  scrollFocusProgress = 0,
  overviewProgress = 0,
  onProjectNodePositions,
}: {
  activeStop: GraphFocusStop;
  selectedNodeId?: string;
  selectedNode?: PortfolioGraphNode;
  onSelect: (id: string) => void;
  onExplore: () => void;
  onOpenModal?: (node: PortfolioGraphNode) => void;
  isExplorer: boolean;
  reduceMotion: boolean;
  scrollFocusFromNodeId?: string;
  scrollFocusToNodeId?: string;
  scrollFocusProgress?: number;
  overviewProgress?: number;
  onProjectNodePositions?: (positions: ProjectGraphScreenPosition[]) => void;
}) {
  const { size } = useThree();
  const isCompactOverview = size.width / size.height < 0.9;
  const group = useRef<Group>(null);
  const layoutProgress = useRef(0);
  const overviewNodes = useMemo(
    () => getOverview2DNodes(isCompactOverview),
    [isCompactOverview],
  );
  const overviewLabels = useMemo(
    () => getOverview2DLabels(isCompactOverview),
    [isCompactOverview],
  );
  const orbitControls = useRef<OrbitControlsImpl>(null);
  const nodesById = useMemo(
    () => new Map(portfolioGraphNodes.map((node) => [node.id, node])),
    [],
  );
  const overviewNodesById = useMemo(
    () => new Map(overviewNodes.map((node) => [node.id, node])),
    [overviewNodes],
  );
  const overviewLabelsById = useMemo(
    () => new Map(overviewLabels.map((label) => [label.id, label])),
    [overviewLabels],
  );
  const scrollFocusFromNode = scrollFocusFromNodeId
    ? nodesById.get(scrollFocusFromNodeId)
    : undefined;
  const scrollFocusToNode = scrollFocusToNodeId
    ? nodesById.get(scrollFocusToNodeId)
    : undefined;
  const selectedConnections = useMemo(
    () =>
      new Set(
        portfolioGraphEdges
          .filter(
            ({ source, target }) =>
              selectedNodeId &&
              (source === selectedNodeId || target === selectedNodeId),
          )
          .flatMap(({ source, target }) => [source, target]),
      ),
    [selectedNodeId],
  );
  const activeEdges = useMemo(
    () =>
      portfolioGraphEdges.filter(({ source, target }) => {
        const sourceNode = nodesById.get(source);
        const targetNode = nodesById.get(target);
        return Boolean(
          sourceNode &&
            targetNode &&
            (activeStop.nodeTypes.includes(sourceNode.type) ||
              activeStop.nodeTypes.includes(targetNode.type)),
        );
      }),
    [activeStop, nodesById],
  );
  const edgeGeometry = useMemo(
    () => createLineGeometry(portfolioGraphEdges, nodesById),
    [nodesById],
  );
  const activeEdgeGeometry = useMemo(
    () => createLineGeometry(activeEdges, nodesById),
    [activeEdges, nodesById],
  );
  const signalEdges = useMemo(
    () =>
      portfolioGraphEdges
        .filter((_, index) => index % 7 === 0)
        .map(({ source, target }) => ({
          source: nodesById.get(source),
          target: nodesById.get(target),
          overviewSource: overviewNodesById.get(source),
          overviewTarget: overviewNodesById.get(target),
        }))
        .filter(
          (
            edge,
          ): edge is {
            source: PortfolioGraphNode;
            target: PortfolioGraphNode;
            overviewSource: PortfolioGraphNode;
            overviewTarget: PortfolioGraphNode;
          } =>
            Boolean(
              edge.source &&
                edge.target &&
                edge.overviewSource &&
                edge.overviewTarget,
            ),
        ),
    [nodesById, overviewNodesById],
  );
  useEffect(
    () => () => {
      edgeGeometry.dispose();
      activeEdgeGeometry.dispose();
    },
    [activeEdgeGeometry, edgeGeometry],
  );
  useFrame(({ clock }, delta) => {
    const targetProgress = MathUtils.smoothstep(
      MathUtils.clamp(overviewProgress, 0, 1),
      0,
      1,
    );
    layoutProgress.current = reduceMotion
      ? targetProgress
      : MathUtils.damp(layoutProgress.current, targetProgress, 4.5, delta);
    updateLineGeometry(
      edgeGeometry,
      portfolioGraphEdges,
      nodesById,
      overviewNodesById,
      layoutProgress.current,
    );
    updateLineGeometry(
      activeEdgeGeometry,
      activeEdges,
      nodesById,
      overviewNodesById,
      layoutProgress.current,
    );

    if (!group.current) return;
    const overviewDrift = isExplorer
      ? 0
      : (1 - layoutProgress.current) *
        (activeStop.id === "overview" ? 0.022 : 0.012);
    const verticalDrift = isExplorer ? 0 : (1 - layoutProgress.current) * 0.018;
    const rotationSmoothing = reduceMotion ? 100 : 1.8;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      reduceMotion ? 0 : Math.sin(clock.elapsedTime * 0.12) * overviewDrift,
      rotationSmoothing,
      delta,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      reduceMotion ? 0 : Math.sin(clock.elapsedTime * 0.09) * verticalDrift,
      rotationSmoothing,
      delta,
    );
  });
  return (
    <>
      <OrbitControls
        ref={orbitControls}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        enablePan={isExplorer}
        enableRotate
        enableZoom={isExplorer}
        minDistance={4.5}
        maxDistance={isExplorer ? 48 : 100}
        screenSpacePanning={isExplorer}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.PAN,
        }}
        touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
      />
      <HomeCameraRig
        isExplorer={isExplorer}
        reduceMotion={reduceMotion}
        controls={orbitControls}
        hasScrollFocus={Boolean(scrollFocusToNode)}
        overviewProgress={overviewProgress}
      />
      <ScrollFocusRig
        controls={orbitControls}
        fromNode={scrollFocusFromNode}
        toNode={scrollFocusToNode}
        progress={scrollFocusProgress}
        isExplorer={isExplorer}
        reduceMotion={reduceMotion}
        overviewProgress={overviewProgress}
      />
      {selectedNode && (
        <NodeFocusRig
          node={selectedNode}
          isExplorer={isExplorer}
          reduceMotion={reduceMotion}
          controls={orbitControls}
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
        {DENSE_CLUSTER_TYPES.map((type) => (
          <ClusterDensity
            key={type}
            type={type}
            activeStop={activeStop}
            baseNodes={portfolioGraphNodes}
            overviewNodes={overviewNodes}
            layoutProgress={layoutProgress}
          />
        ))}
        {portfolioGraphNodes.map((node) => {
          const overviewNode = overviewNodesById.get(node.id) ?? node;
          return (
          <GraphNode
            key={node.id}
            node={node}
            overviewNode={overviewNode}
            activeStop={activeStop}
            isSelected={node.id === selectedNodeId}
            isConnectedToSelection={selectedConnections.has(node.id)}
            onSelect={onSelect}
            onExplore={onExplore}
            onOpenModal={onOpenModal}
            reduceMotion={reduceMotion}
            isScrollFocused={node.id === scrollFocusToNodeId}
            scrollFocusProgress={
              node.id === scrollFocusToNodeId ? scrollFocusProgress : 0
            }
            layoutProgress={layoutProgress}
          />
          );
        })}
        {graphClusterLabels.map((label) => {
          const overviewLabel = overviewLabelsById.get(label.id) ?? label;
          return (
          <GraphClusterLabel
            key={label.id}
            label={label}
            overviewLabel={overviewLabel}
            activeStop={activeStop}
            layoutProgress={layoutProgress}
          />
          );
        })}
        {signalEdges.map(
          ({ source, target, overviewSource, overviewTarget }, index) => (
            <SignalPacket
              key={`${source.id}-${target.id}`}
              source={source}
              target={target}
              overviewSource={overviewSource}
              overviewTarget={overviewTarget}
              index={index}
              reduceMotion={reduceMotion}
              layoutProgress={layoutProgress}
            />
          ),
        )}
      </group>
      {onProjectNodePositions && (
        <ProjectNodeScreenProjector
          group={group}
          nodesById={nodesById}
          overviewNodesById={overviewNodesById}
          layoutProgress={layoutProgress}
          onProjectNodePositions={onProjectNodePositions}
        />
      )}
    </>
  );
}
