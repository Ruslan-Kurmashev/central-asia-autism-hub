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
  // Every newly published Russian-language programme needs a localized
  // catalogue card, even though its actual teaching language remains Russian.
  for (const link of [
    'https://rehab-portal.ru/autism',
    'https://rehab-portal.ru/alternative-communication',
    'https://www.abapsy.com/free-training',
    'https://shkola-na-beregu.ru/open_kurs',
    'https://cms.znanierussia.ru/akademiya/catalog/osobyj-rebyonok-zhizn-semi-i-sistema-soprovozhdeniya',
    'https://daryn.ai/courses/inkliuzivnoe-obrazovanie-soprovozdenie-adaptaciia-obrazovatelnogo-processa-i-monitoring-rezultatov',
    'https://eii.ru/proekt-yazyk-vozmozhnostej/',
  ]) {
    assert.ok(html.includes(link), 'Missing localized learning course on ' + lang + ': ' + link);
  }
  // Ten user-approved free-to-learn providers must appear as ten separate
  // cards on each UI language. The filter language is the teaching language.
  const newlyApproved = [
    [
        "https://pedagog-course.autism.help/",
        "ru"
    ],
    [
        "https://circa.educ.ubc.ca/autism-and-neurodiversity-in-early-childcare/",
        "en"
    ],
    [
        "https://circa.educ.ubc.ca/autism-and-neurodiversity-in-primary-care/",
        "en"
    ],
    [
        "https://circa.educ.ubc.ca/autism-and-neurodiversity-in-dentistry/",
        "en"
    ],
    [
        "https://circa.educ.ubc.ca/autism-in-the-workplace/",
        "en"
    ],
    [
        "https://reframing-autism-s-school.teachable.com/p/autism-essentials",
        "en"
    ],
    [
        "https://thompsoncenter.missouri.edu/autism-training-modules/",
        "en"
    ],
    [
        "https://rehab-portal.ru/communication-in-early-intervention",
        "ru"
    ],
    [
        "https://rehab-portal.ru/social-everyday-adaptation",
        "ru"
    ],
    [
        "https://rehab-portal.ru/introduction-to-assistive-technologies",
        "ru"
    ]
];
  const newCards = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>[\s\S]*?<\/article>/g)].map((m) => m[0]);
  for (const [url, teachingLanguage] of newlyApproved) {
    const matches = newCards.filter((card) => card.includes(url));
    assert.equal(matches.length, 1, 'New course should occur once on ' + lang + ': ' + url);
    assert.ok(matches[0].includes('data-language="' + teachingLanguage + '"'),
      'Incorrect actual teaching language on ' + lang + ': ' + url);
  }
  assert.equal(newCards.length, 56,
    'Exactly 56 unique course cards expected on ' + lang + ', after grouping bilingual Orleu versions');
  const primaryCare = newCards.find((card) => card.includes('autism-and-neurodiversity-in-primary-care/'));
  assert.ok(primaryCare && primaryCare.includes('2026'),
    'Time-limited free primary-care course must disclose its 2026 deadline in ' + lang);
  // Check all five newly approved sensory programmes in every catalogue
  // locale, while keeping teaching language independent from UI language.
  for (const [url, actualTeachingLanguage] of [
  [
    "https://www.sensoryintegrationeducation.com/courses/transform-your-practice-with-sensory-integration",
    "en"
  ],
  [
    "https://register.tealearn.com/browse/tea/network/tslat/courses/evidence-based-practice-ayres-sensory-integration",
    "en"
  ],
  [
    "https://www.sensoryintegrationeducation.com/products/courses/discover-sensory-processing-integration",
    "en"
  ],
  [
    "https://carelearning.org.uk/courses/sensory-processing-training-course/",
    "en"
  ],
  [
    "https://www.art-talant.org/kursy/tehnologii-raboty-s-detmi-s-ovz/sensornaja-integracija-kak-metod-raboty-s-detmi-s-narushenijami-razvitija",
    "ru"
  ]
]) {
    const found = newCards.filter((card) => card.includes(url));
    assert.equal(found.length, 1, 'Sensory course must appear exactly once in ' + lang + ': ' + url);
    assert.ok(found[0].includes('data-language="' + actualTeachingLanguage + '"'),
      'Sensory course teaching-language badge is incorrect in ' + lang + ': ' + url);
    assert.ok(found[0].includes('course-catalogue__outcome') && found[0].includes('course-catalogue__access'),
      'Sensory course missing registration or completion conditions in ' + lang + ': ' + url);
  }
  const paidDocuments = newCards.find((card) =>
    card.includes('sensornaja-integracija-kak-metod-raboty-s-detmi-s-narushenijami-razvitija'));
  assert.ok(paidDocuments && paidDocuments.includes('380'),
    'Optional RUB 380 document fee must be disclosed in ' + lang);
  const thirtyDay = newCards.filter((card) =>
    card.includes('sensoryintegrationeducation.com/') &&
    (card.includes('transform-your-practice-with-sensory-integration') ||
     card.includes('discover-sensory-processing-integration')));
  assert.equal(thirtyDay.length, 2, 'Expected two SIE courses in ' + lang);
  for (const card of thirtyDay) assert.ok(card.includes('30'),
    'SIE 30-day access must be disclosed in ' + lang);
  const itemCount = cards.length;
  // The hero statistic and the actual rendered cards must use the same total.
  // The two bilingual Orleu variants are intentionally grouped into one card.
  const heroCount = html.match(/<div\b[^>]*class="section-v2__count"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(heroCount, 'Learning hero counter missing on ' + lang);
  const displayedHeroCount = Number(heroCount.match(/<strong>\s*(\d+)\s*<\/strong>/)?.[1]);
  assert.equal(displayedHeroCount, itemCount,
    'Learning hero total must match unique course cards on ' + lang);

  const cardBlocks = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>[\s\S]*?<\/article>/g)].map((m) => m[0]);
  // These programmes have two provider URLs but are one catalogue card each.
  // Both actual teaching languages and both links must remain visible.
  for (const [russianUrl, kazakhUrl] of [
    ['https://mooc.orleu.edu.kz/courses/course/6/', 'https://mooc.orleu.edu.kz/courses/course/7/'],
    ['https://mooc.orleu.edu.kz/courses/course/8/', 'https://mooc.orleu.edu.kz/courses/course/9/'],
  ]) {
    const group = cardBlocks.filter((card) => card.includes(russianUrl) && card.includes(kazakhUrl));
    assert.equal(group.length, 1, 'Bilingual Orleu programme must render in one card on ' + lang);
    assert.match(group[0], /data-course-language-pill="ru"/, 'Russian badge missing on ' + lang);
    assert.match(group[0], /data-course-language-pill="kk"/, 'Kazakh badge missing on ' + lang);
    assert.match(group[0], /data-language="ru kk"/, 'Combined language filter missing on ' + lang);
    assert.ok(group[0].includes('target="_blank"'), 'Both versions must open on their official sites');
  }
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
// Only actual published translations appear in each catalogue. A Russian
// source course must not be fabricated in KK/EN while its translations are drafts.
// Every locale still validates its own course count, facet counts and badges above.
for (const [index, counts] of perLanguageCounts.entries()) {
  assert.ok(counts.ru >= 5 && counts.kk >= 5 && counts.en >= 11,
    'Expected baseline language distribution has regressed in ' + Object.keys(labels)[index]);
}
assert.ok(localeCardCounts[0] >= localeCardCounts[1] && localeCardCounts[0] >= localeCardCounts[2],
  'Russian source catalogue is unexpectedly smaller than its translated catalogues');
