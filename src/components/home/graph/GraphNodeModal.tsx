"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  GRAPH_NODE_COLORS,
  type PortfolioGraphNode,
} from "@/data/portfolioGraph";
import { useBodyScrollLock } from "@/lib/scrollLock";
import { useDialogFocusTrap } from "@/lib/focusTrap";

export function GraphNodeModal({
  node,
  onClose,
}: {
  node: PortfolioGraphNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useBodyScrollLock(true, "graph-node-modal");
  useDialogFocusTrap({
    containerRef: dialogRef,
    initialFocusRef: closeButton,
    open: true,
  });

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[70] flex items-center justify-center px-6 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graph-node-modal-title"
    >
      <button
        type="button"
        aria-label="Close node details"
        className="animate-palette-in absolute inset-0 cursor-default bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <article className="animate-node-pop relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)]">
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{ backgroundColor: GRAPH_NODE_COLORS[node.type] }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                {node.eyebrow}
              </p>
              <h2
                id="graph-node-modal-title"
                className="mt-2 font-display text-3xl font-semibold leading-tight text-ink"
              >
                {node.title}
              </h2>
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line font-mono text-lg text-ink-muted transition-colors hover:border-signal hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              aria-label="Close node details"
            >
              ×
            </button>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            {node.description}
          </p>
          {node.href && node.actionLabel && (
            <Link
              href={node.href}
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-signal transition-colors hover:text-ink"
            >
              {node.actionLabel}
              <span aria-hidden="true">→</span>
            </Link>
          )}
          <p className="mt-8 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Press escape or select close to return to the graph
          </p>
        </div>
      </article>
    </div>
  );
}
