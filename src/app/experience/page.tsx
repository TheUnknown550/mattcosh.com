import Link from "next/link";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { skills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { EducationCard } from "@/components/experience/EducationCard";
import { ExperienceGraphConnections } from "@/components/experience/ExperienceGraphConnections";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ExperiencePage() {
  const recentCertifications = certifications.slice(0, 3);

  return (
    <div className="experience-page-rail ml-auto w-full min-w-0 max-w-3xl py-8 lg:py-12">
      <ExperienceGraphConnections />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Experience
        </h1>
      </Reveal>

      <PulseDivider />

      <section id="experience-work">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink">Work</h2>
          <div className="mt-8 flex flex-col gap-5">
            {experience.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </Reveal>
      </section>

      <div
        id="experience-transition"
        className="flex min-h-[50svh] flex-col items-center justify-center gap-5"
      >
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-signal">
            Next section
          </p>
          <p className="mt-2 inline-flex items-center gap-3 font-display text-2xl font-semibold text-ink">
            Education
            <span aria-hidden="true" className="text-signal">
              ↓
            </span>
          </p>
        </div>
        <PulseDivider className="max-w-md" />
      </div>

      <section id="experience-education">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink">Education</h2>
          <div className="mt-8 flex flex-col gap-5">
            {education.map((entry) => (
              <EducationCard key={entry.id} entry={entry} />
            ))}
          </div>
        </Reveal>
      </section>

      <PulseDivider />

      <div className="flex flex-col gap-10">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Skills</h2>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
              Thai &amp; English, native
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {skills.map((group) => (
              <li
                key={group.category}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted"
              >
                {group.category} ({group.skills.length})
              </li>
            ))}
          </ul>
          <Link
            href="/skills"
            className="group mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:text-accent"
          >
            View all skills
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Certifications
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {recentCertifications.map((cert) => (
              <li
                key={cert.id}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3"
              >
                <span className="text-sm text-ink">{cert.name}</span>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {cert.issuedLabel}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/certifications"
            className="group mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:text-accent"
          >
            View all certifications
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
