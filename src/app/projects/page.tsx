import { getAllProjects } from "@/lib/projects";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="project-page-rail mr-auto w-full min-w-0 max-w-3xl py-8 sm:ml-[4%] sm:w-[96%] lg:max-w-none lg:py-12 2xl:ml-[10%] 2xl:w-[min(90%,90rem)]">
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
