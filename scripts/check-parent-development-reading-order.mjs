/** Verify the rendered parent development reading order for RU, KK and EN. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { PARENT_DEVELOPMENT_READING_ORDER as order } from '../src/data/parent-development-reading-order.mjs';

const locales = ['ru', 'kk', 'en'];
const base = '/central-asia-autism-hub';
const topics = new Set(['child-development', 'development-concerns']);
assert.equal(order.length, 12, 'Expected 12 child development articles');
assert.equal(new Set(order).size, 12, 'Duplicate translationKey in development reading order');

function meta(frontmatter, name) {
  const value = frontmatter.match(new RegExp('^' + name + ':\\s*(.*)$', 'm'))?.[1]?.trim() ?? '';
  return value.replace(/^["']|["']$/g, '');
}

for (const locale of locales) {
  const root = path.resolve('src/content/pages/kz', locale);
  const found = new Map();
  for (const file of await readdir(root)) {
    if (!/\.mdx?$/.test(file)) continue;
    const content = await readFile(path.join(root, file), 'utf8');
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatter, locale + '/' + file + ': missing frontmatter');
    const fm = frontmatter[1];
    if (meta(fm, 'section') !== 'parents'
      || !topics.has(meta(fm, 'topic'))
      || meta(fm, 'draft') !== 'false'
      || meta(fm, 'translationStatus') === 'pending') continue;
    const key = meta(fm, 'translationKey');
    assert.ok(!found.has(key), locale + ': duplicate published translationKey ' + key);
    found.set(key, meta(fm, 'slug'));
  }
  assert.deepEqual([...found.keys()].sort(), [...order].sort(),
    locale + ': published development articles do not match the 12 approved keys');

  const listing = path.resolve('dist/kz', locale, 'parents/index.html');
  const html = await readFile(listing, 'utf8');
  const listAnchors = [...html.matchAll(/class="section-v2__article-list"/g)].map(item => item.index);
  assert.ok(listAnchors.length >= 2, locale + ': expected autism basics and child development lists');
  const start = listAnchors[1];
  const end = html.indexOf('</div>', start);
  assert.ok(end > start, locale + ': development list end not found');
  const markup = html.slice(start, end);
  const visibleUrls = [...markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)].map(item => item[1]);
  const expectedUrls = order.map(key => base + '/kz/' + locale + '/parents/' + found.get(key) + '/');
  assert.deepEqual(visibleUrls, expectedUrls,
    locale + ': cards must follow development priority rather than publishedAt / updatedAt');
  const numbers = [...markup.matchAll(/class="section-v2__article-index"[^>]*>\s*(\d+)\s*<\/span>/g)]
    .map(item => Number(item[1]));
  assert.deepEqual(numbers, Array.from({ length: 12 }, (_, index) => index + 1),
    locale + ': displayed development indices must be 01 through 12');
  console.log('Parent child-development reading order PASS:', locale, '12 cards, dates independent');
}
