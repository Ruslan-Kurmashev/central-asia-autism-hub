/** Five published RU professional practice guides, links and downloadable form regression. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const prefix = '/central-asia-autism-hub';
const cases = [
 ['g03','professional-tools-family-referral.md','mezhdisciplinarnaya-marshrutizaciya-semi','family-referral-pathway','professional-tools-family-pathway.svg'],
 ['t01','professional-tools-individual-support-plan.md','individualnyj-plan-podderzhki-celi-monitoring','individual-support-plan','professional-tools-support-plan.svg'],
 ['t02','professional-tools-aac-feature-matching.md','ocenka-aac-vybor-kommunikacii-monitoring','aac-feature-matching','professional-tools-aac-selection.svg'],
 ['t03','professional-tools-structured-fba.md','strukturirovannoe-nablyudenie-fba-abc','fba-abc-observation','professional-tools-fba-observation.svg'],
 ['t04','professional-tools-environment-access.md','adaptacii-sredy-klass-priem-autizm','environment-access-audit','professional-tools-environment-access.svg']
];

const directory=await readFile('dist/kz/ru/professionals/index.html','utf8');
const panel=directory.split('id="professional-practice-tools"')[1]??'';
assert.ok(panel.length>700,'Missing practice tools section');
for(const [id,file,slug,filename,svg] of cases){
 const source=await readFile(path.resolve('src/content/pages/kz/ru',file),'utf8');
 for(const required of ['topic: practice-tools','translationKey: professionals-'+id,'draft: false','evidenceLimitations:','riskLevel: moderate','translationStatus: source'])
  assert.ok(source.includes(required),id+': missing publication metadata '+required);
 assert.ok((source.match(/^## /gm)??[]).length>=12,id+': insufficient practical/theoretical sections');
 assert.ok((source.match(/^  - title:/gm)??[]).length>=4,id+': sources missing');
 assert.ok(!source.includes('\u2014'),id+': forbidden typography');
 const url=prefix+'/kz/ru/professionals/'+slug+'/';
 assert.ok(panel.includes('href="'+url+'"'),id+': not linked from professional directory');
 const html=await readFile(path.resolve('dist/kz/ru/professionals',slug,'index.html'),'utf8');
 for(const required of [svg,'article-v2__sources','article-v2__layout'])
  assert.ok(html.includes(required),id+': rendered article missing '+required);
 for(const format of ['pdf','docx']){
  const download=prefix+'/downloads/practice/'+filename+'-ru.'+format;
  assert.ok(html.includes('href="'+download+'"'),id+': download link missing '+format);
  const bytes=await readFile(path.resolve('dist/downloads/practice',filename+'-ru.'+format));
  assert.ok(bytes.byteLength>2000,id+': empty '+format);
  assert.ok(format==='pdf'?bytes.subarray(0,4).toString()==='%PDF':bytes.subarray(0,2).toString()==='PK',id+': incorrect file signature '+format);
 }
 const vector=await readFile(path.resolve('public/images/editorial',svg),'utf8');
 assert.ok(vector.includes('<title')&&vector.includes('<desc')&&!vector.includes('<script'),id+': unsafe SVG');
}
for(const locale of ['kk','en']){
 const html=await readFile(path.resolve('dist/kz',locale,'professionals/index.html'),'utf8');
 for(const [, ,slug] of cases) assert.ok(!html.includes('/kz/ru/professionals/'+slug+'/'),locale+': Russian article used as untranslated content');
}
console.log('Professional practice QA PASS: 5 complete RU guides; 5 distinct covers; 10 usable PDF/DOCX downloads; directory and locale checks.');
