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
const perLanguageCounts = [];
const availableLanguages = ['ru', 'kk', 'en'];
for (const [lang, languageLabel] of Object.entries(labels)) {
  const html = await readFile(path.join('dist', 'kz', lang, 'learning', 'index.html'), 'utf8');
  assert.match(html, /<select\b[^>]*\bdata-course-language\b/, `Language filter missing for ${lang}`);
  assert.match(html, /<option\b[^>]*value="kk"/, `Kazakh option missing for ${lang}`);
  assert.ok(html.includes(languageLabel), `Kazakh-language label is not localized for ${lang}`);
  assert.ok(!html.includes('data-course-kazakh-shortcut'), `Redundant Kazakh shortcut still present for ${lang}`);
  for (const link of expectedCourseLinks) assert.ok(html.includes(link), `Kazakh course link ${link} missing for ${lang}`);
  const cards = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>/g)].map((match) => match[0]);
  const itemCount = cards.length;
  assert.ok(itemCount >= 21, `Expected complete catalogue, got ${itemCount} entries for ${lang}`);
  localeCardCounts.push(itemCount);

  const counts = Object.fromEntries(availableLanguages.map((key) => [key, 0]));
  for (const card of cards) {
    const courseLanguages = card.match(/\bdata-language="([^"]*)"/)?.[1]?.split(' ') ?? [];
    for (const key of availableLanguages) if (courseLanguages.includes(key)) counts[key] += 1;
  }
  perLanguageCounts.push(counts);
  const select = html.match(/<select\b[^>]*\bdata-course-language\b[^>]*>([\s\S]*?)<\/select>/)?.[1];
  assert.ok(select, `Language select markup not found for ${lang}`);
  assert.match(select, new RegExp(`<option\\b[^>]*value="all"[^>]*>[^<]*\\(${itemCount}\\)<\\/option>`), `Wrong total in language dropdown for ${lang}`);
  const expectedLabels = {
    ru: { ru: 'Русский', kk: 'Казахский', en: 'Английский' },
    kk: { ru: 'Орысша', kk: 'Қазақша', en: 'Ағылшынша' },
    en: { ru: 'Russian', kk: 'Kazakh', en: 'English' },
  }[lang];
  for (const key of availableLanguages) {
    assert.match(select, new RegExp(`<option\\b[^>]*value="${key}"[^>]*>[^<]*${expectedLabels[key]} \\(${counts[key]}\\)<\\/option>`),
      `Incorrect ${key} count in ${lang} language menu: expected ${counts[key]}`);
  }
}
assert.equal(new Set(localeCardCounts).size, 1, 'Catalogue entry counts must match across all three locales');
assert.equal(new Set(perLanguageCounts.map((counts) => JSON.stringify(counts))).size, 1,
  'Actual teaching-language counts must match across all site locales');
assert.ok(perLanguageCounts[0].ru >= 5 && perLanguageCounts[0].kk >= 5 && perLanguageCounts[0].en >= 11,
  'Expected baseline language distribution has regressed');
const component = await readFile('src/components/LearningCatalog.astro', 'utf8');
assert.ok(!component.includes('data-course-kazakh-shortcut'), 'Redundant Kazakh quick selector must be removed');
assert.ok(component.includes('data-search-text='));
assert.ok(component.includes('entry.data.languages.map((l) => languages[locale][l])'));
const chooser = component.indexOf('const chooseFilter = (selected:');
assert.ok(chooser >= 0, 'Unified catalogue filter handler missing');
const handler = component.slice(chooser, component.indexOf("window.addEventListener('pageshow', update)",chooser));
for (const field of ['search','audience','language','topic']) {
  assert.ok(handler.includes("chooseFilter('"+field+"')"), 'Filter event missing: '+field);
}
for (const reset of ["search.value = '';", "audience.value = 'all';", "language.value = 'all';", "topic.value = 'all';"]) {
  assert.ok(handler.includes(reset), 'Filter reset missing: '+reset);
}
assert.ok(component.includes("window.addEventListener('pageshow', update);"));
console.log(`Learning filters checked in RU/KK/EN: ${localeCardCounts.join('/')} cards; language totals ${JSON.stringify(perLanguageCounts[0])}. Every category switch replaces prior selections.`);
