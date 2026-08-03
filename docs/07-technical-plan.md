# Technical Plan

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 07 — Technical Plan  
**Status:** Approved for the first website version  
**Version:** 1.1
**Decision date:** 31 July 2026
**Last updated:** 2 August 2026

## 1. Purpose

This document defines the approved technical architecture, content model, development workflow, validation requirements, and deployment plan for the first public version of Autism Hub Kazakhstan.

The implementation must remain:

- static;
- maintainable by one project owner with Codex assistance;
- suitable for multilingual information publishing;
- compatible with GitHub Pages;
- reproducible from the public repository;
- consistent with the approved editorial, privacy, design, and accessibility policies;
- free to host in the initial version.

This document does not authorise public deployment by itself. GitHub Pages will be enabled only after the website has been implemented, reviewed, and explicitly approved for publication.

## 2. Confirmed technical constraints

The MVP will not require:

- a backend;
- a database;
- server-side rendering;
- user accounts;
- authentication;
- user-submitted forms;
- file uploads;
- payment processing;
- personalised recommendations;
- persistent user profiles;
- a learning-management system;
- a search service;
- an administrative content-management interface.

All public pages must be generated as static HTML, CSS, JavaScript, and media files.

## 3. Approved technology stack

| Area | Approved choice |
|---|---|
| Static site generator | Astro |
| Programming language | TypeScript |
| Type checking | Strict TypeScript configuration |
| Page and UI structure | Astro Components |
| Styling | Plain CSS with shared design tokens |
| Content format | Markdown with validated frontmatter |
| Structured content | Astro Content Collections |
| Package manager | npm |
| Dependency lock | `package-lock.json` committed to Git |
| Source control | Git |
| Remote repository | GitHub |
| Repository name | `central-asia-autism-hub` |
| Hosting | GitHub Pages |
| Deployment | GitHub Actions |
| Analytics candidate | Cloudflare Web Analytics |
| Backend and database | None |

The project will use the current stable Astro release available when implementation begins. The selected Astro and Node.js versions must be recorded and locked rather than silently changing between builds.

The initial implementation should use the current supported even-numbered Node.js release used by the official Astro GitHub Pages action, unless implementation-time compatibility checks require a different supported version.

## 4. Dependency policy

The project must begin with the smallest practical dependency set.

The MVP does not require:

- React;
- Vue;
- Svelte;
- a general client-side application framework;
- Tailwind CSS;
- a commercial component library;
- an accessibility overlay;
- a client-side state-management library;
- a database package;
- an authentication package.

New dependencies may be added only when they solve a documented requirement that cannot be addressed reasonably with Astro, TypeScript, standard HTML, or CSS.

Before adding a dependency, check:

- its purpose;
- current maintenance status;
- licence;
- effect on privacy;
- effect on accessibility;
- client-side payload;
- compatibility with static generation and GitHub Pages;
- whether an existing project dependency already provides the capability.

Dependency upgrades must be deliberate, reviewed, and followed by a full build. Major upgrades must not be applied automatically without reviewing their migration guidance.

## 5. Repository and project structure

The planned repository structure is:

