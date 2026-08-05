import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { projectMDXExists } from "@/lib/mdx";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

type MDXModule = { default: ComponentType };

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
  const CaseStudy = hasCaseStudy
    ? ((await import(`@content/projects/${project.slug}.mdx`)) as MDXModule).default
    : null;

  return <ProjectDetail project={project} CaseStudy={CaseStudy} />;
}
