import Link from "next/link";
import { StatRow } from "@/components/home/StatRow";
import { projects } from "@/data/projects";
import { honors } from "@/data/honors";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

export function Highlights() {
  const earliestYear =
    Number(education[education.length - 1]?.sortDate.slice(0, 4)) || 2021;
  const years = new Date().getFullYear() - earliestYear + 1;

  const stats = [
    { value: projects.length, label: "Projects shipped" },
    { value: honors.length, label: "Awards & honors" },
    { value: experience.length, label: "Roles & internships" },
    { value: years, label: "Years building" },
  ];

  return (
    <section
      data-graph-focus-node="core-matt-cosh"
      data-graph-focus-key="highlights"
      className="mx-auto max-w-6xl py-24"
    >
      <StatRow stats={stats} />
      <Link
        href="/roadmap"
        className="group mt-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        See the full roadmap
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </section>
  );
}
