"use client";

import type { ReactNode } from "react";
import { useGraphScrollFocus } from "./useGraphScrollFocus";

export function CinematicSection({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: ReactNode;
}) {
  const { reduceMotion, sectionProgressByKey } = useGraphScrollFocus();
  const sectionProgress = reduceMotion
    ? 1
    : (sectionProgressByKey[sectionKey] ?? 0);
  const reveal = reduceMotion ? 1 : sectionProgress;

  return (
    <div
      className="transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none"
      style={{
        opacity: reveal,
        pointerEvents: reveal > 0.45 ? "auto" : "none",
        transform: reduceMotion
          ? "none"
          : `translateY(${(1 - reveal) * 1.5}rem) scale(${0.72 + reveal * 0.28})`,
        transformOrigin: "center center",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
