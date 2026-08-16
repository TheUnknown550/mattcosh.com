"use client";

import { useEffect } from "react";

const activeLocks = new Set<string>();
let previousOverflow = "";
let previousOverscrollBehavior = "";

function acquireBodyScrollLock(key: string) {
  if (activeLocks.size === 0) {
    previousOverflow = document.body.style.overflow;
    previousOverscrollBehavior = document.body.style.overscrollBehavior;
  }

  activeLocks.add(key);
  document.body.style.overflow = "hidden";
  document.body.style.overscrollBehavior = "none";
}

function releaseBodyScrollLock(key: string) {
  activeLocks.delete(key);
  if (activeLocks.size > 0) return;

  document.body.style.overflow = previousOverflow;
  document.body.style.overscrollBehavior = previousOverscrollBehavior;
}

/** Coordinates body scroll locking when multiple dialogs can overlap. */
export function useBodyScrollLock(locked: boolean, key: string) {
  useEffect(() => {
    if (!locked) return;

    acquireBodyScrollLock(key);
    return () => releaseBodyScrollLock(key);
  }, [key, locked]);
}
