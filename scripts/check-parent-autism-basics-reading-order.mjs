/** Assert all published autism-basics pages follow a shared parent-first sequence. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { PARENT_AUTISM_BASICS_READING_ORDER as order } from '../src/data/parent-autism-basics-reading-order.mjs';

const base = '/central-asia-autism-hub';
const locales = ['ru', 'kk', 'en'];
assert.equal(order.length, 10, 'The approved autism-basics order has ten articles');
assert.equal(new Set(order).size, order.length, 'Repeated translationKey in basics order');

function field(frontmatter, key) {
  return frontmatter.match(new RegExp('^' + key + ':\\s*(.*)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
}

for (const locale of locales) {
  const source = path.resolve('src/content/pages/kz', locale);
  const found = new Map();
  for (const name of await readdir(source)) {
    if (!/\\.mdx?$/.test(name)) continue;
    const content = await readFile(path.join(source, name), 'utf8');
    const match = content.match(/^---\\r?\\n([\\s\\S]*?)\\r?\\n---/);
    assert.ok(match, name + ': frontmatter not found');
    const fm = match[1];
    if (field(fm, 'section') !== 'parents' || field(fm, 'topic') !== 'autism-basics'
      || field(fm, 'draft') !== 'false' || field(fm, 'translationStatus') === 'pending') continue;
    const key = field(fm, 'translationKey');
    assert.ok(!found.has(key), locale + ': duplicate translationKey ' + key);
    found.set(key, field(fm, 'slug'));
  }
  assert.deepEqual([...found.keys()].sort(), [...order].sort(),
    locale + ': published autism-basics keys must match the curated sequence');

  const file = path.resolve('dist/kz', locale, 'parents/index.html');
  const html = await readFile(file, 'utf8');
  const anchor = html.indexOf('class="section-v2__article-list"');
  assert.ok(anchor >= 0, file + ': basics card list not found');
  const end = html.indexOf('</div>', anchor);
  assert.ok(end > anchor, file + ': basics card list has no closing div');
  const basics = html.slice(anchor, end);
  const shown = [...basics.matchAll(/<a\\b[^>]*\\bhref="([^"]+)"[^>]*>/g)].map(m => m[1]);
  const expected = order.map(key => base + '/kz/' + locale + '/parents/' + found.get(key) + '/');
  expected.splice(1, 0, base + '/kz/' + locale + '/parents/glossary/');
  assert.deepEqual(shown, expected,
    locale + ': rendered autism-basics order must follow translationKeys, with glossary after introduction');
  const displayedIndices = [...basics.matchAll(/class="section-v2__article-index"[^>]*>\\s*(\\d+)\\s*<\\/span>/g)]
    .map(m => Number(m[1]));
  assert.deepEqual(displayedIndices, Array.from({ length: 11 }, (_, i) => i + 1),
    locale + ': glossary and ten articles must be numbered sequentially');
  console.log('Autism basics ordered', locale, ':', order.length, 'articles plus glossary, independent of dates');
}
