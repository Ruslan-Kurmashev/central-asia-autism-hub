import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// Published Parents visual QA: actual compiled list order, reuse, consecutive
// duplicates, hero/list identity and inline duplication. Reuse is reported,
// not silently replaced or considered a failure of the existing content.
const locale = 'ru';
const root = path.resolve('src/content/pages/kz', locale);
const siteRoot = path.resolve('dist/kz', locale, 'parents');
const list = await readFile(path.join(siteRoot, 'index.html'), 'utf8');
const articles = [];
const issues = [];
const lookup = new Map();
const field = (fm, k) =>
  fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';

for (const filename of (await readdir(root)).filter(v => v.endsWith('.md'))) {
  const text = await readFile(path.join(root, filename), 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  if (field(fm[1], 'section') !== 'parents' || field(fm[1], 'draft') !== 'false') continue;
  const data = {
    source: filename,
    slug: field(fm[1], 'slug'),
    title: field(fm[1], 'title'),
    topic: field(fm[1], 'topic'),
    image: field(fm[1], 'featuredImage'),
    alt: field(fm[1], 'featuredImageAlt'),
  };
  articles.push(data);
  if (!data.slug || !data.image || data.alt.length < 25) {
    issues.push(filename + ': incomplete image, slug or alt metadata');
    continue;
  }
  if (lookup.has(data.slug)) issues.push('duplicate published slug ' + data.slug + ': ' + lookup.get(data.slug).source + ' and ' + filename);
  lookup.set(data.slug, data);
  const content = text.slice(fm[0].length);
  const inlineMatches = [
    ...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),
    ...content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)/gi),
  ];
  if (inlineMatches.some(m => m[1] === data.image))
    issues.push(filename + ': same hero image redundantly embedded in Markdown body');
  const built = await readFile(path.join(siteRoot, data.slug, 'index.html'), 'utf8');
  const imageTags = [...built.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const heroCount = imageTags.filter(tag => tag.includes(data.image)).length;
  if (heroCount !== 1) issues.push(filename + ': expected one main image in article, got ' + heroCount);
}

const byImage = new Map();
for (const article of articles) {
  if (!byImage.has(article.image)) byImage.set(article.image, []);
  byImage.get(article.image).push(article);
}
const repeated = [...byImage.entries()]
  .filter(([, docs]) => docs.length > 1)
  .sort((a,b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

const cards = [...list.matchAll(/<a\b[^>]*\bclass="[^"]*section-v2__article-row[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
  .map(match => {
    const html = match[0];
    const href = html.match(/\bhref=["']([^"']+)/)?.[1] ?? '';
    const img = html.match(/<img\b[^>]*\bsrc=["']([^"']+)/)?.[1] ?? '';
    const slug = href.replace(/\/+$/, '').split('/').at(-1);
    const before = list.slice(0, match.index);
    const start = before.lastIndexOf('class="section-v2__group"');
    const group = start === -1 ? 'ungrouped' :
      list.slice(start, start + 280).match(/\bid=["']([^"']+)/)?.[1] ?? 'ungrouped';
    return { slug, img, group, file: lookup.get(slug)?.source ?? null };
  });
const actualArticles = cards.filter(card => lookup.has(card.slug));
for (const article of actualArticles) {
  if (article.img !== lookup.get(article.slug).image)
    issues.push(article.slug + ': list thumbnail differs from article image');
}
if (actualArticles.length !== articles.length)
  issues.push('listing count mismatch: expected ' + articles.length + ', observed ' + actualArticles.length);

const adjacent = [], near = [];
for (const [i, card] of cards.entries()) {
  if (!card.img) continue;
  for (let distance = 1; distance <= 2 && i + distance < cards.length; distance++) {
    const other = cards[i + distance];
    if (card.group !== other.group || card.img !== other.img) continue;
    const entry = { group: card.group, first: card.slug, second: other.slug, image: card.img.split('/').at(-1) };
    (distance === 1 ? adjacent : near).push(entry);
  }
}
console.log('[PARENT-IMAGE-AUDIT] ' + JSON.stringify({
  articles: articles.length,
  distinctImages: byImage.size,
  imageFilesReused: repeated.length,
  articlesUsingReusedImages: repeated.reduce((n,[,v]) => n + v.length,0),
  listingCards: cards.length,
  exactAdjacentPairs: adjacent.length,
  withinTwoCardsPairs: near.length,
  zeroHeroDuplicatesWithinArticles: !issues.some(x => x.includes('same hero image redundantly')),
}));
for (const [img, docs] of repeated.slice(0, 22)) {
  console.log('[REUSED] ' + img.split('/').at(-1) + ': ' + docs.length + ' articles (' + docs.map(x=>x.slug).join(', ') + ')');
}
for (const x of adjacent) console.log('[ADJACENT] ' + JSON.stringify(x));
for (const x of near) console.log('[NEAR] ' + JSON.stringify(x));
if (issues.length) {
  console.warn('[PARENT-IMAGE-ISSUES] ' + issues.length + ' issues requiring editorial decision:\n' +
    issues.map(x => ' - ' + x).join('\n'));
  // Leave all existing article files unchanged in this audit-only PR.
  // Use --strict after the existing duplicate routes and image mismatch are fixed.
  if (process.argv.includes('--strict')) process.exitCode = 1;
} else {
  console.log('Parent image structural QA passed: catalog and hero agree.');
}
console.log('Parent visual audit completed; repeat usage is advisory and no photos were replaced.');
