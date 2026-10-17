/**
 * Regression tests for the published browser-only multilingual global search.
 * Checks real static index coverage, local navigation and deep links.
 */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const base = '/central-asia-autism-hub/';
const index = JSON.parse(await readFile('dist/search-index.json', 'utf8'));
assert.equal(index.version, 1, 'static search index version missing');
assert.ok(Array.isArray(index.entries), 'static search index entries missing');
const seen = new Set();
const indexed = new Set();

for (const entry of index.entries) {
  assert.ok(['ru', 'kk', 'en'].includes(entry.language), 'invalid search language');
  assert.ok(['parents', 'professionals', 'research', 'help-kazakhstan', 'learning'].includes(entry.section), 'unapproved search section');
  assert.ok(entry.translationKey && entry.title && entry.summary && entry.href, 'incomplete search entry');
  assert.ok(entry.href.startsWith(base + 'kz/' + entry.language + '/'), 'search points outside its language route');
  assert.ok(!entry.href.includes('..') && !/^https?:/i.test(entry.href), 'search has external result');
  const key = entry.language + '|' + entry.href;
  assert.ok(!seen.has(key), 'duplicate result: ' + key);
  seen.add(key);
  indexed.add(entry.href);
  assert.ok(entry.searchText.length > 12, 'indexed text is too short for ' + key);
  const [pathname, fragment] = entry.href.split('#');
  const pathnameParts = pathname.slice(base.length).replace(/\/$/, '').split('/');
  const output = path.join('dist', ...pathnameParts, 'index.html');
  const html = await readFile(output, 'utf8');
  if (entry.kind === 'course') {
    assert.ok(fragment?.startsWith('course-'), 'course deep link has no anchor');
    assert.ok(html.includes('id="' + fragment + '"'), 'course anchor absent from built catalogue: ' + entry.href);
  }
}

let published = 0;
for (const collection of ['pages', 'research', 'learning']) {
  for (const locale of ['ru', 'kk', 'en']) {
    const dir = path.join('src/content', collection, 'kz', locale);
    // Learning is stored by locale at src/content/learning/kz/{lang}.
    let files;
    try { files = await readdir(dir); } catch { continue; }
    for (const file of files.filter((name) => /\.mdx?$/.test(name))) {
      const raw = await readFile(path.join(dir, file), 'utf8');
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
      if (!fm || !/^draft:\s*false$/m.test(fm) ||
        /^translationStatus:\s*pending$/m.test(fm)) continue;
      if (collection === 'learning' && !/^externalUrl:\s*/m.test(fm)) continue;
      published++;
      const field = (name) => {
        const raw = fm.split('\n').find((line) => line.startsWith(name + ': '))?.slice(name.length + 2).trim() ?? '';
        return (raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith("'") && raw.endsWith("'"))
          ? raw.slice(1, -1) : raw;
      };
      const section = field('section');
      const slug = field('slug');
      const href = base + 'kz/' + locale + '/' + section + '/' +
        (collection === 'learning' ? '' : slug + '/');
      assert.ok(index.entries.some((item) =>
        item.language === locale && item.section === section &&
        item.title === field('title')), 'published item not indexed: ' + collection + '/' + locale + '/' + file);
    }
  }
}

for (const locale of ['ru', 'kk', 'en']) {
  const search = await readFile('dist/kz/' + locale + '/search/index.html', 'utf8');
  const homepage = await readFile('dist/kz/' + locale + '/index.html', 'utf8');
  const searchHref = base + 'kz/' + locale + '/search/';
  assert.ok(homepage.includes('href="' + searchHref + '"'), 'global search link missing in home navigation: ' + locale);
  assert.ok(search.includes('data-site-search') && search.includes('data-locale="' + locale + '"'), 'localized search surface missing: ' + locale);
  assert.ok(search.includes('data-search-query') && search.includes('data-search-section'), 'search inputs missing: ' + locale);
  assert.ok(search.includes('search-index.json'), 'static index URL absent: ' + locale);
  assert.ok(/<script\\b[^>]*src="[^"]+\\.js"/.test(search),
    'search JavaScript bundle not linked: ' + locale);
  assert.ok(!search.includes('action="https://'), 'search must not forward queries to external services');
  if (locale !== 'ru') assert.ok(search.includes('data-search-ru'), 'Russian translation fallback missing: ' + locale);
}

assert.ok(index.entries.some((item) => item.kind === 'course'), 'free learning catalogue not indexed');
assert.ok(index.entries.some((item) => item.section === 'research'), 'published research not indexed');
assert.ok(index.entries.some((item) => item.section === 'professionals'), 'specialist materials not indexed');
assert.ok(index.entries.some((item) => item.section === 'help-kazakhstan'), 'Kazakhstan family guidance not indexed');
assert.ok(index.entries.some((item) => item.title.includes('Словарь терминов')), 'Russian glossary omitted');
assert.ok(index.entries.length >= published + 1, 'search index has fewer records than published sources');
console.log('Global search QA PASS: ' + index.entries.length + ' local results (' + published + ' published Markdown sources plus glossary), RU/KK/EN pages, stable course anchors and shared navigation.');
