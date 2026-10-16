/**
 * The Kazakhstan legal/professional library has 25 RU reviewed entries across
 * five categories. This checks the *rendered* links and source metadata;
 * it does not certify the legal accuracy or current force of any document.
 */
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/pages/kz/ru');
const siteRoot = '/central-asia-autism-hub/kz/ru/professionals/';
const hubHref = siteRoot + 'kazakhstan-documents/';
const groups = [
  { id: 'education-support', prefix: 'kz-education-', count: 8 },
  { id: 'healthcare-diagnosis', prefix: 'kz-healthcare-', count: 5 },
  { id: 'psychological-practice', prefix: 'kz-psychology-', count: 3 },
  { id: 'social-support', prefix: 'kz-social-', count: 5 },
  { id: 'rights-and-data', prefix: 'kz-rights-', count: 4 },
];
const field = (frontmatter, key) =>
  frontmatter.match(new RegExp('^' + key + ':\\s*"?([^"\\n]+)"?\\s*$', 'm'))?.[1]?.trim();

const filenames = (await readdir(root)).filter(name => name.endsWith('.md'));
const overview = await readFile('dist/kz/ru/professionals/kazakhstan-documents/index.html', 'utf8');
const siteCss = await readFile('src/styles/article-v2.css', 'utf8');
const catalogCss = await readFile('src/styles/kazakhstan-professional-documents.css', 'utf8');

assert.ok(overview.includes('<strong>25</strong> материалов'), 'Russian overview must describe published reviews, not a publication plan');
assert.ok(!overview.includes('25 документов в плане'), 'Russian overview incorrectly presents published material as pending');
assert.ok(overview.includes('Опубликовано: <strong>25</strong>'), 'Full Russian catalog must show 25 published reviews');
assert.ok(siteCss.includes('.article-v2.kz-professionals-document-body .article-v2__body table'),
  'Kazakhstan professional articles need mobile table overflow protection');
assert.ok(siteCss.includes('overflow-x: auto;'), 'Wide legal tables must scroll within their viewport on mobile');
assert.ok(catalogCss.includes('.kz-documents__card-title') && catalogCss.includes('overflow-wrap: anywhere;'),
  'Long legal titles must wrap on narrow mobile layouts');

let checked = 0;
const keys = new Set();
const slugs = new Set();

