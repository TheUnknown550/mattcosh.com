import { getAllProjects } from "@/lib/projects";
import { ProjectList } from "@/components/projects/ProjectList";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
