import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Validate compiled HTML, not only the editable template.
// The language chosen in this filter is the ORIGINAL teaching language,
// independently of the language of the AutismHub catalogue page.
const labels = { ru: 'Казахский', kk: 'Қазақша', en: 'Kazakh' };
const expectedCourseLinks = [
  'https://daryn.ai/courses/Inklyuziya',
  'https://mooc.orleu.edu.kz/courses/course/4/',
  'https://daryn.ai/courses/bilim-berudegi-zasandy-intellekt-innovaciialyq-texnologiialar-men-oqu-uderisinin-cifrlyq-transformaciiasy',
  'https://mooc.orleu.edu.kz/courses/course/9/',
  'https://mooc.orleu.edu.kz/courses/course/7/',
];
const localeCardCounts = [];
for (const [lang, languageLabel] of Object.entries(labels)) {
  const html = await readFile(path.join('dist', 'kz', lang, 'learning', 'index.html'), 'utf8');
  assert.match(html, /<select\b[^>]*\bdata-course-language\b/, `Language filter missing for ${lang}`);
  assert.match(html, /<option\b[^>]*value="kk"/, `Kazakh option missing for ${lang}`);
  assert.ok(html.includes(languageLabel), `Kazakh-language label is not localized for ${lang}`);
  assert.ok(!html.includes('data-course-kazakh-shortcut'), `Redundant Kazakh shortcut still present for ${lang}`);
  for (const link of expectedCourseLinks) assert.ok(html.includes(link), `Kazakh course link ${link} missing for ${lang}`);
  const itemCount = (html.match(/<article\b[^>]*\bdata-course-item\b/g) ?? []).length;
  assert.ok(itemCount >= 21, `Expected complete catalogue, got ${itemCount} entries for ${lang}`);
  localeCardCounts.push(itemCount);
}
assert.equal(new Set(localeCardCounts).size, 1, 'Catalogue entry counts must match across all three locales');
const component = await readFile('src/components/LearningCatalog.astro', 'utf8');
assert.ok(!component.includes('data-course-kazakh-shortcut'), 'Redundant Kazakh quick selector must be removed');
assert.ok(component.includes('data-search-text='));
assert.ok(component.includes('entry.data.languages.map((l) => languages[locale][l])'));
console.log(`Kazakh dropdown option verified without extra shortcut; five Kazakh-language course links and ${localeCardCounts.join('/')} catalogue cards in RU/KK/EN.`);
