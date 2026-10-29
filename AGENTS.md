# Central Asia Autism Hub - repository instructions

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
- `docs/08-content-material-template.md` for information-material structure and metadata;
- `docs/typography-system.md` for the mandatory type scale, allowed font families, and typography QA.
- `docs/decisions/README.md` for approved current decisions and superseded requirements;
- `docs/AUTISMHUB_VISUAL_STYLE.md` for image references, instructional graphics, stock covers, attribution, and accessibility;
- `docs/visual-references/README.md` and `docs/visual-references/manifest.json` for the supplied mother-and-child style pair and immutable published reference examples;
- `docs/evidence/README.md` for the claim-to-source verification register;
- `docs/audit/article-review-procedure.md` for human article review and `docs/audit/article-review-tracker.json` for its genuine completed statuses;
- `docs/release-and-browser-qa.md` for release status, browser checks, and branch protection limitations.

Read only the documents relevant to the task, but read each selected document completely. Do not silently change an approved policy. If implementation and an approved document conflict, report the conflict before deciding which one to change.

## Authoritative decisions and publication truth

- At the start of a new site task, inspect the current repository and the relevant decision records. A previous session's tool limitations do not establish access limitations in the current session.
- Check GitHub read and write tools before declaring publication impossible. Distinguish missing local files from unavailable repository write permissions.
- Current owner-approved decisions in `docs/decisions/` take precedence over historical plans where they expressly supersede earlier sections. Resolve and document contradictions, rather than silently retaining obsolete policy.
- The parent landing page has one combined `assessment` group. Do not recreate the retired `after-diagnosis` group, duplicate its articles, or change article URLs. See `docs/decisions/2026-10-29-parent-assessment-merge.md`.
- The curated external course catalogue contains only verified free-to-learn resources. See the editorial policy and decision record. Do not silently add paid learning entries.
- Keep image examples tied to their exact licensed or project-owned files. Do not claim an illustrative reference is owner-approved when approval cannot be substantiated.
- Protect existing approved instructional images: do not edit a locked asset or its manifest hash without explicit approval of the exact replacement and updated provenance. Run `npm run check:visual-references`. Two source PNGs are documented as Project attachments, not falsely claimed to be in Git.
- Distinguish work prepared locally, committed to GitHub, passed CI, and confirmed on the public site. Never claim publication from a commit alone.
- PR validation and browser QA must be reviewed on the final commit before merging. Browser screenshots and automated assertions do not independently prove clinical accuracy, appropriate visuals, or full accessibility.
- Commit and publication actions still require an explicit user request. Instructions to publish or put changes into the repository count as such a request for the named scope.

## Technical boundaries

- Preserve the existing Astro, TypeScript, Markdown Content Collections, and ordinary CSS architecture.
- Keep static output and GitHub Pages base-path compatibility.
- Use the installed versions and existing patterns in `package.json`, `astro.config.mjs`, `src/content.config.ts`, and `src/lib/urls.ts` as the implementation baseline.
- Do not add a backend, database, authentication, accounts, forms, payments, screening tools, diagnostic tools, personal-data collection, or new production dependencies without explicit approval.
- Owner-approved exception dated 2026-10-28: a statically hosted, browser-only first-stage M-CHAT-R may be prepared. Activation requires actual permission scope for website and source repository, original RU/KK/EN instrument integrity, medical and native-language review, privacy QA and verified pages. An initial score of 3-7 is not a completed M-CHAT-R/F result; do not simulate Follow-Up without its full authorised clinical process.
- Do not change routes, schemas, translation keys, slugs, publication filtering, or evaluation logic incidentally.

## Mandatory typography and publication law (all changes)

- Use only `--type-*` font-size tokens and `--font-*` family tokens from `src/styles/typography.css` in site CSS and Astro components.
- Do not introduce raw `px`, `rem`, `em`, `vw`, or `clamp()` font-size declarations outside the token file, including article-specific and mobile styles.
- Keep titles and article structure semantic. Do not create extra font stacks or page-specific font scales.
- The rule applies to every new and existing page, parent/professional/research article, glossary entry, course listing, card, translation, page template, interactive component, responsive view, print/PDF layout and CMS preview.
- All content must use the shared layouts and semantic Markdown headings: page titles are rendered by the layout; article body starts at H2 and uses H3 for nested subsections. Do not insert manually styled headings, inline font CSS, HTML `<font>` tags or custom per-article typography.
- Changing typography tokens requires a documented design-system decision; never silently shrink text for RU/KK/EN translations or patch a single page.
- No publication, pull request merge or deployment is ready until `npm run check:type-scale` and `npm run validate` succeed plus responsive and zoom QA is reviewed. The automated check is a mandatory fail-closed gate, not a claim of full visual accessibility.
- The identical CMS font token stylesheet must be kept in sync with the source. See `docs/typography-system.md` for the binding policy, checklist and exception process.
- Run `npm run check:type-scale` after any CSS, layout, component, Markdown, CMS or content-style change.


## Editorial and medical safety

- Do not use U+2013 en dash or U+2014 em dash in user-facing article text, headings, section labels, metadata descriptions, cards, navigation or other editorial copy. Use the ASCII hyphen-minus (`-`) consistently, including numeric ranges like `1-3`. Preserve URL syntax, source code, exact licensed screening instruments and immutable third-party text. The article punctuation checker enforces this across content and site copy.
- Never use the semicolon (`;`) as prose punctuation in articles, translations, metadata descriptions, research explainers or learning listings. Use a comma or rewrite the sentence for clarity. Preserve semicolons required by URLs, HTML entities and code. `npm run check:article-punctuation` enforces this rule across all content languages and collections.
- Do not invent medical, scientific, legal, service, organisation, address, price, prevalence, or Kazakhstan-specific claims.
- Use traceable sources for factual, medical, scientific, and Kazakhstan-specific claims. Distinguish confirmed facts, inferences, assumptions, and unknowns.
- Distinguish screening, assessment, diagnosis, triage, support, and treatment. Never imply that a screening result diagnoses autism.
- Do not provide individual diagnosis, medication advice, treatment protocols, cure claims, guaranteed outcomes, or instructions to abandon established care.
- AI is not an author, evidence source, independent reviewer, or final medical decision-maker.
- Record `externalReviewer` only when a real independent reviewer is documented.
- A source-to-claim registry match or CI pass does not establish human editorial approval. Use `pending` until the responsible reviewer genuinely signs off; run `npm run check:evidence-register` and `npm run check:translation-parity` to check integrity.
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
