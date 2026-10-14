/** Regression for three published theoretical evidence guides and one original, non-scored form. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const prefix='/central-asia-autism-hub';
const articles=[
  ['e01','kak-ocenivat-issledovaniya-vmeshatelstv-autizm','professional-evidence-study-appraisal.svg','## 1. Что именно мы называем доказательностью'],
  ['e02','aac-ndbi-fct-fba-dokazatelstva-ocenka-rezultatov','professional-evidence-aac-ndbi-fct-fba.svg','## 1. Почему эти четыре понятия нельзя объединять'],
  ['e03','sensornye-kommercheskie-metody-autizm-kriticheskaya-ocenka','professional-evidence-claims-review.svg','## 1. Почему критическая оценка нужна'],
];
const directory=await readFile('dist/kz/ru/professionals/index.html','utf8');
const panel=directory.split('id="professional-evidence-support"')[1]?.split('id="professional-ethics"')[0] || '';
assert.ok(panel.length>500,'Evidence-support category panel not rendered');
for(const [id,slug,svg,firstHeading] of articles) {
  const file='src/content/pages/kz/ru/professional-evidence-'+(
      id==='e01'?'critical-appraisal':id==='e02'?'aac-ndbi-fct-fba':'sensory-commercial-claims')+'.md';
  const source=await readFile(file,'utf8');
  assert.ok(source.includes('translationKey: professionals-'+id),'Bad key '+id);
  assert.ok(source.includes('topic: evidence-support') && source.includes('draft: false'),'Published evidence guide metadata missing '+id);
  assert.ok(source.includes(firstHeading),'Thorough theory sections missing '+id);
  assert.ok((source.match(/^## /gm)||[]).length>=10,'Expected a multi-section theory article '+id);
  assert.ok((source.match(/^  - title:/gm)||[]).length>=4,'Traceable source list missing '+id);
  assert.ok(source.includes('evidenceLimitations:'),'Evidence limitations missing '+id);
  const html=await readFile(path.resolve('dist/kz/ru/professionals',slug,'index.html'),'utf8');
  assert.ok(html.includes(svg) && html.includes('article-v2__sources'),'Image or sources missing from '+id);
  assert.ok(html.includes('article-v2__layout'),'Rendered article layout missing '+id);
  assert.ok(panel.includes('href="'+prefix+'/kz/ru/professionals/'+slug+'/'),'Directory link missing '+id);
}
for(const locale of ['kk','en']){
  const html=await readFile(path.resolve('dist/kz',locale,'professionals/index.html'),'utf8');
  for(const [,slug] of articles) assert.ok(!html.includes('/kz/ru/professionals/'+slug+'/'),'Must not link RU article as '+locale+' translation');
}
const e3=await readFile('dist/kz/ru/professionals/sensornye-kommercheskie-metody-autizm-kriticheskaya-ocenka/index.html','utf8');
for(const ext of ['pdf','docx']){
 const url=prefix+'/downloads/evidence/critical-claims-appraisal-ru.'+ext;
 assert.ok(e3.includes('href="'+url+'"'),'E03 direct '+ext+' download missing');
 const b=await readFile('dist/downloads/evidence/critical-claims-appraisal-ru.'+ext);
 assert.ok(b.length>3000,'Form empty: '+ext);
 assert.ok(ext==='pdf'?b.subarray(0,4).toString()==='%PDF':b.subarray(0,2).toString()==='PK','Malformed file header '+ext);
}
console.log('Evidence-support editorial QA PASS: three RU theoretical articles, own distinct SVGs, real directory links, locale-safe status, original PDF/DOCX form.');
