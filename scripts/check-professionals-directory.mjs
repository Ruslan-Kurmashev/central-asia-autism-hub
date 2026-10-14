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
    back: 'Все направления', pending: 'Готовится', cardWord: 'материала', training: 'Обучение для специалистов', published: 21,
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
const counts = [42, 6, 12, 3, 3, 5];
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
  assert.equal((html.match(/class="professional-directory__item"/g) ?? []).length, 30, locale + ': expected 30 direct planned resources; international country folders are counted separately');
  // The RU directory has three additional ethics guides and five remaining pending direct entries.
  // Internal-link QA separately verifies that linked destination pages exist.
  assert.equal((html.match(/class="professional-directory__status"/g) ?? []).length, locale === 'ru' ? 5 : 30, locale + ': only genuinely published direct entries should be linked');
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
  const assessmentHubHref = '/central-asia-autism-hub/kz/' + locale + '/professionals/assessment/';
  assert.ok(html.includes('href="' + assessmentHubHref + '"'), locale + ': assessment card must open the five-stage hub');
  for (const id of ['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12']) {
    // Entries remain distinct until their articles are genuinely published.
    assert.ok(html.includes('professional-directory__item-title'), locale + ': assessment topic rows missing');
  }
  const familyPanel = html.split('id="professional-family-communication"')[1]?.split('id="professional-assessment-context"')[0] ?? '';
  assert.ok(familyPanel, locale + ': family communication panel missing');
  const familyTopics = [
    locale === 'ru' ? 'Как обсуждать результаты скрининга с семьёй' : locale === 'kk' ? 'Скрининг нәтижелерін отбасымен қалай талқылау керек' : 'Discussing screening results with families',
    locale === 'ru' ? 'Как сообщать семье о диагнозе аутизма' : locale === 'kk' ? 'Отбасына аутизм диагнозын қалай түсіндіру керек' : 'Communicating an autism diagnosis to families',
    locale === 'ru' ? 'Несогласие, тревога и конфликтные ситуации' : locale === 'kk' ? 'Келіспеушілік, алаңдаушылық және жанжалдар' : 'Managing disagreement, concerns and conflict with families',
  ];
  for (const label of familyTopics) assert.ok(familyPanel.includes(label), locale + ': family roadmap topic missing: ' + label);
  const c06Href = '/central-asia-autism-hub/kz/ru/professionals/nesoglasie-trevoga-konflikty-rabota-s-semjami/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c06Href + '"'), 'RU: final published C06 article missing from family directory');
    const c06 = await readFile(path.resolve('dist/kz/ru/professionals/nesoglasie-trevoga-konflikty-rabota-s-semjami/index.html'), 'utf8');
    for (const phrase of ['Алгоритм деэскалации из восьми шагов', 'Десять ситуаций из практики', 'Шаблон: карточка сложной беседы', 'Внутренний аудит команды: чек-лист', 'professional-family-conflict-deescalation.svg', 'article-v2__sources']) {
      assert.ok(c06.includes(phrase), 'C06 lacks professional content or sources: ' + phrase);
    }
    const c06Source = await readFile(path.resolve('src/content/pages/kz/ru/professional-family-conflict-communication.md'), 'utf8');
    for (const primary of ['nice.org.uk/guidance/ng197', 'nice.org.uk/guidance/cg128', 'nice.org.uk/guidance/ng10', 'Z2600000332', 'V2600039918', 'K2000000360', 'Z1300000094', 'V2500036047']) {
      assert.ok(c06Source.includes(primary), 'C06 must cite clinical and Kazakhstan primary sources: ' + primary);
    }
    assert.ok(c06Source.includes('не являются автоматическим подтверждением') || c06Source.includes('не являются автоматическим') || c06Source.includes('не являются'), 'C06 requires limits on conflict-related restrictions');
    assert.ok(c06Source.includes('не могут переноситься на встречу с родителями'), 'C06 must delimit coercive NG10 measures from family disagreements');
  } else {
    assert.ok(!familyPanel.includes('href="' + c06Href + '"'), locale + ': C06 translations should remain pending, no Russian-only link');
  }
  const c05Href = '/central-asia-autism-hub/kz/ru/professionals/kulturnye-yazykovye-osobennosti-obshcheniya-s-semiej/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c05Href + '"'), 'RU: C05 must link to published language and culture guide');
    const c05 = await readFile(path.resolve('dist/kz/ru/professionals/kulturnye-yazykovye-osobennosti-obshcheniya-s-semiej/index.html'), 'utf8');
    for (const phrase of ['Алгоритм культурно и языково доступной консультации: десять шагов', 'Девять ситуаций и примеры профессионального ответа', 'Рабочая карточка языковой и социальной доступности консультации', 'professional-family-cultural-language-access.svg', 'article-v2__sources']) {
      assert.ok(c05.includes(phrase), 'C05 missing practical source component: ' + phrase);
    }
    const source = await readFile(path.resolve('src/content/pages/kz/ru/professional-family-cultural-language-communication.md'), 'utf8');
    for (const urlPart of ['Z970000151_', 'K2000000360', 'Z1300000094', 'nice.org.uk/guidance/cg128', 'asha.org/practice-portal/professional-issues/collaborating-with-interpreters', 'who.int/publications/i/item/9789240048850']) {
      assert.ok(source.includes(urlPart), 'C05 must include verifiable original source: ' + urlPart);
    }
    assert.ok(source.includes('не являются') || source.includes('не является'), 'C05 must clarify foreign guidelines are not Kazakhstan law');
  } else {
    assert.ok(!familyPanel.includes('href="' + c05Href + '"'), locale + ': C05 translations must remain unlinked until published');
  }
  const c04Href = '/central-asia-autism-hub/kz/ru/professionals/kak-soobshchat-seme-o-diagnoze-autizma/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c04Href + '"'), 'RU: C04 published article link missing');
    const c04 = await readFile(path.resolve('dist/kz/ru/professionals/kak-soobshchat-seme-o-diagnoze-autizma/index.html'), 'utf8');
    for (const phrase of ['Алгоритм сообщения диагноза: восемь шагов', 'Шесть профессиональных сценариев', 'Письменный отчёт: что проверить', 'Карточка итоговой беседы', 'professional-family-diagnosis-conversation.svg', 'article-v2__sources']) {
      assert.ok(c04.includes(phrase), 'C04 missing professional guide component: ' + phrase);
    }
    const source = await readFile(path.resolve('src/content/pages/kz/ru/professional-family-communicating-autism-diagnosis.md'), 'utf8');
    for (const primary of ['nice.org.uk/guidance/cg128', 'cps.ca/en/documents/position/asd-diagnostic-assessment', 'K2000000360', 'Z1300000094']) {
      assert.ok(source.includes(primary), 'C04 primary source missing: ' + primary);
    }
    assert.ok(source.includes('шести недель'), 'C04 must clarify NICE follow-up is not mandated in Kazakhstan');
  } else {
    assert.ok(!familyPanel.includes('href="' + c04Href + '"'), locale + ': C04 unpublished translation must not link to RU article');
  }
  const c03Href = '/central-asia-autism-hub/kz/ru/professionals/peredacha-informacii-semya-medicina-shkola/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c03Href + '"'), 'RU: C03 must link to its published canonical URL');
    const c03 = await readFile(path.resolve('dist/kz/ru/professionals/peredacha-informacii-semya-medicina-shkola/index.html'), 'utf8');
    for (const phrase of ['Алгоритм обмена информацией из восьми шагов', 'краткое функциональное резюме для школы', 'professional-family-information-sharing.svg', 'article-v2__sources']) {
      assert.ok(c03.includes(phrase), 'C03 lacks practice/source component: ' + phrase);
    }
    const c03Source = await readFile(path.resolve('src/content/pages/kz/ru/professional-family-information-sharing.md'), 'utf8');
    for (const source of ['Z1300000094', 'K2000000360', 'V2200029329']) {
      assert.ok(c03Source.includes(source), 'C03 missing Kazakhstan primary source: ' + source);
    }
    assert.ok(c03Source.includes('273'), 'C03 should mention medical confidentiality provision');
  } else {
    assert.ok(!familyPanel.includes('href="' + c03Href + '"'), locale + ': C03 translation cannot link to Russian-only material');
  }
  const c02Href = '/central-asia-autism-hub/kz/ru/professionals/sovmestnye-resheniya-informirovannoe-soglasie-autizm/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c02Href + '"'), 'RU: C02 must link to published canonical article');
    const c02 = await readFile(path.resolve('dist/kz/ru/professionals/sovmestnye-resheniya-informirovannoe-soglasie-autizm/index.html'), 'utf8');
    for (const phrase of ['Алгоритм из шести шагов', 'Шесть практических ситуаций', 'Карточка совместного решения', 'professional-family-shared-decisions.svg', 'article-v2__sources']) {
      assert.ok(c02.includes(phrase), 'C02 article lacks practical component: ' + phrase);
    }
    const c02Source = await readFile(path.resolve('src/content/pages/kz/ru/professional-family-shared-decisions-consent.md'), 'utf8');
    for (const officialRef of ['Z2600000332', 'V2600039918', 'K2000000360', 'Z1300000094']) {
      assert.ok(c02Source.includes(officialRef), 'C02 missing relevant Kazakhstan primary law: ' + officialRef);
    }
  } else {
    assert.ok(!familyPanel.includes('href="' + c02Href + '"'), locale + ': C02 translation must not silently reuse Russian article');
  }
  const c01Href = '/central-asia-autism-hub/kz/ru/professionals/kak-obsuzhdat-rezultaty-skrininga-s-semiej/';
  if (locale === 'ru') {
    assert.ok(familyPanel.includes('href="' + c01Href + '"'), 'RU: published C01 article must link to canonical URL');
    const c01 = await readFile(path.resolve('dist/kz/ru/professionals/kak-obsuzhdat-rezultaty-skrininga-s-semiej/index.html'), 'utf8');
    for (const phrase of ['Алгоритм разговора из семи шагов', 'Шаблон: письменный итог встречи для семьи', 'professional-family-screening-conversation.svg', 'article-v2__sources']) {
      assert.ok(c01.includes(phrase), 'C01 article lacks practical component: ' + phrase);
    }
  } else {
    assert.ok(!familyPanel.includes('href="' + c01Href + '"'), locale + ': untranslated C01 cannot link to Russian article');
  }
  const internationalCountries = {
    uk: ['nice-cg128', 'nice-cg170', 'nice-cg142'],
    us: ['aap-2020', 'aap-developmental-screening-2020', 'aan-sleep-2020'],
    au: ['autism-crc-assessment-2023', 'autism-crc-supporting-children', 'au-functional-strengths-framework-2024'],
    ca: ['cps-early-detection', 'cps-diagnostic-standards', 'cps-followup'],
    fr: ['fr-has-interventions-2026', 'fr-has-diagnosis-2018'],
    nz: ['nz-autism-guideline-2022', 'nz-gender-assessment-2024'],
  };
  for (const [country, identifiers] of Object.entries(internationalCountries)) {
    const countryHref = '/central-asia-autism-hub/kz/' + locale + '/professionals/international-guidelines/' + country + '/';
    assert.ok(html.includes('href="' + countryHref + '"'), locale + ': missing country navigation: ' + country);
    const detail = await readFile(path.resolve('dist/kz', locale, 'professionals/international-guidelines', country, 'index.html'), 'utf8');
    assert.equal((detail.match(/class="international-guidelines__item"/g) ?? []).length, identifiers.length,
      locale + ': country document count mismatch: ' + country);
    assert.ok(detail.includes('international-guidelines__disclaimer'), locale + ': missing jurisdiction warning for ' + country);
    if (country === 'uk') {
      const slugs = [
        'nice-cg128-diagnostika-autizma-u-detej',
        'nice-cg170-podderzhka-detej-i-podrostkov',
        'nice-cg142-diagnostika-i-podderzhka-vzroslyh',
      ];
      for (const slug of slugs) {
        const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
        assert.ok(!html.includes('href="' + href + '"'), 'NICE reviews must be listed only inside UK');
        if (locale === 'ru') assert.ok(detail.includes('href="' + href + '"'), 'Published NICE review is missing from UK catalogue: ' + slug);
      }
      if (locale !== 'ru') assert.equal((detail.match(/class="international-guidelines__pending"/g) ?? []).length, 3,
        locale + ': missing NICE translations must not be represented as published');
    } else {
      const newlyPublished = {
        us: ['aap-2020-vyyavlenie-ocenka-i-soprovozhdenie-ras', 'aap-nablyudenie-za-razvitiem-i-skrining-2020', 'aan-rekomendacii-narusheniya-sna-autizm-2020'],
        au: ['autism-crc-avstraliya-ocenka-i-diagnostika-ras', 'autism-crc-avstraliya-podderzhka-autichnyh-detej', 'autism-crc-framework-ocenki-potrebnostej-detej-2024'],
        ca: ['cps-kanada-rannee-vyyavlenie-autizma-2019', 'cps-kanada-standarty-diagnostiki-autizma-2019', 'cps-kanada-soprovozhdenie-posle-diagnostiki-2019'],
        fr: ['has-franciya-podderzhka-autichnyh-detej-2026', 'has-franciya-vyyavlenie-diagnostika-autizma-2018'],
        nz: ['novaya-zelandiya-nacionalnoe-rukovodstvo-autizm-2022', 'novaya-zelandiya-gender-i-diagnostika-autizma-2024'],
      }[country];
      const publishedCount = locale === 'ru' ? newlyPublished.length : 0;
      assert.equal((detail.match(/class="international-guidelines__pending"/g) ?? []).length, identifiers.length - publishedCount,
        locale + ': published/unpublished status mismatch: ' + country);
      assert.equal((detail.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, identifiers.length - publishedCount,
        locale + ': unreviewed documents must open official sources: ' + country);
      for (const slug of newlyPublished) {
        const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
        assert.ok(!html.includes('href="' + href + '"'), 'Published country guideline must only be listed in country directory: ' + slug);
        if (locale !== 'ru') continue;
        assert.ok(detail.includes('href="' + href + '"'), 'Published review missing from its country directory: ' + slug);
        const article = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
        assert.ok(article.includes('article-v2__sources'), 'International guideline must show its sources: ' + slug);
        assert.ok(article.includes('href="' + countryHref + '"'), 'Review must link back to issuing country: ' + slug);
        if (country === 'ca') {
          assert.ok(article.includes('cps.ca/en/documents/position/'), 'CPS original source missing: ' + slug);
          assert.ok(article.includes('Паспорт документа'), 'Document passport missing: ' + slug);
          assert.ok(article.includes('Казахстан'), 'National applicability warning missing: ' + slug);
        }
      }
    }
  }
  if (locale === 'ru') {
    const documents = [
      { code: 'CG128', slug: 'nice-cg128-diagnostika-autizma-u-detej', phrase: 'Скрининг не равен диагнозу', graphic: 'professional-nice-cg128.svg' },
      { code: 'CG170', slug: 'nice-cg170-podderzhka-detej-i-podrostkov', phrase: 'Адаптация среды и процессов помощи', graphic: 'professional-nice-cg170.svg' },
      { code: 'CG142', slug: 'nice-cg142-diagnostika-i-podderzhka-vzroslyh', phrase: 'AQ-10', graphic: 'professional-nice-cg142.svg' },
    ];
    for (const document of documents) {
      const content = await readFile(path.resolve('dist/kz/ru/professionals', document.slug, 'index.html'), 'utf8');
      assert.ok(content.includes(document.code), document.code + ' number missing');
      assert.ok(content.includes(document.phrase), document.code + ' content missing: ' + document.phrase);
      assert.ok(content.includes(document.graphic), document.code + ' illustration missing');
      assert.ok(content.includes('Казахстан'), document.code + ' local applicability missing');
    }
  }
  const subgroupLabels = locale === 'ru'
    ? ['Основы работы с рекомендациями', 'Международные клинические руководства: по странам', 'Документы Казахстана: клинические протоколы, законы, приказы и стандарты']
    : locale === 'kk'
      ? ['Ұсынымдармен жұмыс негіздері', 'Халықаралық клиникалық нұсқаулықтар: елдер бойынша', 'Қазақстан құжаттары: клиникалық хаттамалар, заңдар, бұйрықтар және стандарттар']
      : ['Working with guidelines', 'International clinical guidelines by country', 'Kazakhstan documents: clinical protocols, laws, orders and standards'];
  assert.equal((html.match(/class="professional-directory__subgroup"/g) ?? []).length, 3, locale + ': first category must have three subgroups (basics, international and unified Kazakhstan)');
  for (const label of subgroupLabels) assert.ok(html.includes(label), locale + ': missing professional subgroup: ' + label);
  const guidelinesPanel = html.split('id="professional-guidelines"')[1]?.split('id="professional-family-communication"')[0] ?? '';
  const toolsPanel = html.split('id="professional-practice-tools"')[1] ?? '';
  const multidisciplinaryLabel = locale === 'ru'
    ? 'Междисциплинарное взаимодействие и маршрутизация семьи'
    : locale === 'kk'
      ? 'Пәнаралық өзара іс-қимыл және отбасын тиісті қызметтерге бағыттау'
      : 'Multidisciplinary coordination and family referral pathways';
  assert.ok(guidelinesPanel && toolsPanel, locale + ': resource panels missing');
  assert.ok(!guidelinesPanel.includes(multidisciplinaryLabel), locale + ': coordination roadmap must not appear under standards');
  assert.ok(!guidelinesPanel.includes('professional-nice-cg128.svg'), locale + ': unrelated article assets should not appear in directory');
  assert.ok(!guidelinesPanel.includes('Клинические протоколы Казахстана</h4>'), locale + ': separate Kazakhstan clinical-protocol subgroup must not appear');
  assert.ok(toolsPanel.includes(multidisciplinaryLabel), locale + ': coordination roadmap must appear under tools');
  const introductoryLabel = locale === 'ru'
    ? 'Как работать с профессиональными рекомендациями при аутизме'
    : locale === 'kk'
      ? 'Аутизм жөніндегі кәсіби ұсынымдармен қалай жұмыс істеуге болады'
      : 'How to appraise professional autism guidelines';
  const ukLabel = locale === 'ru' ? 'Великобритания' : locale === 'kk' ? 'Ұлыбритания' : 'United Kingdom';
  assert.ok(guidelinesPanel.indexOf(introductoryLabel) < guidelinesPanel.indexOf(ukLabel) && guidelinesPanel.indexOf(introductoryLabel) !== -1,
    locale + ': introductory appraisal must remain before the country list');
  for (const name of copy.names) assert.ok(html.includes(name), locale + ': missing category ' + name);
  ids.forEach((id, i) => {
    const overviewTarget = id === 'assessment-context' ? '/central-asia-autism-hub/kz/' + locale + '/professionals/assessment/' : '#professional-' + id;
    assert.ok(html.includes('href="' + overviewTarget + '"'), locale + ': missing category target ' + id);
    assert.ok(html.includes('id="professional-' + id + '"'), locale + ': missing category destination ' + id);
    assert.ok(html.includes('href="#professional-overview"'), locale + ': missing return link');
    assert.ok(
      html.includes('>' + counts[i] + ' ' + (locale === 'en' ? 'resources' : locale === 'kk' ? 'материал' : ([11, 12, 13, 14].includes(counts[i] % 100) ? 'материалов' : counts[i] % 10 === 1 ? 'материал' : [2, 3, 4].includes(counts[i] % 10) ? 'материала' : 'материалов')) + '<'),
      locale + ': category count not visible for ' + id,
    );
  });
  assert.ok(!html.includes('href="undefined"'), locale + ': invalid href');
  assert.ok(!html.includes('href="/kz/'), locale + ': unprefixed locale path');
  const base = '/central-asia-autism-hub/kz/' + locale + '/professionals/kazakhstan-documents/';
  const hubHref = base;
  assert.ok(html.includes('href="' + hubHref + '"'), locale + ': Kazakhstan subgroup must open five-category hub');
  assert.equal((html.match(/professional-directory__item--folder/g) ?? []).length, 7, locale + ': expected six international country folders and one Kazakhstan catalogue');
  assert.ok(!html.includes('Правовые требования к психологической деятельности в Казахстане'), locale + ': old Kazakhstan placeholder remains on professional landing');

  const hub = await readFile(path.resolve('dist/kz', locale, 'professionals/kazakhstan-documents/index.html'), 'utf8');
  assert.equal((hub.match(/class="kz-documents__card"/g) ?? []).length, 5, locale + ': expected five Kazakhstan document categories');
  assert.ok(hub.includes('<strong>25</strong>'), locale + ': roadmap must state 25 planned documents');
  const kazakhDocumentPublicationCount = locale === 'ru' ? 25 : 0;
  assert.ok(hub.includes('Опубликовано: <strong>' + kazakhDocumentPublicationCount + '</strong>') ||
    hub.includes((locale === 'en' ? 'Published' : locale === 'kk' ? 'Жарияланғаны' : 'Опубликовано') + ': <strong>' + kazakhDocumentPublicationCount + '</strong>'),
    locale + ': published Kazakhstan article count is incorrect');
  const categoryData = [
    ['education-support', 8],
    ['healthcare-diagnosis', 5],
    ['psychological-practice', 3],
    ['social-support', 5],
    ['rights-and-data', 4],
  ];
  for (const [category, expectedCount] of categoryData) {
    const href = base + category + '/';
    assert.ok(hub.includes('href="' + href + '"'), locale + ': missing category link: ' + category);
    const categoryHtml = await readFile(path.resolve('dist/kz', locale, 'professionals/kazakhstan-documents', category, 'index.html'), 'utf8');
    assert.ok(categoryHtml.includes('href="' + hubHref + '"'), locale + ': missing back-to-categories link: ' + category);
    assert.equal((categoryHtml.match(/class="kz-documents__entry"/g) ?? []).length, expectedCount, locale + ': incorrect document count for ' + category);
    const publishedHere = locale === 'ru' ? (category === 'education-support' ? 8 : category === 'healthcare-diagnosis' ? 5 : category === 'psychological-practice' ? 3 : category === 'social-support' ? 5 : category === 'rights-and-data' ? 4 : 0) : 0;
    assert.equal((categoryHtml.match(/class="kz-documents__status"/g) ?? []).length, expectedCount - publishedHere, locale + ': unpublished document statuses incorrect for ' + category);
    assert.equal((categoryHtml.match(/class="kz-documents__article-link"/g) ?? []).length, publishedHere, locale + ': published documents must link to real articles only for ' + category);
    assert.ok(!categoryHtml.includes('href="undefined"'), locale + ': undefined link in ' + category);
  }
  if (locale === 'ru') {
    const publishedDocs = [
      ['education-law', 'zakon-ob-obrazovanii-prava-i-specialnye-usloviya', 'Статья 8'],
      ['education-needs-order-4', 'prikaz-4-ocenka-osobyh-obrazovatelnyh-potrebnostej', 'Этапы оценки'],
      ['school-support-order-92', 'prikaz-92-sluzhba-psihologo-pedagogicheskogo-soprovozhdeniya', 'Алгоритм работы'],
      ['special-support-standard-117', 'prikaz-117-standart-specialnoj-podderzhki', 'Комплекс услуг'],
      ['education-organisations-order-385', 'prikaz-385-tipovye-pravila-organizacij-obrazovaniya', 'Роль ПМПК'],
      ['pmpk-services-rules', 'gosusluga-pmpk-pravila-obrashcheniya-i-rezultat', '30 календарных дней'],
      ['psychological-support-centres-264', 'prikaz-264-centry-psihologicheskoj-podderzhki', 'Основные задачи'],
      ['special-support-state-order-532', 'prikaz-532-gosudarstvennyj-zakaz-specialnoj-podderzhki', 'Кто участвует в процедуре'],
    ];
    const educationPage = await readFile(path.resolve('dist/kz/ru/professionals/kazakhstan-documents/education-support/index.html'), 'utf8');
    for (const [id, slug, phrase] of publishedDocs) {
      const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
      assert.ok(educationPage.includes('href="' + href + '"'), 'Published legal document missing category link: ' + id);
      assert.ok(!html.includes('href="' + href + '"'), 'Published Kazakhstan legal document must not appear in unrelated top-level list: ' + id);
      const article = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
      assert.ok(article.includes('kz-education-' + id + '.svg'), id + ': topic-fit hero image missing');
      assert.ok(article.includes('adilet.zan.kz'), id + ': official legislative primary source missing');
      assert.ok(article.includes(phrase), id + ': main editorial content missing');
      assert.ok(article.includes('Паспорт документа'), id + ': primary legal document passport missing');
    }
  }
  if (locale === 'ru') {
    const healthcare = await readFile(path.resolve('dist/kz/ru/professionals/kazakhstan-documents/healthcare-diagnosis/index.html'), 'utf8');
    const healthcareDocs = [
      ['health-code-360', 'kodeks-o-zdorove-naroda-prava-pacientov', 'Права ребёнка и пациента', 'adilet.zan.kz'],
      ['paediatric-care-standard-11', 'standart-pediatricheskoj-pomoshchi-m-chat-r', 'M-CHAT-R', 'adilet.zan.kz'],
      ['mental-health-standard-224', 'standart-psihicheskogo-zdorovya-marshrutizaciya', 'Маршрутизация и компетенция', 'adilet.zan.kz'],
      ['preventive-examinations-264', 'profilakticheskie-medosmotry-detej-prikaz-264-2026', '17 августа 2026', 'adilet.zan.kz'],
      ['autism-clinical-protocol', 'klinicheskij-protokol-ras-2021-kazahstan', 'официальный', 'medelement.com'],
    ];
    for (const [id, slug, phrase, sourceDomain] of healthcareDocs) {
      const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
      assert.ok(healthcare.includes('href="' + href + '"'), id + ': healthcare category must link published article');
      assert.ok(!html.includes('href="' + href + '"'), id + ': Kazakhstan documents, including clinical protocols, must be linked only inside the unified catalogue');
      const page = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
      assert.ok(page.includes('kz-healthcare-' + id + '.svg'), id + ': hero illustration absent');
      assert.ok(page.includes('Паспорт документа'), id + ': document passport absent');
      assert.ok(page.includes(sourceDomain), id + ': source absent');
      assert.ok(page.includes(phrase), id + ': key topic absent');
      if (id === 'autism-clinical-protocol') {
        assert.ok(page.includes('не подтверждён'), 'Clinical protocol must not be presented as definitively in force');
        assert.ok(page.includes('2015'), 'Clinical protocol must explain superseded archive version');
      }
    }
  }
  if (locale === 'ru') {
    const list = await readFile(path.resolve('dist/kz/ru/professionals/kazakhstan-documents/psychological-practice/index.html'), 'utf8');
    const published = [
      ['psychological-activity-law-332', 'zakon-o-psihologicheskoj-deyatelnosti-332-2026', '2028'],
      ['teacher-qualifications-order-338', 'prikaz-338-kvalifikacionnye-trebovaniya-k-pedagogam', 'Педагог-психолог'],
      ['teacher-status-law-293', 'zakon-o-statuse-pedagoga-prava-i-obyazannosti', 'Статья 6'],
    ];
    for (const [id, slug, phrase] of published) {
      const url = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
      assert.ok(list.includes('href="' + url + '"'), id + ': missing category article link');
      const page = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
      assert.ok(page.includes('kz-psychology-' + id + '.svg'), id + ': missing image');
      assert.ok(page.includes('Паспорт документа'), id + ': missing passport');
      assert.ok(page.includes('adilet.zan.kz'), id + ': missing legal source');
      assert.ok(page.includes(phrase), id + ': missing essential legal point');
    }
  }
  if (locale === 'ru') {
    const catalog = await readFile(path.resolve('dist/kz/ru/professionals/kazakhstan-documents/social-support/index.html'), 'utf8');
    const socialDocs = [
      ['child-correction-support-law-343', 'zakon-343-socialnaya-mediko-pedagogicheskaya-podderzhka', 'Статья 3', 'Z020000343_'],
      ['social-code-224', 'socialnyj-kodeks-specialnye-socialnye-uslugi', 'Статья 132', 'K2300000224'],
      ['disability-assessment-order-260', 'prikaz-260-mediko-socialnaya-ekspertiza-invalidnost', '25 августа 2026', 'V2300032922'],
      ['social-service-joint-order', 'sovmestnyj-prikaz-49-54-7-standarty-socialnoj-podderzhki', '34117', 'V2400034117'],
      ['special-social-services-order-165', 'prikaz-165-specialnye-socialnye-uslugi-obrazovanie', 'приложения 1', 'V2300032760'],
    ];
    for (const [id, slug, check, officialId] of socialDocs) {
      const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
      assert.ok(catalog.includes('href="' + href + '"'), id + ': published review not linked from social support');
      assert.ok(!html.includes('href="' + href + '"'), id + ': review should not be duplicated in top-level guidelines');
      const article = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
      assert.ok(article.includes('kz-social-' + id + '.svg'), id + ': distinct illustration missing');
      assert.ok(article.includes('Паспорт документа'), id + ': document passport missing');
      assert.ok(article.includes(officialId), id + ': official Adilet reference missing');
      assert.ok(article.includes(check), id + ': expected concrete editorial detail absent');
    }
  }
  if (locale === 'ru') {
    const list = await readFile(path.resolve('dist/kz/ru/professionals/kazakhstan-documents/rights-and-data/index.html'), 'utf8');
    const reviews = [
      ['children-rights-law-345', 'zakon-345-prava-rebenka-obrazovanie-invalidnost', 'Статья 15', 'Z020000345_'],
      ['personal-data-law-94', 'zakon-94-personalnye-dannye-detej-konfidencialnost', 'Статья 19-1', 'Z1300000094'],
      ['disability-convention-ratification-288', 'konvenciya-o-pravah-invalidov-kazahstan-ratifikaciya', 'Статья 24', 'Z1500000288'],
      ['inclusion-policy-2025-2030', 'koncepciya-inklyuzivnoj-politiki-kazahstan-2025-2030', '2030', 'P2400001143'],
    ];
    for (const [id, slug, phrase, documentId] of reviews) {
      const href = '/central-asia-autism-hub/kz/ru/professionals/' + slug + '/';
      assert.ok(list.includes('href="' + href + '"'), id + ': missing rights-category article link');
      assert.ok(!html.includes('href="' + href + '"'), id + ': article must not be duplicated in the top-level guidelines');
      const article = await readFile(path.resolve('dist/kz/ru/professionals', slug, 'index.html'), 'utf8');
      assert.ok(article.includes('kz-rights-' + id + '.svg'), id + ': dedicated editorial illustration missing');
      assert.ok(article.includes('Паспорт документа'), id + ': document passport missing');
      assert.ok(article.includes('adilet.zan.kz'), id + ': official Adilet source missing');
      assert.ok(article.includes(documentId), id + ': primary legal document ID missing');
      assert.ok(article.includes(phrase), id + ': key article-specific detail missing');
    }
    const policy = await readFile(path.resolve('dist/kz/ru/professionals/koncepciya-inklyuzivnoj-politiki-kazahstan-2025-2030/index.html'), 'utf8');
    assert.ok(policy.includes('плановыми целями') || policy.includes('плановых целей') || policy.includes('плановые цели'), 'Inclusion concept must clearly label planned rather than achieved indicators');
  }
  console.log('Professional directory ' + locale + ': 6 directions, 5 Kazakhstan categories, 25 planned documents and ' + kazakhDocumentPublicationCount + ' locally published reviews.');
}