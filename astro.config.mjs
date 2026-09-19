import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkBaseLinks from './src/lib/remark-base-links.mjs';

const siteOrigin = 'https://ruslan-kurmashev.github.io';
const base = '/central-asia-autism-hub';

export default defineConfig({
  site: siteOrigin,
  base,
  output: 'static',
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base, siteOrigin }]],
  },
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
