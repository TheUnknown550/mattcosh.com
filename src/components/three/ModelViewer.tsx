"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  // Loads a .glb file from /public/models via drei's useGLTF (cached, Suspense-based).
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

interface ModelViewerProps {
  modelPath: string;
}

/**
 * Reusable GLB model loader. Wrap in a <SceneCanvas> to render.
 * Placeholder fallback is shown while the model streams in.
 */
export function ModelViewer({ modelPath }: ModelViewerProps) {
  return (
    <Suspense fallback={null}>
      <Model modelPath={modelPath} />
    </Suspense>
  );
}
