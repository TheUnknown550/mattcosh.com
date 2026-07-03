"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

interface SceneCanvasProps {
  children: ReactNode;
}

/**
 * Base wrapper around React Three Fiber's Canvas. Provides a shared camera
 * and lighting setup so individual scenes don't repeat boilerplate.
 * Must stay a client component — Three.js relies on browser-only APIs.
 */
export function SceneCanvas({ children }: SceneCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      {children}
    </Canvas>
  );
}
