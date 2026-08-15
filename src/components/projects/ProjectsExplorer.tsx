"use client";

import { useMemo, useRef, useState } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { FilterTabs } from "@/components/common/FilterTabs";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectGraphConnections } from "@/components/projects/ProjectGraphConnections";

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
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

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

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.category === filter)),
    [filter, projects],
  );

  return (
    <div>
      <FilterTabs options={options} value={filter} onChange={setFilter} />
      <ProjectGraphConnections cardRefs={cardRefs} projects={filtered} />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <div
            key={project.slug}
            ref={(element) => {
              if (element) {
                cardRefs.current.set(project.slug, element);
              } else {
                cardRefs.current.delete(project.slug);
              }
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-ink-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
