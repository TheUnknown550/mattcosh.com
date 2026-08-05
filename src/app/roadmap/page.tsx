import { timeline } from "@/data/timeline";
import { PulseTimeline } from "@/components/roadmap/PulseTimeline";
import { PulseDivider } from "@/components/common/PulseDivider";
import { Reveal } from "@/components/common/Reveal";

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-6xl py-8 lg:py-12">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold text-ink lg:text-5xl">
          Roadmap
        </h1>
      </Reveal>

      <PulseDivider />

      <div className="mt-6">
        <PulseTimeline entries={timeline} />
      </div>
    </div>
  );
}
