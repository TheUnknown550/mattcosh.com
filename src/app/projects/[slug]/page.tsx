import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { projectMDXExists } from "@/lib/mdx";
import { Placeholder } from "@/components/common/Placeholder";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p className="text-ink-muted">{project.shortDescription}</p>
      <p className="text-sm text-ink-muted">
        {project.category} &middot; {project.status} &middot; {project.year}
      </p>
      <p className="text-sm text-ink-muted">
        Tech stack: {project.techStack.join(", ")}
      </p>

      {hasCaseStudy ? (
        <Placeholder label="MDX case study content will render here once MDX rendering is wired up." />
      ) : (
        <Placeholder label="No case study written yet for this project." />
      )}
    </div>
  );
}
