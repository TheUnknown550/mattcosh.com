import Link from "next/link";
import { profile } from "@/data/profile";

export function ClosingCTA() {
  return (
    <section
      data-graph-focus-node="core-matt-cosh"
      data-graph-focus-key="closing"
      className="relative z-10 mx-auto w-full max-w-[90rem] py-24 text-center lg:py-32"
    >
      <div className="relative z-10 -translate-y-32 sm:-translate-y-24 lg:-translate-y-28">
      <p className="font-mono text-xs uppercase tracking-wide text-signal">
        Open to opportunities
      </p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
        Let&rsquo;s build systems that matter.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-xl text-ink-muted">
        I&rsquo;m looking for software engineering opportunities where I can build
        reliable systems across software, AI, IoT, and networking. Reach out on
        GitHub or LinkedIn, or explore the work below.
      </p>

      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-sm uppercase tracking-wide text-void transition-all duration-200 hover:scale-[1.03] hover:bg-signal active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal motion-reduce:transition-colors motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        >
          GitHub ↗
        </a>
        <a
          href={profile.linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-6 py-3 font-mono text-sm uppercase tracking-wide text-ink transition-all duration-200 hover:scale-[1.03] hover:border-signal hover:bg-signal/10 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal motion-reduce:transition-colors motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
        >
          LinkedIn &#x2197;
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
