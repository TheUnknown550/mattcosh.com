@AGENTS.md

# Project Identity

This is a personal portfolio website for a software developer / computer
engineering student. It showcases:

- AI/ML projects
- Full-stack projects
- IoT projects
- Robotics projects
- Awards and competitions
- Internships and experience
- Technical case studies
- 3D visual elements

# Core Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Three Fiber + Drei + Three.js
- MDX
- Local content files (no database, CMS, backend, or auth)

Do not introduce a database, CMS, backend, or authentication unless
explicitly requested.

# Development Rules

- Use TypeScript everywhere.
- Keep components small and reusable.
- Use clear folder separation (see structure below).
- Keep 3D components inside `src/components/three/`.
- Keep project metadata inside `src/data/projects.ts`.
- Keep long project explanations inside `content/projects/*.mdx`.
- Keep images inside `public/projects/`.
- Keep 3D models inside `public/models/`.
- Use `.glb` files for 3D models.
- Avoid heavy dependencies.
- Do not add unnecessary UI libraries.
- Do not create final visual designs unless asked.
- Do not hardcode large project content into React components — prefer
  data-driven rendering.
- Use semantic HTML where possible.
- Keep accessibility in mind.
- Do not create backend routes unless explicitly requested.
- 3D components must be client components (`"use client"`).
- Avoid SSR issues with Three.js — don't touch `window`/`document` outside
  effects or event handlers.
- Use dynamic imports where needed for 3D scenes.
- Optimise for maintainability first.

# Documentation Rules

Whenever major structure changes are made, update the relevant docs in
`/docs`:

- `docs/content-management.md`
- `docs/project-data.md`
- `docs/3d-assets.md`
- `docs/development-notes.md`

# Current Development Stage

**Data-driven portfolio implementation.** See `docs/development-notes.md` for
the full, up-to-date list of what is and isn't implemented.

Do not implement (unless explicitly asked):

- Final homepage design
- Final 3D hero scene
- Final project page design
- Final animations
- Real project content
- Contact form backend
- CMS
- Database

# Project Structure

```
CLAUDE.md
README.md
docs/                        Documentation (content, project data, 3D assets, dev notes)
public/
  models/                    .glb 3D models
  projects/                  Per-project images/screenshots
  icons/                     Site-wide icons
  resume/                    Resume/CV PDF
content/
  projects/                  Long-form MDX case studies, one per project slug
src/
  app/                       Next.js App Router routes
  components/
    common/                  Generic shared UI (e.g. Placeholder)
    layout/                  Page shell/nav/footer
    projects/                Project card/list components
    three/                   React Three Fiber components
  data/
    projects.ts               Project metadata (source of truth)
  lib/
    projects.ts               Helpers for reading project data
    mdx.ts                     Helpers for resolving MDX content paths
  types/
    project.ts                 Project type definitions
  mdx-components.tsx           Required by @next/mdx (custom MDX component map)
```
