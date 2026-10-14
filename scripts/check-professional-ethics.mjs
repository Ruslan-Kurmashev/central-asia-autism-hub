/** Ethics and safety H01-H03 published Russian source and build regression. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const home='/central-asia-autism-hub/kz/ru/professionals/';
const rows=[
 {id:'h01',source:'professional-ethics-clinical-risks.md',slug:'klinicheskie-riski-granicy-kompetencii-autizm',svg:'professional-ethics-clinical-scope.svg',topics:['## 4. Клинические тревожные сигналы','## 7. Ограничительные','## 14. Правовой контекст'],sources:['adilet.zan.kz/rus/docs/K2000000360','nice.org.uk/guidance/ng11']},
 {id:'h02',source:'professional-ethics-rights-autonomy.md',slug:'etika-podderzhki-prava-autichnogo-cheloveka',svg:'professional-ethics-rights-participation.svg',topics:['## 4. Конвенция','## 6. Согласие','## 13. Сложные'],sources:['Z1500000288','Z020000345_']},
 {id:'h03',source:'professional-ethics-privacy-digital-ai.md',slug:'konfidencialnost-dannye-cifrovye-instrumenty-autizm',svg:'professional-ethics-data-ai-privacy.svg',topics:['## 3. Правовые основы','## 8. Зарубежное облако','## 9. Генеративный ИИ'],sources:['Z1300000094','9789240084759']},
];
const directory=await readFile('dist/kz/ru/professionals/index.html','utf8');
const segment=directory.split('id="professional-ethics"')[1]?.split('id="professional-practice-tools"')[0]??'';
assert.ok(segment.length>400,'Ethics catalogue section not rendered');
for(const item of rows){
 const raw=await readFile(path.resolve('src/content/pages/kz/ru',item.source),'utf8');
 for(const meta of ['topic: ethics','translationKey: professionals-'+item.id,'draft: false','evidenceLimitations:','riskLevel: high','translationStatus: source'])assert.ok(raw.includes(meta),item.id+': invalid metadata '+meta);
 assert.ok(!raw.includes('\u2014'),item.id+': forbidden typography');
 assert.ok((raw.match(/^## /gm)??[]).length>=12,item.id+': insufficient theory sections');
 assert.ok((raw.match(/^  - title:/gm)??[]).length>=5,item.id+': missing sources');
 for(const part of [...item.topics,...item.sources])assert.ok(raw.includes(part),item.id+': missing core argument/source '+part);
 const article=await readFile(path.resolve('dist/kz/ru/professionals',item.slug,'index.html'),'utf8');
 for(const expected of [item.svg,'article-v2__layout','article-v2__sources'])assert.ok(article.includes(expected),item.id+': rendered content missing '+expected);
 assert.ok(segment.includes('href="'+home+item.slug+'/'),item.id+': link absent in Ethics category');
 const svg=await readFile(path.resolve('public/images/editorial',item.svg),'utf8');
 assert.ok(svg.includes('<title')&&svg.includes('<desc')&&!svg.includes('<script'),item.id+': invalid SVG');
}
for(const locale of ['kk','en']){
 const index=await readFile(path.resolve('dist/kz',locale,'professionals/index.html'),'utf8');
 for(const row of rows)assert.ok(!index.includes(home+row.slug+'/'),locale+': must not substitute untranslated RU ethics guide '+row.id);
}
console.log('Ethics and safety QA PASS: 3/3 RU published theoretical guides, traceable official sources, distinct documented SVG covers, live directory links, untranslated KK/EN entries.');
