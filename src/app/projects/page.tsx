import { getAllProjects } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Reveal } from "@/components/common/Reveal";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-6xl py-16 lg:py-24">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Projects
        </h1>
      </Reveal>

      <Reveal className="mt-12">
        <ProjectsExplorer projects={projects} />
      </Reveal>
    </div>
  );
}
