
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
  ['autism-school-kazakhstan', 'autism-school-kazakhstan'],
  ['social-support-rights-kazakhstan', 'social-support-rights-kazakhstan'],
  ['check-service-before-payment-kazakhstan', 'check-service-before-payment-kazakhstan'],
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

const publicSlugs = new Map([
  ['autism-support-kazakhstan-start', 'autism-support-kazakhstan-start'],
  ['development-concerns-kazakhstan', 'child-development-concerns-kazakhstan'],
  ['verify-specialist-center-kazakhstan', 'check-autism-specialist-kazakhstan'],
  ['check-medical-license-kazakhstan', 'verify-medical-licence-kazakhstan'],
  ['autism-kindergarten-kazakhstan', 'autism-kindergarten-support-kazakhstan'],
  ['autism-school-kazakhstan', 'autism-school-enrolment-support-kazakhstan'],
  ['social-support-rights-kazakhstan', 'family-rights-social-support-kazakhstan'],
  ['check-service-before-payment-kazakhstan', 'check-autism-service-before-payment-kazakhstan'],
]);
const slugs = new Set(publicSlugs.values());

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
  assert.equal(property(translated.front, 'slug'), publicSlugs.get(enId));
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
  if (property(translated.front, 'draft') === 'false') {
    const enSlug = publicSlugs.get(enId);
    const outputFile = path.resolve('dist', 'kz', 'en', 'help-kazakhstan', enSlug, 'index.html');
    const builtPage = await readFile(outputFile, 'utf8');
    assert.ok(builtPage.includes('article-v2__layout'),
      `${enId}: expected same editorial article design as Russian pages`);
    assert.ok(builtPage.includes(property(translated.front, 'featuredImage')),
      `${enId}: published page must use the matching source photograph`);
    assert.ok(builtPage.includes('/central-asia-autism-hub/kz/en/help-kazakhstan/'),
      `${enId}: output should have English help section navigation`);
  }


  const links = [...translated.body.matchAll(/\]\((\/central-asia-autism-hub\/kz\/en\/help-kazakhstan\/([^/]+)\/)\)/g)];
  for (const [, , targetSlug] of links) {
    assert.ok(slugs.has(targetSlug), `${enId}: English internal link has no matching translation: ${targetSlug}`);
  }
  console.log(`${ruId} -> ${enId}: source URLs, structure, images, keys and article links verified`);
}

console.log('All eight English Kazakhstan help translations passed structural parity checks.');
