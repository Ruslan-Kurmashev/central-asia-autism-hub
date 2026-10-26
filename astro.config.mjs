import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkBaseLinks from './src/lib/remark-base-links.mjs';
import remarkRemoveInlineStrong from './src/lib/remark-remove-inline-strong.mjs';

const siteOrigin = 'https://ruslan-kurmashev.github.io';
const base = '/central-asia-autism-hub';

export default defineConfig({
  site: siteOrigin,
  base,
  output: 'static',
  // Retired articles remain reachable at their original addresses on GitHub Pages.
  // Static Astro creates HTML/meta-refresh redirects. The old Markdown stays in Git as draft.
  redirects: {
    '/kz/ru/parents/kommunikatsiya-i-aac': '/central-asia-autism-hub/kz/ru/parents/aac/',
    '/kz/ru/parents/aided-language-modelling': '/central-asia-autism-hub/kz/ru/parents/aac/',
    '/kz/ru/parents/antecedent-based-interventions': '/central-asia-autism-hub/kz/ru/parents/povedenie-i-obuchenie/',
    '/kz/ru/parents/play-based-interventions': '/central-asia-autism-hub/kz/ru/parents/razvitie-vzaimodeystvie-i-igra/',
    '/kz/ru/parents/joint-attention': '/central-asia-autism-hub/kz/ru/parents/razvitie-vzaimodeystvie-i-igra/',
    '/kz/ru/parents/sensory-based-strategies': '/central-asia-autism-hub/kz/ru/parents/sensornye-osobennosti-i-adaptatsiya-sredy/',
    '/kz/ru/parents/sensory-diet': '/central-asia-autism-hub/kz/ru/parents/sensornye-osobennosti-i-adaptatsiya-sredy/',
    '/kz/ru/parents/samostoyatelnost-i-povsednevnye-navyki': '/central-asia-autism-hub/kz/ru/parents/obuchenie-povsednevnym-navykam/',
    '/kz/ru/parents/task-analysis': '/central-asia-autism-hub/kz/ru/parents/obuchenie-povsednevnym-navykam/',
    '/kz/ru/parents/adapted-cbt-autistic-people': '/central-asia-autism-hub/kz/ru/parents/cognitive-behavioral-therapy/',
  },
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base, siteOrigin }], remarkRemoveInlineStrong],
  },
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
