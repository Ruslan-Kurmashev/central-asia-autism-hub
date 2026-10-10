import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Presence/metadata regression guardrail for the reviewed intervention pages.
// Passing is not a medical endorsement or a substitute for evidence review.
const checks = [
  { name: 'behavior-learning', words: ['Что означает ABA', 'нежелательные события', '37963634'], refs: ['37963634'], risk: 'moderate' },
  { name: 'functional-behavior-assessment', words: ['Согласие, конфиденциальность и безопасность', 'критерии остановки'], refs: ['nice.org.uk/guidance/cg170'], risk: 'moderate' },
  { name: 'functional-communication-training', words: ['Согласие и нежелательные эффекты', 'стандартам WWC', 'нельзя удерживать'], refs: ['41464031'], risk: 'moderate' },
  { name: 'pecs', words: ['PECS не должен ограничивать', 'Не следует забирать альтернативную систему', 'физическая подсказка'], refs: ['20181849', '41442835'], risk: 'lower' },
  { name: 'aac', words: ['Доступная коммуникация - не награда', 'не существует обязательного порога', 'Доступ к ним'], refs: ['www.asha.org'], risk: 'lower' },
  { name: 'prompting-and-prompt-fading', words: ['Прежде чем использовать подсказку', 'физическую подсказку нужно прекратить'], refs: ['27606243'], risk: 'lower' },
  { name: 'differential-reinforcement', words: ['Проверяйте возможные неблагоприятные эффекты', 'план мониторинга', 'игнорировать боль'], refs: ['29117712'], risk: 'moderate' },
];
const errors = [];
for (const item of checks) {
  const raw = await readFile(path.join('src/content/pages/kz/ru', item.name + '.md'), 'utf8');
  const marker = raw.indexOf('\n---', 4);
  const fm = raw.slice(0, marker);
  const body = raw.slice(marker + 4);
  if (marker < 0 || !/^draft:\s*false/m.test(fm)) errors.push(item.name + ': not a published article');
  if (!fm.includes('riskLevel: ' + item.risk)) errors.push(item.name + ': risk metadata mismatch');
  if (!/^updatedAt:\s*\S+/m.test(fm)) errors.push(item.name + ': missing update date');
  for (const ref of item.refs) if (!fm.includes(ref)) errors.push(item.name + ': missing expected scientific source ' + ref);
  for (const word of item.words) if (!body.toLocaleLowerCase('ru').includes(word.toLocaleLowerCase('ru'))) errors.push(item.name + ': safety/evidence explanation absent: ' + word);
}
console.log('Behavior/AAC editorial regression: ' + checks.length + ' pages checked.');
if (errors.length) {
  for (const message of errors) console.error('EDITORIAL REGRESSION: ' + message);
  process.exitCode = 1;
} else {
  console.log('All reviewed pages retain the expected evidence links, risk metadata and reader safety guidance.');
}
