import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Regression assertions for the reviewed training and family-support materials.
// Passing does not replace professional/clinical evaluation of individual claims.
const checks = [
  { slug: 'video-modeling', markers: ['Согласие ребёнка и безопасность видеозаписей', 'когда будет удалено', 'без публикации записи'], refs: ['38707947'] },
  { slug: 'task-analysis', markers: ['Право делать действие удобным способом', 'удержание рук', 'допустимые альтернативные способы'], refs: ['39540347'] },
  { slug: 'self-management', markers: ['Как понимать результаты для бытовых навыков', '5 из 15', '7 из 15'], refs: ['38709359'] },
  { slug: 'naturalistic-intervention', markers: ['Инициатива ребёнка и границы обучения в игре', 'независимо от выполнения задания', 'игра без учебных задач'], refs: ['pmc.ncbi.nlm.nih.gov/articles/PMC8510990'] },
  { slug: 'parent-mediated-intervention', markers: ['Что говорят исследования с дизайном единичного случая', '17 исследований', '3 исследования'], refs: ['s40489-024-00439-0'] },
  { slug: 'daily-living-skills-training', markers: ['Когда навыку нужно учить иначе или отложить практику', 'острых предметов', 'лишение воды'], refs: ['37562056'] },
];
let checked=0;
const errors=[];
for(const item of checks){
  const content=await readFile(path.join('src/content/pages/kz/ru',item.slug+'.md'),'utf8');
  const marker=content.indexOf('\n---',4);
  const fm=content.slice(0,marker),body=content.slice(marker+4);
  if(marker<0 || !/^draft:\s*false\s*$/m.test(fm)) errors.push(item.slug+': published frontmatter missing');
  if(!/^updatedAt:\s*\S+/m.test(fm)) errors.push(item.slug+': missing update timestamp');
  if(!fm.includes('riskLevel:')) errors.push(item.slug+': missing risk classification');
  if(!fm.includes('featuredImage:')) errors.push(item.slug+': missing existing illustrative image');
  for(const ref of item.refs)if(!fm.includes(ref))errors.push(item.slug+': reference absent: '+ref);
  for(const phrase of item.markers)if(!body.toLocaleLowerCase('ru').includes(phrase.toLocaleLowerCase('ru')))errors.push(item.slug+': safety/evidence limitation absent: '+phrase);
  checked++;
}
console.log('Training skills medical-editorial regression: '+checked+' published materials checked.');
for(const e of errors)console.error('TRAINING QA: '+e);
if(errors.length)process.exitCode=1;
else console.log('Reviewed materials retain consent, safety, evidence limits, citations and images.');
