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
  filterable grid of all 9 real projects (`src/data/projects.ts`), each
  with a full MDX case study (`content/projects/*.mdx`) now actually
  rendered via a dynamic `@content/*` import. The shared `ProjectDetail`
  component adds a consistent resume-oriented summary, skills-developed,
  recognition, and detailed case-study layout to every project page (see
  `src/lib/mdx.ts` and `src/mdx-components.tsx` for styled prose overrides).
- **Experience (`src/app/experience/page.tsx`, `experience/[id]/page.tsx`)** — work-history
  overview cards link to a shared `ExperienceDetail` page with responsibilities,
  skills gained, and lessons learned; education in full, plus condensed Skills/Certifications teasers that link
  out to their own pages (kept condensed deliberately — see
  `docs/content-management.md` on not duplicating full content across pages).
- **Skills (`src/app/skills/page.tsx`)** — all ~65 skills grouped by
  category, with a client-side search (`SkillsExplorer.tsx`) since the full
  list is too long to browse comfortably unfiltered.
- **Certifications (`src/app/certifications/page.tsx`)** — all 9
  certifications with issuer/date, reusing `CertificationList.tsx`.
- **Roadmap (`src/app/roadmap/page.tsx`)** — every milestone (education,
  work, projects, awards, certifications) merged in `src/data/timeline.ts`,
  newest first, and rendered by `PulseTimeline`
  (`src/components/roadmap/PulseTimeline.tsx`): a **vertical**, multi-coloured
  "git graph" (VS Code Git Graph extension-style), newest at the top,
  flowing with normal page scroll. Duration entries (`education`, `work`, and
  `project`) whose date ranges genuinely overlap branch off the main trunk into their own coloured
  lane (lane assignment is a greedy interval-colouring in
  `src/lib/timelineLanes.ts`; colour identifies the milestone type in
  `PulseTimeline.tsx`); awards and certifications are point-in-time and
  always render on the trunk. A branch only curves back into the trunk once the
  entry has actually *finished* (a real `endSortDate`) — still-ongoing
  entries (`endSortDate: null`) stay open: a straight, unmerged line running
  off the top of the graph, rather than every "Present" role curving into
  the same single point at the newest row. Branch curves are SVG paths
  computed from each card's *measured* DOM position (a `useLayoutEffect`,
  same pattern as `FilterTabs`' sliding indicator) rather than
  date-proportional math, so they stay correct regardless of card height.
  **Gotcha already hit once:** the effect that measures positions depends
  on the filtered-entries array — that array must stay memoized
  (`useMemo`), or a fresh reference every render retriggers the effect
  every render → infinite loop. The graph's trunk/fill/SVG need an
  *explicit* pixel height (measured via `scrollHeight`), not a percentage —
  percentage heights don't resolve against an auto-height flex parent. The
  EKG progress line/dot now tracks the page's scroll position against the
  trunk (anchored to a fixed viewport fraction) instead of horizontal
  scroll. There's no more inner scroll container, drag-to-pan, or
  horizontal wheel handling — the graph is part of normal page flow.
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
  glow), and `CommandPalette` (⌘K / Ctrl+K quick nav — keyboard-only now,
  no header trigger button). All motion respects `prefers-reduced-motion`.
- **Header nav (`SiteShell.tsx`)** now lists every page (Projects,
  Experience, Skills, Certifications, Roadmap) inline on `md`+ viewports.
  Below `md`, the inline nav is hidden and `MobileNav.tsx` renders a
  hamburger button that toggles a dropdown panel with the same links — the
  panel anchors to the header via `position: relative` + `top-full`, not a
  hardcoded pixel offset, so it stays correct if header height changes.

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
