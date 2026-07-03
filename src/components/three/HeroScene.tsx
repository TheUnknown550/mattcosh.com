"use client";

import dynamic from "next/dynamic";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
const HeroGeometry = dynamic(
  () => import("@/components/three/HeroGeometry").then((m) => m.HeroGeometry),
  { ssr: false },
);

/**
 * Client-only mount point for the hero's 3D scene. Kept separate from
 * SceneCanvas/HeroGeometry so those stay reusable without the dynamic-import
 * wrapping, per CLAUDE.md's "use dynamic imports for 3D scenes" rule.
 */
export function HeroScene() {
  return (
    <SceneCanvas>
      <HeroGeometry />
    </SceneCanvas>
  );
}
