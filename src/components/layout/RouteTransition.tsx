"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface RouteTransitionProps {
  children: ReactNode;
}

type TransitionKind = "projects" | "default";

/**
 * Keeps route changes feeling like a handoff between connected systems. The
 * overlay is intentionally brief; page-specific entrance classes do the
 * longer follow-through once the destination has mounted.
 */
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const initialMount = useRef(true);
  const [transition, setTransition] = useState<TransitionKind | null>(
    pathname === "/projects" ? "projects" : null,
  );

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      if (!transition) return;

      const timeout = window.setTimeout(() => setTransition(null), 820);
      return () => window.clearTimeout(timeout);
    }

    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    setTransition(pathname === "/projects" ? "projects" : "default");

    const timeout = window.setTimeout(() => setTransition(null), 820);
    return () => window.clearTimeout(timeout);
  }, [pathname, transition]);

  return (
    <div className="relative">
      <div
        className={`route-transition__content ${
          pathname === "/projects" ? "route-transition__content--projects" : ""
        }`}
      >
        {children}
      </div>

      {transition && (
        <div
          aria-hidden="true"
          className={`route-transition__overlay route-transition__overlay--${transition}`}
        >
          <div className="route-transition__panel route-transition__panel--left" />
          <div className="route-transition__panel route-transition__panel--right" />
          <div className="route-transition__signal">
            <span className="route-transition__signal-core" />
            <span className="route-transition__signal-line" />
          </div>
        </div>
      )}
    </div>
  );
}
