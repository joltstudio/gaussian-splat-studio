# Scene configuration

Use `public/projects/toy-cat.json` as the schema example. Working projects are created under `projects/ID/scene.json`; keep private configurations there until preview/publication is approved. The app selects a project with `?project=ID`. Invalid IDs and malformed JSON produce a visible error.

| Setting | Meaning |
| --- | --- |
| `title`, `subtitle` | Introductory text |
| `asset.url` | Bundled `.sog` or Gaussian `.ply`; relative or HTTPS URL |
| `asset.lowUrl` | Optional separately optimised asset chosen on coarse-pointer devices at initial load |
| `asset.position`, `asset.rotation` | Scene transform; rotation in degrees |
| `asset.credit`, `licence`, `source` | Attribution and provenance; credit is shown in the footer |
| `camera.position`, `camera.target` | Starting camera and orbit target in world space |
| `theme.brand`, `logo` | Text branding or logo URL |
| `theme.accent`, `background` | Six-digit hex colours |
| `theme.font` | CSS font-family; load licensed webfonts in CSS if desired |
| `theme.navigation` | `bottom` or `side` |
| `hotspots` | Label, text, world position and optional camera view |
| `tour` | Ordered named camera views and transition duration in seconds |

Hotspots are HTML buttons projected from world coordinates. They are not occlusion-tested against splat geometry. Place them where they make sense from intended viewpoints. They disappear behind the camera or outside the viewport. For a local import, sample hotspots/tour are hidden; sample coordinates do not automatically fit a new scene.

Orbit uses mouse drag, one finger or arrow keys. Wheel/pinch/+/- zoom. Right-drag, shift-drag, two-finger movement and WASD pan. Home resets. Keyboard controls operate only while the scene canvas is focused. Clicking controls remains keyboard accessible. User navigation cancels a tour. Reduced-motion preferences avoid smooth transitions. Fullscreen availability depends on browser permissions and embedding.

Eco caps render resolution; it does not change the Gaussian count. The viewer selects a provided lowUrl at startup for touch-oriented devices. Automatic Eco switching follows three consecutive slow two-second windows below 24 FPS. This threshold is a heuristic, not a performance guarantee. Fullscreen, pinch gestures, hotspot projection and auto quality still require browser verification.

Loading shows bytes and a fraction only when a usable Content-Length is supplied. Otherwise it stays indeterminate. Decoding is a separate indeterminate phase. Downloads are capped at 512 MiB and bounded by a two-minute timeout. This is a safety cap, not an acceptable mobile target. The loader buffers the asset, so peak memory exceeds download size. Aim for a substantially smaller mobile scene and measure on the target phone.

## Updating without rebuilding application code

Runtime manifests can be hosted at an external HTTPS root configured using `VITE_PROJECT_BASE` when the viewer is first built. That host must provide CORS and appropriate authentication. Upload a new immutable asset, then update the manifest URL after approval. Keep the previous manifest version for rollback. The starter does not include an authenticated storage backend or editor; these need account setup.

Same-origin manifests inside `public/` are simpler but changing them requires a new static deployment. That does not require rewriting the viewer. Every manifest and asset delivered to a browser is visible to that authorised browser; VITE_ variables are never secrets.
