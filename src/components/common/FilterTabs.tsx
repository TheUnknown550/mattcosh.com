"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface FilterTabOption<T extends string> {
  value: T;
  label: string;
}

interface FilterTabsProps<T extends string> {
  options: FilterTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Pill-style filter row with a sliding highlight that glides between the
 * active option (CSS transform, no animation library).
 */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: FilterTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLButtonElement>(
      `[data-value="${value}"]`,
    );
    if (!activeEl) return;
    setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1 font-mono text-xs uppercase tracking-wide"
    >
      {indicator && (
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-full border border-signal/40 bg-signal/15 transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {options.map((option) => (
        <button
          key={option.value}
          data-value={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative z-10 rounded-full px-4 py-2 transition-colors duration-200 ${
            value === option.value ? "text-ink" : "text-ink-muted hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
