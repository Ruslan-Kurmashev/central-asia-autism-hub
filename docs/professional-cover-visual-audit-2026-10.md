# Professional library - visual cover audit (14 October 2026)

## Scope

Review of **49 published Russian professional articles** at audit time:
- **25 Kazakhstan legislation, clinical protocol, ministerial orders and standards** across five document groups;
- **24 international-guideline, professional assessment, and family-communication resources**.

This is an illustration / presentation review, **not** a clinical or legal update. No document text, status, institutional authority, or clinical recommendation was verified by the imagery audit.

## Findings

- All 49 article metadata records refer to **different local SVG cover filenames**; their alternate text identifies the actual subject or an explicitly symbolic professional concept.
- Selected source SVGs were inspected. They use different subject-specific vector elements (school/book, diagnostic pathway, healthcare, confidentiality, consent, development, international guidelines), with no real patients, official logos, or diagnostic-instrument facsimiles.
- The Kazakhstan legal-document illustrations deliberately share a consistent *document-and-symbol* composition and palette. **Distinct image filenames alone do not establish strongly differentiated visual appearance.** This family resemblance is part of the existing design system, not a missing or copied file; any further artistic redesign should be considered as a separate editorial decision.
- The top-level professional directory uses **six topic icons**, the Kazakhstan law group index uses **five distinct group icons**, and country/document detail lists are primarily **text links**. They are not intended to present all article cover SVGs as full image cards. Each article itself displays a larger hero illustration.
- English/Kazakh translations of these professional articles were not published in the inspected source set. When they are published, each translation of the same article should reuse its topic-specific cover and supply locale-appropriate alt text.

## Ongoing quality controls

The automated professional article editorial validation now checks:
1. One **unique local SVG path** per published professional article, allowing the same illustration only for a translation of that article.
2. Image file presence, nonempty accessible `title` / `desc` elements, a landscape viewBox, and no active SVG scripting / foreign objects.
3. Duplicate **vector artwork** after removing SVG metadata, so renaming a file or changing only `title` cannot make duplicate illustrations pass.
4. Exactly one matching article hero `img` in compiled HTML, aligned with the article's metadata.
5. Existing image alt descriptions, documentary references, and consistent professional typography.

Automated checks cannot reliably judge icon legibility at 360px mobile widths, thematic creativity, or visual similarity from a compositional template. Responsive visual QA still requires device screenshots and human review.

## Subsequent editorial cover revision (14 October 2026)

Following user review of the homepage update feed, the professional early-referral pathway article (translation key `professionals-a01`) changed from its diagram-style SVG cover to a distinct, licensed Pexels photograph of a clinician consulting a mother and child. The stock image illustrates a consultation, not an actual autism assessment. The source is credited in `docs/editorial-image-sources.md`. The change affects the homepage card and the article hero through shared `featuredImage` metadata. The former pathway diagram remains an internal educational illustration in the repository.

The professional article QA retains the unique-cover check, all SVG validation for other professional publications, and an exact-path exception validating the new local JPEG for this one article.
