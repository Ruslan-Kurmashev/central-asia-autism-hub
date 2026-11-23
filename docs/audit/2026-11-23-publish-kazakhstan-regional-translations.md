# Publication record: six Kazakhstan research translations, 23 November 2026

## Scope and approval

The owner explicitly requested publication of the outstanding research translation batches from draft PR #269 and #270 on 23 November 2026. The old draft PRs were not merged because their common base predates the published PR #271; the six articles and four original-project SVG localizations were transferred to a clean branch from current `main`. No change to the Russian articles, their first-publication dates, the M-CHAT-R implementation, original figures, or other site components was made in this release.

The four article groups are:

| Russian source article | New language versions | Original RU first publication | H2 / H3 | Table lines | Sources |
| --- | --- | --- | ---: | ---: | ---: |
| `statistika-autizma-kazahstan-2020-2026.md` | EN and KK | 2026-10-15T17:10:00Z | 10 / 1 | 16 | 7 |
| `trudnosti-semey-detey-s-autizmom-v-kazahstane.md` | EN and KK | 2026-10-15T21:31:19.569Z | 12 / 14 | 38 | 8 |
| `regiony-kazahstana-registraciya-autizma.md` | KK, existing EN unchanged | 2026-10-15T17:17:00Z | 10 / 10 | 14 | 5 |
| `pochemu-rastet-chislo-diagnozov-autizma-v-kazahstane.md` | KK, existing EN unchanged | 2026-10-15T17:34:51.756Z | 11 / 9 | 11 | 7 |

All six translated pages retain their original RU `translationKey`, `originalPublishedAt` and `displayPublishedAt`. The translations have `publishedAt: '2026-11-23'`, `updatedAt: 2026-11-23`, `draft: false` and `translationStatus: checked`. This status records responsible-editor release approval and source/numeric/structural comparison, **not independent native-language, clinical or scientific peer review**. AI assistance is not represented as human review. All Russian `publishedAt` fields are preserved.

## Scientific safeguards

- The 17,196 children mentioned for 2026 were reported under medical monitoring, which is not an estimate of all autistic children in Kazakhstan. One separately sourced registration series runs from 3,568 in 2020 to 12,456 in 2024. Incompatible administrative series are not combined without explanation.
- The report of 73.3% among 390 responding parents and the report of 90.79% among 239 respondents from Karaganda Region refer to separate non-probability survey samples. They are not national prevalence estimates of family hardship.
- Registered children per 100,000 and first registrations per 100,000 are distinct measures. In Astana the values 712.9 and 221.4 must not be presented as the same indicator.
- The 214,904 aggregate child-year observations in a registry analysis are not 214,904 unique children with ASD. Correlation between registration changes, service availability and staffing is not evidence that any one factor caused a change.
- No translation asserts that vaccines cause autism, or that a screening tool establishes a diagnosis.

## Graphics and provenance

This release includes text-localized EN and KK versions of the existing original AutismHub SVGs `autism-kazakhstan-registered-2020-2024.svg` and `kazakhstan-asd-family-support-survey-2025.svg`. Numerical values, bar geometry and underlying source identity are unchanged. Localized graphics are registered in `docs/editorial-image-sources.md`. The two other Kazakh SVGs referenced by the regional and diagnosis articles already existed on `main` and were reused.

## QA and limits

Before writing to GitHub, all six translations were compared with their actual Russian originals for H2/H3 counts, table rows, number and URLs of source metadata, external body URLs, original publication dates, image references and forbidden editorial punctuation. These structural tests do not independently establish natural Kazakh or English phrasing or verify the underlying external primary publications afresh.

Final release requires GitHub CI on this exact branch after publication metadata is changed, including type-scale and full content validation, translation parity and article punctuation, plus Chromium checks of the now-published routes at supported viewport sizes. Do not call the pages publicly published until GitHub Pages deployment succeeds and the intended pages are verified. There was no independent professional linguistic or medical review.
