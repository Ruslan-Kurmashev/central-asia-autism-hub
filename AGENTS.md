# Central Asia Autism Hub — repository instructions

## Scope and sources of truth

Work only within the requested scope. Inspect the relevant implementation before proposing or making changes. Preserve user changes and avoid unrelated rewrites.

Treat the approved documents in `docs/` as the product and policy sources of truth:

- `docs/01-brand-architecture.md` for naming, positioning, languages, and routes;
- `docs/02-mvp-scope.md` for included and excluded capabilities;
- `docs/03-information-architecture.md` for navigation and page hierarchy;
- `docs/04-editorial-evidence-medical-safety.md` for claims, sources, review, and medical boundaries;
- `docs/05-privacy-and-data.md` for data collection, analytics, and privacy;
- `docs/06-design-and-accessibility.md` for visual and accessibility requirements;
- `docs/07-technical-plan.md` for architecture, dependencies, validation, and deployment;
- `docs/08-content-material-template.md` for information-material structure and metadata.

Read only the documents relevant to the task, but read each selected document completely. Do not silently change an approved policy. If implementation and an approved document conflict, report the conflict before deciding which one to change.

## Technical boundaries

- Preserve the existing Astro, TypeScript, Markdown Content Collections, and ordinary CSS architecture.
- Keep static output and GitHub Pages base-path compatibility.
- Use the installed versions and existing patterns in `package.json`, `astro.config.mjs`, `src/content.config.ts`, and `src/lib/urls.ts` as the implementation baseline.
- Do not add a backend, database, authentication, accounts, forms, payments, screening tools, diagnostic tools, personal-data collection, or new production dependencies without explicit approval.
- Do not change routes, schemas, translation keys, slugs, publication filtering, or evaluation logic incidentally.

## Editorial and medical safety

- Do not invent medical, scientific, legal, service, organisation, address, price, prevalence, or Kazakhstan-specific claims.
- Use traceable sources for factual, medical, scientific, and Kazakhstan-specific claims. Distinguish confirmed facts, inferences, assumptions, and unknowns.
- Distinguish screening, assessment, diagnosis, triage, support, and treatment. Never imply that a screening result diagnoses autism.
- Do not provide individual diagnosis, medication advice, treatment protocols, cure claims, guaranteed outcomes, or instructions to abandon established care.
- AI is not an author, evidence source, independent reviewer, or final medical decision-maker.
- Record `externalReviewer` only when a real independent reviewer is documented.
- Keep new or unapproved content at `draft: true`. Do not set `translationStatus: checked` without a real documented check.

## Change workflow

Before editing:

1. inspect the relevant files and current Git status;
2. state the files to change and why;
3. identify material risks or assumptions;
4. avoid dependencies, broad refactors, formatting sweeps, moves, and deletions unless explicitly requested.

After editing:

1. run the smallest relevant check;
2. run `npm run validate` for changes that can affect the Astro build or content schema;
3. distinguish automated checks from manual or unverified checks;
4. report files changed, what changed, what was not changed, checks run, and remaining risks.

Do not commit, push, deploy, publish content, enable GitHub Pages, or set a draft live unless the user explicitly requests that action.

## Multi-agent workflow

Use subagents only when the task has independent tracks that materially benefit from separate context or parallel work. Prefer them for repository exploration, evidence review, accessibility review, test analysis, and other read-heavy audits. Do not delegate simple changes.

Use `evidence_reviewer` for independent claim-to-source review and `qa_accessibility` for independent technical and accessibility checks. Run agents that edit overlapping files sequentially, with one primary writer at a time. The primary agent owns final decisions, integrates findings, and reports disagreements or unverified items.

## Code review priorities

Prioritize:

1. unsafe or unsupported medical and scientific claims;
2. accidentally published drafts or unchecked translations;
3. broken routes, links, assets, or GitHub Pages base paths;
4. invalid or misleading content metadata;
5. accessibility and keyboard regressions;
6. privacy-boundary violations;
7. language-version inconsistencies;
8. responsive layout and build failures.

Avoid style-only findings unless they affect correctness, maintainability, accessibility, or user understanding.
