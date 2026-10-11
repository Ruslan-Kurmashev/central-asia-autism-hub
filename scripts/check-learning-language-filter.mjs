import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Validate compiled HTML, not only the editable template.
// The language chosen in this filter is the ORIGINAL teaching language,
// independently of the language of the AutismHub catalogue page.
const labels = { ru: ['Казахский', 'Курсы на казахском'], kk: ['Қазақша', 'Қазақ тіліндегі курстар'], en: ['Kazakh', 'Courses in Kazakh'] };
const expectedIds = [
  'daryn-kazakh-inclusive-education',
  'orleu-kazakh-ai-for-parents',
  'daryn-kazakh-ai-education',
  'orleu-kazakh-aac-assistive-technologies',
  'orleu-kazakh-assistive-needs-sett',
];
for (const [lang, [languageLabel, shortcutLabel]] of Object.entries(labels)) {
  const html = await readFile(path.join('dist', 'kz', lang, 'learning', 'index.html'), 'utf8');
  assert.match(html, /<select\s+data-course-language>/, `Language filter missing for ${lang}`);
  assert.ok(html.includes(`value="kk">${languageLabel}</option>`), `Kazakh option missing for ${lang}`);
  assert.ok(html.includes(shortcutLabel), `Kazakh quick selector missing for ${lang}`);
  assert.ok(html.includes('data-course-kazakh-shortcut'), `Shortcut handler target missing for ${lang}`);
  for (const id of expectedIds) assert.ok(html.includes(id), `Kazakh course ${id} missing for ${lang}`);
}
const component = await readFile('src/components/LearningCatalog.astro', 'utf8');
assert.ok(component.includes("language.value = language.value === 'kk' ? 'all' : 'kk';"));
assert.ok(component.includes('data-search-text='));
assert.ok(component.includes('entry.data.languages.map((l) => languages[locale][l])'));
console.log('Kazakh language option, shortcut and five Kazakh-language course listings verified in RU/KK/EN builds.');
