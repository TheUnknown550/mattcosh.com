"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const MAX_TILT_DEG = 5;

/**
 * Wraps children in a card that tilts toward the cursor and glows at the
 * pointer position, driven entirely by CSS custom properties — see the
 * `.tilt-card` rules in globals.css. Pauses under prefers-reduced-motion.
 */
export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--tilt-x", `${(0.5 - py) * MAX_TILT_DEG * 2}deg`);
    el.style.setProperty("--tilt-y", `${(px - 0.5) * MAX_TILT_DEG * 2}deg`);
    el.style.setProperty("--glow-x", `${px * 100}%`);
    el.style.setProperty("--glow-y", `${py * 100}%`);
  }

  function handlePointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
