# Decision: one visual reference system and verifiable publication stages

- Date: 2026-10-26
- Status: approved policy and QA implementation
- Scope: article cover images, step-by-step educational diagrams, browser regression testing, GitHub Pages releases

Maintain one `docs/AUTISMHUB_VISUAL_STYLE.md` describing image purpose, reference material, accessibility, licensing and unacceptable examples. Keep the full original provenance record in `docs/editorial-image-sources.md`.

Extend the existing Chromium browser QA rather than adding a redundant Playwright dependency. Verify 360, 768 and 1440 px article layouts, clipped headings and captions, table text-break settings, image loading, and screenshots. Automated checks cannot establish semantic accuracy or replace human review.

A prepared file is not published. A GitHub commit is not deployed. Confirm CI, GitHub Pages and the final public URL before claiming publication. Making checks mandatory for merging depends on repository branch protection settings and must be verified separately.

Authoritative documents: `docs/AUTISMHUB_VISUAL_STYLE.md`, `docs/release-and-browser-qa.md`, and `AGENTS.md`.