```text
central-asia-autism-hub/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   ├── 01-brand-architecture.md
│   ├── 02-mvp-scope.md
│   ├── 03-information-architecture.md
│   ├── 04-editorial-evidence-medical-safety.md
│   ├── 05-privacy-and-data.md
│   ├── 06-design-and-accessibility.md
│   ├── 07-technical-plan.md
│   └── 08-content-material-template.md
├── public/
│   ├── favicon files
│   ├── robots.txt
│   └── static public assets
├── src/
│   ├── components/
│   ├── content/
│   │   ├── pages/
│   │   ├── research/
│   │   └── learning/
│   ├── i18n/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── content.config.ts
│   └── site.config.ts
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Generated output such as `dist/`, local caches, installed packages, editor files, and secrets must not be committed.

## 6. Static output and GitHub Pages base path

The production output mode is static.

The initial GitHub Pages address is:

```text
https://ruslan-kurmashev.github.io/central-asia-autism-hub/
```

The Astro configuration must account for the repository subpath:

```text
site: https://ruslan-kurmashev.github.io
base: /central-asia-autism-hub
```

The implementation must use one central URL helper or Astro base-path mechanism for:

- internal links;
- navigation links;
- language links;
- canonical URLs;
- asset paths;
- metadata;
- sitemap entries.

The repository name must not be manually repeated across page templates and content files. This avoids a project-wide rewrite when a custom domain is introduced.

Directory-style output and consistent trailing slashes should be used for stable GitHub Pages routes.

## 7. Country and language routing

The approved first-country routes are:

```text
/kz/ru/
/kz/kk/
/kz/en/
```

The site root provides a clear language choice and does not depend on browser detection, geolocation, personal data, or an automatic language redirect.

Because the country precedes the language in the approved URL structure, routing will be implemented as explicit static country-and-language routes rather than assuming a top-level locale segment.

The initial page structure is:

```text
src/pages/
├── index.astro
└── kz/
    └── [lang]/
        ├── index.astro
        └── [section]/
            ├── index.astro
            └── [...slug].astro
```

Only the following route values are approved for generation in the MVP:

```text
country: kz
languages: ru, kk, en
```

Future country codes must be added to an explicit supported-country configuration. The existence of a generic route does not authorise publishing a future country version.

## 8. Primary section routes

The structural section segments remain language-independent:

```text
/kz/{language}/parents/
/kz/{language}/research/
/kz/{language}/help-kazakhstan/
/kz/{language}/learning/
/kz/{language}/learning/autism-school/
/kz/{language}/learning/parents/
/kz/{language}/learning/professionals/
/kz/{language}/professionals/
/kz/{language}/about/
```

Interface labels are translated, while these stable route segments simplify maintenance and reduce broken links.

Individual article slugs may be localised. Equivalent translations must be linked using an internal `translationKey`, not by assuming that their slugs match.

## 9. Content collections

The MVP uses three principal Astro Content Collections.

### 9.1. Pages

The `pages` collection contains:

- parent-facing articles;
- Help in Kazakhstan materials;
- professional materials;
- Autism School programme pages where a specialised learning record is not required;
- About, policy, disclaimer, and organisational pages.

### 9.2. Research

The `research` collection contains Research Explained articles and enforces fields required to describe the original study, review, guideline, or evidence source.

### 9.3. Learning

The `learning` collection contains:

- project-owned education;
- external courses;
- webinars;
- lectures;
- workshops;
- other structured learning opportunities.

Project-owned and external learning resources must be distinguishable through required metadata.

## 10. Content directory structure

Content is organised by collection, country, and language:

```text
src/content/
├── pages/
│   └── kz/
│       ├── ru/
│       ├── kk/
│       └── en/
├── research/
│   └── kz/
│       ├── ru/
│       ├── kk/
│       └── en/
└── learning/
    └── kz/
        ├── ru/
        ├── kk/
        └── en/
