import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// A structural audit of all published professional articles. It checks the
// Astro build output and bibliographies, not legal or clinical correctness.
const root = path.resolve('src/content/pages/kz');
const errors = [];
const counts = { ru: 0, kk: 0, en: 0 };
let headingsChecked = 0;
let tableRowsChecked = 0;
let svgCoversChecked = 0;
let photoCoversChecked = 0;
let articleHeroesChecked = 0;
const keys = new Set();
const imageOwnersByLocale = new Map();
const svgArtworkOwners = new Map();
const coverByTranslationKey = new Map();

const field = (front, name) =>
  front.match(new RegExp('^' + name + ':\\s*(.+)$', 'm'))?.[1]
    ?.trim().replace(/^["']|["']$/g, '') ?? '';

for (const locale of ['ru', 'kk', 'en']) {
  const dir = path.join(root, locale);
  const imageOwners = new Map();
  imageOwnersByLocale.set(locale, imageOwners);
  for (const filename of (await readdir(dir)).filter(name => /\.mdx?$/.test(name))) {
    const raw = await readFile(path.join(dir, filename), 'utf8');
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatter) { errors.push(locale + '/' + filename + ': missing frontmatter'); continue; }
    const front = frontmatter[1];
    if (field(front, 'section') !== 'professionals' || field(front, 'draft') !== 'false') continue;
    const id = locale + '/' + filename;
    counts[locale] += 1;
    const slug = field(front, 'slug');
    const key = field(front, 'translationKey');
    const image = field(front, 'featuredImage');
    const alt = field(front, 'featuredImageAlt');
    if (!slug || !key || field(front, 'language') !== locale)
      errors.push(id + ': missing or incorrect route metadata');
    if (locale !== 'ru' && field(front, 'translationStatus') !== 'checked')
      errors.push(id + ': unreviewed translation published');
    if (keys.has(locale + '/' + key)) errors.push(id + ': duplicated translation key');
    keys.add(locale + '/' + key);
    if (!image || !alt || alt.length < 20) errors.push(id + ': descriptive article image missing');
    // Keep each professional article's hero illustration distinct. A shared
    // cover between translations of the same article is intentional.
    if (image) {
      const earlier = imageOwners.get(image);
      if (earlier) errors.push(id + ': same cover reused by ' + earlier + ': ' + image);
      imageOwners.set(image, id);
      const counterpart = coverByTranslationKey.get(key);
      if (counterpart && counterpart !== image) {
        errors.push(id + ': translation does not share the source cover for ' + key);
      } else {
        coverByTranslationKey.set(key, image);
      }
      // The two approved professional raster covers have distinct formats.
      // Keep validation strict: a01 uses JPEG; a05 uses a locally hosted WebP.
      const approvedRasterCovers = {
        'professionals-a01': 'professional-early-referral-family-consultation.jpg',
      };
      const approvedFilename = approvedRasterCovers[key];
      const approvedRaster = Boolean(approvedFilename) &&
        image === '/central-asia-autism-hub/images/editorial/photos/' + approvedFilename;
      const match = image.match(/^\/central-asia-autism-hub\/images\/editorial\/([a-z0-9-]+\.svg)$/);
      if (approvedRaster) {
        const assetPath = path.resolve('public/images/editorial/photos', approvedFilename);
        try {
          const bytes = await readFile(assetPath);
          const validJpeg = approvedFilename.endsWith('.jpg') &&
            bytes[0] === 0xff && bytes[1] === 0xd8 &&
            bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
          const validWebp = approvedFilename.endsWith('.webp') &&
            bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
            bytes.subarray(8, 12).toString('ascii') === 'WEBP';
          if (bytes.length < 15000 || (!validJpeg && !validWebp)) {
            errors.push(id + ': approved professional raster cover is not a valid local image');
          } else {
            photoCoversChecked++;
          }
        } catch {
          errors.push(id + ': approved professional raster cover missing from build assets');
        }
      } else if (!match) {
        errors.push(id + ': professional cover must be a locally hosted editorial SVG: ' + image);
      } else {
        const svgPath = path.resolve('public/images/editorial', match[1]);
        let svg;
        try { svg = await readFile(svgPath, 'utf8'); }
        catch { errors.push(id + ': cover SVG asset not found: ' + match[1]); }
        if (svg) {
          if (!/<svg\b[^>]*viewBox="0 0 [0-9]+ [0-9]+"/.test(svg) ||
              !/<title\b/.test(svg) || !/<desc\b/.test(svg) ||
              /<(?:script|foreignObject)\b/i.test(svg)) {
            errors.push(id + ': SVG must have a positive viewBox, title and description, with no active content');
          }
          // Fingerprint vector artwork, excluding accessibility metadata:
          // changing only SVG filename, title or description is not enough.
          const artwork = svg.replace(/<title\b[^>]*>[\s\S]*?<\/title>/g, '')
            .replace(/<desc\b[^>]*>[\s\S]*?<\/desc>/g, '')
            .replace(/\s+/g, ' ').trim();
          const digest = createHash('sha256').update(artwork).digest('hex');
          const other = svgArtworkOwners.get(digest);
          if (other && other.image !== image) {
            errors.push(id + ': identical SVG artwork also used by ' + other.id);
          } else {
            svgArtworkOwners.set(digest, { id, image });
          }
          svgCoversChecked++;
        }
      }
    }
    if (!field(front, 'updatedAt') || !field(front, 'reviewDueAt'))
      errors.push(id + ': review or update date missing');
    if (!field(front, 'evidenceLimitations')) errors.push(id + ': limitations statement missing');
    if ((front.match(/^  - title:/gm) || []).length < 2)
      errors.push(id + ': traceable references missing');
    const body = raw.slice(frontmatter[0].length);
    const headings = [...body.matchAll(/^ {0,3}(#{1,6})[ \t]+(.+)$/gm)]
      .map(m => ({ level: m[1].length, text: m[2] }));
    headingsChecked += headings.length;
    tableRowsChecked += (body.match(/^\|.+\|\s*$/gm) || []).length;
    if (!headings.length || headings[0].level !== 2)
      errors.push(id + ': professional article must start with H2');
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].level === 1) errors.push(id + ': article must not have an additional H1');
      if (i && headings[i].level > headings[i - 1].level + 1)
        errors.push(id + ': skipped semantic heading level');
    }
    if (/<(?:h1|font)\b/i.test(body) || /font-(?:family|size)\s*:/i.test(body))
      errors.push(id + ': inline or redundant typography not allowed');

    if (slug) {
      const pagePath = path.resolve('dist/kz', locale, 'professionals', slug, 'index.html');
      let html;
      try { html = await readFile(pagePath, 'utf8'); }
      catch { errors.push(id + ': missing rendered article page'); continue; }
      for (const expected of ['professionals-article-body', 'article-v2__layout', 'article-v2__sources', image]) {
        if (!html.includes(expected)) errors.push(id + ': missing rendered ' + expected);
      }
      if (image) {
        const heroImages = [...html.matchAll(/<img\b[^>]*>/g)]
          .filter(match => match[0].includes('src="' + image + '"'));
        if (heroImages.length !== 1) {
          errors.push(id + ': expected exactly one professional hero matching its cover image, found ' + heroImages.length);
        } else {
          articleHeroesChecked++;
        }
      }
      if (key.startsWith('professionals-kz-') && !html.includes('kz-professionals-document-body'))
        errors.push(id + ': legal-document article requires dedicated mobile-table styles');
    }
  }
}
assert.ok(counts.ru >= 49, 'Published professional RU articles disappeared: expected at least 25 Kazakhstan reviews and 24 international/practice resources');
for (const [locale, owners] of imageOwnersByLocale) {
  if (owners.size !== counts[locale]) errors.push(locale + ': professional cover metadata missing or duplicated');
}
if (errors.length) {
  console.error('Professional article QA failed:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Professional article editorial QA passed: ' +
    Object.values(counts).reduce((sum, count) => sum + count, 0) +
    ' published articles ' + JSON.stringify(counts) + ', ' +
    headingsChecked + ' semantic headings, ' +
    tableRowsChecked + ' Markdown table rows, ' +
    svgCoversChecked + ' verified accessible SVG covers, ' +
    photoCoversChecked + ' verified editorial photo covers, ' +
    articleHeroesChecked + ' correctly rendered article heroes and no reused cover artwork.');
}
