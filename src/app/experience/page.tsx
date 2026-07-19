import Link from "next/link";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { skills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { EducationCard } from "@/components/experience/EducationCard";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ExperiencePage() {
  const recentCertifications = certifications.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl py-16 lg:py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-wide text-signal">Résumé</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
          Experience
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Four roles across a production engineering team, a freelance client
          base, and two teaching positions at Chiang Mai University — plus
          the education behind them.
        </p>
      </Reveal>

      <PulseDivider />

      <Reveal>
        <h2 className="font-display text-2xl font-semibold text-ink">Work</h2>
        <div className="mt-8 flex flex-col gap-5">
          {experience.map((entry) => (
            <ExperienceCard key={entry.id} entry={entry} />
          ))}
        </div>
      </Reveal>

      <PulseDivider />

      <Reveal>
        <h2 className="font-display text-2xl font-semibold text-ink">Education</h2>
        <div className="mt-8 flex flex-col gap-5">
          {education.map((entry) => (
            <EducationCard key={entry.id} entry={entry} />
          ))}
        </div>
      </Reveal>

      <PulseDivider />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
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
