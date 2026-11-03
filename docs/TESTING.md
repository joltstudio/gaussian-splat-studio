# Verification and maintenance

## Initial results from 3 November 2026 (superseded where noted below)

- 13 offline Node tests passed: configuration, camera vector/duration validation, URL safety, PLY classification, payload truncation and SOG container checks.
- TypeScript source parsed/transformed using Node's built-in TypeScript support; standalone generated JavaScript syntax checked.
- Local Git initialised and source commits verified.
- `npm install`: failed, registry hostname unavailable in the shell (`ENOTFOUND`).
- `npm run build`: could not run because TypeScript/Vite dependencies were not installed. **No full TypeScript typecheck has passed.**
- Portable preview HTTP server: blocked with `listen EPERM`.
- Browser local-file fallback: blocked by browser URL policy. No workaround attempted after that denial.
- No sample asset downloaded or decoded. No 3D rendering, interaction, mobile, WebGL or performance result has been verified.
- No SOG conversion, GitHub push, deployment, hosted privacy check or rollback performed.

## Required before the first release

1. Install dependencies, commit the lock, run `npm test` and `npm run build`.
2. Verify the sample asset's own licence, download the explicitly CC BY 4.0 Japanese Bee if needed, preserve attribution and set a suitable camera/orientation. Do not assume the renderer's MIT licence covers an unrelated capture.
3. Open Vite preview in current Chrome and Safari on the Mac. Confirm actual splats render, not just controls or an empty canvas.
4. Orbit, pan, zoom, reset, fullscreen, tour start/stop, camera export and each hotspot. Verify hotspot position at both Eco and High resolutions.
5. Test keyboard-only use and focus visibility. Test reduced-motion preference.
6. Test at 390×844 and desktop dimensions; then on the actual Pixel 7, including pinch, two-finger pan and portrait/landscape. Record real device and browser details.
7. Test a missing manifest, invalid config, HTTP 404 asset, malformed SOG/PLY, offline load, retry, rapid file switching and a large file. No silent success or blank screen.
8. Test both normal and lowUrl assets, Eco/High switching, slow-device fallback and context loss recovery message. Unsupported WebGL should show an actionable error.
9. Use browser Network/Performance tools with cache disabled. Record bytes transferred, time until a visible usable frame, observed frame-rate range and any visible quality loss. The live FPS display is an estimate based on engine update intervals; it is not a benchmark or GPU timing.
10. Check licence, privacy, CORS and asset access with a signed-out browser. Record exact commit and asset hashes. Present for human review.

Do not substitute a successful unit test or compilation for visual verification. Do not invent performance numbers. Keep performance targets separate from measured results.

## Update dependencies

Work on a branch. Read upstream release notes; update one dependency at a time; retain pinned versions and commit the resulting lock. Run tests/build and repeat affected browser/device checks. Recheck SOG format/decoder compatibility after engine or converter upgrades. Keep a tagged known-working release and old immutable assets. Run `npm audit` after registry access is available; no security audit was possible in this session.

## Follow-up verification, 3 November 2026

The user successfully installed dependencies: 49 packages, npm reported zero vulnerabilities at that time. All 13 tests passed and the full TypeScript/Vite build succeeded. The agent repeated tests/build successfully after fixing tour-label DOM churn. The final portrait framing change also passes the production build.

The running Vite preview at http://127.0.0.1:5173 was inspected in the in-app browser. Toy Cat visibly rendered. Clicking its hotspot opened the information panel and changed the view. Tour activation failed initially; updating its DOM only when state changes fixed this, and the Stop tour/pressed state was then verified. Reset, zoom-in and Eco controls were exercised. Desktop 1280x800 and portrait 390x844 views were visually inspected; portrait horizontal FOV fixed clipping. Temporary viewport overrides were reset. The live counter displayed around 58–60 FPS during these brief checks, not a controlled benchmark.

Still unverified: actual Pixel 7 hardware/touch/performance, full keyboard and fullscreen paths, error recovery, production-output browser run, SOG conversion, licensed alternative asset, hosting and rollback.
