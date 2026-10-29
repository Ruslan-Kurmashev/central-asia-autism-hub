# Editorial hyphen rule - 29 October 2026

**Status:** Owner-approved presentation and editorial decision, implementation under QA.

## Decision

In RU, KK and EN editorial prose across all articles, learning listings, research explanations, section headings, cards and interface labels, use the ASCII hyphen-minus `-` instead of U+2013 (en dash) or U+2014 (em dash). This includes compact numeric ranges such as `1-3`, `16-30` and `2025-2030`.

## Safeguards

- Do not change Markdown links, URL routes, filenames, publication dates or translation keys.
- Do not rewrite code examples, HTML attributes or protected URL data merely for typography.
- Preserve the exact wording of licensed M-CHAT-R questionnaire items in `src/data/mchat-licensed-items.ts`, including punctuation. That is instrument content rather than AutismHub editorial copy.
- Existing protocol names and references remain verifiable in their original official sources. Punctuation-only edits do not constitute independent medical review or a new publication date.
- Update `scripts/check-article-punctuation.mjs` to block future reintroduction in user-facing article source and site UI copy while excluding the original instrument.
- Do not disable `npm run validate`, browser QA, article safety checks or publication safeguards.

## Scope

Source Markdown under `src/content/pages`, `src/content/research`, and `src/content/learning` plus site-facing strings under `src/components`, `src/pages`, `src/data` and `src/i18n`. Excludes protected licensed instrument wording, parser code supporting legacy input and non-rendered engineering documentation.

Canonical documents: `AGENTS.md`, `docs/04-editorial-evidence-medical-safety.md`, and this decision. Deployment still requires a successful exact-commit build and browser check.
