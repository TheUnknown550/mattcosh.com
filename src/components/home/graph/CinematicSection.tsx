"use client";

import type { CSSProperties, ReactNode } from "react";
import { PulseDivider } from "@/components/common/PulseDivider";
import { useGraphScrollFocus } from "./useGraphScrollFocus";

export function CinematicSection({
  sectionKey,
  children,
  mode = "standard",
}: {
  sectionKey: string;
  children: ReactNode;
  mode?: "standard" | "core";
}) {
  const { reduceMotion, sectionProgressByKey } = useGraphScrollFocus();
  const sectionProgress = reduceMotion
    ? 1
    : (sectionProgressByKey[sectionKey] ?? 0);
  const reveal = reduceMotion ? 1 : sectionProgress;
  const isCoreReveal = mode === "core";
  const contentOffset = (1 - reveal) * (isCoreReveal ? 4 : 2.5);
  const cinematicStyle = {
    opacity: isCoreReveal ? 1 : reveal,
    pointerEvents: reveal > 0.45 ? "auto" : "none",
    transform: reduceMotion || isCoreReveal
      ? "none"
      : `translateY(${(1 - reveal) * 1.5}rem) scale(${0.72 + reveal * 0.28})`,
    transformOrigin: "center center",
    willChange:
      reveal > 0.01 && reveal < 0.99 ? "opacity, transform" : "auto",
    "--cinematic-progress": reveal,
    "--cinematic-content-opacity": isCoreReveal
      ? 1
      : 0.12 + reveal * 0.88,
    "--cinematic-backdrop-opacity": isCoreReveal ? reveal * 0.34 : 0.34,
    "--cinematic-content-offset": `${contentOffset}rem`,
    "--cinematic-side-scale": 0.06 + reveal * 0.94,
    "--cinematic-copy-offset-x": `${(1 - reveal) * 18}rem`,
    "--cinematic-facts-offset-x": `${(1 - reveal) * -26}rem`,
    "--cinematic-copy-offset-y": `${(1 - reveal) * 8}rem`,
    "--cinematic-facts-offset-y": `${(1 - reveal) * -8}rem`,
    "--cinematic-core-scale": 0.65 + reveal * 0.35,
    "--cinematic-reveal-radius": isCoreReveal
      ? `${reveal * 100}vmax`
      : "999rem",
  } as CSSProperties;

  return (
    <div
      data-home-snap
      data-cinematic-section={sectionKey}
      className="relative transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none"
      inert={reveal <= 0.45 ? true : undefined}
      style={cinematicStyle}
    >
      <PulseDivider className="pointer-events-none absolute inset-x-0 top-0 z-20" />
      {children}
      <PulseDivider className="pointer-events-none absolute inset-x-0 bottom-0 z-20" />
    </div>
  );
}
