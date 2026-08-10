"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  label: string;
}

interface StatRowProps {
  stats: Stat[];
}

/**
 * Counts each stat up from 0 the first time the row scrolls into view,
 * eased with a cubic ease-out. Skips straight to final values under
 * prefers-reduced-motion.
 */
export function StatRow({ stats }: StatRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [display, setDisplay] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => setDisplay(stats.map((stat) => stat.value)));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        const duration = 900;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(stats.map((stat) => Math.round(stat.value * eased)));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stats]);

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label}>
          <p className="font-display text-3xl font-semibold text-ink lg:text-4xl">
            {display[index]}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
