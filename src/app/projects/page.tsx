import { getAllProjects } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="route-projects mx-auto max-w-6xl py-8 lg:py-12">
      <Reveal className="route-projects__title">
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Projects
        </h1>
      </Reveal>

      <div className="route-projects__divider">
        <PulseDivider />
      </div>

      <Reveal className="route-projects__explorer mt-6">
        <ProjectsExplorer projects={projects} />
      </Reveal>
    </div>
  );
}
