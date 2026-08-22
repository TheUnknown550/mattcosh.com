import Image from "next/image";
import Link from "next/link";
import {
  type GraphFocusStop,
  type PortfolioGraphNode,
} from "@/data/portfolioGraph";
import { profile } from "@/data/profile";

function GraphDetailPanel({ node }: { node: PortfolioGraphNode }) {
  if (node.type === "core") {
    return (
      <aside className="pointer-events-auto w-full max-w-sm rounded-xl border border-line/90 bg-surface/95 p-5 shadow-2xl shadow-void/40 backdrop-blur-md">
        <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
          {profile.name}
        </h2>
        <section className="mt-5 border-t border-line pt-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            About
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            An Information Systems and Network Engineering student building
            practical AI, full-stack, IoT, and software systems that connect
            real-world problems to useful technology.
          </p>
        </section>
        <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Based in
            </dt>
            <dd className="text-right text-ink">{profile.location}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Studying
            </dt>
            <dd className="text-right text-ink">
              {profile.educationShort}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Contact
            </dt>
            <dd className="text-right text-ink">{profile.email}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-4 font-mono text-xs uppercase tracking-wide">
          <Link
            href={profile.linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="text-signal transition-colors hover:text-ink"
          >
            LinkedIn ↗
          </Link>
          <Link
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-signal transition-colors hover:text-ink"
          >
            GitHub ↗
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="pointer-events-auto w-full max-w-sm rounded-xl border border-line/90 bg-surface/95 p-5 shadow-2xl shadow-void/40 backdrop-blur-md">
      <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
        {node.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {node.description}
      </p>
      {node.href && node.actionLabel && (
        <Link
          href={node.href}
          className="group mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-signal transition-colors hover:text-ink"
        >
          {node.actionLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      )}
    </aside>
  );
}

function GraphLegend({ activeStop }: { activeStop: GraphFocusStop }) {
  return (
    <div className="pointer-events-none hidden items-center gap-3 font-mono text-[10px] uppercase tracking-wide text-ink-muted lg:flex">
      <span className="h-px w-10 bg-line" />
      <span>{activeStop.label}</span>
    </div>
  );
}

interface GraphOverlayProps {
  activeStop: GraphFocusStop;
  canExplore: boolean;
  isExplorer: boolean;
  isNodeFocused: boolean;
  navigationLabel: string;
  navigationLength: number;
  navigationPosition: number;
  node: PortfolioGraphNode;
  onEnter: () => void;
  onExit: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function GraphOverlay({
  activeStop,
  canExplore,
  isExplorer,
  isNodeFocused,
  navigationLabel,
  navigationLength,
  navigationPosition,
  node,
  onEnter,
  onExit,
  onNext,
  onPrevious,
}: GraphOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 mx-auto max-w-[96rem] px-6 lg:px-10">
      <div
        className={`absolute right-4 bottom-8 left-4 w-auto rounded-xl border border-line/70 bg-void/90 p-5 shadow-2xl shadow-void/30 backdrop-blur-sm transition-all duration-700 ease-out sm:right-auto sm:bottom-20 sm:left-6 sm:w-[min(23rem,48vw)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0 lg:top-1/2 lg:bottom-auto lg:left-10 lg:w-[min(23rem,30vw)] lg:-translate-y-1/2 ${
          isExplorer ? "-translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h1 className="font-display text-[clamp(2rem,8vw,4.5rem)] font-semibold leading-[0.96] tracking-tight text-ink sm:text-[clamp(2.25rem,4vw,4.5rem)]">
          I build systems that solve problems.
        </h1>
        <p className="mt-4 hidden max-w-md text-base leading-relaxed text-ink-muted sm:block">
          Applied AI, full-stack software, IoT, and networking.
        </p>
        <div className="pointer-events-auto mt-5 flex flex-col items-stretch gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-void transition-colors hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:px-5 sm:text-sm sm:tracking-wide"
          >
            View projects <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-void/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink backdrop-blur-sm transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:px-5 sm:text-sm sm:tracking-wide"
          >
            See the roadmap
          </Link>
        </div>
      </div>

      <div
        className={`absolute top-1/2 right-6 hidden w-[min(28rem,32vw)] -translate-y-1/2 transition-all duration-700 ease-out lg:right-10 lg:block ${
          isExplorer ? "translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="relative mx-auto aspect-square w-52 overflow-hidden rounded-full border border-ink bg-surface shadow-2xl shadow-void/40">
          <Image
            src="/img/profile.png"
            alt="Portrait of Matt Cosh"
            fill
            priority
            sizes="(min-width: 1024px) 208px, 176px"
            className="object-contain"
          />
        </div>
        <div className="mt-4 space-y-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="font-display text-lg font-semibold text-ink">
              Matt Cosh
            </p>
          </div>
          <p className="text-xs leading-relaxed text-ink">
            Software Developer | Applied AI, Full-Stack, AIoT &amp; Networking
          </p>
          <p className="text-xs leading-relaxed text-ink-muted">
            Google Professional Certificate | Imagine Cup World Runner-Up
          </p>
          <p className="text-xs text-ink-muted">
            Greater Chiang Mai Area
          </p>
        </div>
      </div>

      {isExplorer && (
        <>
          <button
            type="button"
            onClick={onExit}
            className="pointer-events-auto absolute top-6 left-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal lg:top-8 lg:left-10"
          >
            <span aria-hidden="true">←</span>
            Overview
          </button>
          <p className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-wide text-ink-muted lg:top-8 lg:right-10">
            Drag to orbit · scroll to zoom · right-drag to move
          </p>
          {isNodeFocused && (
            <div className="absolute right-6 bottom-6 left-6 flex flex-col items-start justify-between gap-5 sm:left-auto sm:w-[min(24rem,36vw)] lg:right-10 lg:bottom-8">
              <GraphDetailPanel node={node} />
              <GraphLegend activeStop={activeStop} />
            </div>
          )}
          <button
            type="button"
            onClick={onPrevious}
            className="pointer-events-auto absolute bottom-6 left-6 z-20 inline-flex h-11 items-center gap-3 rounded-md border border-line bg-void/80 px-4 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:bottom-8 lg:left-10"
            aria-label={`Previous ${navigationLabel.toLowerCase()}`}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ←
            </span>
            <span className="hidden sm:inline">Previous {navigationLabel}</span>
          </button>
          <p className="absolute bottom-9 left-1/2 z-20 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-wide text-ink-muted sm:block lg:bottom-11">
            {navigationLabel} {navigationPosition} / {navigationLength}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto absolute right-6 bottom-6 z-20 inline-flex h-11 items-center gap-3 rounded-md border border-line bg-void/80 px-4 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:right-10 lg:bottom-8"
            aria-label={`Next ${navigationLabel.toLowerCase()}`}
          >
            <span className="hidden sm:inline">Next {navigationLabel}</span>
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </button>
        </>
      )}

      {canExplore && (
        <button
          type="button"
          onClick={onEnter}
          className={`absolute right-6 bottom-8 font-mono text-[10px] uppercase tracking-wide text-ink-muted transition-opacity duration-500 hover:text-signal max-[767px]:hidden lg:right-10 ${
            isExplorer
              ? "pointer-events-none opacity-0"
              : "pointer-events-auto opacity-100"
          }`}
        >
          ← Enter graph view
        </button>
      )}
    </div>
  );
}
