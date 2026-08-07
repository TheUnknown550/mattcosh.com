"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getPortfolioGraphNode,
  graphFocusStops,
  type GraphFocusStop,
} from "@/data/portfolioGraph";

export interface GraphScrollFocus {
  fromNodeId?: string;
  toNodeId?: string;
  progress: number;
  activeStop: GraphFocusStop;
  reduceMotion: boolean;
  sectionProgressByKey: Record<string, number>;
}

const INITIAL_FOCUS: GraphScrollFocus = {
  progress: 0,
  activeStop: graphFocusStops[0],
  reduceMotion: false,
  sectionProgressByKey: {},
};

const GraphScrollFocusContext = createContext<GraphScrollFocus>(INITIAL_FOCUS);

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getFocusStop(nodeId?: string) {
  const node = nodeId ? getPortfolioGraphNode(nodeId) : undefined;
  if (!node) return graphFocusStops[0];

  return (
    graphFocusStops.find(
      (stop) => stop.id !== "overview" && stop.nodeTypes.includes(node.type),
    ) ?? graphFocusStops[0]
  );
}

function useGraphScrollFocusState() {
  const [focus, setFocus] = useState<GraphScrollFocus>(INITIAL_FOCUS);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-graph-focus-node]"),
      );
      if (sections.length === 0) return;

      const focusLine = window.innerHeight * 0.56;
      const focusSpread = window.innerHeight * 0.72;
      const sectionProgressByKey: Record<string, number> = {};
      const progressValues = sections.map((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const progress = clamp(
          1 - Math.abs(sectionCenter - focusLine) / focusSpread,
        );
        const key =
          section.dataset.graphFocusKey ??
          section.dataset.graphFocusNode ??
          "section";
        sectionProgressByKey[key] = progress;
        return progress;
      });

      const activeIndex = progressValues.reduce(
        (bestIndex, progress, index) =>
          progress > progressValues[bestIndex] ? index : bestIndex,
        0,
      );
      const currentProgress = progressValues[activeIndex];
      const toNodeId =
        currentProgress > 0.01
          ? sections[activeIndex].dataset.graphFocusNode
          : undefined;

      setFocus({
        fromNodeId: undefined,
        toNodeId,
        progress: currentProgress,
        activeStop: getFocusStop(toNodeId),
        reduceMotion,
        sectionProgressByKey,
      });
    };

    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return focus;
}

export function GraphScrollFocusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const focus = useGraphScrollFocusState();
  return (
    <GraphScrollFocusContext.Provider value={focus}>
      {children}
    </GraphScrollFocusContext.Provider>
  );
}

export function useGraphScrollFocus() {
  return useContext(GraphScrollFocusContext);
}
