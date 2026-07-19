import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { skills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { EducationCard } from "@/components/experience/EducationCard";
import { SkillsCloud } from "@/components/experience/SkillsCloud";
import { CertificationList } from "@/components/experience/CertificationList";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function ExperiencePage() {
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
          the education, skills, and certifications behind them.
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

      <Reveal>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Skills</h2>
          <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
            Thai &amp; English, native
          </p>
        </div>
        <div className="mt-8">
          <SkillsCloud groups={skills} />
        </div>
      </Reveal>

      <PulseDivider />

      <Reveal>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Certifications
        </h2>
        <div className="mt-8">
          <CertificationList certifications={certifications} />
        </div>
      </Reveal>
    </div>
  );
}
