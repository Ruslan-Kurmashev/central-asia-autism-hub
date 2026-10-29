# Parent assessment navigation merge - 29 October 2026

**Status:** Owner-approved information-architecture decision, implementation tracked by the related GitHub PR.

## Decision

The parent landing page must contain one combined `Assessment and diagnosis` topic instead of separate `Assessment and diagnosis` and `After assessment and diagnosis` groups.

The two Russian articles previously under the latter group remain individually published and appear after the existing four Russian assessment/diagnosis articles. The combined group has six entries in RU. Kazakh and English each list four genuinely published articles (without the two untranslated post-diagnosis guides) and never show a Russian article as an available translated version.

## Rationale and scope

The post-diagnosis guidance logically follows assessment and should be part of the same reading path. This reduces one unnecessary accordion and avoids splitting a single parent journey across adjacent groups.

Only the parent-page grouping, labels/descriptions, display order, navigation QA, and applicable project instructions/documentation are in scope. No Markdown source is moved, duplicated, or edited. Article URLs, `translationKey`, `publishedAt`, `updatedAt`, and language status are preserved.

## Affected paths

- `src/pages/kz/[lang]/[section]/index.astro`
- `scripts/check-user-journeys.mjs`
- `docs/03-information-architecture.md`
- `docs/decisions/README.md`
- `AGENTS.md`

This decision supersedes the earlier two-group parent navigation implemented in the component and the obsolete six-topic count in the architecture document. Release and browser validation must pass before the change is merged and deployed. A merge commit is not evidence of completed GitHub Pages deployment.
