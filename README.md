# Central Asia Autism Hub

Evidence-based autism information, parent navigation, education, and resource platform for Kazakhstan and Central Asia.

The first country implementation is **Autism Hub Kazakhstan**. The website is being developed as a static, multilingual information and education resource in Russian, Kazakh, and English.

## Current status

The site is deployed to GitHub Pages and contains published parent resources and ten Russian research explainers, with English and Kazakh translations available for the eight Kazakhstan help guides and the developmental milestones overview. Translation coverage is still incomplete and articles are not represented as independently peer reviewed. The publishing pipeline validates local links, content metadata, translated section structure and editorial image provenance; independent browser, medical and legal review remain separate release checks.

## Local development

Requirements:

- Node.js 22.12.0 or later;
- npm 9.6.5 or later.

Commands:

```powershell
npm install
npm run dev
npm run check
npm run build
```

The local preview uses the GitHub Pages base path configured in `astro.config.mjs`.

## Planning documents

The approved project decisions are stored in [`docs/`](docs/):

1. brand architecture;
2. MVP scope;
3. information architecture and navigation;
4. editorial, evidence, and medical safety;
5. privacy and data;
6. design and accessibility;
7. technical plan;
8. information material template.

## Content workflow

General information materials use the validated `pages` Content Collection. Start from [`src/content/templates/general-article.md`](src/content/templates/general-article.md), copy it into the appropriate `src/content/pages/kz/{language}/` directory, and keep `draft: true` until sources, metadata, wording, and translation status have been checked.

Drafts and translations marked `pending` do not receive public routes and do not appear in section lists.

### Decap CMS

A browser-based Decap CMS authoring interface is available under `/admin/`. It edits the same Markdown files used by Astro, so Git remains the source of truth and the existing validation/build pipeline is preserved.

The CMS currently covers Russian, Kazakh and English information articles plus the `research` and `learning` collections. Editorial workflow is enabled so drafts are reviewed through a CMS branch / pull request before publication.

See [`docs/decap-cms.md`](docs/decap-cms.md) for setup, authentication and media-path details.

## Medical boundary

This project is an information and education resource. It does not diagnose autism, provide individual medical advice, or replace professional assessment or care.
