import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const file='dist/kz/ru/parents/pochemu-rebenok-vedet-sebya-po-raznomu-doma-i-v-sadike/index.html';
const html=readFileSync(file,'utf8');
const toc=html.match(/<aside class="article-v2__sidebar"[\s\S]*?<nav aria-label="Содержание">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(toc,'Context article navigation not rendered');
const list=[...toc.matchAll(/<li\b/g)];
assert.equal(list.length,14,'Context article must list exactly fourteen main sections');
assert.ok(html.includes('parent-context-home-preschool-pexels-7780915.jpg'),'Missing stock photo in article hero');
assert.ok(html.includes('context-home-preschool-article-body'),'Missing table layout class');
assert.equal((html.match(/class="context-observation-card"/g) || []).length,3,
  'Context article must contain three separately captioned illustrations');
for(const name of ['house','school','messages-square','hand-heart','users-round','badge-check']) {
  assert.ok(html.includes('context-lucide-'+name+'.svg'),'Missing licensed vector illustration: '+name);
}
assert.ok(!html.includes('parent-home-preschool-context-observation.svg'),
  'Old diagram with overlapping labels must be removed');
const text=readFileSync('src/content/pages/kz/ru/child-different-behaviour-home-kindergarten.md','utf8');
assert.match(text,/publishedAt: "2026-10-16T17:18:39\.618Z"/);
console.log('Context article QA: fourteen TOC links, original date, photo and diagram preserved.');
