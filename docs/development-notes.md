# Development Notes

## Current stage: initialisation only

This project currently contains foundation and structure only:

- Folder structure, placeholder pages, and placeholder components.
- Project data types and example (placeholder) metadata.
- An example MDX file with placeholder section headings.
- Documentation for how content and 3D assets are managed.

Not yet implemented (by design, at this stage):

- Final homepage design and copy.
- Final 3D hero scene (a minimal spinning-cube placeholder exists in
  `src/components/three/ThreePlaceholder.tsx`, but it isn't mounted
  anywhere yet).
- Final project card/list styling.
- Real project content (metadata or case studies).
- Full MDX rendering on the project detail page (currently a placeholder
  notice; see `src/lib/mdx.ts` and `src/app/projects/[slug]/page.tsx`).
- Contact form, backend, database, CMS, or authentication — none of these
  are planned for this project; it is a static, local-content site.

## Future possible upgrades (not scheduled)

- Wire up real MDX rendering via `@next/mdx`'s dynamic import of
  `content/projects/<slug>.mdx` (path alias `@content/*` is already
  configured in `tsconfig.json` for this).
- Add awards/experience/contact sections once content exists.
- Add a resume download link once `public/resume/resume.pdf` exists.
- Add real 3D models under `public/models/` and wire `ModelViewer` into
  project detail pages.
