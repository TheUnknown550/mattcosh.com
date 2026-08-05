import Link from "next/link";
import type { ComponentType } from "react";
import type { Project } from "@/types/project";
import { Placeholder } from "@/components/common/Placeholder";

interface ProjectDetailProps {
  project: Project;
  CaseStudy: ComponentType | null;
}

/**
 * Shared resume-style layout for every project case study. Project-specific
 * narrative remains in MDX; this component presents the common facts and
 * skills in the same easily scannable order on every page.
 */
export function ProjectDetail({ project, CaseStudy }: ProjectDetailProps) {
  const details = [
    { label: "Focus", value: project.category },
    { label: "Timeline", value: project.year },
    { label: "Delivery", value: project.status },
    { label: "Case study", value: CaseStudy ? "Available" : "Coming soon" },
  ];

  return (
    <article className="mx-auto max-w-6xl py-8 lg:py-12">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none"
        >
          ←
        </span>
        All projects
      </Link>

      <header className="mt-10 grid gap-10 border-b border-line pb-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-signal">
            {project.category} · Project case study
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight text-ink lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted lg:text-xl">
            {project.shortDescription}
          </p>

          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wide">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-signal px-4 py-2 text-void transition-colors hover:bg-accent"
                >
                  View live project ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-ink transition-colors hover:border-signal hover:text-signal"
                >
                  View GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
          {details.map((detail) => (
            <div key={detail.label} className="min-h-24 bg-surface p-4">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                {detail.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-ink">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <section aria-labelledby="project-details-heading" className="rounded-lg border border-line bg-surface p-6 lg:p-8">
          <h2 id="project-details-heading" className="font-display text-2xl font-semibold text-ink">
            Project details
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            This case study covers the problem, implementation, outcomes, and practical lessons from the project. The technical narrative below is based on the project record and supporting LinkedIn export.
          </p>

          {project.recognitions && project.recognitions.length > 0 && (
            <div className="mt-7 border-t border-line pt-6">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                Recognition and outcomes
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.recognitions.map((recognition) => (
                  <li key={recognition} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span aria-hidden="true" className="text-accent">✦</span>
                    {recognition}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section aria-labelledby="skills-heading" className="rounded-lg border border-line p-6 lg:p-8">
          <h2 id="skills-heading" className="font-display text-2xl font-semibold text-ink">
            Skills developed
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Technical and product skills applied or strengthened while delivering this work.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {project.techStack.map((skill) => (
              <li key={skill} className="rounded-full border border-line bg-surface px-3 py-1.5">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="project-story-heading" className="border-t border-line pt-12">
        <div className="max-w-3xl">
          <h2 id="project-story-heading" className="font-display text-3xl font-semibold text-ink">
            Project story and lessons learned
          </h2>
        </div>

        <div className="mt-10 max-w-3xl">
          {CaseStudy ? (
            <CaseStudy />
          ) : (
            <Placeholder label="No case study written yet for this project." />
          )}
        </div>
      </section>
    </article>
  );
}
