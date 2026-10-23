import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const pathToArticle = path.resolve('dist/kz/ru/parents/kak-autichnye-deti-obshchayutsya/index.html');
const html = readFileSync(pathToArticle, 'utf8');
const start = html.indexOf('article-v2__body article-body');
assert.ok(start > 0, 'Article body not found in built HTML');
const slice = html.slice(start);
const labels = [
  'Жесты и движения.',
  'Изображения и символы.',
  'Письмо и набор текста.',
  'Альтернативная и дополнительная коммуникация (AAC).',
];
for (const label of labels) {
  const offset = slice.indexOf(label);
  assert.ok(offset >= 0, 'Missing label in static HTML: ' + label);
  const before = slice.slice(Math.max(0, offset - 160), offset);
  const after = slice.slice(offset + label.length, offset + label.length + 100);
  console.log('RENDERED_LABEL ' + JSON.stringify({ label, before, after }));
  assert.match(before, /<strong(?:\s[^>]*)?>\s*$/, label + ': rendered markup must contain a strong tag');
  assert.match(after, /^\s*<\/strong>/, label + ': strong closing tag missing');
}
console.log('Rendered article labels contain semantic strong markup.');
