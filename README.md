# mattcosh.com

Personal portfolio website — showcases software, AI/ML, full-stack, IoT, and
robotics projects, with 3D models and technical case studies.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [React Three Fiber](https://r3f.docs.pmnd.rs) + [Drei](https://github.com/pmndrs/drei) + [Three.js](https://threejs.org)
- [MDX](https://mdxjs.com) for long-form project write-ups
- No database, CMS, backend, or authentication — content is local files

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content management

- Project metadata (title, tech stack, links, etc.) lives in
  `src/data/projects.ts`, typed by `src/types/project.ts`.
- Long-form case studies live in `content/projects/<slug>.mdx`.
- Images/screenshots live in `public/projects/<slug>/`.

See `docs/content-management.md` and `docs/project-data.md` for details.

## 3D assets

- Models are `.glb` files stored in `public/models/`.
- Rendering building blocks live in `src/components/three/`
  (`SceneCanvas`, `ThreePlaceholder`, `ModelViewer`).

See `docs/3d-assets.md` for conventions and optimisation guidance.

## Current status

**Project initialisation.** Structure, placeholder pages/components, project
data types, and documentation are in place. Final visual design, 3D hero
scene, and real project content have not been added yet — see
`docs/development-notes.md`.
