"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { FilterTabs } from "@/components/common/FilterTabs";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectSignalMap } from "@/components/projects/ProjectSignalMap";

interface ProjectsExplorerProps {
  projects: Project[];
}

type FilterValue = "All" | ProjectCategory;

/**
 * Client-side category filter + grid for the Projects page. Filtering is
 * instant (no route change) so the sliding FilterTabs indicator reads as
 * responsive rather than a page reload.
 */
export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<ProjectCategory>();
    projects.forEach((project) => seen.add(project.category));
    return Array.from(seen);
  }, [projects]);

  const options = useMemo(
    () => [
      { value: "All" as FilterValue, label: `All (${projects.length})` },
      ...categories.map((category) => ({
        value: category as FilterValue,
        label: `${category} (${projects.filter((p) => p.category === category).length})`,
      })),
    ],
    [projects, categories],
  );

  const filtered =
    filter === "All" ? projects : projects.filter((project) => project.category === filter);

  function selectProject(slug: string) {
    setActiveProjectSlug(slug);
    document.getElementById(`project-card-${slug}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }

  return (
    <div>
      <div className="route-projects__filters">
        <FilterTabs options={options} value={filter} onChange={setFilter} />
      </div>

      <div className="route-projects__network mt-5">
        <ProjectSignalMap
          projects={filtered}
          activeProjectSlug={activeProjectSlug}
          onActivate={setActiveProjectSlug}
          onSelect={selectProject}
        />
      </div>

      <div className="route-projects__cards mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <div
            key={project.slug}
            id={`project-card-${project.slug}`}
            onFocus={() => setActiveProjectSlug(project.slug)}
            onBlur={() => setActiveProjectSlug(null)}
            onMouseEnter={() => setActiveProjectSlug(project.slug)}
            onMouseLeave={() => setActiveProjectSlug(null)}
            style={{ "--route-project-index": index } as CSSProperties}
            className={`route-projects__card rounded-lg transition-[box-shadow,transform] duration-300 motion-reduce:transition-none ${
              activeProjectSlug === project.slug
                ? "-translate-y-1 shadow-[0_0_0_1px_rgba(45,217,201,0.8),0_1.5rem_3rem_rgba(45,217,201,0.12)]"
                : ""
            }`}
          >
            <ProjectCard project={project} nodeIndex={index + 1} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-ink-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
