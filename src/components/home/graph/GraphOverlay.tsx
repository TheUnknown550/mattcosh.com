import Image from "next/image";
import Link from "next/link";
import {
  GRAPH_NODE_COLORS,
  type GraphFocusStop,
  type PortfolioGraphNode,
} from "@/data/portfolioGraph";

function GraphDetailPanel({ node }: { node: PortfolioGraphNode }) {
  if (node.type === "core") {
    return (
      <aside className="pointer-events-auto w-full max-w-sm rounded-xl border border-line/90 bg-surface/95 p-5 shadow-2xl shadow-void/40 backdrop-blur-md">
        <p className="font-mono text-[11px] uppercase tracking-wide text-signal">
          Portfolio core
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
          Matt Tanthai Cosh
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
            <dd className="text-right text-ink">Chiang Mai, Thailand</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Studying
            </dt>
            <dd className="text-right text-ink">
              ISNE · Chiang Mai University
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
              Contact
            </dt>
            <dd className="text-right text-ink">mattcosh06@gmail.com</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-4 font-mono text-xs uppercase tracking-wide">
          <Link
            href="https://www.linkedin.com/in/matt-cosh"
            target="_blank"
            rel="noreferrer"
            className="text-signal transition-colors hover:text-ink"
          >
            LinkedIn ↗
          </Link>
          <Link
            href="https://github.com/TheUnknown550"
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
      <p
        className="font-mono text-[11px] uppercase tracking-wide"
        style={{ color: GRAPH_NODE_COLORS[node.type] }}
      >
        {node.eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
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
        className={`absolute right-6 bottom-20 left-6 w-auto transition-all duration-700 ease-out sm:right-auto sm:w-[min(23rem,48vw)] lg:top-1/2 lg:bottom-auto lg:left-10 lg:w-[min(23rem,30vw)] lg:-translate-y-1/2 ${
          isExplorer ? "-translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-wide text-signal">
          Software developer — Chiang Mai, Thailand
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.35rem,4.6vw,5.25rem)] font-semibold leading-[0.98] tracking-tight text-ink">
          I turn signals into systems.
        </h1>
        <p className="mt-6 hidden max-w-md text-base leading-relaxed text-ink-muted sm:block sm:text-lg">
          Explore the connected work behind my experience in applied AI,
          full-stack software, IoT, research, and network engineering.
        </p>
        <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-sm uppercase tracking-wide text-void transition-colors hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            View projects <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-void/70 px-5 py-3 font-mono text-sm uppercase tracking-wide text-ink backdrop-blur-sm transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            See the roadmap
          </Link>
        </div>
      </div>

      <div
        className={`absolute top-1/2 right-6 hidden w-36 -translate-y-1/2 transition-all duration-700 ease-out lg:right-10 lg:block lg:w-52 ${
          isExplorer ? "translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="relative aspect-square overflow-hidden rounded-full border border-ink bg-surface shadow-2xl shadow-void/40">
          <Image
            src="/img/profile.png"
            alt="Portrait of Matt Cosh"
            fill
            priority
            sizes="(min-width: 1024px) 208px, 176px"
            className="object-contain"
          />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wide text-ink-muted">
          Building systems that connect
        </p>
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

      <button
        type="button"
        onClick={onEnter}
        className={`absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-wide text-ink-muted transition-opacity duration-500 hover:text-signal lg:left-10 ${
          isExplorer
            ? "pointer-events-none opacity-0"
            : "pointer-events-auto opacity-100"
        }`}
      >
        Enter graph view →
      </button>
    </div>
  );
}
