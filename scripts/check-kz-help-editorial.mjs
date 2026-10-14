import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// Editorial and rendering QA for every published Kazakhstan-help guide.
// The site layout owns H1; article prose uses H2/H3 and common font tokens.
const root = path.resolve('src/content/pages/kz');
const dist = path.resolve('dist');
const locales = ['ru', 'kk', 'en'];
const errors = [];
const counts = {};
const translations = new Map();
const translationCovers = new Map();
let checkedCoverCards = 0;
let checkedHeroImages = 0;
let checkedHomepageCards = 0;
let checkedHeadings = 0;
let tableRows = 0;

const field = (fm, name) => {
  const match = fm.match(new RegExp('^' + name + ':\\s*(.+)$', 'm'));
  return match?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
};

for (const locale of locales) {
  const dir = path.join(root, locale);
  const indexPath = path.join(dist, 'kz', locale, 'help-kazakhstan', 'index.html');
  const index = await readFile(indexPath, 'utf8');
  if (!index.includes('kz-help-section-body')) {
    errors.push(locale + ': missing help-section typography on index');
  }

  let published = 0;
  const imageOwners = new Map();
  const coversBySlug = new Map();
  const listingCards = [...index.matchAll(/<a\b[^>]*\bclass="[^"]*\bsection-v2__article-row[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
    .map(match => match[0]);
  for (const filename of (await readdir(dir)).filter(x => /\.mdx?$/.test(x))) {
    const source = await readFile(path.join(dir, filename), 'utf8');
    const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!m) { errors.push(locale + '/' + filename + ': no YAML frontmatter'); continue; }
    const fm = m[1];
    if (field(fm, 'section') !== 'help-kazakhstan' || field(fm, 'draft') !== 'false') continue;
    published++;

    const id = locale + '/' + filename;
    const body = source.slice(m[0].length);
    const slug = field(fm, 'slug');
    const key = field(fm, 'translationKey');
    const picture = field(fm, 'featuredImage');
    const alt = field(fm, 'featuredImageAlt');
    const status = field(fm, 'translationStatus');
    if (field(fm, 'language') !== locale || !slug || !key) errors.push(id + ': invalid route or translation metadata');
    if (locale !== 'ru' && status !== 'checked') errors.push(id + ': unchecked published translation');
    if (!picture || alt.length < 25) errors.push(id + ': image or descriptive alternative missing');
    if (picture) {
      if (imageOwners.has(picture)) {
        errors.push(id + ': reused cover with ' + imageOwners.get(picture) + ': ' + picture);
      }
      imageOwners.set(picture, id);
      coversBySlug.set(slug, picture);
      if (!picture.startsWith('/central-asia-autism-hub/images/editorial/photos/')) {
        errors.push(id + ': nonlocal or noneditorial help cover: ' + picture);
      }
      const other = translationCovers.get(key);
      if (other && other !== picture) {
        errors.push(id + ': inconsistent cover between translations for ' + key);
      } else {
        translationCovers.set(key, picture);
      }
      const href = '/central-asia-autism-hub/kz/' + locale + '/help-kazakhstan/' + slug + '/';
      const matchingCards = listingCards.filter(card => card.includes('href="' + href + '"'));
      if (matchingCards.length !== 1) {
        errors.push(id + ': expected exactly one directory card, found ' + matchingCards.length);
      } else if (!matchingCards[0].includes('src="' + picture + '"')) {
        errors.push(id + ': directory cover differs from article cover: ' + picture);
      } else {
        checkedCoverCards++;
      }
    }
    if (!translations.has(key)) translations.set(key, new Set());
    translations.get(key).add(locale);

    // Semantic structure and no article-local font overrides.
    const headings = [...body.matchAll(/^ {0,3}(#{1,6})[ \t]+(.+)$/gm)]
      .map(x => ({ depth: x[1].length, title: x[2] }));
    checkedHeadings += headings.length;
    if (!headings.length || headings[0].depth !== 2) errors.push(id + ': expected H2 sections');
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].depth === 1) errors.push(id + ': duplicate H1');
      if (i && headings[i].depth > headings[i - 1].depth + 1) {
        errors.push(id + ': skipped heading level');
      }
    }
    if (/<(?:h1|font)\b/i.test(body) || /font-(?:size|family)\s*:/i.test(body)) {
      errors.push(id + ': article-local typography override');
    }
    const sources = [...fm.matchAll(/^  - title:/gm)];
    if (sources.length < 2) errors.push(id + ': original official sources missing');
    tableRows += (body.match(/^\|.+\|\s*$/gm) || []).length;

    if (!index.includes('help-kazakhstan/' + slug + '/')) {
      errors.push(id + ': absent from help section listing');
    }
    const articlePath = path.join(dist, 'kz', locale, 'help-kazakhstan', slug, 'index.html');
    let html;
    try { html = await readFile(articlePath, 'utf8'); }
    catch { errors.push(id + ': no generated article page'); continue; }
    const heroImages = [...html.matchAll(/<img\b[^>]*>/g)]
      .filter(match => match[0].includes('src="' + picture + '"'));
    if (heroImages.length !== 1) {
      errors.push(id + ': expected one matching article hero, found ' + heroImages.length);
    } else {
      checkedHeroImages++;
    }
    for (const expected of ['kz-help-article-body', 'article-v2__layout', 'article-v2__sources', picture]) {
      if (!html.includes(expected)) errors.push(id + ': missing rendered ' + expected);
    }
  }
  // Homepage featured cards must use the same distinct images as the help
  // catalogue and article heroes, never the generic editorial fallback.
  const homepage = await readFile(path.join(dist, 'kz', locale, 'index.html'), 'utf8');
  const featured = [...homepage.matchAll(/<article\b[^>]*\bclass="[^"]*\bhome-v2__card--article\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0])
    .filter(card => card.includes('/kz/' + locale + '/help-kazakhstan/'));
  if (featured.length < 1) errors.push(locale + ': missing featured help cards on homepage');
  const seenFeatured = new Set();
  for (const card of featured) {
    const href = card.match(/href="([^"]*\/help-kazakhstan\/[^"]+)"/)?.[1] ?? '';
    const slug = href.replace(/\/+$/, '').split('/').at(-1);
    const image = coversBySlug.get(slug);
    if (!image || !card.includes('src="' + image + '"')) {
      errors.push(locale + ': homepage featured help card has wrong cover: ' + slug);
      continue;
    }
    if (seenFeatured.has(image)) errors.push(locale + ': homepage help cards reuse cover ' + image);
    seenFeatured.add(image);
    checkedHomepageCards++;
  }
  counts[locale] = published;
  if (imageOwners.size !== published) errors.push(locale + ': missing or reused images across published help articles');
  if (published < 8) errors.push(locale + ': expected at least eight published help guides');
}

for (const [key, langs] of translations) {
  if (langs.size > 1 && langs.size < 3) {
    // An RU-only newly published guide may await translation. Once translations
    // begin publishing, the language set must remain consistent.
    errors.push(key + ': incomplete published RU/KK/EN language set');
  }
}

if (errors.length) {
  console.error('Kazakhstan help editorial QA FAILED:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Kazakhstan help editorial QA passed: ' +
    Object.values(counts).reduce((a, b) => a + b, 0) + ' published guides ' +
    JSON.stringify(counts) + ', ' + checkedHeadings + ' semantic headings, ' +
    tableRows + ' Markdown table rows, ' + checkedCoverCards + ' distinct matching directory images, ' + checkedHeroImages + ' verified article heroes, ' + checkedHomepageCards + ' homepage cards and localized templates.');
}
