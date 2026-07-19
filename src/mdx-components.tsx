import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx (App Router convention). Styles case-study prose to
 * match the site's design system without pulling in @tailwindcss/typography.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-12 font-display text-2xl font-semibold text-ink first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-8 font-display text-xl font-semibold text-ink" {...props} />
    ),
    p: (props) => (
      <p className="mt-4 text-base leading-relaxed text-ink-muted" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink-muted marker:text-signal"
        {...props}
      />
    ),
    li: (props) => <li className="pl-1" {...props} />,
    a: (props) => (
      <a
        className="text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:text-accent"
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    ),
    strong: (props) => <strong className="font-semibold text-ink" {...props} />,
    ...components,
  };
}
