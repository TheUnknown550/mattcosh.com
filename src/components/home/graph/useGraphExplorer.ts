"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPortfolioGraphNode,
  graphFocusStops,
  portfolioGraphNodes,
} from "@/data/portfolioGraph";
import { EXPLORER_START_NODE_ID, OVERVIEW_STOP } from "./constants";

export function useGraphExplorer() {
  const [isExplorer, setIsExplorer] = useState(false);
  const [isNodeFocused, setIsNodeFocused] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(
    OVERVIEW_STOP.featuredNodeId,
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const selectedNode =
    getPortfolioGraphNode(selectedNodeId) ??
    getPortfolioGraphNode(OVERVIEW_STOP.featuredNodeId)!;
  const activeStop =
    (isExplorer && isNodeFocused
      ? graphFocusStops.find(
          (stop) =>
            stop.id !== "overview" &&
            stop.nodeTypes.includes(selectedNode.type),
        )
      : undefined) ?? OVERVIEW_STOP;
  const navigationNodes = useMemo(() => {
    const allNodes = portfolioGraphNodes.filter((node) => node.type !== "core");
    const preferredNode = allNodes.find(
      (node) => node.id === EXPLORER_START_NODE_ID,
    );

    return preferredNode
      ? [
          preferredNode,
          ...allNodes.filter((node) => node.id !== preferredNode.id),
        ]
      : allNodes;
  }, []);
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

    const { body } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscrollBehavior = body.style.overscrollBehavior;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isExplorer]);

  const enterExplorer = () => {
    if (isExplorer) return;
    setSelectedNodeId(OVERVIEW_STOP.featuredNodeId);
    setIsNodeFocused(true);
    setIsExplorer(true);
  };

  const exitExplorer = () => {
    setSelectedNodeId(OVERVIEW_STOP.featuredNodeId);
    setIsNodeFocused(false);
    setIsExplorer(false);
  };

  const focusNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsNodeFocused(true);
    setIsExplorer(true);
  };

  const clearFocus = () => {
    setIsNodeFocused(false);
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

    focusNode(navigationNodes[nextIndex].id);
  };

  return {
    activeStop,
    clearFocus,
    enterExplorer,
    exitExplorer,
    isExplorer,
    isNodeFocused,
    navigationLabel: "All nodes",
    navigationNodes,
    reduceMotion,
    selectedNavigationIndex,
    selectedNode,
    selectAdjacentNode,
    focusNode,
  };
}
