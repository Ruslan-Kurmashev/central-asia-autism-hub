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
  assert.ok(html.includes('learning-section-body'), `Learning section typography missing for ${lang}`);
  assert.ok(html.includes('data-course-result-word='), `Missing persistent result count label for ${lang}`);
  const filterPositions = ['language', 'search', 'audience', 'topic']
    .map((field) => html.indexOf('data-course-' + field, html.indexOf('id="professionals-learning"')));
  assert.ok(filterPositions.every((position) => position >= 0), `Filter markup incomplete for ${lang}`);
  assert.ok(filterPositions.every((position, index) => index === 0 || filterPositions[index - 1] < position),
    `Filter order must be language, search, audience, topic on ${lang}`);

  assert.match(html, /<option\b[^>]*value="kk"/, `Kazakh option missing for ${lang}`);
  assert.ok(html.includes(languageLabel), `Kazakh-language label is not localized for ${lang}`);
  assert.ok(!html.includes('data-course-kazakh-shortcut'), `Redundant Kazakh shortcut still present for ${lang}`);
  for (const link of expectedCourseLinks) assert.ok(html.includes(link), `Kazakh course link ${link} missing for ${lang}`);
  const cards = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>/g)].map((match) => match[0]);
  const itemCount = cards.length;
  const cardBlocks = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>[\s\S]*?<\/article>/g)].map((m) => m[0]);
  const priceLabel = { ru: 'Стоимость', kk: 'Құны', en: 'Price' }[lang];
  assert.equal(cardBlocks.length, itemCount, `Incomplete course cards on ${lang}`);
  for (const card of cardBlocks) {
    assert.ok(card.includes(priceLabel) && card.includes('course-catalogue__meta'), `Course cost hidden on ${lang}`);
    assert.ok(card.includes('course-catalogue__outcome'), `Course credential outcome hidden on ${lang}`);
    assert.ok(card.includes('course-catalogue__access'), `Course access instructions hidden on ${lang}`);
    // This is a text-first catalogue: never imply endorsement with copied
    // provider logos or unrelated photos. Course language must be visible
    // before the title, not buried in a long course description.
    assert.ok(!/<(?:img|svg)\b/i.test(card), `Unverified logo or thumbnail in a course card on ${lang}`);
    const itemTag = card.match(/^<article\b[^>]*>/)?.[0] ?? '';
    const expectedLanguages = itemTag.match(/\bdata-language="([^"]+)"/)?.[1]?.split(' ') ?? [];
    const pills = [...card.matchAll(/<span\b[^>]*\bdata-course-language-pill="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)]
      .filter(pill => pill[0].includes('course-catalogue__language-pill'));
    assert.equal(pills.length, expectedLanguages.length, `Visible teaching-language badges missing on ${lang}`);
    const labels = {
      ru: { ru: 'Русский', kk: 'Казахский', en: 'Английский' },
      kk: { ru: 'Орысша', kk: 'Қазақша', en: 'Ағылшынша' },
      en: { ru: 'Russian', kk: 'Kazakh', en: 'English' },
    }[lang];
    const prefix = { ru: 'Язык курса', kk: 'Курс тілі', en: 'Course language' }[lang];
    assert.deepEqual(pills.map(pill => pill[1]), expectedLanguages,
      `Wrong or reordered course language pills on ${lang}`);
    for (const pill of pills) assert.ok(pill[2].includes(prefix + ': ' + labels[pill[1]]),
      `Teaching language badge is incorrectly translated on ${lang}: ${pill[1]}`);
    assert.ok(card.search(/<h3\b/) >= 0 && card.indexOf('course-catalogue__language-pill') < card.search(/<h3\b/),
      `Teaching language must be visible before course title on ${lang}`);
  }
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
assert.ok(component.includes('data-course-language-pill={courseLanguage}'), 'Every card must label its original teaching language visibly');
assert.ok(component.includes('data-search-text='));
assert.ok(component.includes('entry.data.languages.map((l) => languages[locale][l])'));
for (const field of ['search','audience','language','topic']) {
  const event = field === 'search' ? 'input' : 'change';
  assert.ok(component.includes(field + "?.addEventListener('" + event + "', update);"),
    'The ' + field + ' control must update results without resetting other fields');
}
assert.ok(component.includes('const matches = (item: HTMLElement, override?: FilterKey, candidate?: string)'),
  'A shared matcher must combine all criteria and calculate contextual menu counts');
assert.ok(component.includes('Array.from(select.options)'),
  'Dropdown counts must respond to all other selected filters');
assert.ok(!component.includes('chooseFilter('), 'Obsolete reset-on-change behavior must be removed');
assert.ok(component.includes("window.addEventListener('pageshow', update);"));
console.log(`Learning filters checked in RU/KK/EN: ${localeCardCounts.join('/')} cards; language totals ${JSON.stringify(perLanguageCounts[0])}. All criteria remain selected and work together.`);
