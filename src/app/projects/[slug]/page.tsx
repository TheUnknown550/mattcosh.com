import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { projectMDXExists } from "@/lib/mdx";
import { Placeholder } from "@/components/common/Placeholder";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

type MDXModule = { default: ComponentType };

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const hasCaseStudy = projectMDXExists(project.slug);
  const CaseStudy = hasCaseStudy
    ? ((await import(`@content/projects/${project.slug}.mdx`)) as MDXModule).default
    : null;

  return (
    <div className="mx-auto max-w-3xl py-16 lg:py-24">
      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        ← All projects
      </Link>

      <p className="mt-8 font-mono text-xs uppercase tracking-wide text-signal">
        {project.category} · {project.year} · {project.status}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
        {project.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        {project.shortDescription}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
        {project.techStack.map((tech) => (
          <li key={tech} className="rounded-full border border-line px-3 py-1">
            {tech}
          </li>
        ))}
      </ul>

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-6 flex flex-wrap gap-6 font-mono text-sm">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal transition-colors hover:text-accent"
            >
              Live site ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal transition-colors hover:text-accent"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}

      {project.recognitions && project.recognitions.length > 0 && (
        <div className="mt-10 rounded-lg border border-line bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
            Recognized by
          </p>
          <ul className="mt-3 space-y-2">
            {project.recognitions.map((recognition) => (
              <li key={recognition} className="text-sm text-ink">
                <span className="text-accent">★</span> {recognition}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 border-t border-line pt-2">
        {CaseStudy ? (
          <CaseStudy />
        ) : (
          <div className="mt-8">
            <Placeholder label="No case study written yet for this project." />
          </div>
        )}
      </div>
    </div>
  );
}
