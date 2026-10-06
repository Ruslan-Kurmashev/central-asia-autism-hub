# Decap CMS setup

This repository includes a Decap CMS admin UI at:

- production: `https://ruslan-kurmashev.github.io/central-asia-autism-hub/admin/`
- local Astro build: `/central-asia-autism-hub/admin/`

## What is already configured

The CMS edits the same Markdown files that Astro already uses:

- `src/content/pages/kz/ru`
- `src/content/pages/kz/kk`
- `src/content/pages/kz/en`
- `src/content/research`
- `src/content/learning`

The article form mirrors the validated Astro content schema, including:

- title, summary, SEO description;
- section, topic, URL slug and translation key;
- audience and translation status;
- author, editor and external reviewer;
- publication, update and evidence-review dates;
- risk and disclaimer metadata;
- key points and evidence limitations;
- structured sources;
- Markdown article body.

`publish_mode: editorial_workflow` is enabled so CMS drafts are stored on a CMS branch / pull request before publication.

## One manual step required for online authentication

Decap Turbo authentication cannot be created from repository code because it must be linked to the repository owner account.

1. Open Decap Turbo and connect the GitHub account that owns `Ruslan-Kurmashev/central-asia-autism-hub`.
2. Create one Turbo site for this repository.
3. Set:
   - repository: `Ruslan-Kurmashev/central-asia-autism-hub`
   - branch: `main`
   - config path: `public/admin/config.yml`
   - admin URL: `https://ruslan-kurmashev.github.io/central-asia-autism-hub/admin/`
4. Copy the Turbo Site ID from the site Overview.
5. Replace `REPLACE_WITH_DECAP_TURBO_SITE_ID` in `public/admin/config.yml` with that UUID.
6. Merge and deploy.

The Turbo backend is currently distributed through the Decap CMS beta package, so `public/admin/index.html` pins the exact beta version instead of tracking an unpinned beta tag.

## Local CMS testing

`local_backend: true` is enabled. For local authoring, run Astro and a Decap local backend proxy according to the Decap local-backend documentation. Production uses Turbo after the Site ID is configured.

## Media

CMS uploads are stored in:

`public/images/uploads`

Because the current production site is a GitHub Pages project site, public image URLs include the current base path:

`/central-asia-autism-hub/images/uploads`

If the site later moves to a custom root domain, update `public_folder` and `site_url` in `public/admin/config.yml`.

## Safety rules

- New entries default to `draft: true`.
- Do not publish an article while `translationStatus: pending`.
- Published information pages must have at least one source.
- Publication and update dates are required by the Astro schema for non-draft entries.
- The Astro validation pipeline remains authoritative: CMS convenience does not bypass `npm run validate`.
