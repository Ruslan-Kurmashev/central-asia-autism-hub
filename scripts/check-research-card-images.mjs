/** Research photo QA: unique cards, correct sources, and rendered listing/home assets. */
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const base = '/central-asia-autism-hub/';
const visualSource = await readFile(path.join(root, 'src/data/research-card-visuals.ts'), 'utf8');
const manifest = await readFile(path.join(root, 'scripts/sync-editorial-photos.mjs'), 'utf8');
const attribution = await readFile(path.join(root, 'docs/editorial-image-sources.md'), 'utf8');
const homepageSource = await readFile(path.join(root, 'src/pages/kz/[lang]/index.astro'), 'utf8');
const catalogueSource = await readFile(path.join(root, 'src/pages/kz/[lang]/[section]/index.astro'), 'utf8');
assert.ok(homepageSource.includes('getResearchCardVisual(material.data.slug)'), 'Homepage must render per-article research cover');
assert.ok(catalogueSource.includes('getResearchCardVisual(material.data.slug)'), 'Research catalogue must render per-article research cover');
assert.ok(!homepageSource.includes("getEditorialVisual('research'"), 'Generic lab image may not override research covers');

const visuals = new Map();
const images = new Set();
const pattern = /'([a-z0-9-]+)':\s*\{\s*src:\s*'([^']+)',\s*alt:\s*'([^']+)',\s*\},/g;
for (const match of visualSource.matchAll(pattern)) {
  const [, slug, src, alt] = match;
  assert.ok(!visuals.has(slug), 'Duplicate research visual slug: ' + slug);
  assert.ok(src.startsWith('images/editorial/photos/research-') && src.endsWith('.jpg'),
    'Nonlocal or misclassified research visual: ' + slug + ': ' + src);
  assert.ok(!images.has(src), 'Two research cards share a cover: ' + src);
  assert.ok(alt.length >= 55, 'Uninformative research card alt text: ' + slug);
  images.add(src);
  visuals.set(slug, src);
}

const researchDir = path.join(root, 'src/content/research');
const files = (await readdir(researchDir)).filter(name => /\.mdx?$/.test(name));
const published = [];
for (const file of files) {
  const raw = await readFile(path.join(researchDir, file), 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(fm, 'Invalid research frontmatter: ' + file);
  const value = name => fm.match(new RegExp('^' + name + ':\\s*(.*)$', 'm'))?.[1]
    ?.trim().replace(/^["']|["']$/g, '') ?? '';
  if (value('draft') !== 'false' || value('language') !== 'ru') continue;
  const slug = value('slug');
  const src = visuals.get(slug);
  assert.ok(src, 'Published research explainer lacks a unique card photo: ' + slug);
  const filename = path.basename(src);
  const photo = path.join(root, 'public', src);
  const info = await stat(photo);
  assert.ok(info.size > 12000, 'Missing or empty research card photo: ' + filename);
  const bytes = await readFile(photo);
  assert.ok(bytes[0] === 0xff && bytes[1] === 0xd8 &&
    bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9, 'Not a valid JPEG: ' + filename);
  assert.ok(manifest.includes("['" + filename + "', '"),
    'Research image omitted from local photo downloader: ' + filename);
  assert.ok(attribution.includes('`' + filename + '`') &&
    attribution.includes('https://www.pexels.com/photo/'),
    'Research image source not documented: ' + filename);
  published.push({ slug, src, at: Date.parse(value('publishedAt')) });
}
assert.ok(published.length >= 10, 'Expected ten published Russian scientific explainers');
assert.equal(visuals.size, published.length,
  'Research card photo registry must cover all and only the published Russian research articles');

const listing = await readFile(path.join(root, 'dist/kz/ru/research/index.html'), 'utf8');
for (const item of published) {
  assert.ok(listing.includes('src="' + base + item.src + '"'),
    'Published research listing does not use its unique local card image: ' + item.slug);
}
const home = await readFile(path.join(root, 'dist/kz/ru/index.html'), 'utf8');
const cards = [...home.matchAll(/<article\\b[^>]*\\bclass="[^"]*\\bhome-v2__card--article\\b[^"]*"[^>]*>[\\s\\S]*?<\\/article>/g)]
  .map(match => match[0])
  .filter(card => card.includes(base + 'kz/ru/research/'));
assert.equal(cards.length, 2, 'Homepage must feature two research explainers');
const featuredPhotos = new Set();
for (const card of cards) {
  const slug = card.match(/href="\\/central-asia-autism-hub\\/kz\\/ru\\/research\\/([a-z0-9-]+)\\/"/)?.[1];
  assert.ok(slug && visuals.has(slug), 'Homepage research card has an unmapped article slug');
  const src = base + visuals.get(slug);
  assert.ok(card.includes('src="' + src + '"'),
    'Homepage research highlight does not use its own specific photo: ' + slug);
  featuredPhotos.add(src);
}
assert.equal(featuredPhotos.size, cards.length, 'Homepage research card photos must be distinct');
console.log(`Research visual QA passed: ${published.length} unique documented locally hosted covers; ${latest.length} distinct homepage research highlights.`);
