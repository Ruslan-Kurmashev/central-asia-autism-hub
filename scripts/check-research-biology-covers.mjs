import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const list=JSON.parse(await readFile('scripts/research-biology-cover-sources.json','utf8'));
assert.equal(list.length,12,'Expected 12 research biology article covers');
assert.equal(new Set(list.map(x=>x.filename)).size,12,'Image filenames must be unique');
const topic=await readFile('dist/kz/ru/research/topics/causes-and-biology/index.html','utf8');
for (const item of list) {
  const raw=await readFile('src/content/pages/kz/ru/'+item.article+'.md','utf8');
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]??'';
  const url='/central-asia-autism-hub/images/research/verified/'+item.filename;
  assert.ok(front.includes('featuredImage: "'+url+'"'),item.article+': wrong cover');
  assert.ok(front.includes(item.alt),item.article+': missing meaningful alternative text');
  assert.ok(front.includes('topic: causes-and-biology'),item.article+': changed topic');
  assert.ok(front.includes('publishedAt: 2026-10-15')||front.includes('publishedAt: 2026-10-16'),item.article+': original date changed');
  assert.ok(raw.includes(item.sourceUrl) && raw.includes(item.licenseUrl),item.article+': missing licensing credit');
  assert.ok(topic.includes(url),item.article+': image missing from list');
  const {size}=await stat(path.join('public/images/research/verified',item.filename));
  assert.ok(size>900,item.article+': missing downloaded image');
  const slug=front.match(/^slug:\s*(.*?)$/m)?.[1]?.trim();
  assert.ok(slug,item.article+': missing slug');
  const hero=await readFile('dist/kz/ru/research/'+slug+'/index.html','utf8');
  assert.ok(hero.includes(url),item.article+': image missing from article');
}
console.log('Research biology covers PASS: all 12 original source images and hero/list placements, dates and credits.');
