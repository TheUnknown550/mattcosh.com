# Development Notes

## Current stage: landing page designed, project pages still basic

The landing page (`src/app/page.tsx`) now has a real visual design and real
content, sourced from `content/linkedin-exports/`:

- Dark theme (`--color-void` background, `--color-signal` teal +
  `--color-accent` orange dual accent), `Space Grotesk` / `IBM Plex Sans` /
  `IBM Plex Mono` type system — see `src/app/globals.css`.
- Hero, About, Testimonial, and a flagship-project spotlight
  (`src/components/home/*`), separated by a heartbeat/EKG-trace divider
  (`src/components/common/PulseDivider.tsx`) — a nod to CS-M, the cardiac
  monitoring flagship project.
- The 3D hero object (`src/components/three/HeroGeometry.tsx`) rotates and
  pulses on a heartbeat-like cadence; both stop under
  `prefers-reduced-motion`.
- Real project data: `src/data/projects.ts` currently holds one real entry
  (CS-M) with a `recognitions` field for awards/press.

`/projects` and `/projects/[slug]` are still intentionally basic (no final
styling) — only their text colors were updated so they stay legible against
the new dark body background.

Not yet implemented:

- Final styling for `/projects` and `/projects/[slug]`.
- Full MDX rendering on the project detail page (currently a placeholder
  notice; see `src/lib/mdx.ts` and `src/app/projects/[slug]/page.tsx`).
- Additional real projects beyond CS-M.
- Contact form, backend, database, CMS, or authentication — none of these
  are planned for this project; it is a static, local-content site.

## Future possible upgrades (not scheduled)

- Wire up real MDX rendering via `@next/mdx`'s dynamic import of
  `content/projects/<slug>.mdx` (path alias `@content/*` is already
  configured in `tsconfig.json` for this).
- Design `/projects` and `/projects/[slug]` to match the landing page.
- Add a resume download link once `public/resume/resume.pdf` exists.
- Add real 3D models under `public/models/` and wire `ModelViewer` into
  project detail pages.
