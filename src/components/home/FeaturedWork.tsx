import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { TiltCard } from "@/components/common/TiltCard";

export function FeaturedWork() {
  const [project] = getFeaturedProjects();
  if (!project) return null;

  return (
    <section
      data-graph-focus-node="project-cs-m-cardiac-monitor"
      data-graph-focus-key="selected-work"
      className="mx-auto w-full max-w-[90rem] py-16 max-sm:py-10 md:-translate-y-8 lg:-translate-y-12 lg:py-16 2xl:py-20"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-4xl font-semibold text-ink max-sm:text-3xl">
          Selected work
        </h2>
        <Link
          href="/projects"
          className="font-mono text-sm uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
        >
          View all →
        </Link>
      </div>

      <TiltCard className="group mx-auto mt-12 block w-full max-w-[72rem] rounded-lg max-sm:mt-6">
        <Link
          href={`/projects/${project.slug}`}
          className="grid grid-cols-1 gap-8 rounded-lg border border-line bg-surface p-8 transition-colors duration-300 group-hover:border-signal max-sm:gap-6 max-sm:p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)] lg:gap-8 lg:p-10 xl:gap-10 xl:p-12"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-signal">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-4 font-display text-4xl font-semibold text-ink max-sm:text-3xl lg:text-4xl xl:text-[2.75rem]">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted max-sm:text-sm">
              {project.shortDescription}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-wide text-ink-muted max-sm:mt-4">
              {project.techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-sm text-ink transition-colors group-hover:text-accent max-sm:mt-5">
              View project →
            </p>
          </div>

          {project.recognitions && project.recognitions.length > 0 && (
            <div className="flex flex-col justify-center gap-3 border-t border-line pt-6 max-sm:gap-2 max-sm:pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-10">
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
