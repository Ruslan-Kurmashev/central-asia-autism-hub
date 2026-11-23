# Parent wellbeing and early autism identification: translation preparation and publication decision (23 November 2026)

## Translation preparation and subsequent release

Four English (EN) and Kazakh (KK) translations of two existing Russian Research Explained articles were first committed as drafts, with four localized SVGs. The subsequent owner-approved release on 23 November 2026 changed their publication metadata and corrected one factual statement in the Russian early-identification original. This work is separate from PR #269 and PR #270.

| Russian original | New translations | Original publishedAt | H2/H3 | Markdown table lines | Frontmatter scientific sources |
| --- | --- | --- | --- | --- | --- |
| `psihologicheskoe-blagopoluchie-roditeley-autizm-kazahstan.md` | `psychological-wellbeing-parents-autistic-children-kazakhstan.md` (EN), `kazakstandagy-autizmi-bar-balalardyn-ata-analarynyn-psihologiyalyk-al-aukaty.md` (KK) | 2026-10-16T14:22:08.196Z | 11/22 | 13 | 7 |
| `rannee-vyyavlenie-autizma-v-kazahstane.md` | `early-autism-identification-research-kazakhstan.md` (EN), `kazakstanda-autizmdi-erte-anyktau-zertteuleri.md` (KK) | 2026-10-15T21:06:21.091Z | 12/14 | 24 | 10 |

All four EN/KK pages retain the Russian `translationKey`, `originalPublishedAt` and `displayPublishedAt`. At initial preparation, these were pending drafts. The project owner explicitly approved their publication on 23 November 2026. Release metadata now reads `draft: false`, `translationStatus: checked` and `publishedAt: '2026-11-23T00:00:00Z'`, reflecting the translation publication date rather than rewriting the original Russian dates. The `checked` status records responsible-editor release approval after numerical and structural cross-checking, **not** independent linguistic or clinical peer review.

## Chart provenance

Four localized derivatives of AutismHub-owned SVGs were added without changes to Russian figures:

- `kazakhstan-autism-caregiver-mental-health-2018-en.svg` and `-kk.svg`: retains 61.0%, 52.9% and 53.7% symptom scores among 136 complete DASS-21 respondents. These are overlapping self-reports, not national psychiatric diagnoses.
- `kazakhstan-autism-early-detection-pathway-en.svg` and `-kk.svg`: retains the four-stage conceptual pathway and a direct route from parental concerns to professional assessment. This is not the M-CHAT-R/F questionnaire or a diagnostic algorithm.

Image origins and evidence boundaries recorded in `docs/editorial-image-sources.md`.

## Scientific interpretation and limitations

- The early-identification translations retain the essential distinction among developmental observation, screening, two-stage M-CHAT-R/F including Follow-Up, professional assessment and clinical diagnosis.
- The 2022 Kazakhstan sample of 171 children measured internal consistency of the language questionnaires. Cronbach alpha 0.87 and 0.93 **do not** mean 87% or 93% clinical diagnostic accuracy.
- In the 526-child Karaganda study, 144/526 (27.4%) is the combined initial medium-risk (76) and high-risk (68) categories. The paper's abstract describes 27.4% as high risk. Neither percentage is a population prevalence or confirmed diagnosis.
- International meta-analytic estimates sensitivity 0.83, specificity 0.94 and PPV 57.7% are not automatically validated for Kazakhstan.
- The wellbeing article distinguishes questionnaire symptoms (61.0% stress, 52.9% anxiety, 53.7% depressive symptoms) from psychiatric diagnoses, in a convenience sample of 136 complete respondents. Another nonrandom study included 327 parents and interviewed 10 psychologists.
- Associations with perceived support, employment and social acceptance are not causal intervention effects. WHO educational material is not proof of programme availability or clinical effectiveness in Kazakhstan.
- All external source URLs in both language versions matched their Russian originals in the translation-source comparison. No comprehensive new source/retraction review or human claim verification was performed here.

## Resolved factual inconsistency about available first-stage M-CHAT-R

The project owner confirmed that AutismHub already offers the initial M-CHAT-R stage. The Russian original was amended only where it had incorrectly stated that the website offers no automatic first-stage screening, and its `updatedAt` was advanced to 23 November 2026 without changing original `publishedAt`. EN and KK now accurately describe an online first-stage page at `src/pages/kz/[lang]/tools/mchat-r.astro` with score interpretation, not the two-stage M-CHAT-R/F: **no Follow-Up interview is conducted and a score is not an autism diagnosis**. This editorial correction does not assert that the instrument rightsholder licence has been independently verified, and it does not alter the instrument's actual code, licensed items, scoring or medical pathway.

## Verification and release status

- Compared heading counts, table row counts, metadata sources, canonical original publication dates and external URLs against the Russian originals.
- Checked localized image paths exist in the translation branch and verified each SVG's key labels, values and structure. The initially mixed-language Kazakh early-identification footer was caught and corrected before PR.
- The initial draft-page browser checks did not visually inspect the drafts. Release CI must now exercise the published pages, with QA screenshots reviewed where available.
- The initial draft PR passed GitHub CI. After release metadata and Russian copy updates, final commit CI is required, including `npm run check:type-scale`, `npm run validate`, article punctuation, translation parity, published-page browser QA and image checks. Record their actual results before merging.
- No independent native-language review, independent clinical review or external medical reviewer sign-off occurred. The owner approved publication under the one-person editorial policy. Deployment and public-page status must be verified independently after merge.
