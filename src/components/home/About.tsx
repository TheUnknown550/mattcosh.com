const FACTS = [
  { label: "Based in", value: "Chiang Mai, Thailand" },
  { label: "Studying", value: "Information Systems & Network Engineering" },
  { label: "Focus", value: "Applied AI · Full-Stack · AIoT · Networking" },
  { label: "Languages", value: "Thai, English" },
];

export function About() {
  return (
    <section className="mx-auto max-w-6xl py-24">
      <h2 className="font-display text-3xl font-semibold text-ink">About</h2>
      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
          I&rsquo;m an Information Systems and Network Engineering student at
          Chiang Mai University, working across full-stack development, IoT,
          and network engineering, with a growing focus on applied AI. My
          flagship project, CS-M, pairs custom heart-sound recording
          hardware with a neural network to flag patterns linked to heart
          disease — recognized by Microsoft Imagine Cup, Intel&rsquo;s AI
          Global Impact Festival, and Regeneron ISEF. I hold a Google
          Professional Certificate and I&rsquo;m looking for software
          engineering roles where I can keep building reliable, practical
          systems.
        </p>

        <dl className="grid shrink-0 grid-cols-1 gap-x-10 gap-y-5 rounded-lg border border-line bg-surface p-6 sm:grid-cols-2 lg:w-80 lg:grid-cols-1">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-signal">
                {fact.label}
              </dt>
              <dd className="mt-1 text-sm text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
