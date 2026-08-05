import Link from "next/link";
import type { ExperienceEntry } from "@/types/experience";

interface ExperienceDetailProps {
  entry: ExperienceEntry;
}

/** Shared, resume-oriented detail layout for every work experience entry. */
export function ExperienceDetail({ entry }: ExperienceDetailProps) {
  const details = [
    { label: "Organisation", value: entry.company },
    { label: "Location", value: entry.location },
    { label: "Timeline", value: `${entry.startLabel} – ${entry.endLabel}` },
    { label: "Engagement", value: entry.endSortDate === null ? "Current" : "Completed" },
  ];

  return (
    <article className="mx-auto max-w-6xl py-16 lg:py-24">
      <Link
        href="/experience"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none"
        >
          ←
        </span>
        All experience
      </Link>

      <header className="mt-10 grid gap-10 border-b border-line pb-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">Professional experience</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight text-ink lg:text-6xl">
            {entry.title}
          </h1>
          <p className="mt-4 font-display text-2xl font-medium text-signal">{entry.company}</p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted lg:text-xl">
            {entry.summary}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
          {details.map((detail) => (
            <div key={detail.label} className="min-h-24 bg-surface p-4">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                {detail.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-ink">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <section aria-labelledby="experience-details-heading" className="rounded-lg border border-line bg-surface p-6 lg:p-8">
          <h2 id="experience-details-heading" className="font-display text-2xl font-semibold text-ink">
            Experience details
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            Key responsibilities and outcomes drawn from this role&apos;s LinkedIn record.
          </p>
          <ul className="mt-7 space-y-4 border-t border-line pt-6">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-ink">
                <span aria-hidden="true" className="text-accent">✦</span>
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="skills-gained-heading" className="rounded-lg border border-line p-6 lg:p-8">
          <h2 id="skills-gained-heading" className="font-display text-2xl font-semibold text-ink">
            Skills gained
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Technical, delivery, and collaboration skills developed through the role.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {entry.skillsGained.map((skill) => (
              <li key={skill} className="rounded-full border border-line bg-surface px-3 py-1.5">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="lessons-heading" className="border-t border-line pt-12">
        <div className="max-w-3xl">
          <h2 id="lessons-heading" className="font-display text-3xl font-semibold text-ink">
            What I learned
          </h2>
          <ul className="mt-7 space-y-5">
            {entry.whatILearned.map((lesson) => (
              <li key={lesson} className="border-l-2 border-signal pl-5 text-lg leading-relaxed text-ink-muted">
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
