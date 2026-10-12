/**
 * Professional directory contract: six categories in a three-column layout,
 * localized category lists with numbered editorial-plan resources, and only
 * genuine published articles linked. This is static HTML QA, not browser QA.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const expected = {
  ru: {
    names: ['Рекомендации и стандарты', 'Работа с семьями', 'Оценка и диагностика', 'Доказательность методов', 'Этика и безопасность', 'Алгоритмы и инструменты'],
    back: 'Все направления', pending: 'Готовится', cardWord: 'материала', training: 'Обучение для специалистов', published: 4,
  },
  kk: {
    names: ['Ұсынымдар мен стандарттар', 'Отбасылармен жұмыс', 'Бағалау және диагностика', 'Әдістердің дәлелділігі', 'Этика және қауіпсіздік', 'Алгоритмдер мен құралдар'],
    back: 'Барлық бағыттар', pending: 'Әзірленуде', cardWord: 'материал', training: 'Мамандарға арналған оқу', published: 0,
  },
  en: {
    names: ['Guidelines and standards', 'Working with families', 'Assessment and diagnosis', 'Evidence for approaches', 'Ethics and safety', 'Workflows and tools'],
    back: 'All areas', pending: 'In preparation', cardWord: 'resources', training: 'Training for professionals', published: 0,
  },
};
const counts = [6, 3, 4, 3, 3, 4];
const ids = ['guidelines', 'family-communication', 'assessment-context', 'evidence-support', 'ethics', 'practice-tools'];
// CSS emitted assets are content-hashed. The HTML must reference our directory stylesheet
// indirectly via Astro's static asset pipeline.
for (const [locale, copy] of Object.entries(expected)) {
  const relative = path.join('kz', locale, 'professionals', 'index.html');
  const html = await readFile(path.resolve('dist', relative), 'utf8');
  assert.match(html, /<body\b[^>]*class="professional-library-body"/);
  assert.ok(html.includes('professional-directory__grid'), locale + ': missing category grid');
  assert.ok(html.includes('professional-directory__card'), locale + ': missing cards');
  assert.ok(html.includes(copy.back), locale + ': missing back navigation');
  assert.ok(html.includes(copy.pending), locale + ': missing draft markers');
  assert.equal((html.match(/class="professional-directory__title-row"/g) ?? []).length, 7, locale + ': header and six category headings must have title rows');
  assert.equal((html.match(/class="professional-directory__training-link"/g) ?? []).length, 7, locale + ': training link must sit beside each heading');
  assert.equal(html.split('<h1').length - 1, 1, locale + ': page should have exactly one H1');
  assert.ok(html.includes(copy.training), locale + ': localized training link label missing');
  const trainingHref = '/central-asia-autism-hub/kz/' + locale + '/learning/#professionals-learning';
  assert.equal(html.split('href="' + trainingHref + '"').length - 1, 7, locale + ': training links must point to the correct locale');
  assert.ok(!html.includes('section-boundary'), locale + ': old professional information callout remains');
  assert.ok(!html.includes('professional-directory__note'), locale + ': redundant editorial note remains');
  for (const oldPhrase of ['Числа на карточках показывают', 'Карточкалардағы сандар', 'Card counts reflect the editorial roadmap', 'Профессиональные ресурсы публикуются с источниками', 'Professional resources include sources']) {
    assert.ok(!html.includes(oldPhrase), locale + ': obsolete explanation remains: ' + oldPhrase);
  }
  assert.ok(!html.includes('PRO-G01') && !html.includes('PRO-E03'), locale + ': internal editorial IDs leaked');
  assert.equal((html.match(/class="professional-directory__card"/g) ?? []).length, 6, locale + ': expected six area cards');
  assert.equal((html.match(/class="professional-directory__detail"/g) ?? []).length, 6, locale + ': expected six detail panels');
  assert.equal((html.match(/class="professional-directory__item"/g) ?? []).length, 23, locale + ': expected 23 planned resources');
  assert.equal((html.match(/class="professional-directory__status"/g) ?? []).length, 23 - copy.published, locale + ': only reviewed published entries should be linked');
  if (locale === 'ru') {
    const articleHref = '/central-asia-autism-hub/kz/ru/professionals/kak-rabotat-s-professionalnymi-rekomendaciyami/';
    assert.ok(html.includes('href="' + articleHref + '"'), 'Russian first professional resource must have a working article link');
    assert.ok(html.includes('Как работать с профессиональными рекомендациями при аутизме'));
    const articleHtml = await readFile(path.resolve('dist/kz/ru/professionals/kak-rabotat-s-professionalnymi-rekomendaciyami/index.html'), 'utf8');
    for (const phrase of ['Практический чек-лист: семь вопросов', 'Strengthening countries', 'AGREE II', 'Международные документы и Казахстан']) {
      assert.ok(articleHtml.includes(phrase), 'First professional article missing ' + phrase);
    }
    assert.ok(articleHtml.includes('professional-guideline-appraisal.svg'), 'Professional illustration missing');
    // Generated article navigation may mention a nearby NICE document. Check the
    // introductory article's actual source, not its related-resource links.
    const introductorySource = await readFile(path.resolve('src/content/pages/kz/ru/professional-guideline-appraisal.md'), 'utf8');
    for (const documentToKeepSeparate of ['NICE CG128', 'CG170', 'CG142', '№ 332-VIII']) {
      assert.ok(!introductorySource.includes(documentToKeepSeparate), 'Introductory article contains an individual-document deep dive: ' + documentToKeepSeparate);
    }
  }
  if (locale === 'ru') {
    const documents = [
      { code: 'CG128', slug: 'nice-cg128-diagnostika-autizma-u-detej', phrase: 'Скрининг не равен диагнозу', graphic: 'professional-nice-cg128.svg' },
      { code: 'CG170', slug: 'nice-cg170-podderzhka-detej-i-podrostkov', phrase: 'Адаптация среды и процессов помощи', graphic: 'professional-nice-cg170.svg' },
      { code: 'CG142', slug: 'nice-cg142-diagnostika-i-podderzhka-vzroslyh', phrase: 'AQ-10', graphic: 'professional-nice-cg142.svg' },
    ];
    for (const document of documents) {
      const expectedHref = '/central-asia-autism-hub/kz/ru/professionals/' + document.slug + '/';
      assert.ok(html.includes('href="' + expectedHref + '"'), document.code + ' is missing from the professional directory');
      const content = await readFile(path.resolve('dist/kz/ru/professionals', document.slug, 'index.html'), 'utf8');
      assert.ok(content.includes(document.code), document.code + ' number missing');
      assert.ok(content.includes(document.phrase), document.code + ' content missing: ' + document.phrase);
      assert.ok(content.includes(document.graphic), document.code + ' illustration missing');
      assert.ok(content.includes('Казахстан'), document.code + ' local applicability missing');
    }
  }
  const subgroupLabels = locale === 'ru'
    ? ['Основы работы с рекомендациями', 'Международные клинические руководства', 'Документы Казахстана', 'Междисциплинарная работа']
    : locale === 'kk'
      ? ['Ұсынымдармен жұмыс негіздері', 'Халықаралық клиникалық нұсқаулықтар', 'Қазақстан құжаттары', 'Пәнаралық жұмыс']
      : ['Working with guidelines', 'International clinical guidelines', 'Kazakhstan documents', 'Multidisciplinary coordination'];
  assert.equal((html.match(/class="professional-directory__subgroup"/g) ?? []).length, 4, locale + ': first category must have four subgroups');
  for (const label of subgroupLabels) assert.ok(html.includes(label), locale + ': missing professional subgroup: ' + label);
  for (const name of copy.names) assert.ok(html.includes(name), locale + ': missing category ' + name);
  ids.forEach((id, i) => {
    assert.ok(html.includes('href="#professional-' + id + '"'), locale + ': missing category target ' + id);
    assert.ok(html.includes('id="professional-' + id + '"'), locale + ': missing category destination ' + id);
    assert.ok(html.includes('href="#professional-overview"'), locale + ': missing return link');
    assert.ok(
      html.includes('>' + counts[i] + ' ' + (locale === 'en' ? 'resources' : locale === 'kk' ? 'материал' : (counts[i] === 3 || counts[i] === 4 ? 'материала' : 'материалов')) + '<'),
      locale + ': category count not visible for ' + id,
    );
  });
  assert.ok(!html.includes('href="undefined"'), locale + ': invalid href');
  assert.ok(!html.includes('href="/kz/'), locale + ': unprefixed locale path');
  console.log('Professional directory ' + locale + ': 6 categories; 23 planned entries; unpublished resources not linked.');
}