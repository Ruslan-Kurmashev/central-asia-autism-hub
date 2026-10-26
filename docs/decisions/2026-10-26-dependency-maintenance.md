# Decision: maintain dependencies through reviewable updates

- Date: 2026-10-26
- Status: approved technical maintenance
- Scope: npm package-lock security and scheduled update requests

Set up GitHub Dependabot weekly npm update pull requests, limited to three simultaneously. It must not bypass existing validation or automatically deploy unreviewed dependency changes. Updates are proposals, not proof of security remediation.

On the 26 October 2026 security remediation PR, npm on the official GitHub runner proposed patched undici 8.12.3, zod 4.6.7 and fast-uri 3.1.9, with lockfile-only changes. Treat these versions as proposed until same-commit CI has passed.

At introduction, the separate diagnostics workflow previously reported high-severity transitive findings for undici and zod, and a moderate finding for fast-uri. Confirm current advisory state on the exact lockfile, apply the smallest compatible dependency update, rerun `npm ci`, `npm run validate`, Chromium QA, and `npm run audit:dependencies -- --fail-on-high-production`.

Dependabot configuration is not evidence that GitHub security alerts or dependency graph permissions are enabled. The repository owner must verify these settings in GitHub. Do not classify build-time dependencies as live site runtime dependencies without analysing the static Astro deployment.

Related: `docs/release-and-browser-qa.md` and `.github/workflows/qa-diagnostics.yml`.
