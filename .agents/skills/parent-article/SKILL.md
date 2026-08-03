---
name: parent-article
description: Create or revise a Russian parent-facing Autism Hub Kazakhstan information article from an approved brief and supplied source pack, using the repository's editorial policy, content schema, and Markdown template. Use for parent explainers and general guidance drafts; do not use to publish, translate, or create unsupported medical or Kazakhstan-specific claims.
---

# Parent article workflow

## Establish the inputs

Require:

- a defined topic, audience, and intended reader outcome;
- an approved scope or brief;
- the source pack for every medical, scientific, legal, service, and Kazakhstan-specific claim;
- the target content path or confirmation that the result should remain in chat.

If sources needed for the requested claims are missing, identify the missing evidence and stop before drafting those claims. A structural placeholder may be prepared only when it is clearly labelled as incomplete and contains no invented facts.

## Read the project requirements

Read these files completely before drafting:

1. `docs/04-editorial-evidence-medical-safety.md`;
2. `docs/08-content-material-template.md`;
3. `src/content/templates/general-article.md`;
4. `src/content.config.ts`;
5. the existing target draft, if one exists.

Read `docs/01-brand-architecture.md`, `docs/02-mvp-scope.md`, or `docs/03-information-architecture.md` when naming, scope, navigation, or Kazakhstan positioning is material to the task.

## Draft the material

1. Extract the factual, medical, scientific, and Kazakhstan-specific claims the article needs.
2. Build a working claim-to-source map before writing prose.
3. Classify the editorial risk using Document 04. Do not produce individual advice or original high-risk recommendations.
4. Follow the existing general-article template and current schema. Add optional sections only when the brief and evidence justify them.
5. Write in clear, respectful Russian without stigmatizing language, fear-based framing, cure claims, guaranteed outcomes, or a single stereotypical presentation of autism.
6. Separate established information, variability, uncertainty, practical interpretation, and limits on what the reader should conclude.
7. Paraphrase sources in original language. Do not reproduce abstracts, tables, figures, or long copyrighted passages.
8. Preserve an existing `slug`, `translationKey`, and other stable metadata unless the task explicitly requires a change.

For a new or unapproved record:

- set `draft: true`;
- use `translationStatus: pending` until a documented source-language or translation check occurs;
- leave `externalReviewer` absent unless a real independent reviewer is documented;
- do not invent publication, update, review, source-access, or verification dates;
- include only sources actually consulted.

## Check the draft

Before returning the result:

1. map each material claim back to a source;
2. mark unsupported, partially supported, inaccessible, or uncertain items explicitly;
3. check screening, assessment, diagnosis, support, and treatment terminology;
4. check the disclaimer, conflict-of-interest statement, authorship, and review transparency;
5. confirm that Kazakhstan-specific statements do not generalize across regions without evidence;
6. validate frontmatter against `src/content.config.ts` when a file was created or edited.

Return the draft together with unresolved evidence gaps, metadata still requiring human input, files changed, checks run, and readiness as `DRAFT — NOT READY FOR PUBLICATION` or `DRAFT — READY FOR EVIDENCE REVIEW`.

Do not set `draft: false`, publish, deploy, translate automatically, claim medical review, or make the final editorial decision.
