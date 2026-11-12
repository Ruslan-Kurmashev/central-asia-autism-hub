# Parent assessment article reading order - 29 October 2026

**Status:** Owner-requested editorial navigation order; implementation and release must be verified separately.

## Decision

Keep the six published Russian parent articles in the existing combined `assessment` group, arranged by the reader's diagnostic journey:

1. `assessment-and-diagnosis`: distinguish screening, assessment and diagnosis.
2. `autism-diagnosis-kazakhstan`: understand the Kazakhstan diagnostic route.
3. `autism-assessments-kazakhstan`: understand when additional tests may be relevant.
4. `autism-pmpk-vkk-mse-kazakhstan`: distinguish medical, education and disability-related responsibilities.
5. `after-autism-assessment-kazakhstan`: understand assessment outcomes and next actions.
6. `first-30-days-after-autism-diagnosis-kazakhstan`: plan the first month after diagnosis.

At the time of this decision, the initial four topics had translations. The 12 November 2026 owner-approved release adds actual KK and EN content for the final two, so all six are now shown in the same order. The article list is a navigation aid rather than a mandatory medical sequence.

## Implementation and limits

Only reorder existing topic IDs in `src/pages/kz/[lang]/[section]/index.astro`. Extend `scripts/check-user-journeys.mjs` to assert all six Russian article URLs in their visible positions. Update the architecture and decision documentation, retaining the existing group and all canonical article links.

Do not edit article Markdown, source evidence, dates, slugs, images, translation status or underlying clinical claims. Validate and independently confirm the live GitHub Pages output before calling this published.
