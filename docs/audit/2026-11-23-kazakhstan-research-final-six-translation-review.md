# Six remaining Kazakhstan / Central Asia research translations (23 November 2026)

## Scope and state

Six Russian articles within `topic: kazakhstan-research` have full English and Kazakh draft counterparts in `src/content/pages/kz/en/` and `src/content/pages/kz/kk/` (12 translated Markdown files total). All currently have `draft: true` and `translationStatus: pending` for responsible-editor approval. They must not be described as publicly released merely because they exist in Git.

1. Inclusive education in Kazakhstan.
2. Autism support technology in Kazakhstan.
3. Five-country Central Asian autism statistics.
4. History of research in Kazakhstan and Central Asia.
5. Research gaps in Central Asia.
6. Future research, collaboration and illustrative roadmap.

The final Kazakh article was added on 23 November 2026. Its 16 H2 sections, 6 H3 subsections, 22 Markdown table rows and 15 frontmatter sources match the Russian original. The other eleven drafts were already present in the working branch and were rechecked structurally.

## Structural checks performed on the working branch

For each of six RU/EN/KK topic groups, the following were compared programmatically using GitHub file contents: `translationKey`, original and displayed publication dates, numbers of H2/H3 headings, table rows, source entries, and complete sets of external URLs. No differences were found in those fields. Translation drafts have not changed the source Russian articles.

| Source article | H2 | H3 | Table rows | Frontmatter sources |
| --- | ---: | ---: | ---: | ---: |
| Inclusive education | 17 | 14 | 29 | 9 |
| Support technology | 13 | 12 | 25 | 12 |
| Five-country statistics | 13 | 4 | 28 | 11 |
| Research history | 14 | 15 | 28 | 12 |
| Research gaps | 15 | 17 | 20 | 10 |
| Future research | 16 | 6 | 22 | 15 |

All 12 EN/KK SVG files referenced within the translated articles exist in the branch. They contain `title` and `desc`, and have matching opening/closing SVG tags. Four last SVGs (research gaps and future roadmap, EN/KK) were localized on 23 November and entered in `docs/editorial-image-sources.md`. This source-level check does not establish visual legibility on mobile.

## Evidence cross-check: representative primary sources

A limited source-to-claim cross-check was completed against actual accessible scholarly records, beyond matching URLs to the Russian text:

- Zakirova-Engstrand and Yakubova: historical 11-study review, DOI https://doi.org/10.1177/13623613231170553 .
- Baikatov et al.: 214,904 child-year registry records must not be called distinct children, DOI https://doi.org/10.3389/fpsyt.2026.1880419 .
- Nukeshtayeva et al.: Kazakh/Russian M-CHAT-R/F internal consistency, not national diagnostic accuracy, DOI https://doi.org/10.23950/jcmk/11574 .
- Imamatdinova et al.: cross-sectional survey of 390 Kazakhstan parents, DOI https://doi.org/10.1186/s12889-025-23764-3 .
- Cage et al.: research priorities of 225 autistic adults in Scotland are not Central Asian preferences, https://pmc.ncbi.nlm.nih.gov/articles/PMC11401337/ .

**Scope limit:** this is not an exhaustive review of every statement or the full body text of all research reports. External URL parity proves identity of citations, not that every associated claim has been validated. No new claim-register record is marked `verified`.

## Release blockers and next checks

- Independent Kazakh native-language review and responsible human editorial sign-off are not recorded. An AI-assisted translation and cross-language structural comparison are not a professional-language review.
- The 12 draft translations are intentionally not marked `checked`, `publishedAt` or `draft: false` in this branch. The original Russian `publishedAt` dates were preserved through `originalPublishedAt` and `displayPublishedAt`.
- Source-level checks do not replace `npm run check:type-scale`, `npm run validate`, browser QA at 360/768/1440 px, mobile SVG-label inspection, or source-link/retraction review.
- GitHub Actions must be checked on this branch or PR. Only successful required checks and explicit editorial approval should precede merging and public Pages verification.

## Publication authorization and release metadata (23 November 2026)

After this original draft audit, the project owner explicitly instructed to publish all six article pairs. All 12 language versions were moved to `draft: false` and `translationStatus: checked` following editorial source/structure/limitation parity checks. Their real translation publication date is `2026-11-23T00:00:00Z`, while the originals' `publishedAt` remain unchanged and translations retain `originalPublishedAt` and `displayPublishedAt` from the Russian sources. AI-assisted translation is not described as independent professional language or medical review. The outdated ASI safety-check phrase was replaced with the scientifically equivalent wording used in the current, unchanged ASI article, preserving the fail-closed check for inconclusive efficacy evidence.
