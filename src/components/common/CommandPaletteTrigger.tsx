"use client";

/**
 * Visible ⌘K hint in the header. Dispatches a DOM event rather than lifting
 * CommandPalette's open state up, so CommandPalette can stay self-contained.
 */
export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      aria-label="Open quick navigation"
      className="hidden items-center gap-1 rounded-md border border-line px-2.5 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-signal hover:text-ink sm:flex"
    >
      <span aria-hidden="true">⌘</span>K
    </button>
  );
}
