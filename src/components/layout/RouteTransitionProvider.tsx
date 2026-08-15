"use client";

import {
  createContext,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type GraphRouteKey =
  | "overview"
  | "projects"
  | "experience"
  | "skills"
  | "certifications";

type RouteTransitionPhase = "leaving" | "entering";

type RouteTransition = {
  destinationPath: string;
  phase: RouteTransitionPhase;
};

type RouteTransitionContextValue = {
  transition: RouteTransition | null;
  navigate: (href: string) => void;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const ROUTE_TRAVEL_DURATION = 440;
const ROUTE_ARRIVAL_DURATION = 560;

export function getGraphRouteForPath(pathname: string): GraphRouteKey | null {
  if (pathname === "/") return "overview";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/experience")) return "experience";
  if (pathname.startsWith("/skills")) return "skills";
  if (pathname.startsWith("/certifications")) return "certifications";
  if (pathname.startsWith("/roadmap")) return "overview";

  return null;
}

function isEligibleNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    anchor.target ||
    anchor.hasAttribute("download") ||
    anchor.dataset.routeTransition === "false"
  ) {
    return false;
  }

  return true;
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [transition, setTransition] = useState<RouteTransition | null>(null);
  const travelTimer = useRef<number | null>(null);

  const navigate = useCallback(
    (href: string) => {
      const destination = new URL(href, window.location.href);
      const destinationPath = destination.pathname;
      const destinationGraphRoute = getGraphRouteForPath(destinationPath);

      if (!destinationGraphRoute || destinationPath === pathname) {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
        return;
      }

      if (transition) return;

      setTransition({ destinationPath, phase: "leaving" });
      travelTimer.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, ROUTE_TRAVEL_DURATION);
    },
    [pathname, router, transition],
  );

  useEffect(() => {
    const interceptNavigation = (event: MouseEvent) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;

      const anchor = origin.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !isEligibleNavigation(event, anchor)) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        !getGraphRouteForPath(destination.pathname) ||
        destination.pathname === pathname
      ) {
        return;
      }

      event.preventDefault();
      navigate(`${destination.pathname}${destination.search}${destination.hash}`);
    };

    document.addEventListener("click", interceptNavigation, true);
    return () => document.removeEventListener("click", interceptNavigation, true);
  }, [navigate, pathname]);

  useEffect(() => {
    if (!transition || transition.destinationPath !== pathname) return;

    if (transition.phase === "leaving") {
      const frame = window.requestAnimationFrame(() => {
        setTransition((current) =>
          current && current.destinationPath === pathname
            ? { ...current, phase: "entering" }
            : current,
        );
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const arrivalTimer = window.setTimeout(() => setTransition(null), ROUTE_ARRIVAL_DURATION);
    return () => window.clearTimeout(arrivalTimer);
  }, [pathname, transition]);

  useEffect(
    () => () => {
      if (travelTimer.current !== null) window.clearTimeout(travelTimer.current);
    },
    [],
  );

  return (
    <RouteTransitionContext.Provider value={{ transition, navigate }}>
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error("useRouteTransition must be used inside RouteTransitionProvider.");
  }

  return context;
}

export function RouteContentFrame({ children }: { children: ReactNode }) {
  const { transition } = useRouteTransition();
  const isLeaving = transition?.phase === "leaving";
  const isEntering = transition?.phase === "entering";
  const frameStyle: CSSProperties | undefined = isLeaving
    ? {
        opacity: 0,
        pointerEvents: "none",
        transform: "translate3d(0, 1.25rem, 0) scale(0.985)",
        transition:
          "opacity 340ms cubic-bezier(0.4, 0, 1, 1), transform 420ms cubic-bezier(0.4, 0, 1, 1)",
      }
    : isEntering
      ? {
          animation: "fade-in-up 560ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }
      : undefined;

  return (
    <div
      className="route-content-frame flex min-h-0 flex-1 flex-col origin-top"
      data-route-transition-state={transition?.phase ?? "idle"}
      aria-busy={transition?.phase === "leaving" || undefined}
      style={frameStyle}
    >
      {children}
    </div>
  );
}

export function useRouteTransitionLink(href: string) {
  const { navigate } = useRouteTransition();

  return useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!isEligibleNavigation(event.nativeEvent, event.currentTarget)) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || !getGraphRouteForPath(destination.pathname)) {
        return;
      }

      event.preventDefault();
      navigate(href);
    },
    [href, navigate],
  );
}
