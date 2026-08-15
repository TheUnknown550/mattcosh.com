"use client";

import type { Project } from "@/types/project";

interface ProjectSignalMapProps {
  projects: Project[];
  activeProjectSlug: string | null;
  onActivate: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}

const CATEGORY_COLORS: Record<Project["category"], string> = {
  "AI/ML": "#2dd9c9",
  Research: "#82aaff",
  Other: "#ff8a5b",
  "Full-Stack": "#65c7f2",
  IoT: "#c792ea",
  Robotics: "#ffd166",
  Mobile: "#c7e86b",
};

const NODE_POSITIONS = [
  [17, 38],
  [50, 38],
  [83, 38],
  [17, 63],
  [50, 63],
  [83, 63],
  [17, 88],
  [50, 88],
  [83, 88],
] as const;

function compactTitle(title: string) {
  return title
    .replace("CS-M — ", "")
    .replace(" — ", " / ")
    .replace(" —", "")
    .replace("CO₂ Emission Visualization from ", "")
    .replace("Creative Excellence Awards 2026 — ", "");
}

export function ProjectSignalMap({
  projects,
  activeProjectSlug,
  onActivate,
  onSelect,
}: ProjectSignalMapProps) {
  return (
    <section
      aria-labelledby="project-network-heading"
      className="relative overflow-hidden rounded-xl border border-line bg-surface/80 px-4 py-5 sm:px-6 sm:py-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(110, 136, 151, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(110, 136, 151, 0.08) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(ellipse at center, black, transparent 82%)",
        }}
      />

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Project network
          </p>
          <h2
            id="project-network-heading"
            className="mt-1 font-display text-lg font-semibold text-ink sm:text-xl"
          >
            Trace the work
          </h2>
        </div>
        <p className="hidden text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted sm:block">
          {projects.length} active nodes
          <br />
          hover to illuminate
        </p>
      </div>

      <div className="relative z-10 mt-5 h-[18rem] sm:h-[20rem]">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <circle cx="50" cy="13" r="3" fill="#ffffff" opacity="0.9" />
          <circle cx="50" cy="13" r="7" fill="none" stroke="#2dd9c9" strokeOpacity="0.35" />
          {projects.map((project, index) => {
            const [x, y] = NODE_POSITIONS[index] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1];
            const isActive = activeProjectSlug === project.slug;
            const color = CATEGORY_COLORS[project.category];

            return (
              <g key={project.slug}>
                <path
                  d={`M 50 13 C 50 23, ${x} ${y - 13}, ${x} ${y}`}
                  fill="none"
                  stroke={isActive ? color : "#354052"}
                  strokeOpacity={isActive ? 0.95 : 0.72}
                  strokeWidth={isActive ? 0.7 : 0.35}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 2.5 : 1.8}
                  fill={color}
                  opacity={isActive ? 1 : 0.82}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-ink/80 bg-void text-sm text-ink shadow-[0_0_0_6px_rgba(45,217,201,0.08)]">
            <span aria-hidden="true">✦</span>
          </div>
          <p className="mt-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
            Matt Cosh / core
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-5 sm:gap-y-5">
          {projects.map((project, index) => {
            const color = CATEGORY_COLORS[project.category];
            const isActive = activeProjectSlug === project.slug;

            return (
              <button
                key={project.slug}
                type="button"
                aria-label={`Trace ${project.title}`}
                onClick={() => onSelect(project.slug)}
                onFocus={() => onActivate(project.slug)}
                onBlur={() => onActivate(null)}
                onMouseEnter={() => onActivate(project.slug)}
                onMouseLeave={() => onActivate(null)}
                className={`group min-w-0 text-left transition-transform duration-200 motion-reduce:transition-none ${
                  isActive ? "-translate-y-1" : ""
                }`}
              >
                <span
                  className="flex items-center gap-2 rounded-md border px-2 py-2 transition-colors duration-200 sm:px-3"
                  style={{
                    borderColor: isActive ? `${color}aa` : "#232833",
                    backgroundColor: isActive ? `${color}18` : "rgba(10, 13, 18, 0.7)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color, boxShadow: isActive ? `0 0 0 4px ${color}22` : undefined }}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                      node {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block truncate font-display text-[11px] font-medium text-ink sm:text-xs">
                      {compactTitle(project.title)}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
