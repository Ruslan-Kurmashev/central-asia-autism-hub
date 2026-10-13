import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const base = '/central-asia-autism-hub/kz/';
const locales = ['ru', 'kk', 'en'];
const sections = ['parents','research','help-kazakhstan','learning','professionals','about'];
const subtitles = {
  ru: 'Часть инициативы Central Asia Autism Hub',
  kk: 'Central Asia Autism Hub бастамасының бөлігі',
  en: 'Part of the Central Asia Autism Hub',
};
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

for (const lang of locales) {
  const filename = path.join(dist, 'kz', lang, 'index.html');
  const html = await readFile(filename, 'utf8');
  const id = 'homepage ' + lang;
  check(html.includes('<html lang="' + lang + '"'), id + ': HTML document language incorrect');
  check(html.includes('home-v2__hero') && html.includes('home-v2__masonry'),
    id + ': homepage hero or featured grid missing');
  check(html.includes(subtitles[lang]), id + ': brand affiliation is not localised');
  check(html.includes('href="' + base + lang + '/parents/#autism-basics"'),
    id + ': start-here action missing or not base-path safe');
  check(html.includes('alt=') && html.includes('hero-family.webp'), id + ': hero image missing');

  for (const locale of locales) {
    check(html.includes('href="' + base + locale + '/"'),
      id + ': language switcher is missing ' + locale);
  }
  for (const section of sections) {
    check(html.includes('href="' + base + lang + '/' + section + '/"'),
      id + ': primary section link missing: ' + section);
    const sectionPage = path.join(dist, 'kz', lang, section, 'index.html');
    const sectionHtml = await readFile(sectionPage, 'utf8');
    check(sectionHtml.includes('href="' + base + lang + '/"'),
      lang + '/' + section + ': missing local home link');
    check(sectionHtml.includes('<html lang="' + lang + '"'),
      lang + '/' + section + ': page language does not match URL');
  }

  const cards = [...html.matchAll(/<article\b[^>]*\bclass="[^"]*\bhome-v2__card--article\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0]);
  check(cards.length === 9, id + ': expected nine actual published resources, got ' + cards.length);
  check(cards.every(card => !card.includes(base + lang + '/professionals/')),
    id + ': professional articles should not crowd out family-first highlights');
  check(cards[0]?.includes(base + lang + '/parents/'),
    id + ': first featured resource must be from the parent information section');
  check(cards.some(card => card.includes(base + lang + '/help-kazakhstan/')),
    id + ': Kazakhstan support must be represented on the homepage');
  if (lang === 'ru') {
    check(cards.some(card => card.includes(base + lang + '/research/')),
      id + ': published research explainers are omitted from the homepage');
    check(cards.some(card => card.includes('images/editorial/research-lab.jpg')),
      id + ': missing locally hosted research editorial image');
  }

  for (const anchor of ['editorial', 'privacy', 'accessibility', 'contact']) {
    check(html.includes('href="' + base + lang + '/about/#' + anchor + '"'),
      id + ': footer policy anchor missing: ' + anchor);
  }
}

const rusResearch = path.join(dist, 'kz', 'ru', 'research');
const slug = (await readdir(rusResearch, { withFileTypes: true }))
  .find(entry => entry.isDirectory())?.name;
assert.ok(slug, 'At least one published Russian research article is required');
const article = await readFile(path.join(rusResearch, slug, 'index.html'), 'utf8');
check(article.includes('data-translation-missing'), 'Russian research: missing translation state must be disclosed');
for (const target of ['kk','en']) {
  check(article.includes('href="' + base + target + '/research/"'),
    'Russian research: missing translation must link to ' + target + ' research section');
}

const css = await readFile('src/styles/home-v2.css', 'utf8');
const main = await readFile('src/styles/global.css', 'utf8');
check(css.includes('@media (max-width: 42rem)') && css.includes('@media (max-width: 56rem)'),
  'Homepage responsive mobile breakpoints missing');
check(main.includes('@media (max-width: 56rem)') && main.includes('.nav-disclosure__summary'),
  'Mobile primary navigation is not implemented');
check(css.includes('.home-v2__card:focus-within'), 'Keyboard focus not visible on full featured card');
check(!css.includes('-webkit-line-clamp: 3;'), 'Homepage editorial summaries are truncated');

function lum(hex) {
  const rgb = hex.match(/[0-9a-f]{2}/gi)?.map(v => parseInt(v, 16) / 255);
  if (!rgb || rgb.length !== 3) throw new Error('Invalid RGB hex: ' + hex);
  return rgb.map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const values = [lum(a), lum(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const homeMuted = css.match(/--home-muted:\s*(#[0-9a-f]{6})\s*;/i)?.[1];
check(Boolean(homeMuted), 'Missing shared homepage secondary text color');
if (homeMuted) {
  for (const background of ['#ffffff', '#f1f7fb']) {
    check(contrast(homeMuted, background) >= 4.5,
      'Homepage secondary text has less than 4.5:1 contrast on ' + background);
  }
}
if (errors.length) {
  console.error('Prelaunch navigation and homepage audit FAILED:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Prelaunch navigation QA passed: 3 language-specific homepages, 18 section routes, 27 family-first featured cards, footer anchors, missing-translation routing, image labels, focus and >=4.5:1 secondary-text contrast.');
}
