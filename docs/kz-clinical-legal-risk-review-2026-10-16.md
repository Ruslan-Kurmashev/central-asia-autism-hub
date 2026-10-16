# AutismHub Kazakhstan: clinical and legal risk review, wave 1

**Date:** 16 October 2026  
**Scope:** The 25 published Russian Kazakhstan professional document overviews (8 education, 5 healthcare, 3 psychology, 5 social support and 4 rights/data); targeted review of the parent diagnostic pathway and the family social-support guide.

## What this review does and does not confirm

- All 25 professional-document articles were inspected for their risk classifications, source URLs, source provenance, update dates, next review dates and evidence-limitations statements. All list primary Kazakhstan institutional/government/legal references, although the presence of a citation does **not** confirm every provision's current legal force.
- The five healthcare document reviews are flagged `riskLevel: high`, carry medical boundaries and have a scheduled recheck of 12 January 2027. These are **not** independently peer reviewed.
- This is a metadata/provenance triage and one focused primary-source verification, not an independent medical, legal or claim-by-claim audit of all 25 documents.

## Substantive primary-source finding

**2021 Kazakhstan ASD clinical protocol, approved 30 July 2021, No. 145:** the original protocol text is available as a PDF hosted by the National Scientific Center for Health Development named after Salidat Kairbekova (Ministry of Health of Kazakhstan, `nrchd.kz`). Its first page records the title, approving commission, 30 July 2021 and No. 145; it includes ICD-10 categories F84.0, F84.1, F84.4 and F84.5.

- Institutional source: see the `nrchd.kz/storage/documents/` URL in `src/content/pages/kz/ru/kz-healthcare-autism-clinical-protocol.md` and `src/content/pages/kz/ru/autism-diagnosis-kazakhstan.md`.
- Secondary archived copy: MedElement clinical protocols 2021 (the article retains its source link).
- The governing rules for clinical-protocol development and review were amended by Kazakhstan Order No. 15 of 24 February 2026: https://www.adilet.zan.kz/rus/docs/V2600038036 . That change does **not** certify the currently applicable version of the 2021 ASD protocol.
- **Unresolved:** no authoritative current-force registry confirmation or written Ministry clarification was established on 16 October 2026 that protocol No. 145 remains in effect without replacement or amendments. A document being hosted on an institutional site proves the availability of the published version, not its active clinical or legal applicability.

## Changes committed

1. The 2021 ASD protocol professional overview now cites the institutional PDF first, verifies the passport details, keeps MedElement as secondary provenance and explicitly distinguishes document existence from current-force status.
2. The parent article `autism-diagnosis-kazakhstan.md` now makes the same distinction in the medical evidence limitation and source note. No claim of individual diagnostic authority was added.
3. The Kazakhstan social-support guide `social-support-rights-kazakhstan.md` gained an explicit `reviewDueAt: 2027-01-09`; its legal claims were not otherwise changed.
4. `scripts/check-kz-professional-library.mjs` now requires the institutional ASD PDF as a primary source, retains secondary provenance, checks sensible review dates and enforces high-risk/medical-disclaimer metadata for the five healthcare overviews.

## Remaining work, prioritized

| Priority | Item | Reason and acceptance condition |
| --- | --- | --- |
| P1 | Obtain an official, up-to-date status confirmation of ASD protocol No. 145 | Confirm replacement/amendment history with the official Kazakhstan protocol registry or the responsible Ministry/National Center; until then retain the uncertainty notice. |
| P1 | Independent qualified review of the five healthcare document overviews | Confirm actual reviewer, qualifications, review date and article version before adding any external-review claim. Do not invent a reviewer. |
| P1 | Recheck parent-facing diagnostic and disability routes before the dates in article metadata | Highest consequence of outdated referral, M-CHAT-R or MSE advice for families. |
| P2 | Recheck all 20 non-healthcare normative document summaries against the latest full texts, including effective dates | The current triage verifies source provenance, not the full current state or every amendment. |
| P2 | Update expired review dates and detect legal changes routinely | Review windows are checkpoints, not evidence that the article remains current without inspection. |

**Editorial boundary:** This log is not a certification, a legal opinion, a clinical practice instruction, or an independent expert peer review.
