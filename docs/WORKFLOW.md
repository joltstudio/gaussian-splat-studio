# Repeatable project workflow

Each project has `projects/ID/status.json`, with completed stages, evidence, next action, decisions and known issues. Commands refuse to overwrite originals. Stage checkpoint notes are human/agent attestations, not independent proof. Never mark something complete on the strength of an attempted command.

## 1. Import: your first capture

On your Pixel 7, check that your installed Scaniverse app offers **Splat** capture and local export. The classic Android app and the newer cloud Scaniverse product have different requirements; the newer quickstart lists Pixel 8 or newer. A real Pixel 7 capture remains to be checked.

Choose a small, static, textured object first. Avoid glass, mirrors, moving people, thin foliage and changing light. Walk slowly around it at several heights, with overlapping views; keep the subject in frame. Inspect the reconstructed result on the phone. Choose a **Gaussian splat PLY** export, not mesh PLY, GLB or OBJ. Keep the phone's original scan. Transfer the PLY to your Mac and attach it in ChatGPT. Do not choose public map publishing just to export a file.

Required return: original `.ply` (preferred), or `.spz`, scene name and any privacy restrictions.

```sh
npm run studio -- new garden "Garden study"
npm run studio -- import garden /path/to/capture.ply
```

## 2. Inspect

Import checks the header, byte size, Gaussian properties and a SHA-256 checksum. It distinguishes Gaussian PLY from ordinary mesh PLY. Binary standard PLY is checked for an obviously truncated payload. SOG/SPZ checks are container checks only. Full parsing, visual completeness and texture validity still need a decoder.

```sh
npm run studio -- inspect /path/to/capture.ply
```

If it fails, keep the original and re-export a splat from Scaniverse. Do not rename a mesh extension to make it pass. Large files are flagged for mobile optimisation; warnings are not automatic deletion instructions.

## 3. Clean up: manual checkpoint

Open https://superspl.at/editor in a current WebGPU-capable browser. Open the original locally. Inspect from front, back, sides and above. Remove floaters and unwanted background using selection tools. Crop only once you have checked that useful views remain intact. Set the scene upright; avoid applying the same orientation twice in the viewer. Save an editable project if the editor offers it, then export a new Gaussian PLY such as `garden-clean-v1.ply`. Preserve the original.

Required return: edited PLY, a brief note of what you removed, and your preferred front view. Using local editing is separate from SuperSplat publishing; do not click Publish for this workflow.

```sh
npm run studio -- checkpoint garden cleanup "Reviewed in SuperSplat; removed background floaters; returned garden-clean-v1.ply"
```

There is no safe general-purpose automatic decision about which real objects to remove. Optional cropping, opacity filtering, decimation and floater filtering exist in splat-transform but need scene-specific review. The default converter only removes non-finite/unrenderable records using the supported `--filter-nan` action. This happens on a new output, never in place.

## 4. Optimise

```sh
npm run studio -- optimise garden /path/to/garden-clean-v1.ply
```

This invokes pinned splat-transform with `--gpu cpu`, writes a timestamped SOG, then records its size and hash. CPU conversion avoids assuming an NVIDIA GPU or a working native WebGPU adapter on Apple Silicon. If the converter is unavailable, use https://superspl.at/convert or SuperSplat's SOG export, then inspect the returned output and record that manual alternative in status. No silent format substitution.

For a large scene, make a separately reviewed lower-detail SOG. A single SOG is not automatic LOD streaming; lower pixel resolution does not reduce splat count or memory. Use decimation only after inspecting its output. Streamed SOG is a later extension, not implemented here.

## 5. Configure: creative checkpoint

Ask for: object showcase or environment; intended audience; branding; title/description; starting viewpoint; hotspot labels/text/positions; optional tour stops; desktop/mobile priority; and whether the scene may ever be public. Edit `projects/ID/scene.json`. Open a local PLY/SOG in the viewer and use Save camera to export position/target coordinates.

```sh
npm run studio -- checkpoint garden configure "Scene configuration validated; camera and content reviewed"
```

## 6. Build

Working manifests are not deployed automatically. Once the intended preview audience is approved, stage only that scene's manifest into `public/projects/ID.json` and put its delivery assets in a suitable protected preview location. Do not place originals in `public/`.

Run `npm run build`; record success with the commit SHA. The site at `/?project=garden` loads the corresponding runtime manifest. A genuinely private preview must protect both the application and its asset host, not just use an obscure URL.

## 7. Test

Run `npm test`, then the browser/device checklist in TESTING.md. Record actual browser version, device, scene bytes, loading behaviour, measured FPS and failures. Use real Pixel 7 testing for final mobile approval. Never claim device emulation is a real phone test.

## 8. Review: human checkpoint

Provide the exact build/commit, working preview, asset version and known limitations. Ask for visual/copy/navigation feedback. Changes invalidate affected tests and review evidence. Do not reuse approval for materially different assets or audiences.

## 9. Publish: explicit approval checkpoint

State the exact commit, project, destination URL, audience and asset list. Ask for approval before making those accessible. Follow DEPLOYMENT.md. A status entry does not itself deploy. After deployment reports ready, check the published page and record its URL/deploy ID.

## 10. Archive

Commit source, configs, changelog and non-secret evidence. Keep original and cleaned assets in private external storage, plus delivery SOGs under immutable versioned names. Store their hashes, object references, capture licence/consent, conversion version/options and approval record in the project. Avoid signed URLs and private location details in public configs. Tag the release. Verify the backup can be retrieved before marking archive complete.

## Resume and recover

Read status before acting. After an error, record the failed operation and exact next action. Do not repeat failed conversion indefinitely. Try CPU conversion, browser conversion or a smaller reviewed scene as appropriate. If tests or deployment fail, retain the last working version; do not delete it. For substantial revisions create a new delivery version and reset affected workflow stages to pending with a note explaining why.
