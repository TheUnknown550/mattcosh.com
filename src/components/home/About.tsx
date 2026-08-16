import { profile } from "@/data/profile";

const FACTS = [
  { label: "Studying", value: profile.degree },
  { label: "Focus", value: profile.focus },
  { label: "Languages", value: profile.languages },
];

export function About() {
  return (
    <section
      data-graph-focus-node="core-matt-cosh"
      data-graph-focus-key="about"
      className="about-stage relative mx-auto w-full max-w-[90rem] px-0 py-24 max-sm:py-10 lg:py-28"
    >
      <div className="about-stage__backdrop" aria-hidden="true" />

      <div className="about-stage__reveal">
        <h2 className="about-stage__title font-display text-3xl font-semibold text-ink">
          About
        </h2>
        <div className="about-stage__content mt-8 flex flex-col gap-10 max-sm:mt-5 max-sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="about-stage__copy max-w-xl md:max-lg:rounded-r-xl md:max-lg:bg-gradient-to-r md:max-lg:from-void/95 md:max-lg:via-void/80 md:max-lg:to-void/55 md:max-lg:p-4">
            <p className="text-lg leading-relaxed text-ink max-sm:text-base max-sm:leading-snug lg:text-xl">
              I&rsquo;m an Information Systems &amp; Network Engineering student at
              Chiang Mai University. I build across full-stack software, IoT,
              networking, and applied AI, with a focus on turning complex
              problems into practical tools. My flagship project, CS-M, combines
              custom heart-sound hardware with a neural network to identify
              patterns associated with heart disease — recognized by Microsoft
              Imagine Cup, Intel&rsquo;s AI Global Impact Festival, and Regeneron ISEF.
              I&rsquo;m looking for software engineering opportunities where I can keep
              building reliable systems that make a difference.
            </p>
          </div>

          <dl className="about-stage__facts grid shrink-0 grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-line bg-surface p-8 max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-4 max-sm:p-4 sm:grid-cols-2 lg:w-96 lg:grid-cols-1">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-signal">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-base text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
