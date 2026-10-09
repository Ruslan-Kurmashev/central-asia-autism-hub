import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');

async function inspectPage(relative, expectedBodyClass, requiredText) {
  const html = await readFile(path.join(dist, relative, 'index.html'), 'utf8');
  assert.match(
    html,
    new RegExp(`<body\\s+class=["'][^"']*\\b${expectedBodyClass}\\b`),
    `Missing ${expectedBodyClass} body class on ${relative}`,
  );
  for (const text of requiredText) {
    assert.ok(html.includes(text), `Expected ${JSON.stringify(text)} on ${relative}`);
  }
  return html;
}

const enHome = await inspectPage('kz/en', 'home-v2', [
  'home-v2__hero',
  'home-v2__masonry',
  'Featured now',
  'All resources',
  'Our information sources',
]);
const ruHome = await inspectPage('kz/ru', 'home-v2', [
  'home-v2__hero',
  'home-v2__masonry',
]);
const enParents = await inspectPage('kz/en/parents', 'section-v2', [
  'Child development',
  'section-v2__accordion',
  'Section topics',
]);
const enArticle = await inspectPage(
  'kz/en/parents/child-development-milestones',
  'article-v2',
  ['On this page', 'Key points', 'Sources', 'article-v2__layout'],
);

assert.ok(enHome.includes('/central-asia-autism-hub/kz/en/parents/'));
assert.ok(ruHome.includes('/central-asia-autism-hub/kz/ru/parents/'));
assert.ok(enParents.includes('child-development-milestones'));
assert.ok(enArticle.includes('Developmental milestones'));

for (const [label, html] of [
  ['English homepage', enHome],
  ['English parents section', enParents],
  ['English article', enArticle],
]) {
  for (const russianPhrase of ['Навигация по разделу', 'Следующий материал по теме', 'Все материалы', 'На что мы опираемся', 'Содержание статьи']) {
    assert.ok(!html.includes(russianPhrase), `${label} contains untranslated interface text: ${russianPhrase}`);
  }
}
console.log('English design parity passed: home, parent section, article, locale routes and copy.');
