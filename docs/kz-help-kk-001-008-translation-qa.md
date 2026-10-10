# Kazakh translation QA: Kazakhstan help KZ-HLP-001 to 008

**Prepared:** 10 October 2026  
**Scope:** Eight translations from published Russian originals.  
**Review type:** AI-assisted bilingual translation, terminology and source-alignment check; no independent native-language, legal or medical reviewer is claimed.

## Article mapping

| Source RU | Kazakh source file | Public Kazakh URL slug | Featured photograph |
| --- | --- | --- | --- |
| help-kazakhstan-start | kk-help-kazakhstan-start.md | autizm-komek-kazakstan-bastau | kz-help-001.jpg |
| development-concerns-kazakhstan | kk-development-concerns-kazakhstan.md | bala-damuy-boyynsha-komek-kazakstan | kz-help-002.jpg |
| verify-specialist-center-kazakhstan | kk-verify-specialist-center-kazakhstan.md | autizm-maman-ortalyk-tekseru | kz-help-003.jpg |
| check-medical-license-kazakhstan | kk-check-medical-license-kazakhstan.md | meditsinalyk-litsenziya-tekseru-kazakstan | kz-help-004.jpg |
| autism-kindergarten-kazakhstan | kk-autism-kindergarten-kazakhstan.md | autizm-balabaksha-kazakstan | kz-help-005.jpg |
| autism-school-kazakhstan | kk-autism-school-kazakhstan.md | autizm-mektep-kazakstan | kz-help-006.jpg |
| social-support-rights-kazakhstan | kk-social-support-rights-kazakhstan.md | otbasy-aleumettik-koldau-kazakstan | kz-help-007.jpg |
| check-service-before-payment-kazakhstan | kk-check-service-before-payment-kazakhstan.md | kyzmetti-tolemge-deyin-tekseru-kazakstan | kz-help-008.jpg |

## Source, image and structure parity

The test `scripts/check-kz-help-kk-translations.mjs` checks all eight pairings for identical topic, section, stable translationKey, author/editor, risk level, photograph URL, original legal and clinical source URLs in the **same order**, count of source headings and key points, non-abbreviated body length, and internal links to the complete set of Kazakh article slugs. When a translation is published, the test also validates the generated HTML route, shared `article-v2__layout` and exact source photograph.

Kazakh source filenames are prefixed with `kk-` and every Kazakh article has a distinct public URL slug. Astro uses the `slug` field as the content ID; uniqueness ensures that no Russian or English publication is replaced at build time.

## Terminology choices

- **ПМПК** - психологиялық-медициналық-педагогикалық консультация. It assesses special educational needs and does not replace medical diagnosis.
- **ППҚҚ** - психологиялық-педагогикалық қолдау қызметі. The Kazakh title in 2026 Order No. 144-NQ was used instead of wording from superseded guidance. Source: https://adilet.zan.kz/kaz/docs/V2600038856.
- **МСАК** - алғашқы медициналық-санитариялық көмек (the Russian-language sources call this ПМСП).
- **ДКК** - дәрігерлік-консультациялық комиссия (Russian ВКК).
- **МӘС** - медициналық-әлеуметтік сараптама (Russian МСЭ).
- **ОЖБ** - мүгедектігі бар адамды абилитациялаудың және оңалтудың жеке бағдарламасы (Russian ИПАР). The Kazakh formal term was checked against the MSE regulation: https://adilet.zan.kz/kaz/docs/V2300032922.
- The official 2026 law is titled **«Психологиялық қызмет туралы»**, with Kazakh legal text at https://adilet.zan.kz/kaz/docs/Z2600000332.
- Consumer protections are described carefully: the 10-calendar-day written response under Article 42-4, where the provider disagrees with the demands, does not automatically establish a full-refund right.
- School admissions dates are explicitly limited to the **2026-2027** academic year, and MSE disability status is not an automatic consequence of an autism diagnosis.

## Source language, editorial qualifications and release

Official reference metadata URLs are preserved exactly from the Russian originals for traceability. Where the article body points to an official Kazakh version of the same Adilet law, the link is labelled accordingly. Russian-only AutismHub resources remain labelled **(орыс тілінде)**, not falsely represented as translated.

This is a source-aligned, manually authored Kazakh translation and an AI-assisted wording and terminology review, **not an independent human linguistic, legal or clinical review**. No `externalReviewer` field is added, and technical CI does not replace browser-based responsive screenshot QA.

The user's current request to continue the multilingual publication phase authorises preparation and release once the articles pass the repository's publication checks. All translations remain drafts until the check is documented. The release commit changes translationStatus to checked, adds publication/update dates and switches draft to false. Further editorial corrections may be made under the project's published editorial policy.
