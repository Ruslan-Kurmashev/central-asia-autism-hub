# Central Asia Autism Hub

Evidence-based autism information, parent navigation, education, and resource platform for Kazakhstan and Central Asia.

The first country implementation is **Autism Hub Kazakhstan**. The website is being developed as a static, multilingual information and education resource in Russian, Kazakh, and English.

## Current status

The repository contains the approved planning documents and the first local Astro foundation. Medical and parent-facing articles have not yet been published. GitHub Pages is intentionally disabled until the launch candidate has been reviewed.

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

## Medical boundary

This project is an information and education resource. It does not diagnose autism, provide individual medical advice, or replace professional assessment or care.
