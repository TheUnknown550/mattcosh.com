import { timeline } from "@/data/timeline";
import { PulseTimeline } from "@/components/roadmap/PulseTimeline";
import { Reveal } from "@/components/common/Reveal";

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl py-16 lg:py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-wide text-signal">
          The whole story
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink lg:text-5xl">
          Roadmap
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          Every milestone in one chronological feed — school, work, projects,
          awards, and certifications. Scroll to trace the pulse from 2021 to
          now.
        </p>
      </Reveal>

      <div className="mt-12">
        <PulseTimeline entries={timeline} />
      </div>
    </div>
  );
}
