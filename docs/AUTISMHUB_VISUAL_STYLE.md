# AutismHub Visual Style Guide

**Status:** owner-approved editorial direction, 26 October 2026  
**Scope:** RU, KK and EN covers, instructional illustrations, diagrams, research assets and reusable graphics  
**Related:** `docs/06-design-and-accessibility.md`, `docs/typography-system.md`, `docs/editorial-image-sources.md`

## 1. What an image must achieve

An image must answer a concrete reader question or add necessary human context. No generic technology symbols, meaningless silhouettes, arbitrary decorative charts, duplicated covers, or pictures that imply a child's diagnosis from appearance. Avoid pity-based messaging, autism stereotypes, and misleading depictions of clinical tests.

- Article cover: real licensed stock photography, an owner-provided original, or another expressly approved asset. Do not invent an AI-generated stock photograph.
- Instructional sequence: clear original vector/illustration with one observable action per panel. Follow the exact approved visual reference and characters, where provided.
- Research chart: faithfully represent supported data, axes, units, caveats and source. Do not fabricate measurements.
- Official event poster: use the organiser's authentic licensed or permission-cleared artwork, not an invented lookalike.

An AI-generated image is never automatically cleared for publication. The owner's prior restriction on generated article covers remains in force. Any illustrative exception requires a specific request and an asset review.

## 2. Existing repository references

These are concrete assets already stored in the project and useful for comparison. File existence alone does **not** prove every visual property or character has been finally approved.

| Asset | Role |
| --- | --- |
| `public/images/editorial/motor/motor-walking-line-steps.webp` | Step-by-step movement activity, panel sequencing |
| `public/images/editorial/diagrams/child-daily-independence-handwashing-steps.webp` | Handwashing instructional sequence |
| `public/images/editorial/diagrams/child-daily-independence-table-setting-user-approved-v3.webp` | Owner-labelled approved iteration of an instructional task |
| `public/images/editorial/emotion-three-moments-reference.png` | Emotion-support illustration reference |
| `public/images/editorial/parent-context-home-preschool-pexels-7780915.jpg` | Stock-based article visual rather than an instructional diagram |

**Owner-supplied mother-and-child style pair (26 October 2026):** two Project-attached PNGs, `Референсы мамы и ребенка 1.png` (table setting) and `Референсы мамы и ребенка 2.png` (dressing), each 1448 x 1086 px. Their exact SHA-256 fingerprints, practical visual characteristics and storage status are documented in `docs/visual-references/manifest.json` and `docs/visual-references/README.md`. They are the source visual comparison pair, **not** published reference files within Git. Their Russian lettering may contain errors, so never reuse embedded phrases unchecked. Existing previously approved in-repo examples are pinned by Git blob SHA, but should not be confused with the originals. If source attachments are unavailable in a subsequent session, never claim to have compared pixels.

## 3. Instructional panel specification

1. Show one action in each panel, numbered in the correct order.
2. Use the same explicitly approved characters across panels, with stable facial features, clothes, proportions and illustration style.
3. Make the hands, object placement, direction of motion and end state observable without relying on text.
4. Use calm backgrounds, restrained color accents and consistent illustration scale.
5. Use short, checked language-appropriate captions when needed. No dense text baked into small diagrams.
6. Use comfortable whitespace between panels and maintain consistent panel shape.
7. Ensure panels are understandable at common mobile widths. Provide adjacent real text instructions for screen readers and translation.
8. Do not add activities, clinical promises, safety-critical details, or tools absent from the written instructions.
9. Avoid repeating the same text in the artwork and caption unless the text version is the required accessibility alternative.
10. Use contextually appropriate local representation without stereotyping ethnicity or implying that all Kazakhstan families look alike.

## 4. Stock covers and legal provenance

Before reuse, record source URL, creator, license URL, license/access date, local path, permitted adaptation, and the editorial meaning. Retain this history in `docs/editorial-image-sources.md`. Verify permission when using photos of identifiable people, illustrations from external articles, conference posters and adapted research figures.

Use local site-owned image paths with the Astro/GitHub Pages base prefix via existing helpers. Do not hotlink an asset without permission or misattribute unrelated Pexels licensing to another provider.

## 5. Accessibility and typography

- Meaningful `alt` text describes the relevant visible action or context, not a diagnosis.
- A diagram containing essential instructions needs a separate selectable text alternative in RU, KK and EN.
- Charts need accessible values or a text summary.
- Artwork may use its own consistent lettering, but site typography stays controlled by `src/styles/typography.css`.
- Avoid truncated labels, midword breaks, tiny captions, illegible text, horizontal page overflow and overlapping panels.
- Test at 360, 768 and 1440 px, plus 200% browser zoom where possible.

### 5.1. Locked reference check

Run `npm run check:visual-references` (also in `npm run validate`) to ensure that owner-approved example files have not been silently overwritten. A correct hash proves file identity, not that the graphic conveys the intended educational action. Continue manual frame-by-frame review.

## 6. Review before publication

Verify the exact image requested by the owner, relevance to the section, identity/style consistency, correct language, order of steps, legible labels, alt text, image provenance, loading, and copyright. Reject visuals if the action cannot be understood at first glance or if text is distorted.

The existing Chromium user-journey QA supplies automated coverage and screenshots, but cannot certify that a drawing conveys the medically intended message. The owner or responsible editor must inspect key educational graphics manually.

## 7. Disallowed substitutions

- A new abstract diagram in place of an explicitly approved step-by-step character illustration.
- An unlicensed image copied from another autism article.
- A fake event poster or stock photo presented as a real participant or patient.
- A design that uses different characters in sequential panels without a reason.
- A caption presented as a substitute for drawing the action clearly.
- A fabricated diagram with unsupported numerical data.
