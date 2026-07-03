import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block border border-line p-4"
    >
      <h3 className="font-semibold">{project.title}</h3>
      <p className="text-sm text-ink-muted">{project.shortDescription}</p>
      <p className="mt-2 text-xs text-ink-muted">
        {project.category} &middot; {project.status} &middot; {project.year}
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        {project.techStack.join(", ")}
      </p>
    </Link>
  );
}
