/** Static regression contract for the slim assessment flow, group pages and downloads. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const base='/central-asia-autism-hub';
const stages=['early-identification','instruments','comprehensive-assessment','differential-assessment','reporting-followup'];
const ruNames=['Раннее выявление и маршрут ребёнка','Диагностические инструменты','Комплексная диагностическая оценка','Дифференциальная диагностика и сопутствующие состояния','Заключение и дальнейшее наблюдение'];
const counts=[2,3,3,2,2];
const files=['early-detection-pathway-ru.pdf','diagnostic-instrument-comparison-ru.pdf','diagnostic-instrument-comparison-ru.csv','diagnostic-instrument-comparison-ru.xlsx','developmental-history-template-ru.docx','developmental-history-template-ru.pdf','preassessment-checklist-ru.pdf','preassessment-checklist-ru.docx','structured-observation-ru.pdf','structured-observation-ru.docx','differential-assessment-map-ru.pdf','differential-assessment-map-ru.docx','cooccurring-conditions-checklist-ru.pdf','cooccurring-conditions-checklist-ru.docx','cooccurring-conditions-sleep-log-ru.csv','multidisciplinary-team-meeting-ru.pdf','multidisciplinary-team-meeting-ru.docx','diagnostic-report-outline-ru.pdf','diagnostic-report-outline-ru.docx','reassessment-action-plan-ru.pdf','reassessment-action-plan-ru.docx'];
const a01Href=base+'/kz/ru/professionals/rannee-vyyavlenie-autizma-marshrut-specialista/';

for(const locale of ['ru','kk','en']) {
  const baseRoute=base+'/kz/'+locale+'/professionals/assessment/';
  const h=await readFile(path.resolve('dist/kz',locale,'professionals/assessment/index.html'),'utf8');
  const tools=await readFile(path.resolve('dist/kz',locale,'professionals/assessment/tools/index.html'),'utf8');
  const expectedTitle={ru:'Оценка и диагностика',kk:'Бағалау және диагностика',en:'Assessment and diagnosis'}[locale];
  assert.ok(h.includes(expectedTitle),locale+': localized main section title');
  assert.equal((h.match(/class="assessment-flow__card"/g)||[]).length,5,locale+': exactly five full-card stage links');
  assert.equal((h.match(/class="assessment-flow__connector"/g)||[]).length,4,locale+': four arrows between five steps');
  assert.ok(h.includes('assessment-hub__intro')&&h.includes('assessment-hub__library-cta'),locale+': flow and dedicated library CTA missing');
  assert.ok(h.includes('href="'+baseRoute+'tools/"'),locale+': standalone tools page link missing');
  assert.ok(!h.includes('assessment-hub__stage-article')&&!h.includes('assessment-hub__tool '),locale+': main route must not duplicate article or downloads catalogue');
  for(let i=0;i<stages.length;i++) {
    const href=baseRoute+stages[i]+'/';
    assert.ok(h.includes('href="'+href+'"'),locale+': missing clickable stage '+stages[i]);
    const stage=await readFile(path.resolve('dist/kz',locale,'professionals/assessment',stages[i],'index.html'),'utf8');
    assert.ok(stage.includes('assessment-hub__stage-articles'),locale+': no article list at '+stages[i]);
    assert.equal((stage.match(/class="assessment-hub__stage-article"/g)||[]).length,counts[i],locale+': wrong scoped article count '+stages[i]);
    assert.ok(stage.includes('assessment-hub__stage-section')&&stage.includes('assessment-hub__stage-files')===(locale==='ru'),locale+': incorrect ready-file visibility '+stages[i]);
    assert.ok(stage.includes('href="'+baseRoute+'tools/"'),locale+': must offer library navigation within each stage');
    assert.ok(!stage.includes('assessment-flow__card'),locale+': group pages must not repeat entire main flow');
    if(i<4)assert.ok(stage.includes('href="'+baseRoute+stages[i+1]+'/'),locale+': next stage navigation missing');
    if(i===0) {
      if(locale==='ru')assert.ok(stage.includes('href="'+a01Href+'"'), 'RU A01 article not linked');
      else assert.ok(!stage.includes('href="'+a01Href+'"'),locale+': Russian article should not masquerade as translation');
    }
  }
  if(locale==='ru') assert.ok(tools.includes('data-assessment-category')&&tools.includes('data-assessment-search'), 'RU: tools filters missing');
  const expectedReady=locale==='ru'?10:0;
  assert.equal((tools.match(/class="assessment-hub__tool"/g)||[]).length,expectedReady,locale+': only actually released locale-specific resource sets should display');
  assert.ok(tools.includes('assessment-hub__planned-tools')===(locale!=='ru'),locale+': upcoming list should appear only for missing language resources');
  if(locale==='ru') {
    for(const file of files) {
      const url=base+'/downloads/assessment/'+file;
      assert.ok(tools.includes('href="'+url+'"'),'RU: available file must be linked in library '+file);
      assert.ok(!h.includes('href="'+url+'"'),'RU: download links must not clutter landing page');
    }
    for(const name of ruNames)assert.ok(h.includes(name),'RU: stage title missing '+name);
  } else {
    for(const file of files) assert.ok(!tools.includes('href="'+base+'/downloads/assessment/'+file+'"'),locale+': missing translation must not link to RU document');
    assert.ok(tools.includes('assessment-hub__no-translation'),locale+': clearly mark translated resources pending');
  }
}
const publishedGuides=[
  {key:'a02', group:'early-identification', slug:'skrining-autizma-vybor-rezultat-deystviya', cover:'professional-assessment-screening-decisions.svg', heading:'Девять шагов организации качественного скрининга'},
  {key:'a03', group:'instruments', slug:'vybor-instrumenta-ocenki-autizma-vozrast-yazyk-validnost', cover:'professional-assessment-tool-selection.svg', heading:'Матрица восьми критериев выбора'},
  {key:'a04', group:'instruments', slug:'m-chat-r-f-primenenie-follow-up-ogranicheniya', cover:'professional-assessment-mchat-workflow.svg', heading:'Второй этап Follow-Up'},
  {key:'a05', group:'instruments', slug:'ados-2-adi-r-cars-2-vozmozhnosti-ogranicheniya', cover:'professional-ados-adi-cars-clinical-observation.jpg', heading:'Матрица пригодности метода'},
  {key:'a06', group:'comprehensive-assessment', slug:'sbor-anamneza-razvitiya-intervyu-s-semjej', cover:'professional-assessment-developmental-history.svg', heading:'Алгоритм интервью из одиннадцати шагов'},
  {key:'a07', group:'comprehensive-assessment', slug:'strukturirovannoe-nablyudenie-autizm-raznye-situacii', cover:'professional-assessment-observation.svg', heading:'Шесть этапов наблюдения'},
  {key:'a08', group:'comprehensive-assessment', slug:'kompleksnaya-klinicheskaya-ocenka-autizma-etapy', cover:'professional-assessment-clinical-integration.svg', heading:'Семь основных компонентов'},
  {key:'a09', group:'differential-assessment', slug:'differencialnaya-diagnostika-autizma-drugie-sostoyaniya', cover:'professional-assessment-differential.svg', heading:'Шесть шагов клинического рассмотрения'},
  {key:'a10', group:'differential-assessment', slug:'soputstvuyushchie-sostoyaniya-pri-autizme-ocenka', cover:'professional-assessment-cooccurring.svg', heading:'Карта основных направлений оценки'},
  {key:'a11', group:'reporting-followup', slug:'diagnosticheskoe-zaklyuchenie-autizm-struktura-otcheta', cover:'professional-assessment-report.svg', heading:'Двенадцать разделов полноценного отчёта'},
  {key:'a12', group:'reporting-followup', slug:'diagnosticheskaya-neopredelennost-vtoroe-mnenie-povtornaya-ocenka', cover:'professional-assessment-reassessment.svg', heading:'Алгоритм решения: девять шагов'},
];
for(const guide of publishedGuides) {
  const url=base+'/kz/ru/professionals/'+guide.slug+'/';
  const list=await readFile(path.resolve('dist/kz/ru/professionals/assessment',guide.group,'index.html'),'utf8');
  assert.ok(list.includes('href="'+url+'"'),'RU: published guide not in group '+guide.key);
  const page=await readFile(path.resolve('dist/kz/ru/professionals',guide.slug,'index.html'),'utf8');
  for(const marker of [guide.cover,guide.heading,'article-v2__sources']) assert.ok(page.includes(marker),guide.key+': missing editorial component '+marker);
  const pendingLocales=['kk','en'];
  for(const locale of pendingLocales){
    const listing=await readFile(path.resolve('dist/kz',locale,'professionals/assessment',guide.group,'index.html'),'utf8');
    assert.ok(!listing.includes('href="'+url+'"'),locale+': cannot substitute RU guide for untranslated '+guide.key);
  }
}
const officialSources=[
 'https://www.who.int/publications/m/item/icf-checklist',
 'https://www.autismcrc.com.au/best-practice/sites/default/files/resources/Assessment_and_diagnosis_pathway_A3_Assessment_and_Diagnosis_Guideline.pdf',
 'https://www.cdc.gov/act-early/resources/',
 'https://www.mchatscreen.com/mchat-rf/'
];
for(const locale of ['ru','kk','en']){
 const html=await readFile(path.resolve('dist/kz',locale,'professionals/assessment/tools/index.html'),'utf8');
 assert.ok(html.includes('assessment-hub__external-resources'),locale+': official originals must be distinguished from AutismHub files');
 for(const uri of officialSources) assert.ok(html.includes('href="'+uri+'"'),locale+': original source missing '+uri);
}
const specs=JSON.parse(await readFile(path.resolve('scripts/assessment-practical-tool-specs.json'),'utf8'));
assert.equal(specs.length,6,'Six new original sets defined in canonical content file');
for(const spec of specs){
 assert.ok(spec.sections.length>=4,spec.id+': practical sections missing');
 assert.ok(spec.notes.length>=2,spec.id+': licence, clinical or local limits missing');
 assert.ok(spec.references.length>=2,spec.id+': original source links missing');
}
for(const filename of files) {
  const buf=await readFile(path.resolve('dist/downloads/assessment',filename));
  assert.ok(buf.length>1500,'Empty or invalid file '+filename);
  if(filename.endsWith('.pdf')) assert.equal(buf.subarray(0,4).toString('ascii'),'%PDF','PDF magic bytes '+filename);
  if(filename.endsWith('.docx')||filename.endsWith('.xlsx'))assert.equal(buf.subarray(0,2).toString('ascii'),'PK','OOXML package '+filename);
  if(filename.endsWith('.csv')) {
    const s=buf.toString('utf8');
    if(filename.includes('sleep-log')) {
      assert.ok(s.includes('Ночные пробуждения') && s.includes('14;'), '14-day sleep CSV should include 14 rows and useful columns');
    } else assert.ok(s.includes('M-CHAT-R/F')&&s.includes('ADOS-2')&&s.includes('ADI-R'),'CSV comparison missing entries');
  }
}
const components=await Promise.all(['ProfessionalAssessmentHome.astro','ProfessionalAssessmentGroup.astro','ProfessionalAssessmentTools.astro'].map(p=>readFile(path.resolve('src/components',p),'utf8')));
const css=await readFile(path.resolve('src/styles/professional-assessment.css'),'utf8');
assert.ok(css.includes('.assessment-flow__card:hover')&&css.includes('.assessment-flow__card:focus-visible'), 'Missing hover glow and keyboard focus state');
assert.ok(css.includes('background:#fff'), 'Assessment cards must default to white');
assert.ok(components[0].includes('assessment-flow__card')&&components[1].includes('assessment-hub__stage-articles')&&components[2].includes('data-assessment-category'),'Three-level UI separation missing');
assert.ok(components[2].includes('https://www.mchatscreen.com/mchat-rf/'),'Link only to official copyrighted diagnostic instruments');
const registry=await readFile(path.resolve('src/data/professional-assessment.ts'),'utf8');
assert.ok(!registry.includes('scoreItems')&&!registry.includes('testQuestions'),'Do not distribute protected diagnostic prompts');
const generator=await readFile(path.resolve('scripts/build-professional-assessment-downloads.py'),'utf8');
assert.ok(generator.includes('NICE CG128')&&generator.includes('Не валидированная шкала'),'Downloads need clinical scope and source statement');
console.log('Assessment structure PASS: five linked white-card stages; 12 scoped articles; standalone tools page; 21 valid downloads in ten released RU sets; locale-safe URLs and focus states.');