```

Markdown bodies contain the readable content. Frontmatter contains structured publication, translation, evidence, and routing metadata.

## 11. Common content schema

The exact implementation types will be defined in `src/content.config.ts`. Common fields should include:

| Field | Purpose |
|---|---|
| `title` | Public page title |
| `summary` | Short plain-language description |
| `country` | Approved country code |
| `language` | `ru`, `kk`, or `en` |
| `section` | Approved primary or secondary section |
| `translationKey` | Stable identifier shared across translations |
| `author` | Responsible author |
| `editor` | Responsible editor |
| `externalReviewer` | Optional; displayed only when a real external review occurred |
| `publishedAt` | Original publication date |
| `updatedAt` | Latest substantive update date |
| `reviewDueAt` | Planned content review date where applicable |
| `riskLevel` | Lower, moderate, or high editorial risk |
| `draft` | Excludes unfinished content from public output |
| `sources` | Structured references or source links |
| `description` | Search and social metadata description |
| `slug` | Stable localised URL segment |
| `translationStatus` | Source version, checked translation, or pending review |
| `disclaimerType` | Informational or medical boundary notice |
| `conflictOfInterest` | Visible conflict-of-interest declaration |
| `versionNote` | Optional correction or substantive-update note |

The schema must not require an external reviewer. This is consistent with the approved one-person editorial-responsibility model.

The site must not display an empty or implied reviewer field when no external reviewer participated.

## 12. Research schema additions

Research Explained records should additionally support:

- `originalTitle`;
- `originalAuthors`;
- `journalOrOrganisation`;
- `publicationYear`;
- `doi` or `sourceUrl`;
- `documentType` or `studyType`;
- `sampleSize`, when applicable;
- `population`, when applicable;
- correction, expression-of-concern, or retraction status where known;
- date on which the source status was checked.

The article body must still explain methods, results, limitations, uncertainty, and practical meaning in prose. Structured fields do not replace critical interpretation.

## 13. Learning schema additions

Learning records should additionally support:

- `provider`;
- `audience`;
- `format`;
- `languages`;
- `costLabel`;
- `externalUrl`, when applicable;
- `lastVerifiedAt`;
- `projectOwned`;
- `registrationStatus`, when applicable;
- `resourceDisclaimerType`, distinguishing project-owned and external learning.

External listings must be visibly labelled. The schema and page templates must prevent an external course from appearing as an Autism Hub Kazakhstan programme merely because both records use the same collection.

## 14. Translation integrity

Every translated content family uses one stable `translationKey`.

Build-time validation should identify:

- duplicate language versions for the same key;
- unsupported country or language values;
- missing core translations required for launch;
- language metadata that does not match the content directory;
- links to a translation that does not exist;
- untranslated interface strings;
- silent fallback to a different language.

The public interface must state clearly when an optional translation is unavailable. It must not present another language as if it were the requested translation.

## 15. Layouts and components

The initial reusable layouts are:

- `BaseLayout`;
- `LandingLayout`;
- `SectionLayout`;
- `ArticleLayout`;
- `ResearchLayout`;
- `LearningResourceLayout`.

The minimum shared component set is:

- header;
- primary navigation;
- language switcher;
- breadcrumbs;
- footer;
- article metadata;
- evidence or scope notice;
- medical disclaimer;
- source list;
- external-resource notice;
- related-content list;
- skip link;
- accessible mobile-navigation control.

Components should render semantic HTML by default. Native HTML controls must be preferred over custom scripted controls where they fulfil the requirement.

## 16. CSS and visual implementation

The MVP uses plain CSS with central design tokens for:

- colour;
- type scale;
- spacing;
- content width;
- borders;
- focus indicators;
- responsive breakpoints;
- motion preferences.

The CSS architecture should remain small and explicit:

- global reset and defaults;
- design tokens;
- shared layout styles;
- component styles;
- article-content styles;
- limited utility classes only when repetition justifies them.

The implementation must not depend on a JavaScript design system to render ordinary content.

System fonts are the initial preference. Any later web font must support Russian, Kazakh, and English, be tested across target systems, and preferably be hosted locally.

## 17. Client-side JavaScript policy

Astro must deliver usable HTML without requiring a client-side application framework.

JavaScript may be used only for a documented interface need, such as an accessible mobile-navigation toggle. The page content, links, language choices, sources, disclaimers, and policies must remain available without application hydration.

The MVP will not use client-side JavaScript for:

- personalisation;
- visitor profiling;
- form collection;
- medical calculations;
- screening;
- course-progress tracking;
- animated page transitions;
- decorative effects that reduce accessibility.

## 18. Images and static assets

Project-owned images should be processed through Astro's asset pipeline where practical.

The implementation must:

- preserve meaningful alternative text in content metadata or markup;
- use empty alternative text for decorative images;
- avoid essential text embedded in images;
- record image source, licence, and attribution where required;
- optimise dimensions and formats;
- prevent oversized original files from being published unnecessarily;
- avoid third-party image requests when a local asset is appropriate.

Large media files should not be stored in the repository without a documented need. YouTube or another approved external platform may host future videos, but the MVP should prefer ordinary external links over embedded players.

## 19. Metadata and discoverability

Every public page must support:

- a unique HTML title;
- a concise metadata description;
- a canonical URL;
- the correct document-language attribute;
- Open Graph metadata where appropriate;
- publication and update dates where relevant;
- translated alternate links using `hreflang`;
- a stable human-readable URL.

Country-language alternates should use appropriate language-region values such as:

```text
ru-KZ
kk-KZ
en-KZ
```

The root language-choice page may serve as the `x-default` alternate.

The site must provide:

- a generated sitemap index (`sitemap-index.xml`) and numbered sitemap files;
- `robots.txt`;
- an accessible 404 page;
- consistent canonical URLs that include the GitHub Pages base path until a custom domain is introduced.

Structured data must be limited to types that accurately describe the published page. The project must not use medical, organisational, course, or review markup to imply clinical status, accreditation, official authority, or independent review that does not exist.

## 20. Privacy and analytics implementation

The code must not include:

- contact or intake forms;
- user accounts;
- medical questionnaires;
- advertising trackers;
- remarketing tags;
- visitor-profile storage;
- third-party scripts added without review.

Cloudflare Web Analytics is the preferred initial analytics candidate. It may be enabled only after:

1. the first working site has been deployed;
2. the provider's current data practices have been rechecked;
3. the public privacy page accurately describes the implementation;
4. the script has been checked for performance and Content Security Policy implications.

Analytics must not block page rendering or accessibility. Google Analytics, Meta Pixel, and comparable profiling tools are not approved for the MVP.

## 21. Accessibility implementation

The technical target is WCAG 2.2 Level AA, subject to documented testing rather than an unsupported conformance claim.

Templates and components must support:

- semantic landmarks;
- logical heading order;
- keyboard navigation;
- visible and unobscured focus;
- a skip link;
- sufficient contrast;
- correct accessible names;
- meaningful link text;
- correct language attributes;
- text resizing and narrow-screen reflow;
- reduced-motion preferences;
- touch-friendly target sizing;
- alternative text;
- captions and transcripts for project-produced media when applicable.

Accessibility checks apply to all three language templates, not only the Russian version.

## 22. Build-time validation

The build must fail for material structural problems, including:

- invalid required frontmatter;
- unsupported country or language values;
- duplicate content identifiers;
- invalid dates;
- publication of a record marked as a draft;
- missing required research-source data;
- external learning records without required provenance or verification fields;
- invalid internal route construction;
- missing required core translations at release time.

Some release-specific conditions may be implemented as a separate validation command rather than as permanent collection-schema requirements. This allows drafts and progressive optional translations to exist locally without weakening launch checks.

## 23. Local validation commands

The project should provide clear npm scripts for the smallest relevant checks:

```text
npm run dev
npm run check
npm run build
npm run validate:content
npm run validate:links
```

Their responsibilities are:

- `dev`: local development preview;
- `check`: Astro and TypeScript validation;
- `build`: production static generation;
- `validate:content`: project-specific content and translation rules;
- `validate:links`: generated internal-link validation.

Commands must work from the repository root on Windows and in the Linux environment used by GitHub Actions.

## 24. Manual pre-launch validation

Automated checks must be supplemented by manual review of representative pages.

The minimum manual checks are:

1. root language selection;
2. primary navigation in Russian, Kazakh, and English;
3. language switching between equivalent pages;
4. keyboard-only navigation;
5. visible focus;
6. mobile and narrow-screen layout;
7. browser zoom and text resizing;
8. basic screen-reader navigation;
9. contrast and non-colour status cues;
10. external-resource labelling;
11. medical and evidence disclaimers;
12. publication metadata and references;
13. missing-translation behaviour;
14. 404 behaviour under the GitHub Pages base path.

Automated accessibility or link tools must not be treated as proof that all requirements have been satisfied.

## 25. Git workflow

The local project directory is the authoritative working copy. GitHub is the remote source-control and publication platform.

The initial workflow is:

```text
edit locally
→ inspect changes
→ run the relevant checks
→ create an intentional commit
→ push to GitHub
→ GitHub Actions builds the site
→ GitHub Pages deploys only when publication has been enabled
```

Commits should describe one coherent change. Generated build output and unrelated local files must not be staged.

The public repository must not contain:

- access tokens;
- passwords;
- private keys;
- local environment files;
- unpublished personal or medical information;
- copyrighted full-text articles without permission;
- unlicensed media.

## 26. GitHub Actions deployment

Deployment will use the official Astro and GitHub Pages Actions available at implementation time.

The workflow will:

1. run on approved changes to the default branch and support manual execution;
2. read the repository contents;
3. install dependencies from the lockfile;
4. run the required checks;
5. build the static site;
6. upload the Pages artifact;
7. deploy through the protected `github-pages` environment.

The workflow must use only the permissions it needs, normally:

- `contents: read`;
- `pages: write`;
- `id-token: write`.

Action versions must be checked against current official documentation when the workflow is created. The planning document intentionally does not freeze future Action version numbers before implementation.

GitHub Pages will not be enabled until the site is ready for a public launch review.

## 27. Custom-domain migration

The first version uses the free GitHub Pages project address.

When a custom domain is approved later:

1. configure the domain and DNS according to current GitHub documentation;
2. add the required `CNAME` file;
3. update the Astro `site` value;
4. remove the repository `base` value if the custom domain serves the site from `/`;
5. rebuild canonical, alternate-language, sitemap, and social URLs;
6. test redirects and old links;
7. verify HTTPS;
8. update public policy and contact information where necessary.

Purchasing or configuring a domain is not part of the approved zero-cost MVP.

## 28. Content publication workflow

The minimum content workflow is:

```text
select topic
→ identify sources
→ draft Markdown
→ complete structured metadata
→ perform the Document 04 self-review
→ prepare and check translations
→ preview locally
→ validate content and links
→ publish through Git
→ schedule review or correction
```

The `draft` state must prevent unfinished material from entering public page lists, sitemaps, related-content blocks, and production output.

An external reviewer is recorded only when a real independent review occurred. The absence of an external reviewer does not block publication under the approved one-person editorial model.

## 29. Implementation phases

### Phase 1 — Repository foundation

- preserve approved planning documents;
- initialise Astro in the existing project directory without replacing the documents;
- configure TypeScript, npm, and ignored files;
- record the selected runtime and dependency versions;
- verify a clean local build.

### Phase 2 — Routing and design foundation

- configure static output, `site`, and `base`;
- create country and language configuration;
- implement the root language-choice page;
- implement shared layouts, navigation, footer, language switcher, and design tokens;
- verify responsive and keyboard behaviour.

### Phase 3 — Content system

- define the three Content Collections;
- define common, research, and learning schemas;
- implement article and listing routes;
- implement translation-key relationships;
- add draft, metadata, source, and disclaimer handling.

### Phase 4 — Initial content

- prepare the approved 8–12 parent-facing resources;
- prepare Russian, Kazakh, and English versions;
- add Research Explained examples;
- add Help in Kazakhstan material;
- add Autism School and selected external-learning pages;
- validate sources, translations, dates, and disclaimers.

### Phase 5 — Quality and launch preparation

- run production and content checks;
- review accessibility and mobile behaviour;
- validate internal and external links;
- check metadata, sitemap, and 404 behaviour;
- review the public privacy, editorial, and medical-safety pages;
- create and verify the GitHub Actions workflow.

### Phase 6 — Publication

- explicitly approve the launch candidate;
- enable GitHub Pages with GitHub Actions as the source;
- deploy the tested build;
- verify the public address;
- enable approved aggregate analytics only after its separate implementation check;
- record the launch date and known limitations.

## 30. Explicitly excluded from the technical MVP

The following are not part of the first implementation:

- backend APIs;
- databases;
- server-side rendering;
- authentication;
- forms;
- accounts;
- user-generated content;
- screening or diagnostic calculators;
- individual recommendations;
- service-provider directories or maps;
- full-text site search;
- course enrolment and progress tracking;
- quizzes, certificates, or payments;
- automated translation publication;
- a headless CMS;
- a mobile application;
- advertising technology;
- continuous collection of visitor-level analytics.

Their absence is an intentional MVP boundary, not an incomplete implementation.

## 31. Risks and controls

| Risk | Initial control |
|---|---|
| One person maintains the project | Small dependency set, reusable templates, documented checks |
| Three languages drift apart | Stable translation keys and release validation |
| Medical or evidence claims are overstated | Document 04 workflow, sources, disclaimers, risk levels |
| Missing or stale external resources | Verification dates and visible external-resource labels |
| GitHub Pages subpath breaks links | Central base-aware URL construction and generated-link checks |
| Future domain change breaks metadata | Central site configuration and canonical URL generation |
| Accessibility regressions | Shared semantic components plus automated and manual checks |
| Draft content is published accidentally | Draft filtering and release validation |
| Dependency behaviour changes | Lockfile, deliberate upgrades, production builds |
| Analytics exceeds the privacy boundary | Approved provider review and Document 05 controls |

## 32. Assumptions requiring implementation-time verification

The following are confirmed project intentions but require technical verification when implemented:

- the current stable Astro and Node.js versions;
- the current official GitHub Actions versions;
- the exact Content Collections API for the installed Astro version;
- GitHub Pages repository and workflow settings;
- Cloudflare Web Analytics data practices and installation method;
- final font rendering for Kazakh characters;
- accessibility behaviour of the completed components;
- behaviour of canonical and alternate-language URLs under the GitHub Pages base path.

No provider behaviour or software version should be assumed indefinitely from this planning document.

## 33. Primary technical references

- Astro, *Deploy your Astro Site to GitHub Pages*:  
  <https://docs.astro.build/en/guides/deploy/github/>
- Astro, *Content Collections*:  
  <https://docs.astro.build/en/guides/content-collections/>
- Astro, *Internationalization Routing*:  
  <https://docs.astro.build/en/guides/internationalization/>
- Astro, *Configuration Reference*:  
  <https://docs.astro.build/en/reference/configuration-reference/>
- GitHub Docs, *Using custom workflows with GitHub Pages*:  
  <https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
- GitHub Docs, *What is GitHub Pages?*:  
  <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>

These references describe software and hosting behaviour. Their current versions must be consulted during implementation.

## 34. Final decision

The approved technical model is:

1. A static Astro and TypeScript website generated from validated Markdown.
2. Plain Astro Components and CSS without an additional client framework.
3. Three Content Collections for general pages, research explainers, and learning resources.
4. Explicit `/kz/{language}/` routes for Russian, Kazakh, and English.
5. Stable translation keys linking equivalent content with potentially localised slugs.
6. No backend, database, accounts, forms, screening, or user-data collection.
7. GitHub as the public source repository and GitHub Pages as the zero-cost host.
8. GitHub Actions for reproducible validation, build, and later deployment.
9. WCAG 2.2 Level AA as the technical accessibility target without premature conformance claims.
10. Privacy-focused aggregate analytics only after a separate implementation-time review.
11. GitHub Pages remains disabled until the implemented launch candidate is explicitly approved.
