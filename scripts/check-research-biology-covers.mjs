import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const list=JSON.parse(await readFile('scripts/research-biology-cover-sources.json','utf8'));
assert.equal(list.length,13,'Expected 12 research biology article covers');
assert.equal(new Set(list.map(x=>x.filename)).size,13,'Image filenames must be unique');
const approvedNeuronCover = {
  article: 'neurons-synapses-how-brain-cells-connect',
  url: '/central-asia-autism-hub/images/research/neuron-synapse-signal-v3-approved.avif',
  alt: 'Утверждённая образовательная схема четырёх этапов передачи сигнала между нейронами: дендриты, аксон, химический синапс и следующая клетка.',
};
const provenance = await readFile('docs/editorial-image-sources.md', 'utf8');
assert.ok(
  provenance.includes('public/images/research/neuron-synapse-signal-v3-approved.avif'),
  'Approved neuron cover: source and editorial limits must be registered',
);
const topic=await readFile('dist/kz/ru/research/topics/causes-and-biology/index.html','utf8');
for (const item of list) {
  const raw=await readFile('src/content/pages/kz/ru/'+item.article+'.md','utf8');
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]??'';
  const isApprovedNeuronCover = item.article === approvedNeuronCover.article;
  const url = isApprovedNeuronCover
    ? approvedNeuronCover.url
    : '/central-asia-autism-hub/images/research/verified/'+item.filename;
  const alt = isApprovedNeuronCover ? approvedNeuronCover.alt : item.alt;
  assert.ok(front.includes('featuredImage: "'+url+'"'),item.article+': wrong cover');
  assert.ok(front.includes(alt),item.article+': missing meaningful alternative text');
  assert.ok(front.includes('topic: causes-and-biology'),item.article+': changed topic');
  assert.ok(front.includes('publishedAt: 2026-10-15')||front.includes('publishedAt: 2026-10-16')||(item.article==='neuroplasticity-how-brain-learns'&&front.includes('publishedAt: 2026-11-16')),item.article+': original date changed');
  if (!isApprovedNeuronCover) {
    assert.ok(raw.includes(item.sourceUrl) && raw.includes(item.licenseUrl),item.article+': missing licensing credit');
  } else {
    assert.ok(raw.includes('Источник иллюстрации: оригинальная образовательная схема AutismHub'),item.article+': missing approved-image credit');
  }
  assert.ok(topic.includes(url),item.article+': image missing from list');
  const localFile = isApprovedNeuronCover
    ? 'public/images/research/neuron-synapse-signal-v3-approved.avif'
    : path.join('public/images/research/verified',item.filename);
  const {size}=await stat(localFile);
  assert.ok(size>900,item.article+': missing cover image');
  const slug=front.match(/^slug:\s*(.*?)$/m)?.[1]?.trim();
  assert.ok(slug,item.article+': missing slug');
  const hero=await readFile('dist/kz/ru/research/'+slug+'/index.html','utf8');
  assert.ok(hero.includes(url),item.article+': image missing from article');
}
console.log('Research biology covers PASS: 12 source images, 1 owner-approved cover, hero/list placements, dates and provenance.');
