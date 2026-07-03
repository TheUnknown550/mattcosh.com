# 3D Assets

## Format

Use `.glb` (binary glTF) — it bundles geometry, materials, and textures into
a single file, which is simplest for a web project with no backend.

## Storage and referencing

- Store models in `public/models/`.
- Reference them from project metadata as `/models/<name>.glb` (the
  `modelPath` field in `src/types/project.ts`).
- Use clear, descriptive file names: `heart-monitor.glb`, `robot.glb`,
  `qr-cube.glb` — not `model1.glb` or `final_v2.glb`.

## Optimisation

Before adding a model:

- Keep poly count reasonable — this renders in a browser tab, not a native
  viewer.
- Compress textures (prefer KTX2/Basis over raw PNG/JPEG where tooling
  allows).
- Consider Draco or Meshopt geometry compression for larger models.
- Avoid bundling unused animations, cameras, or lights baked into the file.

Tools like [gltf-transform](https://gltf-transform.dev/) or the
[glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline) CLI can optimise a
model before it's added to `public/models/`.

## Components

The rendering building blocks live in `src/components/three/`:

- `SceneCanvas.tsx` — shared `<Canvas>` wrapper (camera + lighting).
- `ThreePlaceholder.tsx` — simple spinning-cube placeholder mesh, used to
  verify the rendering pipeline before real models exist.
- `ModelViewer.tsx` — reusable `.glb` loader (via drei's `useGLTF`), wrapped
  in `Suspense`.

All 3D components must:

- Be marked `"use client"` (Three.js needs browser APIs).
- Avoid touching `window`/`document` outside of effects or event handlers.
- Be composed inside a `SceneCanvas`, not render a raw `<Canvas>` themselves.
