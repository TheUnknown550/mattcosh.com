import { notFound } from "next/navigation";
import { ExperienceDetail } from "@/components/experience/ExperienceDetail";
import { getAllExperience, getExperienceById } from "@/lib/experience";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllExperience().map((entry) => ({ id: entry.id }));
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = await params;
  const entry = getExperienceById(id);

  if (!entry) notFound();

  return <ExperienceDetail entry={entry} />;
}
