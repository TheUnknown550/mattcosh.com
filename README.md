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

**Active portfolio build.** The site has a data-driven portfolio graph on the
landing page, real project and career content, MDX case studies, responsive
navigation, and dedicated Projects, Experience, Skills, Certifications, and
Roadmap routes. The remaining roadmap is focused on optional project media,
3D detail assets, and a resume download — see `docs/development-notes.md`.
