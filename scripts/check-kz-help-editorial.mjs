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
    for (const expected of ['kz-help-article-body', 'article-v2__layout', 'article-v2__sources', picture]) {
      if (!html.includes(expected)) errors.push(id + ': missing rendered ' + expected);
    }
  }
  counts[locale] = published;
  if (published < 8) errors.push(locale + ': expected at least eight published help guides');
}

for (const [key, langs] of translations) {
  if (langs.size < 3) {
    // Existing eight guides have checked translations; keep the three editions in sync.
    errors.push(key + ': missing published RU/KK/EN edition');
  }
}

if (errors.length) {
  console.error('Kazakhstan help editorial QA FAILED:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Kazakhstan help editorial QA passed: ' +
    Object.values(counts).reduce((a, b) => a + b, 0) + ' published guides ' +
    JSON.stringify(counts) + ', ' + checkedHeadings + ' semantic headings, ' +
    tableRows + ' Markdown table rows, localized listing and article templates.');
}
