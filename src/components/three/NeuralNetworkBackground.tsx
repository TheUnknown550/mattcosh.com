"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Vector3,
} from "three";
import type { Mesh } from "three";

interface Node {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  source: Node;
  target: Node;
}

interface SignalPacketProps extends Edge {
  index: number;
  reduceMotion: boolean;
}

function SignalPacket({
  source,
  target,
  index,
  reduceMotion,
}: SignalPacketProps) {
  const packet = useRef<Mesh>(null);
  const [start, end] = useMemo(
    () => [new Vector3(source.x, source.y, source.z), new Vector3(target.x, target.y, target.z)],
    [source, target],
  );

  useFrame(({ clock }) => {
    if (!packet.current || reduceMotion) return;

    const progress =
      (Math.sin(clock.elapsedTime * (0.62 + (index % 3) * 0.1) + index * 1.7) +
        1) /
      2;
    packet.current.position.lerpVectors(start, end, progress);
  });

  return (
    <mesh ref={packet} position={start} scale={0.05}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={index % 4 === 0 ? "#ff5a1f" : "#2dd9c9"}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}

function createGraph() {
  let seed = 481516;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const nodes: Node[] = Array.from({ length: 54 }, () => ({
    x: random() * 17 - 8.5,
    y: random() * 11 - 5.5,
    z: random() * 5 - 2.5,
  }));

  const nodePositions = nodes.flatMap(({ x, y, z }) => [x, y, z]);
  const edgePositions: number[] = [];
  const edges: Edge[] = [];

  nodes.forEach((node, index) => {
    const nearest = nodes
      .slice(index + 1)
      .map((other) => ({
        node: other,
        distance: Math.hypot(
          node.x - other.x,
          node.y - other.y,
          node.z - other.z,
        ),
      }))
      .filter(({ distance }) => distance < 3.4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    nearest.forEach(({ node: other }) => {
      edges.push({ source: node, target: other });
      edgePositions.push(node.x, node.y, node.z, other.x, other.y, other.z);
    });
  });

  return { edgePositions, nodePositions, edges };
}

function NeuralGraph({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<Group>(null);
  const scrollProgress = useRef(0);
  const { edgePositions, nodePositions, edges } = useMemo(
    () => createGraph(),
    [],
  );
  const signalConnections = useMemo(
    () => edges.filter((_, index) => index % 8 === 0),
    [edges],
  );
  const pointsGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(nodePositions, 3),
    );
    return geometry;
  }, [nodePositions]);
  const linesGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(edgePositions, 3),
    );
    return geometry;
  }, [edgePositions]);

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      linesGeometry.dispose();
    },
    [linesGeometry, pointsGeometry],
  );

  useEffect(() => {
    const updateScrollProgress = () => {
      const maximumScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      scrollProgress.current = window.scrollY / maximumScroll;
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current || reduceMotion) return;

    const targetRotationY = scrollProgress.current * 0.68 + clock.elapsedTime * 0.018;
    const targetRotationX = -0.14 + scrollProgress.current * 0.26;
    const targetPositionY = 0.45 - scrollProgress.current * 0.9;

    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotationY,
      2.4,
      delta,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotationX,
      2.4,
      delta,
    );
    group.current.position.y = MathUtils.damp(
      group.current.position.y,
      targetPositionY,
      2.4,
      delta,
    );
  });

  return (
    <group ref={group} rotation={[-0.14, 0, 0]} position={[0, 0.45, 0]}>
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          color="#2dd9c9"
          transparent
          opacity={0.17}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={pointsGeometry}>
        <pointsMaterial
          color="#2dd9c9"
          transparent
          opacity={0.58}
          size={0.078}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      {signalConnections.map((connection, index) => (
        <SignalPacket
          key={index}
          source={connection.source}
          target={connection.target}
          index={index}
          reduceMotion={reduceMotion}
        />
      ))}
    </group>
  );
}

export function NeuralNetworkBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const staticGraph = isMobileViewport || reduceMotion;

  return (
    <div
      aria-hidden="true"
      data-graph-motion={staticGraph ? "static" : "animated"}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
    >
      <Canvas
        frameloop={staticGraph ? "demand" : "always"}
        dpr={isMobileViewport ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 48 }}
        gl={{
          alpha: true,
          antialias: !isMobileViewport,
          powerPreference: "low-power",
        }}
      >
        <NeuralGraph reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
