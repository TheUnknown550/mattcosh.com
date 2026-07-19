import Link from "next/link";
import { HeroPortrait } from "@/components/home/HeroPortrait";
import { experience } from "@/data/experience";

export function Hero() {
  const currentRole = experience[0];

  return (
    <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-28">
      <div className="max-w-xl">
        <p className="animate-hero-1 font-mono text-xs uppercase tracking-wide text-signal">
          Software developer — Chiang Mai, Thailand
        </p>
        <h1 className="animate-hero-1 mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
          I turn signals into systems.
        </h1>
        <p className="animate-hero-2 mt-6 max-w-md text-lg text-ink-muted">
          Matt Cosh — building CS-M, an award-winning AI cardiac monitoring
          system, alongside full-stack, IoT, and networking projects. Currently
          shipping production features and taking on freelance work while
          finishing a degree in Information Systems and Network Engineering.
        </p>

        <div className="animate-hero-3 mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-sm uppercase tracking-wide text-void transition-all duration-200 hover:scale-[1.03] hover:bg-signal active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal motion-reduce:transition-colors motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
          >
            View projects
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-md border border-line px-6 py-3 font-mono text-sm uppercase tracking-wide text-ink transition-all duration-200 hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            See the roadmap
          </Link>
        </div>

        {currentRole && (
          <p className="animate-hero-3 mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
            <span className="animate-dot-pulse h-1.5 w-1.5 rounded-full bg-signal" />
            Currently: {currentRole.title} @ {currentRole.company}
          </p>
        )}
      </div>

      <div className="animate-hero-4 w-full max-w-sm shrink-0">
        <HeroPortrait />
      </div>
    </section>
  );
}
