import { getAllProjects } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Reveal } from "@/components/common/Reveal";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-6xl py-16 lg:py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-wide text-signal">
          Selected work
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Nine projects across applied AI, full-stack development, and IoT —
          from an award-winning cardiac monitor to the site you&rsquo;re
          reading this on.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <ProjectsExplorer projects={projects} />
      </Reveal>
    </div>
  );
}
