# KZ-HLP-006 to KZ-HLP-008: English translation quality record

**Prepared:** 10 October 2026
**Languages:** Russian source, English translation
**Scope:** School, family rights and social support, and checking services before payment in Kazakhstan.

## Translation map

| Russian source file | English translation file | Public English URL slug | Source photograph |
| --- | --- | --- | --- |
| `ru/autism-school-kazakhstan.md` | `en/en-autism-school-kazakhstan.md` | `autism-school-enrolment-support-kazakhstan` | `kz-help-006.jpg` |
| `ru/social-support-rights-kazakhstan.md` | `en/en-social-support-rights-kazakhstan.md` | `family-rights-social-support-kazakhstan` | `kz-help-007.jpg` |
| `ru/check-service-before-payment-kazakhstan.md` | `en/en-check-service-before-payment-kazakhstan.md` | `check-autism-service-before-payment-kazakhstan` | `kz-help-008.jpg` |

All three translations share their `translationKey` with the source, and retain the topic, section, author/editor, audience, risk boundary, image path, original sources and legal conditions. The public English routes use distinct slugs, preventing Astro content-ID collisions with the Russian articles.

## Terminology and editorial decisions

- **PMPK**: Kazakhstan's psychological, medical and pedagogical consultation service, assessing special educational needs. It is not a medical diagnostic body.
- **VKK**: medical advisory commission. Medical grounds for school education at home require the relevant medical decision, not autism or PMPK recommendations alone.
- **MSE**: medical and social expert assessment, used in disability determination and social protection.
- **IPAR**: individual rehabilitation and habilitation plan, a legal instrument for specific measures rather than an automatic entitlement to all services.
- State disability benefit and the allowance for a caregiver of a child with a disability must be distinguished.
- The ten-calendar-day response period under Article 42-4 applies to a written consumer complaint and the provider's **reasoned response when disputing the demands**. It is not an unconditional right to a full refund.
- School Grade 1 application dates are expressly tied to 2026-2027, not represented as perennial dates. Regional phased starts may differ.
- All legislation references use the official source links included with the Russian materials. English titles and source-specific annotation notes are translated, and official Russian-language destinations are labelled where relevant.

## QA and publication boundaries

The updated `npm run check:kz-help-en-translations` now checks eight article pairs and validates for each:
- `translationKey`, section, topic, authorship and featured photograph match;
- original official and clinical source URLs preserved in source order;
- number of headings and key points preserved;
- substantial body text rather than an abbreviated summary;
- distinct translated URL slugs and English cross-links matching actual article routes;
- published pages exist in the build and use the shared editorial v2 layout with the matching artwork;
- no disallowed em dash.

This is an **AI-assisted bilingual source-alignment, terminology and fluency review**, not an external or independent legal, medical or native-language review. No `externalReviewer` is recorded. The existing user's instruction authorises publication of the remaining English section after QA, and metadata should only be set to checked/published once the check is documented and passes.

The article contents provide general information as of the date specified in their source notes. They do not constitute tailored legal, clinical, education or financial advice. The live site requires separate responsive visual inspection after technical deployment.
