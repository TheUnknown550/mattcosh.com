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
  endSortDate: entry.endSortDate,
  description: entry.notes ?? entry.degree,
}));

const workEntries: TimelineEntry[] = experience.map((entry) => ({
  id: `work-${entry.id}`,
  type: "work",
  title: entry.title,
  subtitle: `${entry.company} · ${entry.location}`,
  dateLabel: `${entry.startLabel} — ${entry.endLabel}`,
  sortDate: entry.sortDate,
  endSortDate: entry.endSortDate,
  description: entry.summary,
}));

const projectEntries: TimelineEntry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  type: "project",
  title: project.title,
  subtitle: `${project.category} · ${project.year}`,
  dateLabel: project.year,
  sortDate: project.startSortDate,
  endSortDate: project.endSortDate,
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
 * into one reverse-chronological feed (newest first) for the Roadmap page —
 * see src/components/roadmap/PulseTimeline.tsx. `sort` is stable, so when two
 * entries land in the same month (only month-level precision is tracked),
 * ties keep their relative order from this array — work/project entries are
 * listed first so a project that started later in the same month as a
 * point-in-time education/award/certification milestone still renders above
 * it (newest first).
 */
export const timeline: TimelineEntry[] = [
  ...workEntries,
  ...projectEntries,
  ...educationEntries,
  ...awardEntries,
  ...certificationEntries,
].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
