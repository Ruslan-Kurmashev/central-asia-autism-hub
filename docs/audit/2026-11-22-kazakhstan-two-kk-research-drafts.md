# Kazakhstan regional autism research: two Kazakh drafts, 22 November 2026

## Scope

Two **existing published Russian articles** already have published English equivalents but no Kazakh entry on `main`. This branch adds only the missing Kazakh body translations. The existing Kazakh-language SVGs are reused without modifying their artwork or sources.

| Russian source | Existing English | New Kazakh draft | H2 / H3 | Table lines | Sources |
| --- | --- | --- | ---: | ---: | ---: |
| `regiony-kazahstana-registraciya-autizma.md` | `which-regions-of-kazakhstan-register-autism-more-often.md` | `kazakstannyn-onirlerinde-autizm-tirkelui.md` | 10 / 10 | 14 | 5 |
| `pochemu-rastet-chislo-diagnozov-autizma-v-kazahstane.md` | `why-autism-diagnoses-are-increasing-in-kazakhstan.md` | `kazakstanda-autizm-diagnozy-nege-kobeiedi.md` | 11 / 9 | 11 | 7 |

All three versions in each row use the same `translationKey`. The table, heading, source-count and external URL parity figures were compared in memory before the GitHub commit. This does not constitute independent translation quality assurance.

## Critical interpretation preserved

- Registered ASD cases are **not population prevalence**.
- In Astana, the ministry-reported 2025 value of **712.9** refers to children already registered per 100,000, while the 2026 paper's **221.4** refers to first registrations per 100,000. The two are not interchangeable.
- The 214,904 national registry observations are **child-years across diagnostic groups**, not 214,904 unique children with ASD.
- Concurrent changes in specialist density, policy, diagnoses and registrations do not establish causation.
- Vaccination is not presented as a cause of autism. Screening is distinct from diagnosis.
- The chart paths point to already existing Kazakh SVGs with matching numeric values.

## Publication safeguards

- The Russian sources are unchanged, including the original publication dates.
- Kazakh documents use the matching `originalPublishedAt` and `displayPublishedAt` values, with no `publishedAt`.
- `translationStatus: pending`, `draft: true` remain set.
- Human Kazakh-language and medical review are **not** claimed. No new claim-level validation or publication is asserted.
- Before release: editorial read-through by a qualified Kazakh-language reviewer, final validation on the final commit, and explicit publication decision.
- The browser workflow may skip draft content when enumerating changed routes, so a green browser check would not prove these draft pages were visually reviewed.
