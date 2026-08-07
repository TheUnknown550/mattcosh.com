"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
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
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  GRAPH_NODE_COLORS,
  graphClusterLabels,
  portfolioGraphEdges,
  portfolioGraphNodes,
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
  const position = useMemo(
    () => new Vector3(...node.position),
    [node.position],
  );
  const isInFocus = activeStop.nodeTypes.includes(node.type);
  useFrame((_, delta) => {
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

function ClusterDensity({
  type,
  activeStop,
}: {
  type: PortfolioGraphNodeType;
  activeStop: GraphFocusStop;
}) {
  const nodes = useMemo(
    () => portfolioGraphNodes.filter((node) => node.type === type),
    [type],
  );
  const { pointGeometry, lineGeometry } = useMemo(() => {
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
    const nextPointGeometry = new BufferGeometry();
    nextPointGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(pointPositions, 3),
    );
    const nextLineGeometry = new BufferGeometry();
    nextLineGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(linePositions, 3),
    );
    return { pointGeometry: nextPointGeometry, lineGeometry: nextLineGeometry };
  }, [nodes]);
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
          color={GRAPH_NODE_COLORS[type]}
          size={0.045}
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
}: {
  isExplorer: boolean;
  reduceMotion: boolean;
  controls: RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, size } = useThree();
  const hasLandingInteraction = useRef(false);
  const homeCameraPosition = useMemo(
    () =>
      HOME_CAMERA_DIRECTION.clone().setLength(
        size.width / size.height < 0.8 ? 36 : 22,
      ),
    [size.height, size.width],
  );

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
    if (!isExplorer && !hasLandingInteraction.current) {
      const smoothing = reduceMotion ? 1 : 1 - Math.exp(-4 * delta);
      camera.position.lerp(homeCameraPosition, smoothing);
      camera.lookAt(HOME_CAMERA_TARGET);
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
    node.type === "core" ? 9 : node.type === "skill" ? 6.5 : 5.4;
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
}: {
  controls: RefObject<OrbitControlsImpl | null>;
  fromNode?: PortfolioGraphNode;
  toNode?: PortfolioGraphNode;
  progress: number;
  isExplorer: boolean;
  reduceMotion: boolean;
}) {
  const { camera, size } = useThree();
  const homePosition = useMemo(
    () =>
      HOME_CAMERA_DIRECTION.clone().setLength(
        size.width / size.height < 0.8 ? 36 : 22,
      ),
    [size.height, size.width],
  );
  const fallbackDirection = useMemo(
    () => HOME_CAMERA_DIRECTION.clone().normalize(),
    [],
  );

  useFrame((_, delta) => {
    const orbitControls = controls.current;
    if (isExplorer || !orbitControls) return;

    const fromPose = fromNode
      ? getScrollFocusPose(fromNode, fallbackDirection)
      : { position: homePosition, target: HOME_CAMERA_TARGET };
    const toPose = toNode
      ? getScrollFocusPose(toNode, fallbackDirection)
      : { position: homePosition, target: HOME_CAMERA_TARGET };
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

export function PortfolioGraphScene({
  activeStop,
  selectedNodeId,
  selectedNode,
  onSelect,
  onExplore,
  isExplorer,
  reduceMotion,
  scrollFocusFromNodeId,
  scrollFocusToNodeId,
  scrollFocusProgress = 0,
}: {
  activeStop: GraphFocusStop;
  selectedNodeId?: string;
  selectedNode?: PortfolioGraphNode;
  onSelect: (id: string) => void;
  onExplore: () => void;
  isExplorer: boolean;
  reduceMotion: boolean;
  scrollFocusFromNodeId?: string;
  scrollFocusToNodeId?: string;
  scrollFocusProgress?: number;
}) {
  const group = useRef<Group>(null);
  const orbitControls = useRef<OrbitControlsImpl>(null);
  const nodesById = useMemo(
    () => new Map(portfolioGraphNodes.map((node) => [node.id, node])),
    [],
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
  const edgeGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        portfolioGraphEdges.flatMap(({ source, target }) => {
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
  }, [nodesById]);
  const activeEdgeGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        portfolioGraphEdges.flatMap(({ source, target }) => {
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
        }),
        3,
      ),
    );
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
          (
            edge,
          ): edge is {
            source: PortfolioGraphNode;
            target: PortfolioGraphNode;
          } => Boolean(edge.source && edge.target),
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
      <OrbitControls
        ref={orbitControls}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        enablePan={isExplorer}
        enableRotate
        enableZoom={isExplorer}
        minDistance={4.5}
        maxDistance={48}
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
      />
      <ScrollFocusRig
        controls={orbitControls}
        fromNode={scrollFocusFromNode}
        toNode={scrollFocusToNode}
        progress={scrollFocusProgress}
        isExplorer={isExplorer}
        reduceMotion={reduceMotion}
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
          <ClusterDensity key={type} type={type} activeStop={activeStop} />
        ))}
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
