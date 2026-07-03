"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * Minimal spinning-cube placeholder, used to verify the R3F pipeline
 * end-to-end before real 3D models/scenes are designed.
 */
export function ThreePlaceholder() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}
