# Draft translations: parent wellbeing and early autism identification (23 November 2026)

## Scope and publication status

Four full English (EN) and Kazakh (KK) draft translations of two existing Russian Research Explained articles, plus four localized educational SVGs. Both Russian originals are unchanged. This set is separate from PR #269 and PR #270.

| Russian original | New translations | Original publishedAt | H2/H3 | Markdown table lines | Frontmatter scientific sources |
| --- | --- | --- | --- | --- | --- |
| `psihologicheskoe-blagopoluchie-roditeley-autizm-kazahstan.md` | `psychological-wellbeing-parents-autistic-children-kazakhstan.md` (EN), `kazakstandagy-autizmi-bar-balalardyn-ata-analarynyn-psihologiyalyk-al-aukaty.md` (KK) | 2026-10-16T14:22:08.196Z | 11/22 | 13 | 7 |
| `rannee-vyyavlenie-autizma-v-kazahstane.md` | `early-autism-identification-research-kazakhstan.md` (EN), `kazakstanda-autizmdi-erte-anyktau-zertteuleri.md` (KK) | 2026-10-15T21:06:21.091Z | 12/14 | 24 | 10 |

Each EN/KK draft has the same `translationKey` as its Russian original and the same `originalPublishedAt` and `displayPublishedAt`. No `publishedAt` is set in drafts, which remain `draft: true` and `translationStatus: pending`.

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

## Pre-publication editorial issue

The Russian early-identification original contains an inconsistency: it links to the site's operational first-stage M-CHAT-R page while later saying AutismHub does not run its own automatic screening. The first-stage page exists at `src/pages/kz/[lang]/tools/mchat-r.astro`. Both translations distinguish this page from the **missing Follow-Up stage** and refrain from calling first-stage scoring a diagnostic assessment. The Russian original has not been silently rewritten, but the owner should decide the final wording across all languages before publishing.

## Verification status

- Compared heading counts, table row counts, metadata sources, canonical original publication dates and external URLs against the Russian originals.
- Checked localized image paths exist in the translation branch and verified each SVG's key labels, values and structure. The initially mixed-language Kazakh early-identification footer was caught and corrected before PR.
- Drafts are excluded from public article routes. Passing a browser check does not constitute visual QA of these drafts.
- Required CI on final commit is pending at the time this report was created. Check `npm run check:type-scale`, `npm run validate`, article punctuation, translation parity and image QA in GitHub Actions.
- No independent native-language review, clinical review, external medical reviewer sign-off, merge or production publication has occurred.
