# Content Management

This project separates structured metadata from long-form writing so that
listing/filtering pages stay fast and simple while case studies can be
written as plain prose.

## Where things live

| Content type                       | Location                              |
| ----------------------------------- | -------------------------------------- |
| Project metadata (cards, lists)     | `src/data/projects.ts`                |
| Long-form project explanations      | `content/projects/<slug>.mdx`         |
| Project images/screenshots          | `public/projects/<slug>/`             |
| 3D models                           | `public/models/`                      |
| Site icons                          | `public/icons/`                       |
| Resume/CV                           | `public/resume/`                      |
| Profile photo (Hero portrait)        | `public/img/profile.png`             |
| Work history                        | `src/data/experience.ts`              |
| Education                           | `src/data/education.ts`               |
| Skills (grouped)                    | `src/data/skills.ts`                  |
| Certifications                      | `src/data/certifications.ts`          |
| Awards/honors                       | `src/data/honors.ts`                  |
| Merged Roadmap feed (derived, don't hand-edit) | `src/data/timeline.ts`     |
| Original LinkedIn export CSVs (gitignored, source-of-truth reference) | `content/linkedin-exports/` |

## Rules

- Do not store project content (descriptions, write-ups) inside React
  components. Components should be data-driven and read from
  `src/data/projects.ts` / `content/projects/*.mdx`. The same rule applies
  to experience/education/skills/certifications/honors — edit the
  `src/data/*` file, not the page or component that renders it.
- A project's MDX file name must match its `slug` field exactly:
  `content/projects/<slug>.mdx`.
- Keep metadata (`src/data/projects.ts`) and prose (`content/projects/*.mdx`)
  in sync — the MDX file doesn't repeat title/tech-stack/links, since those
  already live in metadata.
- `src/data/timeline.ts` is derived (it maps and merges the other data
  files) — add new milestones to the underlying data file, not to
  `timeline.ts` directly.
- See `docs/project-data.md` for the metadata schema and
  `docs/3d-assets.md` for model conventions.