const russianCatalogue = await readFile(path.join('dist', 'kz', 'ru', 'learning', 'index.html'), 'utf8');
for (const newCourse of [
  'https://rehab-portal.ru/autism',
  'https://rehab-portal.ru/alternative-communication',
  'https://www.abapsy.com/free-training',
  'https://shkola-na-beregu.ru/open_kurs',
  'https://cms.znanierussia.ru/akademiya/catalog/osobyj-rebyonok-zhizn-semi-i-sistema-soprovozhdeniya',
  'https://daryn.ai/courses/inkliuzivnoe-obrazovanie-soprovozdenie-adaptaciia-obrazovatelnogo-processa-i-monitoring-rezultatov',
  'https://eii.ru/proekt-yazyk-vozmozhnostej/',
]) {
  assert.ok(russianCatalogue.includes(newCourse), 'New free course link missing from Russian catalogue: ' + newCourse);
}
const component = await readFile('src/components/LearningCatalog.astro', 'utf8');
assert.ok(!component.includes('data-course-kazakh-shortcut'), 'Redundant Kazakh quick selector must be removed');
assert.ok(component.includes('data-course-language-pill={courseLanguage}'), 'Every card must label its original teaching language visibly');
assert.ok(component.includes('data-search-text='));
assert.ok(component.includes('courseLanguages(entry).map((l) => languages[locale][l])'));
assert.ok(component.includes('bilingualCoursePairs'), 'Bilingual programme grouping must be explicit');
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
