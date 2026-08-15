import Link from "next/link";
import type { Project } from "@/types/project";
import { TiltCard } from "@/components/common/TiltCard";
import { ProjectCardNodeIcon } from "@/components/projects/ProjectCardNodeIcon";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <TiltCard className="group h-full rounded-lg">
      <Link
        href={`/projects/${project.slug}`}
        className="relative isolate flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface/85 p-6 backdrop-blur-[2px] transition-colors duration-300 group-hover:border-signal"
      >
        <ProjectCardNodeIcon />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-wide text-signal">
              {project.category} · {project.year}
            </p>
            {project.recognitions && project.recognitions.length > 0 && (
              <span
                aria-hidden="true"
                title={project.recognitions[0]}
                className="shrink-0 text-accent"
              >
                ★
              </span>
            )}
          </div>

          <h3 className="mt-4 font-display text-xl font-semibold text-ink">
            {project.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
            {project.shortDescription}
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {project.techStack.slice(0, 4).map((tech) => (
              <li key={tech} className="rounded-full border border-line px-2.5 py-1">
                {tech}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-xs uppercase tracking-wide text-ink transition-colors group-hover:text-accent">
            {project.status === "In Progress" ? "In progress" : "View case study"} →
          </p>
        </div>
      </Link>
    </TiltCard>
  );
}
