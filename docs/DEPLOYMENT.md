# GitHub and deployment

## Current state

Local Git is initialised with meaningful commits. Remote repository creation awaits Wes's approval and authenticated account access. No captures, source or secrets have been sent to GitHub or a hosting provider. Netlify is selected for the prepared workflow; Cloudflare Pages remains a compatible alternative for the static `dist/` output.

## Create the private source of truth, after approval

1. Choose the owning GitHub account/organisation and approve `gaussian-splat-studio` as a **private** repository.
2. Create an empty repository without a generated README or licence; use GitHub Desktop or an authenticated GitHub CLI. Do not paste access tokens into chat or commit them.
3. From this folder, add its exact SSH/HTTPS clone URL as `origin`, then push `main`.
4. After `npm install` succeeds, review and commit `package-lock.json`. Run tests and build before pushing the lock. CI uses `npm ci` and fails closed if the lock is missing.
5. Restrict write/admin access, protect main where your plan supports it, and review workflow changes. The eventual remote is the permanent source of truth; local Git alone is not a remote backup.

A `.bundle` archive included in the handover preserves local Git history. Restore it with `git clone gaussian-splat-studio.bundle gaussian-splat-studio`, then copy any external assets separately.

## Netlify setup

Use an account-owned site. Set its audience and access protection before uploading anything private. Verify in a signed-out browser that both the app and its raw asset URLs are protected. A private GitHub repository does **not** make a deployed site private. A draft URL is not inherently private either. Plan-dependent Netlify protection must be checked on the actual account.

Do not enable Netlify's automatic production publishing from main. The provided production workflow uses the Netlify API and only runs on an explicit manual action. In GitHub repository settings add:

- Variable `PUBLISHER_LOGIN`: Wes's exact GitHub login.
- Secret `NETLIFY_AUTH_TOKEN`: an account-owned deployment token.
- Secret `NETLIFY_SITE_ID`: the exact destination site ID.

Create credentials through the provider UI and enter them directly into GitHub Secrets. Never use VITE_ variables for secrets. Protect secret access and repository write permissions.

To publish, review the build, asset list and target audience, then open Actions → Publish approved release → Run workflow on main. Enter `PUBLISH` and the full reviewed commit SHA. The workflow checks the triggering user against PUBLISHER_LOGIN, the branch and the SHA; builds and tests; then uploads and waits for Netlify's `ready` state. A queued or accepted response is not treated as success. Browser-check the URL afterwards.

This is a deliberate release action, not a tamper-proof two-person approval system. Repo administrators can change workflows and variables. GitHub currently limits private-repository environment required reviewers to relevant Enterprise capabilities; do not promise a free required-reviewer gate. If stricter segregation is needed, configure the appropriate account protection before enabling releases.

## Automatic preview deployments

Build checks run on pushes and pull requests. Automatic hosted previews are **not enabled yet**, because their audience and provider account have not been approved. Safe setup choices:

- A separately protected Netlify preview site, with access verified and an explicit list of assets approved for that audience.
- Netlify Deploy Previews after confirming protection on the account and ensuring main cannot automatically publish production.

Only wire the preview job after that review. PR workflows must not expose production credentials, and untrusted fork code must never run with them. Until then, Actions stores build artifacts privately within GitHub's access model and local Vite previews are used for review.

## Assets and separate project URLs

Keep originals and cleaned captures in private external storage. Use immutable delivery keys such as `garden/2026-11-03-v1/scene.sog`; record SHA-256, byte size, licence and conversion settings in the project record. R2 or an equivalent object store can serve assets, but the bucket, CORS and authentication are not provisioned here.

One app can serve `https://YOUR-SITE/?project=garden` and `?project=object`. For separate domains or isolated clients, use separate hosting sites with only the appropriate approved manifests. For updates without a viewer rebuild, use the external runtime manifest option described in CUSTOMISATION.md. Private manifests require an authenticated hosting/access solution, not a long-lived signed URL embedded in code.

Public delivery assets must be explicitly approved. Only delivery SOGs and non-sensitive manifest fields should be browser-accessible. Private captures should never be put in a public bucket just to make CORS easier.

## Rollback

Record the successful deploy ID, full commit and manifest/asset versions. In Netlify's deploy history, select the previous successful production deploy and use its publish/rollback action after approval. Verify the page and asset fetch afterwards. Rolling back code does not roll back mutable external manifests: restore that manifest's previous version as well. Keep old immutable assets until retention is agreed.

If an upload/status request times out, inspect provider state before rerunning to avoid duplicate releases. If it failed, preserve the last working version and diagnose build, permissions, CORS, missing assets or decoder errors. Do not replace working assets in place.
