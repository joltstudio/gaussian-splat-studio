# Technology decisions, checked 3 November 2026

## Keep the requested stack

Scaniverse provides reconstruction; SuperSplat provides visual cleanup; SOG is the delivery format; PlayCanvas renders; Vite/TypeScript structure the reusable app; private GitHub is the intended source of truth; Netlify is the prepared deployment target. No commercial editor or NVIDIA/CUDA training stack has been substituted.

PlayCanvas's current API documents PLY, bundled SOG, unbundled SOG and streamed LOD. This starter deliberately implements bundled SOG and PLY only. SPZ is accepted by the local inspection/conversion workflow, not directly by the viewer. A compressed container is not LOD streaming. Large environments may need streamed SOG later.

SplatTransform supports SPZ/PLY/SOG, non-finite filtering, transforms and conversion. CPU SOG conversion is selected for portability on Apple Silicon; it trades speed for avoiding a native GPU-backend prerequisite. Automated removal of floaters or decimation needs visual approval, so it is not silently applied.

Package observations: PlayCanvas documentation and npm indexing identify 2.23.3; SplatTransform's API identifies 3.10.3. Package.json pins those plus Vite 8.3.5 and TypeScript 5.9.3. Registry resolution was blocked, so the latter pins and the full dependency graph still need installation verification. No claim that all installed dependencies are latest: none were installed here.

The current Scaniverse quickstart lists Pixel 8 or newer for its newer workflow. Classic Scaniverse's support page describes broader Android requirements. Confirm the installed Pixel 7 app offers Splat capture and PLY export; do not infer new-product compatibility from classic-app support.

Netlify supports immutable deploy history, ZIP API uploads and production/draft deploys. The code prepares the documented ZIP API route. Production is a manual exact-commit release. Automated hosted preview creation awaits verified private access. Cloudflare Pages is also viable, but would require a different deployment adapter; no advantage justified maintaining both providers at this stage.

## Primary references

- Scaniverse classic support: https://scaniverse.com/support
- Scaniverse current quickstart: https://nianticspatial.com/docs/scaniverse/quickstart/
- SuperSplat: https://developer.playcanvas.com/user-manual/supersplat/
- SuperSplat editor: https://superspl.at/editor
- Browser converter: https://superspl.at/convert
- PlayCanvas first splat application: https://developer.playcanvas.com/user-manual/gaussian-splatting/building/your-first-app/engine/
- PlayCanvas GSplat component/API: https://api.playcanvas.com/engine/classes/GSplatComponent.html
- Performance: https://developer.playcanvas.com/user-manual/gaussian-splatting/building/performance/
- Streamed SOG: https://developer.playcanvas.com/user-manual/gaussian-splatting/building/lod-streaming/
- Converter: https://github.com/playcanvas/splat-transform
- Converter API version: https://api.playcanvas.com/splat-transform/one-page.html
- Vite release policy: https://vite.dev/releases
- Netlify API: https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/
- GitHub environment/approval limitations: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
