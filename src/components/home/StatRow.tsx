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
    <div
      ref={containerRef}
      className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-8"
    >
      {stats.map((stat, index) => (
        <div key={stat.label} className="min-w-0">
          <p className="font-display text-4xl font-semibold leading-none text-ink lg:text-6xl">
            {display[index]}
          </p>
          <p className="mt-3 max-w-[10rem] font-mono text-xs uppercase leading-snug tracking-[0.12em] text-ink sm:text-sm sm:tracking-wide">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
