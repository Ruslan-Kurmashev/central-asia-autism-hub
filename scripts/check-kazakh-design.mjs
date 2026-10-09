import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const base = '/central-asia-autism-hub/kz/kk/';

async function inspectPage(relative, bodyClass, requiredText) {
  const html = await readFile(path.join(dist, relative, 'index.html'), 'utf8');
  assert.match(
    html,
    new RegExp(`<body\\s+class=["'][^"']*\\b${bodyClass}\\b`),
    `Missing ${bodyClass} on ${relative}`,
  );
  for (const text of requiredText) {
    assert.ok(html.includes(text), `Expected ${JSON.stringify(text)} on ${relative}`);
  }
  assert.ok(!html.includes('href="/kz/'), `Unprefixed links on ${relative}`);
  return html;
}

const home = await inspectPage('kz/kk', 'home-v2', [
  'home-v2__hero',
  'home-v2__masonry',
  'Назарда',
  'Барлық материалдар',
  'Біз сүйенетін дереккөздер',
]);
const parents = await inspectPage('kz/kk/parents', 'section-v2', [
  'Баланың дамуы',
  'section-v2__accordion',
  'Материалдар мен тақырыптар',
  'Бөлім құрылымы',
]);
const article = await inspectPage(
  'kz/kk/parents/balanyn-damu-bagdarlary',
  'article-v2',
  ['Мақала мазмұны', 'Негізгі ойлар', 'Дереккөздер', 'article-v2__layout'],
);

assert.ok(home.includes(`${base}parents/`));
assert.ok(parents.includes('balanyn-damu-bagdarlary'));
assert.match(
  parents,
  /<details[^>]*class="section-v2__group"[^>]*open[^>]*>[\s\S]*?Баланың дамуы/,
  'The first topic with published content should be open',
);
assert.ok(article.includes('Баланың 2 айдан 5 жасқа дейінгі дамуы'));
assert.match(article, /lang="kk"/);
for (const [label, html] of [
  ['Kazakh homepage', home],
  ['Kazakh parents section', parents],
  ['Kazakh article', article],
]) {
  for (const untranslated of [
    'Навигация по разделу',
    'Следующий материал по теме',
    'Все материалы',
    'На что мы опираемся',
    'Разделы статьи появятся здесь автоматически.',
    'Featured now',
    'Resources and topics',
    'On this page',
  ]) {
    assert.ok(!html.includes(untranslated), `${label} has untranslated UI: ${untranslated}`);
  }
}

console.log('Kazakh design parity passed: homepage, section, article, links and localised UI.');
