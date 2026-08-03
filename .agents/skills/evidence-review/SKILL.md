---
name: evidence-review
description: Audit factual, scientific, medical, and Kazakhstan-specific claims in Autism Hub drafts against the sources actually supplied or cited. Use before publication, after substantive revision, or when checking terminology, evidence strength, limitations, and claim-to-source alignment; do not use as final clinical approval or to invent missing evidence.
---

# Evidence review workflow

## Prepare the review

Require the complete draft and its source pack or cited source links. Read `docs/04-editorial-evidence-medical-safety.md` completely. When publication metadata or content readiness is in scope, also read `docs/08-content-material-template.md` and `src/content.config.ts`.

Record which files, pages, and source versions were actually inspected. If a source is inaccessible, incomplete, retracted, corrected, or available only as an abstract when full text is required, state that limitation rather than filling the gap from memory.

## Review every material claim

1. Extract each factual, medical, scientific, legal, service, and Kazakhstan-specific claim.
2. Identify the cited source intended to support it.
3. Read the relevant source passage and determine whether it supports the exact wording, population, setting, timeframe, and degree of certainty.
4. Evaluate study design, applicability, limitations, risk of bias, precision, conflicts of interest where available, and whether a more appropriate source type is required.
5. Check association versus causation, exploratory versus confirmatory findings, statistical versus practical importance, screening versus diagnosis, and general information versus individual advice.
6. Check that uncertainty and evidence limitations are visible to the intended audience.
7. Verify bibliographic metadata separately from claim support. A valid DOI or accurate title does not prove that the source supports the claim.

Assign exactly one status to each claim:

- `supported`;
- `partially supported`;
- `unsupported`;
- `overstated`;
- `outdated`;
- `source unavailable`;
- `not applicable`.

## Return the report

Provide:

1. review scope and materials inspected;
2. a table with `passage`, `claim`, `source`, `status`, `rationale`, and `recommended action`;
3. missing, inaccessible, corrected, or potentially retracted sources;
4. medical-boundary, conflict-of-interest, translation, and metadata findings;
5. unresolved questions requiring the project owner or a qualified human reviewer;
6. readiness as `NOT READY`, `READY FOR HUMAN REVIEW`, or `READY FOR TECHNICAL INTEGRATION`.

Use precise replacement wording only for the affected sentence when helpful. Do not silently rewrite the article, add uncited facts, select a source only because it is convenient, claim independent clinical or scientific review, or grant final publication approval.
