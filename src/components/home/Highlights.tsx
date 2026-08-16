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
      className="flex min-h-[calc(100svh-77px)] w-full flex-col justify-start px-4 pt-8 pb-20 sm:px-6 sm:pt-12 sm:pb-24 md:px-[5vw]"
    >
      <div className="relative z-10 rounded-xl border border-line/70 bg-void/90 p-4 shadow-2xl shadow-void/20 backdrop-blur-sm sm:border-transparent sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0">
        <StatRow stats={stats} />
        <Link
          href="/roadmap"
          className="group mt-9 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:text-signal sm:mt-4 sm:text-sm sm:tracking-wide"
        >
          See the full roadmap
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
