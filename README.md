# Gaussian Splat Studio

A PlayCanvas + Vite + TypeScript starter for presenting Gaussian splats, with a local workflow for Scaniverse → SuperSplat → SOG → web. The application source is MIT-licensed.

**Status:** the local prototype and licensed sample render. All 13 tests and the production build passed. The 1.3 MB CC0 measuring tape PLY rendered in the local viewer; zoom and reset worked. The GitHub repository exists; public release and production deployment are pending. See `PROJECT_STATUS.json`.

## Start on your Mac

Install Node.js 24 LTS. In Terminal, run:

```sh
npm ci
npm test
npm run build
npm run dev
```

Open the local URL Vite prints. The default demo is a bundled measuring tape Gaussian PLY under CC0 1.0; see `THIRD_PARTY.md` for its source and licence.

An optional portable preview is available with `npm run preview:portable`; it uses a pinned PlayCanvas CDN module and needs network access.

## Start a capture project

```sh
npm run studio -- new first-capture "My first capture"
npm run studio -- import first-capture /absolute/path/to/capture.ply
npm run studio -- status first-capture
```

Then follow [the ten-stage workflow](docs/WORKFLOW.md). Local originals and delivery assets live under ignored `assets-private/`; project records and editable scene configuration live under `projects/`. Opening a file in the viewer is a temporary browser preview, not an archival import.

## Repository layout

- `src/`: renderer, interface, styling and scene validation.
- `public/projects/`: scene manifests and the bundled public demo asset. Everything here ships with the site.
- `projects/`: private working configuration and stage records; not served by the production build.
- `scripts/`: inspection, conversion, checkpoints, deployment and local preview.
- `tests/`: offline validation tests.
- `.github/workflows/`: build checks and manually approved production publishing.
- `netlify.toml`: static build configuration. Production publishing must stay manual.

This is a local capture workflow and static viewer, not a hosted upload or reconstruction service. Scaniverse performs reconstruction on the phone; SuperSplat handles visual cleanup; SOG conversion runs locally. No server-side queue or account system is provided.

## Guides

- [Capture, cleanup and checkpoints](docs/WORKFLOW.md)
- [Branding, cameras and scene configuration](docs/CUSTOMISATION.md)
- [GitHub, deployment and privacy](docs/DEPLOYMENT.md)
- [Verification and maintenance](docs/TESTING.md)
- [Technology decisions and sources](docs/RESEARCH.md)
