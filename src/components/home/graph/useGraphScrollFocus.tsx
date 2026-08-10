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

const HOME_SNAP_SELECTOR = "[data-home-snap]";
const HOME_SNAP_DURATION = 950;
const HOME_SNAP_COOLDOWN = 320;

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
    const root = document.documentElement;
    const previousScrollSnapType = root.style.scrollSnapType;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.dataset.scrollSnap = "home";
    root.style.scrollSnapType = "none";
    root.style.scrollBehavior = "auto";

    return () => {
      delete root.dataset.scrollSnap;
      root.style.scrollSnapType = previousScrollSnapType;
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let isAnimating = false;
    let cooldownUntil = 0;
    let touchStartY: number | null = null;

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;

      return Boolean(
        target.closest("input, textarea, select, button, [contenteditable=\"true\"]"),
      );
    };

    const getDocumentTop = (element: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = element;

      while (current) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }

      return top;
    };

    const getSnapTargets = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(HOME_SNAP_SELECTOR),
      ).map((element) => {
        const header = document.querySelector<HTMLElement>("header");
        const headerHeight = header?.offsetHeight ?? 77;
        return Math.max(0, getDocumentTop(element) - headerHeight);
      });

    const getCurrentIndex = (targets: number[]) => {
      const scrollPosition = window.scrollY + 24;
      let currentIndex = 0;

      targets.forEach((target, index) => {
        if (target <= scrollPosition) currentIndex = index;
      });

      return currentIndex;
    };

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const animateTo = (target: number) => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const start = window.scrollY;
      const destination = Math.min(maxScroll, Math.max(0, target));

      if (Math.abs(destination - start) < 2) return;

      if (reduceMotion) {
        window.scrollTo(0, destination);
        cooldownUntil = performance.now() + HOME_SNAP_COOLDOWN;
        return;
      }

      isAnimating = true;
      const startedAt = performance.now();

      const frame = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / HOME_SNAP_DURATION);
        const easedProgress = easeInOut(progress);
        window.scrollTo(
          0,
          start + (destination - start) * easedProgress,
        );

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(frame);
          return;
        }

        isAnimating = false;
        cooldownUntil = performance.now() + HOME_SNAP_COOLDOWN;
        window.scrollTo(0, destination);
      };

      animationFrame = window.requestAnimationFrame(frame);
    };

    const navigate = (direction: 1 | -1) => {
      if (isAnimating || performance.now() < cooldownUntil) return false;

      const targets = getSnapTargets();
      if (targets.length < 2) return false;

      const currentIndex = getCurrentIndex(targets);
      const nextIndex = currentIndex + direction;
      const destination = targets[nextIndex];

      if (destination === undefined) return false;

      animateTo(destination);
      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || isEditableTarget(event.target)) return;

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (direction === 0) return;

      if (isAnimating || performance.now() < cooldownUntil) {
        event.preventDefault();
        return;
      }

      if (navigate(direction)) event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const direction =
        event.key === "ArrowDown" || event.key === "PageDown"
          ? 1
          : event.key === "ArrowUp" || event.key === "PageUp"
            ? -1
            : 0;

      if (direction === 0) return;
      if (navigate(direction)) event.preventDefault();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY !== null && event.touches.length === 1) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;

      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - endY;
      touchStartY = null;

      if (Math.abs(deltaY) < 32 || isEditableTarget(event.target)) return;

      const direction = deltaY > 0 ? 1 : -1;
      navigate(direction);
    };

    const handleTouchCancel = () => {
      touchStartY = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [reduceMotion]);

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
