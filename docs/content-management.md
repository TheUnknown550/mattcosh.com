# Content Management

This project separates structured metadata from long-form writing so that
listing/filtering pages stay fast and simple while case studies can be
written as plain prose.

## Where things live

| Content type                     | Location                              |
| --------------------------------- | -------------------------------------- |
| Project metadata (cards, lists)    | `src/data/projects.ts`                |
| Long-form project explanations     | `content/projects/<slug>.mdx`         |
| Project images/screenshots         | `public/projects/<slug>/`             |
| 3D models                          | `public/models/`                      |
| Site icons                         | `public/icons/`                       |
| Resume/CV                          | `public/resume/`                      |

## Rules

- Do not store project content (descriptions, write-ups) inside React
  components. Components should be data-driven and read from
  `src/data/projects.ts` / `content/projects/*.mdx`.
- A project's MDX file name must match its `slug` field exactly:
  `content/projects/<slug>.mdx`.
- Keep metadata (`src/data/projects.ts`) and prose (`content/projects/*.mdx`)
  in sync — the MDX file doesn't repeat title/tech-stack/links, since those
  already live in metadata.
- See `docs/project-data.md` for the metadata schema and
  `docs/3d-assets.md` for model conventions.
