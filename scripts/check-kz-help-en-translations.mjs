
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/pages/kz');
const pairs = [
  ['help-kazakhstan-start', 'autism-support-kazakhstan-start'],
  ['development-concerns-kazakhstan', 'development-concerns-kazakhstan'],
  ['verify-specialist-center-kazakhstan', 'verify-specialist-center-kazakhstan'],
  ['check-medical-license-kazakhstan', 'check-medical-license-kazakhstan'],
  ['autism-kindergarten-kazakhstan', 'autism-kindergarten-kazakhstan'],
];

const extract = (text) => {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  assert.ok(match, 'Missing YAML frontmatter delimiters');
  return { front: match[1], body: match[2] };
};
const property = (front, name) => {
  const match = front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  assert.ok(match, `Missing frontmatter field: ${name}`);
  return match[1].trim().replace(/^"|"$/g, '');
};
const urls = (front) => [...front.matchAll(/^\s+url:\s*"([^"]+)"/gm)].map((m) => m[1]);
const headings = (body) => [...body.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1]);
const keyPoints = (front) =>
  [...(front.match(/^keyPoints:\n((?:  - .+\n)+)/m)?.[1] ?? '').matchAll(/^  - /gm)].length;

const slugs = new Set(pairs.map(([, en]) => en));

for (const [ruId, enId] of pairs) {
  const [ru, en] = await Promise.all([
    readFile(path.join(root, 'ru', `${ruId}.md`), 'utf8'),
    readFile(path.join(root, 'en', `${enId === 'autism-support-kazakhstan-start' ? enId : `en-${enId}`}.md`), 'utf8'),
  ]);
  const source = extract(ru);
  const translated = extract(en);

  for (const prop of ['section', 'topic', 'translationKey', 'featuredImage', 'author', 'editor']) {
    assert.equal(property(source.front, prop), property(translated.front, prop),
      `${ruId}: the EN ${prop} does not match the Russian source`);
  }
  assert.equal(property(translated.front, 'language'), 'en');
  assert.equal(property(translated.front, 'slug'), enId);
  assert.ok(['pending', 'checked'].includes(property(translated.front, 'translationStatus')));
  assert.ok(['true', 'false'].includes(property(translated.front, 'draft')));
  assert.ok(
    !(property(translated.front, 'draft') === 'false' &&
      property(translated.front, 'translationStatus') !== 'checked'),
    `${enId}: publication requires an explicitly checked translation`,
  );

  assert.deepEqual(urls(translated.front), urls(source.front),
    `${enId}: original legal and clinical source URLs changed`);
  assert.equal(headings(translated.body).length, headings(source.body).length,
    `${enId}: section/subsection count differs from source`);
  assert.equal(keyPoints(translated.front), keyPoints(source.front),
    `${enId}: key-point count differs from source`);
  assert.ok(translated.body.trim().length > source.body.trim().length * 0.70,
    `${enId}: translation appears severely abbreviated`);
  assert.ok(translated.front.includes('featuredImageAlt:'));
  assert.ok(!translated.body.includes(String.fromCharCode(0x2014)), `${enId}: disallowed em dash`);

  const links = [...translated.body.matchAll(/\]\((\/central-asia-autism-hub\/kz\/en\/help-kazakhstan\/([^/]+)\/)\)/g)];
  for (const [, , targetSlug] of links) {
    assert.ok(slugs.has(targetSlug), `${enId}: English internal link has no matching translation: ${targetSlug}`);
  }
  console.log(`${ruId} -> ${enId}: source URLs, structure, images, keys and article links verified`);
}

console.log('All five English Kazakhstan help translations passed structural parity checks.');
