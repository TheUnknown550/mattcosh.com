import Image from "next/image";
import { experience } from "@/data/experience";
import { getFeaturedProjects } from "@/lib/projects";

/**
 * Replaces the old 3D hero geometry with a portrait treatment: ambient glow
 * blobs + sonar-style pulse rings (a nod to the same heartbeat motif as
 * PulseDivider/PulseTimeline) framing the photo, plus two data-driven
 * badges — no hardcoded achievement/role text, both read from real data.
 */
export function HeroPortrait() {
  const currentRole = experience[0];
  const [flagship] = getFeaturedProjects();
  const topRecognition = flagship?.recognitions?.[0];

  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute h-56 w-56 rounded-full bg-signal/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute h-44 w-44 translate-x-14 translate-y-8 rounded-full bg-accent/10 blur-3xl"
      />

      <span
        aria-hidden="true"
        className="animate-ring-pulse absolute h-[80%] w-[80%] rounded-full border border-signal/40"
      />
      <span
        aria-hidden="true"
        className="animate-ring-pulse absolute h-[80%] w-[80%] rounded-full border border-signal/40"
        style={{ animationDelay: "1.1s" }}
      />
      <div
        aria-hidden="true"
        className="absolute h-[80%] w-[80%] rounded-full border border-line"
      />

      <Image
        src="/img/profile.png"
        alt="Portrait of Matt Cosh"
        width={800}
        height={800}
        priority
        className="relative z-10 h-[92%] w-[92%] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
      />

      {currentRole && (
        <div className="absolute top-2 right-0 z-20 flex max-w-[13rem] items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1.5 shadow-lg backdrop-blur-sm sm:right-2">
          <span className="animate-dot-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
          <span className="truncate font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            Currently @ {currentRole.company}
          </span>
        </div>
      )}

      {topRecognition && (
        <div className="absolute bottom-4 left-0 z-20 flex max-w-[14rem] items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
          <span className="shrink-0 text-accent">★</span>
          <span className="truncate font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {topRecognition}
          </span>
        </div>
      )}
    </div>
  );
}
