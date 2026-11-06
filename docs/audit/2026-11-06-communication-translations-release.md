# Communication and speech translation release QA

Date: 2026-11-06

## Scope

First public release of the English and Kazakh versions of five previously published Russian parent articles: AAC, speech-language therapy, communication partner training, PECS and functional communication training (FCT). Russian source files and their first-publication dates are unchanged.

Project owner explicitly requested publication in the conversation on 2026-11-06. This documents publication authorization, not independent expert or native-speaker review.

## Checks performed

- All ten translations were compared with their Russian sources for H2/H3 section counts and sequence, scientific source URLs, major numeric findings, warnings and Kazakh-specific service qualifications. Automated checks of source list and heading parity had no mismatches.
- Cross-checks against PubMed abstracts confirmed the numbers cited in the 2025 FCT meta-analysis (PMID 41464031), 2026 PECS meta-analysis (PMID 41442835) and parent-mediated intervention meta-analysis (PMID 40358871).
- Frontmatter for each locale was checked for language, translationKey, stable source display date, release date, source list, draft status and translation status.
- One Kazakh wording error was corrected before first release in the speech-language support article.
- No cover files, approved PECS diagrams, Russian originals, shared components, schemas or citation URLs were changed. After the initial commit, localized slugs and cross-article links were adjusted to prevent Astro content collection ID collisions with the Russian source slugs. No previously published Russian URLs were modified.
- PECS examples include existing image artwork with Russian wording. English and Kazakh captions explain this limitation. The artwork was retained instead of altering previously approved source images.

## Translation release inventory

- `src/content/pages/kz/en/aac.md`: 19 main headings, 13 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/kk/aac.md`: 19 main headings, 13 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/en/speech-language-therapy.md`: 20 main headings, 8 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/kk/speech-language-therapy.md`: 20 main headings, 8 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/en/communication-partner-training.md`: 18 main headings, 7 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/kk/communication-partner-training.md`: 18 main headings, 7 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/en/pecs.md`: 14 main headings, 9 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/kk/pecs.md`: 14 main headings, 9 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/en/functional-communication-training.md`: 12 main headings, 6 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.
- `src/content/pages/kz/kk/functional-communication-training.md`: 12 main headings, 6 frontmatter sources, original displayed date 2026-09-18, release date 2026-11-06.

## Editorial limitations

This is an AI-assisted comparative editorial check with direct owner publication authorization, not independent clinical peer review or native-speaker linguistic certification. The published article should not imply either. The project editor remains responsible for ongoing corrections. CI validates structural, metadata, accessibility and linking requirements but does not establish linguistic or clinical accuracy.

First publication dates for translations are 2026-11-06. Original displayed dates remain 2026-09-18.

## Route collision correction

The first release commit reused source-language `slug` values in all three locales. Astro did not generate the ten translated routes, and Chromium QA failed when mapping changed source files to search-index entries. The following new locale-specific slugs correct this without changing the Astro collection loader or existing Russian routes:

- `src/content/pages/kz/en/aac.md` -> `aac-communication-guide`
- `src/content/pages/kz/en/speech-language-therapy.md` -> `speech-language-therapy-autism`
- `src/content/pages/kz/en/communication-partner-training.md` -> `communication-partners-training`
- `src/content/pages/kz/en/pecs.md` -> `pecs-picture-exchange-system`
- `src/content/pages/kz/en/functional-communication-training.md` -> `fct-functional-communication-training`
- `src/content/pages/kz/kk/aac.md` -> `aac-balamaly-kosymsha-kommunikatsiya`
- `src/content/pages/kz/kk/speech-language-therapy.md` -> `autizm-soileu-tiline-koldau`
- `src/content/pages/kz/kk/communication-partner-training.md` -> `kommunikatsiya-seriktesterin-okytu`
- `src/content/pages/kz/kk/pecs.md` -> `pecs-suret-almasu-kommunikatsiya`
- `src/content/pages/kz/kk/functional-communication-training.md` -> `fct-funktsionaldyk-kommunikatsiya`

Re-run source validation, generated-page checks and browser QA on the corrective commit. The initial release commit alone does not establish publication.
