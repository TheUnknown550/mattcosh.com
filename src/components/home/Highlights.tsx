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
      data-graph-focus-stop="overview"
      data-graph-focus-key="highlights"
      className="flex min-h-[calc(100svh-77px)] w-full flex-col justify-start px-6 pt-12 pb-24 md:px-[5vw]"
    >
      <StatRow stats={stats} />
      <Link
        href="/roadmap"
        className="group mt-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:text-signal"
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
