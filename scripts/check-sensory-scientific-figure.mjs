import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const pairs=[
  ['ru','research','pochemu-zvuki-svet-i-prikosnoveniya-vosprinimayutsya-inache','autism-sensory-sound-light-touch','Клиническое проявление'],
  ['kk','parents','autizm-kezindegi-sensorlyk-erekshelikter','autizm-kezindegi-sensorlyk-erekshelikter','Клиникалық көрініс'],
  ['en','parents','sensory-differences-in-autism','sensory-differences-in-autism','Clinical symptom'],
];
const root='/central-asia-autism-hub/images/research/verified/';
const prefix='schauder-bennetto-2016-figure-1-';
const old='schauder-bennetto-2016-sensory-processing-figure-1.webp';
const docs=await readFile('docs/editorial-image-sources.md','utf8');
for(const item of ['10.3389/fnins.2016.00268','creativecommons.org/licenses/by/4.0/','Modification disclosed'])
  assert.ok(docs.includes(item),'Missing attribution '+item);
for(const [lang,section,slug,file,label] of pairs){
  const raw=await readFile('src/content/pages/kz/'+lang+'/'+file+'.md','utf8');
  const html=await readFile(path.join('dist/kz',lang,section,slug,'index.html'),'utf8');
  assert.ok(raw.includes('<picture>') && html.includes('<picture>'),'Missing picture element '+lang);
  assert.ok(!raw.includes(old) && raw.includes('10.3389/fnins.2016.00268'),'Wrong image source '+lang);
  for(const mode of ['desktop','mobile']){
    const name=prefix+lang+'-'+mode+'.svg';
    const img=root+name;
    assert.ok(raw.includes(img)&&html.includes(img),'Missing image '+name);
    const fp=path.join('public/images/research/verified',name);
    assert.ok((await stat(fp)).size>4400,'Incomplete image '+name);
    const svg=await readFile(fp,'utf8');
    assert.ok(svg.includes('<title')&&svg.includes('<desc')&&svg.includes('lang="'+lang+'"'),'SVG metadata missing '+name);
    assert.ok(svg.includes(label),'Source level missing '+name);
    assert.ok(!/<script\b|<foreignObject\b|javascript:|onload\s*=/.test(svg),'Unsafe SVG '+name);
    if(mode==='mobile')assert.equal((svg.match(/<rect x="18" y="/g)||[]).length,6,'Wrong number of level cards '+name);
    assert.ok(docs.includes(name),'Source registry missing '+name);
  }
  assert.ok(html.includes('650px'),'Mobile image source not rendered '+lang);
  assert.ok(html.includes('CC BY 4.0'),'No visible license credit '+lang);
}
console.log('SENSORY_FIGURE_OK: six scientific Figure 1 adaptations in RU/KK/EN, complete metadata and responsive routes.');
