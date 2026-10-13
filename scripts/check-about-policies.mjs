import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Validate all published About/Policy pages after the Astro build.
// Checks bilingual/trilingual navigation and claims, not legal compliance.
const locales = ['ru', 'kk', 'en'];
const ids = ['mission', 'editorial', 'evidence-safety', 'privacy', 'accessibility', 'contact'];
const policies = [
  '01-brand-architecture.md',
  '04-editorial-evidence-medical-safety.md',
  '05-privacy-and-data.md',
  '06-design-and-accessibility.md',
];
const expected = {
  ru: { heading: 'О проекте', navigation: 'Разделы страницы', issue: 'Сообщить об ошибке через GitHub' },
  kk: { heading: 'Жоба туралы', navigation: 'Бет бөлімдері', issue: 'GitHub арқылы қате туралы хабарлау' },
  en: { heading: 'About', navigation: 'On this page', issue: 'Report an issue on GitHub' },
};
const docs = 'https://github.com/Ruslan-Kurmashev/central-asia-autism-hub/blob/main/docs/';
const errors = [];
for (const locale of locales) {
  const id = locale + '/about';
  const page = await readFile(path.join('dist', 'kz', locale, 'about', 'policies', 'index.html'), 'utf8');
  const inspect = (predicate, description) => {
    if (!predicate) errors.push(id + ': ' + description);
  };
  const overview = await readFile(path.join('dist', 'kz', locale, 'about', 'index.html'), 'utf8');
  inspect(overview.includes(expected[locale].heading), 'missing localized About label');
  inspect((overview.match(/<h1\b/g) || []).length === 1, 'expected one About H1');
  inspect(overview.includes('about-overview__hero') && overview.includes('about-overview__offer-grid'), 'compact public overview missing');
  inspect(!overview.includes('about-policies__grid'), 'full policies must not crowd the About overview');
  inspect(!overview.includes('Что уже сделано и куда мы движемся'), 'removed results section resurfaced');
  for (const segment of ['team', 'experts', 'contact']) {
    inspect(overview.includes('/about/' + segment + '/'), 'missing about navigation to ' + segment);
  }
  inspect(overview.includes('/about/policies/#editorial'), 'editorial policy link missing from overview');
  inspect((page.match(/<h1\b/g) || []).length === 1, 'expected one semantic H1');
  inspect(page.includes('about-section-body'), 'policy page section-scoped typography missing');
  inspect(page.includes('class="about-policies__navigation"'), 'in-page policy navigation missing');
  inspect(page.includes(expected[locale].navigation), 'navigation name is not localized');
  inspect((page.match(/class="about-policies__item"/g) || []).length === ids.length, 'six policies must appear');
  for (const anchor of ids) {
    inspect(page.includes('id="' + anchor + '"'), 'missing policy section #' + anchor);
    inspect(page.includes('href="#' + anchor + '"'), 'missing quick-link #' + anchor);
  }
  inspect(page.includes('Central Asia Autism Hub') &&
    page.includes('Autism Hub Kazakhstan') &&
    page.includes('Autism School Kazakhstan'),
    'three-level brand architecture incomplete');
  inspect(page.includes('GitHub Pages') && page.includes('IP'), 'GitHub Pages technical data processing is not disclosed');
  inspect(page.includes('WCAG 2.2 AA'), 'accessibility target missing');
  inspect(page.includes('https://github.com/Ruslan-Kurmashev/central-asia-autism-hub/issues/new'),
    'correction issue link missing');
  inspect(page.includes(expected[locale].issue), 'error-reporting link label not translated');
  for (const doc of policies) {
    inspect(page.includes(docs + doc), 'source policy link absent: ' + doc);
  }
  inspect(!page.includes('href="/kz/'), 'base-path-unaware internal link');
}

const component = await readFile('src/components/AboutPolicies.astro', 'utf8');
assert.ok(!component.includes('target="_blank"'), 'About page should not force new tabs');
assert.ok(!component.includes('\u2014'), 'Em dash violates project typography policy');
if (errors.length) {
  console.error('About and policy QA failed:\n' + errors.map(line => ' - ' + line).join('\n'));
  process.exitCode = 1;
} else {
  console.log('About QA passed: 3 compact overviews and separate policies, 6 policy sections per language, source links and navigation.');
}
