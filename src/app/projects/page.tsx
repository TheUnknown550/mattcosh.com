import { getAllProjects } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="ml-0 mr-auto w-full max-w-3xl py-8 sm:ml-6 lg:ml-[clamp(5rem,10vw,13rem)] lg:max-w-5xl lg:py-12">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Projects
        </h1>
      </Reveal>

      <PulseDivider />

      <Reveal className="mt-6">
        <ProjectsExplorer projects={projects} />
      </Reveal>
    </div>
  );
}
