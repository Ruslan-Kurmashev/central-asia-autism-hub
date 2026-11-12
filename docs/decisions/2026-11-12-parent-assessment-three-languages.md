# Parent assessment subsection: six articles in three languages

Date: 12 November 2026

Status: owner explicitly requested review, translation, GitHub commit and publication.

## Decision

Publish Kazakh and English versions of the two existing Russian-only parent articles, `after-autism-assessment-kazakhstan` and `first-30-days-after-autism-diagnosis-kazakhstan`. Retain one combined assessment navigation group and the previously approved six-topic reading order in every language.

This updates the historical **6 RU / 4 KK / 4 EN** counts in decisions of 29 October 2026 to **6 RU / 6 KK / 6 EN** upon successful deployment. It does not reinstate the removed `after-diagnosis` navigation group.

## Evidence and editorial boundaries

- Preserve original Russian article content, `publishedAt`, canonical URLs and clinical limitations. New translation files have their own first-publication date `2026-11-12` and `originalPublishedAt` / `displayPublishedAt: 2026-09-14`.
- All section headings, table rows, the eight-item checklist and source URLs were compared between languages. Translation metadata reflects an editorial comparison, **not independent external clinical or native-language review**. The legal and medical claims retain the source article's stated limitations.
- The four new translated articles have the same registered Pexels cover identities as the source pages. The source-approved assessment-results cover was restored from the recorded Pexels source, not generated.
- UK NICE guidance does not define Kazakhstan law. The 30-day plan is illustrative, not a statutory timeframe. PMPK scheduling and assessment are distinct from service availability, and the MSE four-month referral rule has exceptions.
- Some translated articles link to existing Russian-only material. These links must be explicitly identified as Russian and not represented as translated pages.

## Implementation

- Four new locale files under `src/content/pages/kz/kk/` and `src/content/pages/kz/en/`.
- `scripts/check-user-journeys.mjs`: verify all six assessment rows and the curated order at 360, 768 and 1440 px.
- `docs/03-information-architecture.md`, `AGENTS.md` and the historical decision records are updated to reflect the actual publication inventory.
- Standard validation and GitHub Pages deployment remain mandatory. An accepted PR and commit do not by themselves prove publication.
