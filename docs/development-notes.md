# Development Notes

## Current stage: six real pages, data-driven from LinkedIn exports

The site now has a real visual design and real content across all six
pages, sourced from `content/linkedin-exports/`:

- **Landing (`src/app/page.tsx`)** — Hero (with a portrait treatment —
  `public/img/profile.png` framed by ambient glow + sonar pulse rings and
  two data-driven badges, see `HeroPortrait.tsx`), About (bio + a quick-facts
  panel), Highlights (animated stat row + roadmap teaser), Testimonial, a
  flagship-project spotlight, and a closing CTA (`src/components/home/*`),
  separated by a heartbeat/EKG-trace divider
  (`src/components/common/PulseDivider.tsx`) — a nod to CS-M, the cardiac
  monitoring flagship project.
- **Projects (`src/app/projects/page.tsx`, `[slug]/page.tsx`)** — a
  filterable grid of all 7 real projects (`src/data/projects.ts`), each
  with a full MDX case study (`content/projects/*.mdx`) now actually
  rendered via a dynamic `@content/*` import (see `src/lib/mdx.ts` and
  `src/mdx-components.tsx` for the styled component overrides).
- **Experience (`src/app/experience/page.tsx`)** — work history and
  education in full, plus condensed Skills/Certifications teasers that link
  out to their own pages (kept condensed deliberately — see
  `docs/content-management.md` on not duplicating full content across pages).
- **Skills (`src/app/skills/page.tsx`)** — all ~65 skills grouped by
  category, with a client-side search (`SkillsExplorer.tsx`) since the full
  list is too long to browse comfortably unfiltered.
- **Certifications (`src/app/certifications/page.tsx`)** — all 9
  certifications with issuer/date, reusing `CertificationList.tsx`.
- **Roadmap (`src/app/roadmap/page.tsx`)** — every milestone (education,
  work, projects, awards, certifications) merged chronologically in
  `src/data/timeline.ts` and rendered by `PulseTimeline`
  (`src/components/roadmap/PulseTimeline.tsx`): a vertical line that draws
  itself as the page scrolls, with a traveling pulse dot and type-filterable
  milestone cards.
- Dark theme (`--color-void` background, `--color-signal` teal +
  `--color-accent` orange dual accent), `Space Grotesk` / `IBM Plex Sans` /
  `IBM Plex Mono` type system — see `src/app/globals.css`.
- The Hero no longer uses a 3D object (`HeroGeometry`/`HeroScene` were
  removed once the portrait replaced them) — `src/components/three/*`
  (`SceneCanvas`, `ModelViewer`, `ThreePlaceholder`) remains as documented,
  reusable infra for a future project-detail 3D model viewer, per
  `docs/3d-assets.md`.
- Shared interactive primitives, all hand-rolled (no animation library):
  `FilterTabs` (sliding pill indicator), `TiltCard` (cursor-tracked tilt +
  glow), and `CommandPalette` (⌘K / Ctrl+K quick nav, opened via keyboard or
  the header's `CommandPaletteTrigger` button). All motion respects
  `prefers-reduced-motion`.
- Skills and Certifications are deliberately *not* in the header nav
  (`SiteShell.tsx`) — the header has no mobile-collapse mechanism yet, and
  6 top-level links would overflow on narrow viewports. They're reachable
  via the Experience page's teasers, cross-links between the two pages, and
  the command palette. Revisit this once the header gets a mobile nav.

Not yet implemented:

- Cover images / 3D models for individual projects (`coverImage`,
  `modelPath` on `Project` are still unused). The Hero's portrait
  (`public/img/profile.png`) is the only real image asset in use so far.
- A resume download link (`public/resume/resume.pdf` doesn't exist yet).
- Contact form, backend, database, CMS, or authentication — none of these
  are planned for this project; it is a static, local-content site.

## Future possible upgrades (not scheduled)

- Add real cover images/3D models under `public/projects/` and
  `public/models/`, wiring `ModelViewer` into project detail pages.
- Add a resume download link once `public/resume/resume.pdf` exists.
- Revisit `PulseTimeline`'s scroll-progress calculation if the page layout
  changes significantly (it anchors to a fixed viewport fraction, not
  scroll-linked CSS animation-timeline, for broader browser support).
