## Typography and editorial layout

- [ ] Every site page, article, translation, CMS preview and component uses the canonical typography system in [docs/typography-system.md](../docs/typography-system.md).
- [ ] Article title is the single layout H1; Markdown body starts with H2, and H3 is used for nested subsections.
- [ ] No new inline font styles, HTML font tags, custom font faces, literal sizes, or per-article mobile typography overrides.
- [ ] At least one RU/KK/EN long heading or representative page was checked at narrow mobile, tablet and desktop widths and at 200% zoom where applicable.
- [ ] The latest commit passes `npm run check:type-scale` and `npm run validate`; any token exception is documented in the central design policy.

## Change-specific release checks

- [ ] List the exact modified article URLs, locales, and reference assets.
- [ ] Confirm the changed-page QA lists all published Markdown pages and direct image references affected by this PR. If there are more than 24, split the PR for meaningful review.
- [ ] Review Chromium screenshots at 360, 768 and 1440 px for each changed route. Browser automation checks technical layout, not illustration meaning or medical accuracy.
- [ ] Record the commit SHA, GitHub Actions status and actual public link after deployment. Do not report a commit as publication.

## Visual reference approval

- [ ] For new step-by-step diagrams, compare with the *actual* two owner-supplied mother-and-child references where applicable and confirm characters, sequence and accurate captions.
- [ ] Existing protected illustration not replaced accidentally. `npm run check:visual-references` passes. If a replacement was approved, record the exact approval, provenance and reviewed new hash.
- [ ] Do not imply the Project source PNGs are in Git unless the exact original bytes were committed.

## Other validation

- [ ] Factual claims, source references, metadata, draft and translation states were reviewed for affected content.
- [ ] Routes, accessibility, keyboard controls and image alt text were checked where affected.
