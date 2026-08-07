"use client";

import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OVERVIEW_STOP } from "./constants";
import { PortfolioGraphScene } from "./PortfolioGraphScene";

/**
 * A quiet, non-interactive version of the portfolio graph that stays behind
 * every route. The home page owns the interactive explorer, so it is omitted
 * there to avoid rendering two graphs at once.
 */
export function PortfolioGraphBackground() {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  if (pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 5.5, 18], fov: 43 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <PortfolioGraphScene
          activeStop={OVERVIEW_STOP}
          onSelect={() => undefined}
          onExplore={() => undefined}
          isExplorer={false}
          reduceMotion={reduceMotion}
        />
      </Canvas>
    </div>
  );
}
