import type { TimelineEntry } from "@/types/timeline";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { honors } from "@/data/honors";
import { certifications } from "@/data/certifications";

const educationEntries: TimelineEntry[] = education.map((entry) => ({
  id: `education-${entry.id}`,
  type: "education",
  title: entry.school,
  subtitle: entry.degree,
  dateLabel: `${entry.startLabel} — ${entry.endLabel}`,
  sortDate: entry.sortDate,
  description: entry.notes ?? entry.degree,
}));

const workEntries: TimelineEntry[] = experience.map((entry) => ({
  id: `work-${entry.id}`,
  type: "work",
  title: entry.title,
  subtitle: `${entry.company} · ${entry.location}`,
  dateLabel: `${entry.startLabel} — ${entry.endLabel}`,
  sortDate: entry.sortDate,
  description: entry.summary,
}));

const projectEntries: TimelineEntry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  type: "project",
  title: project.title,
  subtitle: `${project.category} · ${project.year}`,
  dateLabel: project.year,
  // Projects only carry a year, not a month — pad to "YYYY-01" so string
  // comparison sorts consistently against the "YYYY-MM" dates used by
  // every other entry type instead of always sorting year-only entries first.
  sortDate: `${project.year.slice(0, 4)}-01`,
  description: project.shortDescription,
  tags: project.techStack,
  link: { label: "View project", href: `/projects/${project.slug}` },
}));

const awardEntries: TimelineEntry[] = honors.map((honor) => ({
  id: `award-${honor.id}`,
  type: "award",
  title: honor.title,
  dateLabel: honor.dateLabel,
  sortDate: honor.sortDate,
  description: honor.description,
  link: honor.relatedProjectSlug
    ? { label: "Related project", href: `/projects/${honor.relatedProjectSlug}` }
    : undefined,
}));

const certificationEntries: TimelineEntry[] = certifications.map((cert) => ({
  id: `certification-${cert.id}`,
  type: "certification",
  title: cert.name,
  subtitle: cert.authority,
  dateLabel: cert.issuedLabel,
  sortDate: cert.sortDate,
  description: `Issued by ${cert.authority}.`,
  link: cert.url ? { label: "View credential", href: cert.url } : undefined,
}));

/**
 * Every milestone (education, work, projects, awards, certifications) merged
 * into one chronological feed for the Roadmap page — see
 * src/components/roadmap/PulseTimeline.tsx.
 */
export const timeline: TimelineEntry[] = [
  ...educationEntries,
  ...workEntries,
  ...projectEntries,
  ...awardEntries,
  ...certificationEntries,
].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
