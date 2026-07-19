import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { TiltCard } from "@/components/common/TiltCard";

export function FeaturedWork() {
  const [project] = getFeaturedProjects();
  if (!project) return null;

  return (
    <section className="mx-auto max-w-6xl py-24">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Selected work
        </h2>
        <Link
          href="/projects"
          className="font-mono text-sm uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
        >
          View all →
        </Link>
      </div>

      <TiltCard className="group mt-10 block rounded-lg">
        <Link
          href={`/projects/${project.slug}`}
          className="grid grid-cols-1 gap-10 rounded-lg border border-line bg-surface p-8 transition-colors duration-300 group-hover:border-signal lg:grid-cols-[1.4fr_1fr] lg:p-12"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-signal">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold text-ink">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
              {project.shortDescription}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
              {project.techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-sm text-ink transition-colors group-hover:text-accent">
              View project →
            </p>
          </div>

          {project.recognitions && project.recognitions.length > 0 && (
            <div className="flex flex-col justify-center gap-3 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                Recognized by
              </p>
              {project.recognitions.map((recognition) => (
                <p key={recognition} className="text-sm text-ink">
                  <span className="text-signal">●</span> {recognition}
                </p>
              ))}
            </div>
          )}
        </Link>
      </TiltCard>
    </section>
  );
}
