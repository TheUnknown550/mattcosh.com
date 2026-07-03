# /public/models

Put `.glb` files here.

- Keep models optimised for web (compress with `gltf-transform` or similar
  before adding them).
- Prefer compressed textures (KTX2/Basis) and Draco/Meshopt geometry
  compression where possible.
- Avoid very high-poly models — this is a portfolio site, not a CAD viewer.
- Use clear, descriptive file names, e.g. `heart-monitor.glb`, `robot.glb`,
  `qr-cube.glb`.
- Reference models from project metadata as `/models/<file-name>.glb` (see
  `modelPath` in `src/types/project.ts`).

See `docs/3d-assets.md` for more detail.
