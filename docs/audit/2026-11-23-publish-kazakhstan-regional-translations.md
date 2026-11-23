# Publication record: Kazakhstan family and statistics translations, 23 November 2026

## Scope and approval

The project owner requested publication of the outstanding research translation batches from draft PR #269 and #270. The first release candidate exposed two **duplicate Kazakh translations** through `check:translation-parity`: the regional registration and diagnosis-increase articles already had distinct, published KK versions on `main` since **22 November 2026**. The duplicate files from draft PR #270 were therefore excluded from this release, and the two existing published translations were preserved unmodified. The CI gate was not disabled.

This release publishes four new full translations from the earlier draft PR #269, using a fresh branch based on current `main`, alongside four localized SVG charts, image provenance and this audit:

| Russian original | New translations | Original Russian publishedAt | H2 / H3 | Table lines | Sources |
| --- | --- | --- | ---: | ---: | ---: |
| `statistika-autizma-kazahstan-2020-2026.md` | EN and KK | 2026-10-15T17:10:00Z | 10 / 1 | 16 | 7 |
| `trudnosti-semey-detey-s-autizmom-v-kazahstane.md` | EN and KK | 2026-10-15T21:31:19.569Z | 12 / 14 | 38 | 8 |

Already on `main`, unchanged by this release:

| Russian original | Previously published Kazakh | KK publishedAt | H2 / H3 | Sources |
| --- | --- | --- | ---: | ---: |
| `regiony-kazahstana-registraciya-autizma.md` | `kazakstannyn-kai-onirlerinde-autizm-zhiirek-tirkeledi.md` | 2026-11-22 | 10 / 10 | 5 |
| `pochemu-rastet-chislo-diagnozov-autizma-v-kazahstane.md` | `kazakstanda-autizm-diagnozdary-nege-kobeip-zhatyr.md` | 2026-11-22 | 11 / 9 | 7 |

The four new EN/KK translations retain matching original `translationKey`, `originalPublishedAt`, and `displayPublishedAt` and have `publishedAt: '2026-11-23'`, `updatedAt: 2026-11-23`, `draft: false`, and `translationStatus: checked`. The owner explicitly requested release. This editorial release approval and structural verification is **not** independent professional Kazakh/English proofreading or clinical or scientific peer review. The original Russian `publishedAt` values remain unchanged.

## Scientific safeguards

- Kazakhstan's 2026 report of 17,196 children concerns those under medical observation, **not** the full population prevalence of autism. The 2020-2024 electronic registration series is a distinct administrative series and must not be mixed with other reporting methods without caveats.
- Family difficulties: 73.3% of **390** respondents in one parent survey reported insufficient state support, whereas 90.79% of **239** Karaganda Region respondents in a different survey reported financial difficulties. These are separate, non-probability samples, not national rates.
- Administrative registrations, first registrations, population prevalence, sample percentages, diagnosed cases and screened children are not interchangeable.

## Graphics and provenance

The release includes original-project English and Kazakh SVG text localizations of `autism-kazakhstan-registered-2020-2024.svg` and `kazakhstan-asd-family-support-survey-2025.svg`. Values, bar geometry, colour palette and sources were preserved. The four new SVG paths and origin notes are registered in `docs/editorial-image-sources.md`. No new AI cover was created.

## QA and limits

The drafts were checked against the Russian source files for H2/H3 counts, Markdown table row counts, frontmatter source counts and external URL sets, first-publication dates, images and prohibited editorial punctuation. Structural and numeric cross-checks cannot guarantee that every Kazakh or English phrase is linguistically ideal, or substitute for independent medical validation.

An initial validation run failed with `duplicate locale kk` for the two already published article groups. Both duplicate translated files were deleted from this release branch. Rerun `npm run check:translation-parity`, `npm run validate`, typography and Chromium published-page QA on the final commit. No QA gate was disabled. A Git commit alone is not proof that GitHub Pages has deployed or that live pages have been inspected.
