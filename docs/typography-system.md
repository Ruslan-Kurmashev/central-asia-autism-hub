# AutismHub - mandatory typography design system

**Status:** Typography implementation contract, 12 October 2026. Supplements `docs/06-design-and-accessibility.md` without replacing its accessibility principles.

## 1. Fonts

Use exactly two font-family roles, both defined in `src/styles/typography.css`:

- `--font-body`: the system-compatible sans-serif stack for navigation, article prose, descriptions, filters, buttons, tables and explanatory content.
- `--font-editorial`: the existing Georgia/serif editorial treatment for prominent editorial headings. It is not used for body paragraphs or form controls. Maintain a readable system fallback for Russian, Kazakh and English.

Never introduce a third family, remotely loaded font, inline font-family declaration, or a one-off font stack. Some existing utility-section headings deliberately inherit the sans-serif family; their font role remains intentional.

## 2. Fixed semantic text scale (CSS rem at a 16px browser default)

| Token | Size | Only for |
|---|---|---|
| `--type-caption` | 12px | Non-essential eyebrow labels, decorative captions |
| `--type-meta` | 13px | Dates, source labels, supplementary metadata |
| `--type-small` | 14px | Compact cards, navigation, supplementary descriptions |
| `--type-control` | 15px | Filters, search, buttons and selects |
| `--type-body` | 16px | Default UI and informational content |
| `--type-reading` | 17px | Extended article prose, definitions and long-form reading |
| `--type-lead` | 18px | Summaries and introductions |
| `--type-card` | 18px | Article and section card titles |
| `--type-subhead` | 20px | Subsection names and compact headings |
| `--type-h3` | 22px | Third-level headings |
| `--type-h2` | 26-36px fluid | Section and article H2 headings |
| `--type-h1` | 32-56px fluid | Article and page titles |
| `--type-display` | 40-72px fluid | Homepage and section hero titles |
| `--type-symbol` | 24px | Non-text arrows or typographic icons only |

Mobile (up to 640px) changes only the central `h1`, `h2` and display tokens; no individual page may invent a separate mobile font size.

Print/PDF outputs use the central `--type-print-*` tokens, not screen sizes.

## 3. Reading layout

- Body uses `--leading-body: 1.65`; long-form article text uses `--leading-reading: 1.75`.
- Heading levels must be semantic: one meaningful H1 per page, H2 for major sections and H3 for subsections. Do not skip levels solely for appearance.
- Keep long articles in the established reading width, using the existing `--reading-width` or article layout.
- Do not communicate meaning only by size, weight or color; keep accessible contrast and keyboard focus.
- Never hardcode a smaller font to force a translation to fit. Allow wrapping and flexible containers, then check RU, KK and EN.

## 4. Mandatory engineering rules

1. All font sizes in `src/**/*.css`, `src/**/*.astro`, article markdown or embedded styles must be `font-size: var(--type-...);`. `!important` is allowed only if specificity cannot otherwise be corrected.
2. All font-family declarations must be `font-family: var(--font-...);` or `inherit`. The only numeric font definitions and real family stacks live in `src/styles/typography.css`.
3. No direct `font-size: 14px`, `1rem`, `clamp(...)`, SVG font-size attributes or CSS `font` shorthand in page code. Use classes with tokens.
4. Run `npm run check:type-scale` and `npm run validate` before merging. Both PR validation and deployment build execute the same typography gate through `npm run validate`.
5. If a new text role is genuinely needed, document why, add a token centrally and review its use across desktop/mobile and all three languages rather than patching one page.

The CMS editor is also in scope. `public/admin/preview.css` imports `public/admin/typography.css`, a checked byte-for-byte copy of the canonical stylesheet. `npm run check:type-scale` fails if either copy drifts, and it scans all site and CMS styles.

## 5. Visual QA before public deployment

Review at 360px, 768px and 1440px widths, at 200% browser zoom, and for long RU/KK/EN headings. Check H1 wrapping, article content density, glossary search/results, course filters, professional directory and mobile navigation. Passing a static font-token check proves consistency in source code, not visual or WCAG conformance.

## 6. Binding project law: every material, every language, every template

**Scope: mandatory, no opt-outs by content category.** Every parent or professional article, scientific explainer, Kazakhstan help article, glossary definition, learning listing, policy or landing page, navigation and cards, component, translation, CMS preview, print/PDF view and newly developed section uses this same typography system. This rule applies to existing and newly created materials whenever edited or republished.

**Single source of truth:** only `src/styles/typography.css` can define font families and sizes. The CMS uses a byte-identical public copy because its standalone editor cannot import source assets directly. No other file can declare a new font size or family outside the approved tokens.

**Editorial rule:** authors enter text and semantic headings in Markdown, not graphic formatting. The shared article layout owns the H1 title; article Markdown begins at H2 and may use nested H3/H4. No HTML font tags, inline `style` overrides, custom font-size classes or editor-generated styling that changes typography. Publication templates and agent workflows must reference this rule. A translation cannot use a smaller font simply because its title or paragraph is longer.

**Release gate:**
1. Before publication or merging any content/code change, run `npm run check:type-scale`, `npm run validate` and confirm that the GitHub Actions checks passed for the exact latest commit.
2. The typography checker scans site Astro/CSS/HTML and Markdown/MDX plus public CMS HTML/CSS; it rejects unapproved family/size declarations, font shorthand and HTML font elements. The CMS token copy must match the canonical source.
3. Check key templates at 360, 768 and 1440px, at 200% zoom, with long RU, KK and EN titles. Verify article body, reading width, heading hierarchy, glossary, learning filters, cards, print layout and navigation do not overflow.
4. If a violation occurs, correct the shared component/token and rerun validation. Never bypass the check, disable it to publish, or introduce ad hoc `!important` declarations to disguise a mismatch.
5. Only a documented project-owner decision may extend the token scale, with a reason, impacted components, accessibility review and updates to this document plus canonical tokens and CMS mirror. The exception cannot be a one-off font size inside a publication.

**Technical boundary:** automated style checks do not verify real pixel rendering, contrast, font fallback glyph coverage or WCAG compliance; those still require visual/manual testing. Image artwork and third-party embedded content can contain typography outside the website style system, but must not replace essential readable text. Enforceability through pull-request protection depends on the repository's GitHub branch rules; CI failing alone does not guarantee that maintainers cannot override a merge.
