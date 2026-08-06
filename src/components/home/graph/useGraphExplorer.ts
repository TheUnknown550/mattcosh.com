"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPortfolioGraphNode,
  graphFocusStops,
  portfolioGraphNodes,
} from "@/data/portfolioGraph";
import {
  EXPLORER_START_NODE_ID,
  GRAPH_TYPE_LABELS,
  OVERVIEW_STOP,
} from "./constants";

export function useGraphExplorer() {
  const [isExplorer, setIsExplorer] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(
    OVERVIEW_STOP.featuredNodeId,
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const selectedNode =
    getPortfolioGraphNode(selectedNodeId) ??
    getPortfolioGraphNode(OVERVIEW_STOP.featuredNodeId)!;
  const activeStop =
    (isExplorer
      ? graphFocusStops.find(
          (stop) =>
            stop.id !== "overview" &&
            stop.nodeTypes.includes(selectedNode.type),
        )
      : undefined) ?? OVERVIEW_STOP;
  const navigationNodes = useMemo(
    () =>
      selectedNode.type === "core"
        ? portfolioGraphNodes.filter((node) => node.type !== "core")
        : portfolioGraphNodes.filter((node) => node.type === selectedNode.type),
    [selectedNode.type],
  );
  const selectedNavigationIndex = navigationNodes.findIndex(
    (node) => node.id === selectedNode.id,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isExplorer) return;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isExplorer]);

  const enterExplorer = () => {
    if (isExplorer) return;
    setSelectedNodeId(EXPLORER_START_NODE_ID);
    setIsExplorer(true);
  };

  const exitExplorer = () => {
    setSelectedNodeId(OVERVIEW_STOP.featuredNodeId);
    setIsExplorer(false);
  };

  const selectAdjacentNode = (direction: -1 | 1) => {
    const currentIndex =
      selectedNavigationIndex >= 0
        ? selectedNavigationIndex
        : direction > 0
          ? -1
          : 0;
    const nextIndex =
      (currentIndex + direction + navigationNodes.length) %
      navigationNodes.length;

    setSelectedNodeId(navigationNodes[nextIndex].id);
    setIsExplorer(true);
  };

  return {
    activeStop,
    enterExplorer,
    exitExplorer,
    isExplorer,
    navigationLabel: GRAPH_TYPE_LABELS[selectedNode.type],
    navigationNodes,
    reduceMotion,
    selectedNavigationIndex,
    selectedNode,
    selectAdjacentNode,
    setSelectedNodeId,
  };
}
