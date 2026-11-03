# Gaussian Splat Studio

A reusable PlayCanvas + Vite + TypeScript starter, plus a local project workflow for Scaniverse → SuperSplat → SOG → web.

**Status: local prototype renders.** Dependencies are installed, 13 tests and the production build pass. Browser checks confirmed sample rendering, hotspot information and tour activation; desktop and portrait layouts were inspected. SOG conversion, real-device testing and deployment remain unverified. See `PROJECT_STATUS.json`. Nothing has been published; no GitHub repository has been created.

## Start on your Mac

Install Node.js 24 LTS from https://nodejs.org/. Open Terminal in this folder:

```sh
npm install
npm test
npm run build
npm run dev
```

Open the Local URL Vite prints. The sample configuration references PlayCanvas's public Toy Cat SOG. The engine is bundled by Vite; the sample itself requires an internet connection. See `THIRD_PARTY.md` for the sample licence limitation and the explicitly CC BY 4.0 alternative identified for release testing.

A package-lock.json is now included after successful installation on the Mac. Use npm ci for subsequent reproducible installations. CI uses the same lock.

Optional dependency-free preview: `npm run preview:portable`. This uses a pinned PlayCanvas CDN module and still needs network access and permission to bind localhost. `node scripts/standalone.mjs` creates `.portable/studio-preview.html` for manual local browser review, also needing CDN access. Neither fallback replaces Vite build verification.

## First project

```sh
npm run studio -- new first-capture "My first capture"
npm run studio -- import first-capture /absolute/path/to/capture.ply
npm run studio -- status first-capture
```

Then follow [the ten-stage workflow](docs/WORKFLOW.md). Local originals and delivery assets live under ignored `assets-private/`. Project records and editable scene configuration live under `projects/`. Opening a file in the viewer is a temporary browser preview, not an archival import.

## What is here

- `src/viewer.ts`: rendering, camera navigation, tours, device quality and loading.
- `src/ui.ts`, `src/style.css`: interface and responsive layout.
- `src/config.ts`: runtime configuration validation.
- `public/projects/`: deployment-visible scene manifests. **Everything here is public if the site is public.**
- `projects/`: private working configuration, inspection reports and stage records. Not served by the production build.
- `scripts/`: import/inspection/conversion/checkpoints, deployment and local preview tools.
- `tests/`: offline validation tests.
- `.github/workflows/`: build checks and manually approved production deployment.
- `netlify.toml`: build configuration. Production must not use automatic Git publishing.

## Using this with ChatGPT

For future work, provide this repository and the current project ID, then attach the export:

> Use Gaussian Splat Studio. Resume from projects/PROJECT/status.json. Inspect this capture, preserve the original, perform non-destructive automated preparation, and stop for visual cleanup if needed. Ask me for the audience, branding, initial viewpoint, hotspots and tour. Build and test it, record actual evidence, then ask before publishing the exact reviewed version. Do not treat a successful build as proof of correct rendering.

This is an agent-assisted workflow, not an autonomous hosted upload/processing service. There is no server-side queue, account system or automatic reconstruction. Scaniverse performs reconstruction on the phone; SuperSplat handles visual cleanup. SOG conversion runs locally once dependencies are installed. No NVIDIA/CUDA machine is required for the provided CPU conversion route; it can be slower than GPU conversion.

## Guides

- [Capture, cleanup and checkpoints](docs/WORKFLOW.md)
- [Branding, cameras and scene configuration](docs/CUSTOMISATION.md)
- [GitHub, deployment, privacy and rollback](docs/DEPLOYMENT.md)
- [Verification and maintenance](docs/TESTING.md)
- [Technology decisions and sources](docs/RESEARCH.md)
