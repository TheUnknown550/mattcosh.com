export function About() {
  return (
    <section className="mx-auto max-w-6xl py-24">
      <h2 className="font-display text-3xl font-semibold text-ink">About</h2>
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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
        <ul className="flex shrink-0 flex-wrap gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-wide text-ink-muted lg:flex-col lg:text-right">
          <li>Applied AI</li>
          <li>Full-Stack</li>
          <li>AIoT</li>
          <li>Networking</li>
        </ul>
      </div>
    </section>
  );
}
