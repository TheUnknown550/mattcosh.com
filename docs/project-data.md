# Project Data

Project metadata is defined by the `Project` type in `src/types/project.ts`
and stored as an array in `src/data/projects.ts`.

## The `Project` type

```ts
export interface Project {
  slug: string;            // URL-safe unique id, e.g. "heart-rate-monitor"
  title: string;            // Display name
  shortDescription: string; // One or two sentences, used on cards
  category: ProjectCategory; // "AI/ML" | "Full-Stack" | "IoT" | "Robotics" | "Mobile" | "Research" | "Other"
  status: ProjectStatus;    // "Completed" | "In Progress" | "Archived"
  year: string;             // e.g. "2026"
  techStack: string[];      // e.g. ["Next.js", "TypeScript"]
  featured: boolean;        // Show on homepage/featured sections
  recognitions?: string[];  // Awards/press, e.g. ["Microsoft Imagine Cup — World Runner-Up"]
  coverImage?: string;      // Path under /public, e.g. "/projects/<slug>/cover.png"
  modelPath?: string;       // Path under /public, e.g. "/models/<name>.glb"
  githubUrl?: string;
  liveUrl?: string;
  caseStudyPath?: string;   // Path to the matching MDX file
}
```

## Adding a new project

1. Pick a slug: lowercase, hyphen-separated, no spaces (e.g.
   `heart-rate-monitor`, not `Heart Rate Monitor` or `heart_rate_monitor`).
2. Add an entry to the `projects` array in `src/data/projects.ts`.
3. If it needs a full case study, create `content/projects/<slug>.mdx` with
   the same slug.
4. If it has a cover image, add it under `public/projects/<slug>/` and set
   `coverImage`.
5. If it has a 3D model, add the `.glb` under `public/models/` and set
   `modelPath` (see `docs/3d-assets.md`).

## Slug naming convention

- Lowercase, hyphen-separated (`kebab-case`).
- Must be unique across all projects.
- Must exactly match the MDX file name (`content/projects/<slug>.mdx`) and
  the URL segment (`/projects/<slug>`).

## Related data: experience, education, skills, certifications, timeline

The same pattern (typed data in `src/types/*`, arrays in `src/data/*`)
covers the Experience and Roadmap pages:

- `src/types/experience.ts` / `src/data/experience.ts` — work history.
- `src/types/education.ts` / `src/data/education.ts` — schools/degrees.
- `src/types/skill.ts` / `src/data/skills.ts` — skills grouped by category.
- `src/types/certification.ts` / `src/data/certifications.ts` — certs.
- `src/types/honor.ts` / `src/data/honors.ts` — awards/competition results.
- `src/types/timeline.ts` / `src/data/timeline.ts` — merges all of the
  above (plus `projects`) into one `TimelineEntry[]` for the Roadmap page,
  sorted newest first. Don't hand-edit `timeline.ts`'s entries directly — add or
  edit the source data file instead (education/experience/projects/
  honors/certifications) and the timeline derives from it automatically.
