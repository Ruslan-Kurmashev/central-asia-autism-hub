import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const pairs=[
  ['ru','research','pochemu-zvuki-svet-i-prikosnoveniya-vosprinimayutsya-inache','autism-sensory-sound-light-touch'],
  ['kk','parents','autizm-kezindegi-sensorlyk-erekshelikter','autizm-kezindegi-sensorlyk-erekshelikter'],
  ['en','parents','sensory-differences-in-autism','sensory-differences-in-autism'],
];
const name='schauder-bennetto-2016-sensory-processing-figure-1.webp';
const img='/central-asia-autism-hub/images/research/verified/'+name;
const {size}=await stat(path.resolve('public/images/research/verified',name));
assert.ok(size>14000,'Original scientific figure missing');
const bits=await readFile(path.resolve('public/images/research/verified',name));
assert.equal(bits.subarray(0,4).toString(),'RIFF');
assert.equal(bits.subarray(8,12).toString(),'WEBP');
const docs=await readFile('docs/editorial-image-sources.md','utf8');
for(const field of [name,'10.3389/fnins.2016.00268','creativecommons.org/licenses/by/4.0/'])assert.ok(docs.includes(field),'Missing image provenance '+field);
for(const [lang,section,slug,file] of pairs){
  const src=await readFile('src/content/pages/kz/'+lang+'/'+file+'.md','utf8');
  assert.ok(src.includes(img),'Scientific image not referenced '+lang);
  assert.ok(src.includes('2016, Figure 1')||src.includes('2016, original Figure 1'),'Missing figure attribution '+lang);
  assert.ok(src.includes('10.3389/fnins.2016.00268'),'Missing scientific source '+lang);
  const html=await readFile(path.join('dist/kz',lang,section,slug,'index.html'),'utf8');
  assert.ok(html.includes(img),'Missing rendered scientific figure '+lang);
}
console.log('SENSORY_SCIENTIFIC_FIGURE_OK: licensed Figure 1 rendered in RU research and KK/EN parents.');
