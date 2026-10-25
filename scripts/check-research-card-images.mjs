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
const catalogueSource = await readFile(path.join(root, 'src/pages/kz/[lang]/research/topics/[topic].astro'), 'utf8');
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

const listing = await readFile(path.join(root, 'dist/kz/ru/research/topics/research-reviews/index.html'), 'utf8');
for (const item of published) {
  assert.ok(listing.includes('src="' + base + item.src + '"'),
    'Published research listing does not use its unique local card image: ' + item.slug);
}
const home = await readFile(path.join(root, 'dist/kz/ru/index.html'), 'utf8');
const cards = [...home.matchAll(/<article\b[^>]*\bclass="[^"]*\bhome-v2__card--article\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
  .map(match => match[0])
  .filter(card => card.includes(base + 'kz/ru/research/'));
// Chronological updates may contain zero, one or several scientific explainers.
// The dedicated research collection uses curated Pexels cards; explanatory
// research pages in the pages collection carry their own editorial cover.
const featuredPhotos = new Set();
for (const card of cards) {
  const slug = card.match(/href="\/central-asia-autism-hub\/kz\/ru\/research\/([a-z0-9-]+)\/"/)?.[1];
  assert.ok(slug, 'Homepage research article must have a local article link');
  if (visuals.has(slug)) {
    const src = base + visuals.get(slug);
    assert.ok(card.includes('src="' + src + '"'),
      'Homepage research highlight does not use its specific photo: ' + slug);
    assert.ok(!featuredPhotos.has(src), 'Research photos must remain distinct');
    featuredPhotos.add(src);
  }
}
console.log('Research visual QA passed: ' + published.length + ' unique documented research covers; ' + featuredPhotos.size + ' research-collection cards in the chronological homepage feed.');


// Regression check for three regional science explainers: distinct real stock photographs
// on listing cards and article heroes, retaining scientific figures in the body.
const regionalCovers = [{"name":"probely-issledovaniy-autizma-v-centralnoy-azii.md","slug":"probely-issledovaniy-autizma-v-centralnoy-azii","file":"research-kz-evidence-gaps-team-meeting.jpg","old":"central-asia-autism-research-gaps-roadmap.svg","id":"7698802"},{"name":"tehnologii-podderzhki-autizma-v-kazahstane-nauchnye-dannye.md","slug":"tehnologii-podderzhki-autizma-v-kazahstane-nauchnye-dannye","file":"research-kz-technology-child-tablet.jpg","old":"kazakhstan-autism-support-technologies-map.svg","id":"9345618"},{"name":"inklyuzivnoe-obrazovanie-autizm-kazahstan-issledovaniya.md","slug":"inklyuzivnoe-obrazovanie-autizm-kazahstan-issledovaniya","file":"research-kz-inclusive-classroom-teacher-support.jpg","old":"kazakhstan-inclusive-education-participation-path.svg","id":"5212354"}];
const regionalListing = await readFile(path.join(root, 'dist/kz/ru/research/topics/kazakhstan-research/index.html'), 'utf8');
for (const cover of regionalCovers) {
  const articleSource = await readFile(path.join(root, 'src/content/pages/kz/ru', cover.name), 'utf8');
  const photoUrl = base + 'images/editorial/photos/' + cover.file;
  assert.ok(articleSource.includes('featuredImage: "' + photoUrl + '"'), cover.slug + ': no new stock cover');
  assert.ok(articleSource.includes(cover.old), cover.slug + ': explanatory original diagram must remain');
  assert.ok(manifest.includes("['" + cover.file + "', '" + cover.id + "']"), cover.slug + ': missing Pexels source in downloader');
  assert.ok(attribution.includes(cover.file) && attribution.includes('pexels.com/photo/'), cover.slug + ': no source credit');
  const photo = await readFile(path.join(root, 'public/images/editorial/photos', cover.file));
  assert.ok(photo.length > 15000 && photo[0] === 255 && photo[1] === 216 && photo.at(-2) === 255 && photo.at(-1) === 217,
    cover.slug + ': downloaded photo is invalid');
  const html = await readFile(path.join(root, 'dist/kz/ru/research', cover.slug, 'index.html'), 'utf8');
  assert.ok(html.includes(photoUrl), cover.slug + ': hero image does not show photo');
  assert.ok(regionalListing.includes(photoUrl), cover.slug + ': topic card does not show photo');
}
assert.equal(new Set(regionalCovers.map(c => c.file)).size, 3, 'Regional science covers must be distinct');
console.log('Regional Kazakhstan research covers PASS: three unique Pexels photos on article and catalogue pages.');
