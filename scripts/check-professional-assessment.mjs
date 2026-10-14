/** Regression contract for the Assessment & Diagnosis practice library. */
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const base='/central-asia-autism-hub';
const stages=['early-identification','instruments','comprehensive-assessment','differential-assessment','reporting-followup'];
const stagesRu=[
  'Раннее выявление и маршрут ребёнка',
  'Диагностические инструменты',
  'Комплексная диагностическая оценка',
  'Дифференциальная диагностика и сопутствующие состояния',
  'Заключение и дальнейшее наблюдение',
];
const downloads=[
  'early-detection-pathway-ru.pdf',
  'diagnostic-instrument-comparison-ru.pdf',
  'diagnostic-instrument-comparison-ru.csv',
  'diagnostic-instrument-comparison-ru.xlsx',
  'developmental-history-template-ru.docx',
  'developmental-history-template-ru.pdf',
];
const copy = {ru:['Оценка и диагностика',12,3],kk:['Бағалау және диагностика',12,0],en:['Assessment and diagnosis',12,0]};
for (const [locale,[title,count,ready]] of Object.entries(copy)) {
  const html=await readFile(path.resolve('dist/kz',locale,'professionals/assessment/index.html'),'utf8');
  assert.ok(html.includes(title),locale+': landing title missing');
  assert.equal((html.match(/class="assessment-hub__group"/g)||[]).length,5,locale+': five stages are required');
  assert.equal((html.match(/class="assessment-hub__article"/g)||[]).length,count,locale+': twelve article cards are required');
  assert.equal((html.match(/assessment-hub__download--ready/g)||[]).length,ready,locale+': downloaded resources must match genuine translations');
  assert.equal((html.match(/class="assessment-hub__download(?: |")/g)||[]).length,10,locale+': ten unique planned/downloadable records required');
  for(const stage of stages) {
    const href=base+'/kz/'+locale+'/professionals/assessment/'+stage+'/';
    assert.ok(html.includes('href="'+href+'"'),locale+': stage link missing '+stage);
    const inner=await readFile(path.resolve('dist/kz',locale,'professionals/assessment',stage,'index.html'),'utf8');
    assert.ok(inner.includes('assessment-hub__download'),locale+': stage download area missing '+stage);
    assert.ok(inner.includes('assessment-hub__article'),locale+': stage article list missing '+stage);
    assert.equal((inner.match(/class="assessment-hub__group"/g)||[]).length,0,locale+': stage pages should not repeat entire landing grid');
  }
  const a01Href=base+'/kz/ru/professionals/rannee-vyyavlenie-autizma-marshrut-specialista/';
  const earlyHub=await readFile(path.resolve('dist/kz',locale,'professionals/assessment/early-identification/index.html'),'utf8');
  if(locale==='ru') {
    assert.ok(earlyHub.includes('href="'+a01Href+'"'), 'RU first assessment article must be published and linked');
    const articleHtml=await readFile(path.resolve('dist/kz/ru/professionals/rannee-vyyavlenie-autizma-marshrut-specialista/index.html'),'utf8');
    for(const part of ['professional-early-referral-family-consultation.jpg','article-v2__sources','download', 'Действия в пяти типовых ситуациях', 'Казахстан']) {
      assert.ok(articleHtml.includes(part), 'A01 must include source-backed practical content: '+part);
    }
  } else {
    assert.ok(!earlyHub.includes('href="'+a01Href+'"'), locale+': Russian A01 cannot stand in for unpublished translation');
  }
  if(locale==='ru'){
    for(const file of downloads) assert.ok(html.includes(base+'/downloads/assessment/'+file),'RU: download link absent '+file);
    for(const group of stagesRu) assert.ok(html.includes(group),'RU: localized stage name missing '+group);
  } else {
    for(const file of downloads)assert.ok(!html.includes('href="'+base+'/downloads/assessment/'+file+'"'),locale+': untranslated RU file should not silently publish');
  }
}
for(const file of downloads){
  const asset=path.resolve('dist/downloads/assessment',file);
  const buf=await readFile(asset);
  assert.ok(buf.length>1500,'Invalid small binary/CSV '+file);
  if(file.endsWith('.pdf'))assert.equal(buf.subarray(0,4).toString('ascii'),'%PDF','Invalid PDF '+file);
  if(file.endsWith('.docx'))assert.equal(buf.subarray(0,2).toString('ascii'),'PK','Invalid DOCX package '+file);
  if(file.endsWith('.xlsx'))assert.equal(buf.subarray(0,2).toString('ascii'),'PK','Invalid XLSX package '+file);
  if(file.endsWith('.csv')) {
    const txt=buf.toString('utf8');
    assert.ok(txt.includes('M-CHAT-R/F')&&txt.includes('ADOS-2')&&txt.includes('ADI-R'),'CSV: professional instrument comparison incomplete');
  }
}
const source=await readFile(path.resolve('src/data/professional-assessment.ts'),'utf8');
const hubComponent=await readFile(path.resolve('src/components/ProfessionalAssessmentHub.astro'),'utf8');
assert.ok(hubComponent.includes('https://www.mchatscreen.com/mchat-rf/'), 'Do not reproduce copyrighted tests; link to M-CHAT official source');
assert.ok(!source.includes('scoreItems') && !source.includes('testQuestions'),'Do not bundle copyrighted test questions/scoring');
const generator=await readFile(path.resolve('scripts/build-professional-assessment-downloads.py'),'utf8');
assert.ok(generator.includes('NICE CG128') && generator.includes('Не валидированная шкала'), 'Source attribution or clinical limitations missing');
console.log('Assessment toolkit PASS: 5 localized stage routes each, 12 planned articles, 10 catalogue items, 3 downloadable Russian sets, 6 verified files.');
