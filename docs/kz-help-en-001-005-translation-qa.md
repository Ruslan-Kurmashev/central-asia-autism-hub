# KZ-HLP-001 to 005: English translation quality and release record

**Prepared:** 10 October 2026  
**Scope:** Five published Russian Kazakhstan-help articles translated into English.  
**Status:** Prepared and structurally verified; awaiting editorial approval to mark translation as checked and release.

## Source and output mapping

| Russian source | English draft | Topic |
| --- | --- | --- |
| `kz/ru/help-kazakhstan-start.md` | `kz/en/autism-support-kazakhstan-start.md` | Starting the support pathway |
| `kz/ru/development-concerns-kazakhstan.md` | `kz/en/development-concerns-kazakhstan.md` | Developmental concerns and first contact |
| `kz/ru/verify-specialist-center-kazakhstan.md` | `kz/en/verify-specialist-center-kazakhstan.md` | Verifying a specialist or centre |
| `kz/ru/check-medical-license-kazakhstan.md` | `kz/en/check-medical-license-kazakhstan.md` | eGov and eLicense lookup |
| `kz/ru/autism-kindergarten-kazakhstan.md` | `kz/en/autism-kindergarten-kazakhstan.md` | Preschool support |

## Source-parity checks

The translation check (`npm run check:kz-help-en-translations`) verifies:
- Same section, topic, stable `translationKey`, author/editor and image URL.
- All official and clinical reference URLs preserved in the **same order**.
- Same count of top-level and subheadings and key point bullets.
- English body not substantially abbreviated.
- Target slugs for internal English-language cross-references exist in this translated wave.
- Only explicit Russian-language labels used for links without an English equivalent.
- `translationStatus: pending` and `draft: true` until editorial approval.
- No disallowed em dash character in repository text.

## Editorial wording decisions

1. Explain **PMPK** once as Kazakhstan's psychological, medical and pedagogical consultation service; retain the local acronym for legal identification.
2. Explain **PMSP** as primary healthcare, **VKK** as a medical advisory commission and **MSE** as medical and social expert assessment.
3. Differentiate **developmental screening**, medical ASD diagnosis, educational needs assessment and disability assessment throughout.
4. Retain local legal instrument numbers and effective dates: PMPK Order No. 180-NQ dated 26 June 2026; MSE amendments effective 25 August 2026; Law No. 332-VIII dated 2 July 2026, Article 17 commencement in 2028 and Article 21 registration transition; preschool Order No. 144-NQ dated 29 May 2026.
5. Preserve the meaning of conditions, exceptions and caveats. Neither a medical diagnosis nor a PMPK conclusion automatically guarantees disability status or a place in a specific institution.
6. Localise source titles and individual source annotations into English while retaining the exact source URLs. Official Russian legal-text pages remain linked and are identified as Russian-language where relevant.
7. Reuse the exact five local licensed photographs rather than producing new or AI-generated visuals.
8. English body links between these five translations point to English pages. Other resources are clearly identified as Russian-language originals.

## Limitations and release gate

These checks are an **AI-assisted translation and source-consistency audit**, not an independent professional language, medical or legal review and not approval by the responsible project editor. A passing CI check does not assess every nuance of legal translation or professional writing style.

Before release, the responsible editor must approve the finished English wording and source-specific caveats. Only then change `translationStatus` from `pending` to `checked`, set `draft: false`, add appropriate publication/update dates, and merge after successful CI. Do not represent this record as an external review or as user approval.
