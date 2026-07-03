import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx (App Router convention). Custom component overrides
 * for MDX content (e.g. styled headings, custom <a>/<img>) can be added here
 * once the visual design phase begins.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
