import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="mx-auto max-w-6xl py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-signal">
        Open to opportunities
      </p>
      <h2 className="mt-4 font-display text-3xl font-semibold text-ink lg:text-4xl">
        Let&rsquo;s build the next system.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
        I&rsquo;m looking for software engineering roles where I can keep
        building reliable, practical systems — reach out on GitHub, or dig
        into the work below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://github.com/TheUnknown550"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-sm uppercase tracking-wide text-void transition-all duration-200 hover:scale-[1.03] hover:bg-signal active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal motion-reduce:transition-colors motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        >
          GitHub ↗
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
        <Link href="/projects" className="transition-colors hover:text-ink">
          Projects
        </Link>
        <Link href="/experience" className="transition-colors hover:text-ink">
          Experience
        </Link>
        <Link href="/roadmap" className="transition-colors hover:text-ink">
          Roadmap
        </Link>
      </div>
    </section>
  );
}
