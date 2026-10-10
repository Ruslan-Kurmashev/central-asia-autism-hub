import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Editorial safety gate for the first high-risk intervention QA cohort.
// These are targeted regression checks, not a substitute for medical peer review.
const base = 'src/content/pages/kz/ru';
const checks = [
  {
    slug: 'weighted-items', risk: 'high', disclaimer: 'medical',
    references: ['25022743', 'Sleep-Related Infant Deaths'],
    wording: ['Ключевое предупреждение о безопасности', 'для сна младенцев', 'нельзя применять для фиксации'],
  },
  {
    slug: 'feeding-therapy', risk: 'high', disclaimer: 'medical',
    references: ['30358739', 'asha.org/practice-portal/clinical-topics/pediatric-feeding-and-swallowing/'],
    wording: ['оценка глотания', 'кашляет или давится'],
  },
  {
    slug: 'behavioral-feeding-interventions', risk: 'high', disclaimer: 'medical',
    references: ['30358739'], wording: ['подозрение на аспирацию', 'наименее интрузивной'],
  },
  {
    slug: 'auditory-integration-listening-programs', risk: 'moderate',
    references: ['nice.org.uk/guidance/cg170'], wording: ['не рекомендует слуховую интеграционную тренировку', 'нельзя заставлять ребёнка'],
  },
  {
    slug: 'ayres-sensory-integration', risk: 'moderate',
    references: ['41903087'], wording: ['ограниченной уверенностью', 'смешанными'],
  },
  {
    slug: 'ndbi', risk: 'moderate',
    references: ['37963634'], wording: ['252 исследования', 'не только NDBI', 'не является прогнозом'],
  },
];
const errors = [];
for (const item of checks) {
  const file = path.join(base, item.slug + '.md');
  const raw = await readFile(file, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
  const body = raw.slice(raw.indexOf('\n---', 4) + 4);
  if (!/^draft:\s*false\s*$/m.test(fm)) errors.push(item.slug + ': not published');
  if (!fm.includes('riskLevel: ' + item.risk)) errors.push(item.slug + ': risk classification mismatch');
  if (item.disclaimer && !fm.includes('disclaimerType: ' + item.disclaimer)) errors.push(item.slug + ': medical disclaimer missing');
  if (!/^updatedAt:\s*\S+/m.test(fm)) errors.push(item.slug + ': updatedAt missing');
  for (const ref of item.references) if (!fm.includes(ref)) errors.push(item.slug + ': missing source ' + ref);
  for (const word of item.wording) if (!body.includes(word)) errors.push(item.slug + ': required safety/evidence explanation missing: ' + word);
}
console.log('Intervention safety regression gate: ' + checks.length + ' high-priority articles checked.');
if (errors.length) {
  for (const error of errors) console.error('QA FAILURE: ' + error);
  process.exitCode = 1;
} else console.log('All required risk categories, source records and patient-facing cautions are present.');