for (const group of groups) {
  const categoryHref = hubHref + group.id + '/';
  const categoryHtml = await readFile(
    path.resolve('dist/kz/ru/professionals/kazakhstan-documents', group.id, 'index.html'),
    'utf8',
  );
  const matching = filenames.filter(name => name.startsWith(group.prefix));
  assert.equal(matching.length, group.count, group.id + ': incorrect number of review files');
  assert.ok(overview.includes('href="' + categoryHref + '"'), group.id + ': missing overview link');
  assert.ok(categoryHtml.includes('href="' + hubHref + '"'), group.id + ': missing return to index');

  for (const filename of matching) {
    const raw = await readFile(path.join(root, filename), 'utf8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    assert.ok(fm, filename + ': missing frontmatter');
    const slug = field(fm, 'slug');
    const key = field(fm, 'translationKey');
    const cover = field(fm, 'featuredImage');
    assert.ok(slug && key && cover, filename + ': missing routing or illustration');
    assert.ok(!slugs.has(slug), filename + ': duplicate slug');
    assert.ok(!keys.has(key), filename + ': duplicate translation key');
    slugs.add(slug);
    keys.add(key);
    assert.ok(fm.includes('draft: false'), filename + ': article still a draft');
    assert.ok(fm.includes('language: ru'), filename + ': unexpected source language');
    assert.ok(fm.includes('translationStatus: source'), filename + ': unexpected translation status');
    assert.ok(key.startsWith('professionals-kz-'), filename + ': invalid translation key prefix');
    const reviewed = field(fm, 'updatedAt');
    const due = field(fm, 'reviewDueAt');
    assert.match(reviewed ?? '', /^\d{4}-\d{2}-\d{2}$/, filename + ': malformed update date');
    assert.match(due ?? '', /^\d{4}-\d{2}-\d{2}$/, filename + ': malformed next review date');
    assert.ok(due > reviewed, filename + ': next review date must follow latest update');
    assert.ok(fm.includes('evidenceLimitations:'), filename + ': missing evidence limitations');
    if (group.id === 'healthcare-diagnosis') {
      assert.equal(field(fm, 'riskLevel'), 'high',
        filename + ': Kazakhstan clinical/legal healthcare review must stay flagged as high risk');
      assert.equal(field(fm, 'disclaimerType'), 'medical',
        filename + ': medical limitation notice missing');
      assert.ok(fm.includes('versionNote:'), filename + ': healthcare change log absent');
    }
    assert.ok(fm.includes('featuredImageAlt:'), filename + ': missing image alternative text');
    assert.ok(fm.includes('sources:'), filename + ': missing references');

    const sourceUrls = [...fm.matchAll(/^\s+url:\s*"?([^"\n]+)/gm)].map(match => match[1]);
    assert.ok(sourceUrls.length >= 2, filename + ': at least two sourced records expected');
    if (key.endsWith('autism-clinical-protocol')) {
      assert.ok(sourceUrls.some(url => url.includes('nrchd.kz/storage/documents/') && url.includes('.pdf')),
        filename + ': institutional ASD protocol PDF is required as the primary source');
      assert.ok(sourceUrls.some(url => url.includes('medelement.com')),
        filename + ': missing secondary MedElement version history');
      assert.ok(raw.includes('не подтверждён'), filename + ': clinical current-force caveat missing');
      assert.ok(raw.includes('размещение') || raw.includes('Размещение'),
        filename + ': published PDF must not imply the protocol is still in force');
    } else {
      assert.ok(sourceUrls.some(url => url.includes('adilet.zan.kz/rus/docs/')),
        filename + ': official Adilet law/ministerial primary source missing');
    }

    const imageBase = cover.split('/').pop();
    await access(path.resolve('public/images/editorial', imageBase));
    const articleHref = siteRoot + slug + '/';
    const articleHtml = await readFile(
      path.resolve('dist/kz/ru/professionals', slug, 'index.html'),
      'utf8',
    );
    assert.ok(categoryHtml.includes('href="' + articleHref + '"'),
      filename + ': category must link article');
    assert.ok(articleHtml.includes('href="' + hubHref + '"'),
      filename + ': article breadcrumb must include Kazakhstan document overview');
    assert.ok(articleHtml.includes('href="' + categoryHref + '"'),
      filename + ': article breadcrumb/back link must include its own category');
    assert.ok(articleHtml.includes('class="article-v2__back" href="' + categoryHref + '"'),
      filename + ': article footer must return to its own document category');
    assert.ok(articleHtml.includes('kz-professionals-document-body'),
      filename + ': mobile professional document styles not applied');
    assert.ok(articleHtml.includes(imageBase), filename + ': article hero illustration missing');
    assert.ok(articleHtml.includes('Паспорт документа'), filename + ': document passport absent');
    checked++;
  }
}

assert.equal(checked, 25, 'Expected 25 individual RU Kazakhstan legal reviews');
for (const locale of ['kk', 'en']) {
  const localizedOverview = await readFile(
    path.resolve('dist/kz', locale, 'professionals/kazakhstan-documents/index.html'),
    'utf8',
  );
  assert.ok(localizedOverview.includes((locale === 'kk' ? 'Жарияланғаны' : 'Published') + ': <strong>0</strong>'),
    locale + ': do not mark unreviewed translation as published');
}

console.log('Kazakhstan professional library QA: 25 published RU reviews, 5 correct category breadcrumbs and back links, 25 covers, source provenance, mobile CSS safeguards; KK/EN pending.');
