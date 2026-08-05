import Link from "next/link";
import { skills } from "@/data/skills";
import { SkillsExplorer } from "@/components/skills/SkillsExplorer";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-5xl py-8 lg:py-12">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Skills
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Everything from applied AI and computer vision to network
          engineering and technical leadership — search to filter, or browse
          by category.
        </p>
      </Reveal>

      <PulseDivider />

      <Reveal className="mt-6">
        <SkillsExplorer groups={skills} />
      </Reveal>

      <p className="mt-16 font-mono text-xs uppercase tracking-wide text-ink-muted">
        <Link href="/certifications" className="transition-colors hover:text-ink">
          View certifications →
        </Link>
      </p>
    </div>
  );
}
