# AutismHub release and browser QA standard

**Introduced:** 26 October 2026

## 1. Four separate states

1. Prepared: local changes or an artifact have been created.
2. Committed: GitHub exposes the exact commit SHA and changed paths.
3. Validated: tests appropriate to that commit have completed successfully, and manual checks are identified separately.
4. Published: the Pages deployment for that revision succeeded and the target public URL renders the intended change.

Never infer state 4 from state 2. If checks are pending, report pending. If the public page cannot be independently inspected, report that verification is incomplete.

## 2. Existing automation

- `.github/workflows/validate.yml` checks source and build for PRs into `main`.
- `.github/workflows/deploy.yml` builds and deploys pushes to `main`.
- `.github/workflows/user-journey-qa.yml` runs a real Chromium browser regression test, on PRs, qualifying pushes and manual dispatches.
- `scripts/check-user-journeys.mjs` checks RU/KK/EN at 360, 768 and 1440 px, with screenshots of homepage and representative articles and checks for image errors, horizontal overflow, important navigation and forced midword table wrapping.
- `scripts/find-changed-pages.mjs` compares the PR/push base commit to HEAD, maps changed published Markdown to the actual built search-index routes and also tracks image assets referenced by article Markdown. Each resolved page is tested and screenshot at all three widths, with a fail-closed 24-route budget. Drafts are skipped explicitly, not treated as published.
- `npm run check:type-scale` and `npm run validate` remain mandatory source-level checks.

The Chromium DevTools Protocol runner already exists. There is no need to introduce Playwright until its additional value, dependency cost and maintenance plan are established.

## 2.1. Dependency security upkeep

The `.github/dependabot.yml` file requests weekly npm dependency update PRs. This does not establish that security features are enabled on the hosting account or that any vulnerable installed package has already been repaired. Each dependency PR must pass the normal validation and browser tests before merge. Keep the diagnostic `audit:dependencies` check active and triage its actual advisories, not just its pass/fail indicator.

## 3. Required review before release

- Review the exact final diff. No unrelated article or schema changes.
- Confirm evidence sources and rights to any images added or replaced.
- Run `npm run check:type-scale` and `npm run validate` or verify the matching CI run.
- Review browser QA status and the saved screenshots at all three widths.
- Inspect article tables, long RU/KK/EN titles, images and accessibility at 200% zoom when relevant.
- Confirm published dates and the translation status remain correct.
- For publishing tasks, inspect the live GitHub Pages URL after deployment completes.
- Report which checks were automatic and which were actually reviewed by a person.

## 4. Branch protection limitation

At the time of this change, the repository rulesets listing returned an empty list through the connected GitHub tool. The branch-protection read returned HTTP 403 with `Resource not accessible by integration`. Therefore protection cannot be claimed to be configured or absent from all views.

Repository owner should open GitHub repository Settings, then Rules / Rulesets or Branch protection and require at least the `validate` and relevant `browser-smoke` checks for `main` where supported by their GitHub plan and repository rules. The required-check names must match the check names actually emitted by Actions. Recheck their status after changing the rules.

## 5. Browser test scope and limitations

The user-journey script inspects representative pages and published pages directly affected by Markdown or referenced image changes, not all published articles. Changes to shared components and dynamically selected images can affect other routes that are not automatically enumerated. It catches some text clipping and pathological table breaks, but cannot reliably decide whether instructional artwork is semantically clear or determine WCAG 2.2 AA conformance alone. Screenshot inspection, cross-language copy review and scientific validation remain human responsibilities.

For future enhancements, prioritize sampled pages with dense tables, step-by-step instructional figures, and recently modified article routes. Do not disable failing checks to ship.
