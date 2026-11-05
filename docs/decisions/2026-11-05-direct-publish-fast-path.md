# Decision: fast path for an explicit publication request

- Date: 2026-11-05
- Status: owner-approved policy
- Applies to: narrow changes to already approved website material, including replacing an owner-supplied article illustration
- Affected guidance: `AGENTS.md`, `docs/release-and-browser-qa.md`, `docs/07-technical-plan.md`

## Decision

An explicit command to "publish", "publish now" or "replace it directly on the site" is both authorisation to commit the specified change to the publishing branch and an instruction to act promptly. Do not request another confirmation or spend an extended session repeating full-site QA, reviewing unrelated files, checking the same status many times or waiting through service timeouts.

For a narrow approved asset or editorial correction:

1. Inspect the precise existing reference, replacement bytes, rights/provenance and relevant policy.
2. Apply the minimal correction and commit to `main` using the available GitHub API or local Git. There is no mandatory local clone.
3. Let the existing GitHub Actions build, `npm run check:type-scale`, `npm run validate` and configured browser QA execute normally. Do not turn those automated checks into a pre-commit waiting loop.
4. Check the commit and deployment status promptly. Verify the public page when Pages has already completed.
5. When GitHub Pages is slow, pending, or unsuccessful, report the exact commit and workflow status concisely, without prolonged polling or repeated retries and without claiming that a commit equals public deployment.

## Boundaries

- Do not remove or disable mandatory CI checks, bypass branch rules or misrepresent test results.
- Unverified medical content, restricted screening instruments, image licensing problems, data/privacy changes, and other high-risk work continue to require their established safety review before publication.
- Keep the existing distinction between prepared, committed, validated and published. The owner prioritises immediate execution, not a false publication claim.
- This decision supersedes earlier instructions to repeat exhaustive manual browser checks or to wait indefinitely for GitHub Pages after an ordinary approved single-file change. It does not change the technical GitHub Pages service or guarantee its response time.

## Implementation

Documentation-only update. No website layout, article content, CI configuration or deployment protections are modified by this decision.
