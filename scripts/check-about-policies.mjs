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
  const page = await readFile(path.join('dist', 'kz', locale, 'about', 'index.html'), 'utf8');
  const inspect = (predicate, description) => {
    if (!predicate) errors.push(id + ': ' + description);
  };
  inspect(page.includes(expected[locale].heading), 'missing localized page title');
  inspect((page.match(/<h1\b/g) || []).length === 1, 'expected one semantic H1');
  inspect(page.includes('about-section-body'), 'section-scoped shared typography missing');
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
  console.log('About policy QA passed: 3 localized About pages, 6 policy sections and links each, source document links, brand architecture, privacy and accessibility claims.');
}
