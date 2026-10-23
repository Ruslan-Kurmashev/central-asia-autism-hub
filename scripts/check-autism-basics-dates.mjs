/**
 * Ensure every translated "Understanding autism: the basics" article shows
 * the first publication date of its Russian original, never the date on which
 * the translation was uploaded. The translation's real publishedAt stays intact.
 * Run after astro build to inspect what visitors actually see.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const locales = ['ru', 'en', 'kk'];
const root = path.resolve('src/content/pages/kz');
const dist = path.resolve('dist/kz');
const values = new Map();
const errors = [];
const field = (source, key) => {
  const block = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const value = block.split(/\r?\n/).find(line => line.startsWith(key + ':'))?.slice(key.length + 1).trim();
  return value?.replace(/^["']|["']$/g, '') ?? '';
};

for (const locale of locales) {
  const dir = path.join(root, locale);
  for (const name of await readdir(dir)) {
    if (!/\.mdx?$/.test(name)) continue;
    const text = await readFile(path.join(dir, name), 'utf8');
    if (field(text, 'topic') !== 'autism-basics' ||
        field(text, 'section') !== 'parents' ||
        field(text, 'draft') !== 'false') continue;
    const key = field(text, 'translationKey');
    if (!key || values.has(locale + '/' + key)) {
      errors.push('Missing or duplicate translation key: ' + locale + '/' + name);
      continue;
    }
    values.set(locale + '/' + key, {
      file: name,
      slug: field(text, 'slug'),
      publication: field(text, 'publishedAt'),
      original: field(text, 'originalPublishedAt'),
    });
  }
}

const sources = [...values.entries()].filter(([key]) => key.startsWith('ru/'));
assert.ok(sources.length >= 10, 'Expected at least ten Russian autism-basics articles');

let checked = 0;
for (const [sourceKey, source] of sources) {
  const key = sourceKey.slice(3);
  const first = source.publication;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(first)) {
    errors.push(sourceKey + ': missing original date in YYYY-MM-DD format');
    continue;
  }
  for (const locale of locales) {
    const article = values.get(locale + '/' + key);
    if (!article) continue; // Additional language versions may be published later.
    if (locale !== 'ru' && article.original !== first) {
      errors.push(locale + '/' + article.file + ': originalPublishedAt ' +
        (article.original || '(missing)') + ' does not match Russian ' + first);
    }
    const htmlFile = path.join(dist, locale, 'parents', article.slug, 'index.html');
    let html;
    try { html = await readFile(htmlFile, 'utf8'); }
    catch { errors.push('Built article missing: ' + htmlFile); continue; }
    const actual = html.match(/class="article-v2__meta"[\s\S]*?<time datetime="([^"]+)"/)?.[1];
    if (!actual || actual.slice(0, 10) !== first) {
      errors.push(locale + '/' + article.slug + ': page date ' +
        (actual || '(missing)') + ', expected Russian ' + first);
    }
    checked++;
  }
}
for (const [key, item] of values) {
  if (key.startsWith('ru/')) continue;
  if (!values.has('ru/' + key.slice(3))) {
    errors.push(key + ': translation has no Russian original');
  }
}
if (errors.length) {
  console.error('Autism basics source-date audit FAILED:\n - ' + errors.join('\n - '));
  process.exitCode = 1;
} else {
  console.log('Autism basics dates PASS: ' + sources.length +
    ' Russian originals, ' + checked + ' published pages across ru/en/kk.');
}
