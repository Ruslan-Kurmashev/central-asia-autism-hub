import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const base = '/central-asia-autism-hub/kz/';
const locales = ['ru', 'kk', 'en'];
const expectedHomeHeadlineLines = {
  ru: ['Все об аутизме,', 'когда понимание открывает возможности'],
  kk: ['Аутизм туралы бәрі,', 'түсіну мүмкіндіктерге жол ашқанда'],
  en: ['All about autism,', 'when understanding opens up possibilities'],
};
const sections = ['parents','research','help-kazakhstan','learning','professionals','about'];
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const expectedMainNavigation = {
  ru: ['Главная', 'Родителям', 'Наука простыми словами', 'Помощь в Казахстане', 'Обучение', 'Специалистам', 'О проекте'],
  kk: ['Басты бет', 'Ата-аналарға', 'Ғылым қарапайым тілмен', 'Қазақстандағы көмек', 'Оқу', 'Мамандарға', 'Жоба туралы'],
  en: ['Home', 'For Parents', 'Research Explained', 'Help in Kazakhstan', 'Learning', 'For Professionals', 'About'],
};

function checkLocalizedHeader(html, lang, id) {
  const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)?.[0] ?? '';
  const navigation = header.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const languages = header.match(/<nav class="language-switcher"[\s\S]*?<\/nav>/)?.[0] ?? '';
  check(Boolean(header) && header.includes('Autism Hub Kazakhstan'),
    id + ': shared site header or brand is missing');
  for (const label of expectedMainNavigation[lang]) {
    check(navigation.includes(label), id + ': main navigation translation missing: ' + label);
  }
  const firstNavigationLink = navigation.match(/<ul>\s*<li>\s*<a\s+([^>]+)>\s*([^<]+?)\s*<\/a>/)?.slice(1) ?? [];
  const firstAttributes = firstNavigationLink[0] ?? '';
  const firstLabel = (firstNavigationLink[1] ?? '').trim();
  check(firstAttributes.includes('href="' + base + lang + '/"') &&
    firstLabel === expectedMainNavigation[lang][0],
    id + ': the first header tab must link to its language-specific homepage');
  const homeIsActive = id === 'homepage ' + lang;
  check(firstAttributes.includes('aria-current="page"') === homeIsActive,
    id + ': Home tab must be active only on the homepage');
  for (const target of locales) {
    check(new RegExp('href="' + base + target + '/[^"]*"').test(languages),
      id + ': language switcher missing locale-specific destination for ' + target);
  }
  check(new RegExp('<a[^>]*lang="' + lang + '"[^>]*aria-current="page"').test(languages),
    id + ': language switcher does not mark the active locale');
}

for (const lang of locales) {
  const filename = path.join(dist, 'kz', lang, 'index.html');
  const html = await readFile(filename, 'utf8');
  const id = 'homepage ' + lang;
  checkLocalizedHeader(html, lang, id);
  check(html.includes('<html lang="' + lang + '"'), id + ': HTML document language incorrect');
  check(html.includes('home-v2__hero') && html.includes('home-v2__masonry'),
    id + ': homepage hero or featured grid missing');
  check(!html.includes('home-v2__topicbar'), id + ': duplicate homepage navigation must not be rendered');
  check(html.includes('class="primary-nav"'), id + ': primary header navigation must remain');
  const heroHeading = html.match(/<h1 id="home-v2-title">([\s\S]*?)<\/h1>/)?.[1] ?? '';
  const actualHeadlineLines = [...heroHeading.matchAll(/<span class="home-v2__hero-title-line(?: home-v2__hero-title-line--supporting)?">([^<]*)<\/span>/g)]
    .map((match) => match[1]);
  check(JSON.stringify(actualHeadlineLines) === JSON.stringify(expectedHomeHeadlineLines[lang]),
    id + ': approved slogan must render as two separate lines without a dash');
  check(html.includes('id="announcements"') &&
    html.includes('id="materials"') &&
    html.indexOf('id="announcements"') < html.indexOf('id="materials"'),
    id + ': events must appear above the site update feed');
  const eventCards = [...html.matchAll(/<article\b[^>]*class="home-v2__event"[^>]*data-event-kind=/g)];
  const todayInKazakhstan = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Almaty', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const expectedEvents = [
    ['2026-10-19', 'beyim.edu.kz', 'beyim-preschool-user-photo.webp'],
    ['2026-10-27', 'tamyrplatform.com', 'group-18739.png'],
    ['2026-10-30', 'conference-satr.kz', 'satr-logo.svg'],
  ].filter(([expires]) => expires >= todayInKazakhstan);
  check(eventCards.length === expectedEvents.length,
    id + ': expected ' + expectedEvents.length + ' valid unexpired events, found ' + eventCards.length);
  for (const [, organiserDomain, imageFilename] of expectedEvents) {
    check(html.includes(organiserDomain) && html.includes(imageFilename),
      id + ': missing correct event source or relevant visual ' + imageFilename);
  }
  check((html.match(/class="home-v2__event-media(?: home-v2__event-media--(?:brand|logo))?"/g) || []).length === expectedEvents.length,
    id + ': each live event must have a distinct image with an alt description');
  if (expectedEvents.some(([, domain]) => domain === 'conference-satr.kz')) {
    check(html.includes('home-v2__event-media--logo'), id + ': SATR logo must be fully visible, not cropped as a stock photo');
  }
  check(html.includes('home-v2__events-empty'), id + ': empty state must remain available after expiry');
  check(html.includes('home-v2__materials-description'), id + ': update section intro missing');
  const brand = html.match(/<a\b[^>]*class="brand"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  check(brand.includes('Autism Hub Kazakhstan'), id + ': site name missing from header');
  check(!brand.includes('brand__parent') && !brand.includes('Central Asia Autism Hub'),
    id + ': header must show only the Autism Hub Kazakhstan name');
  check(html.includes('href="' + base + lang + '/parents/#autism-basics"'),
    id + ': start-here action missing or not base-path safe');
  check(html.includes('alt=') && html.includes('hero-family.webp'), id + ': hero image missing');
  for (const page of ['about/team', 'about/experts', 'about/contact']) {
    check(html.includes('href="' + base + lang + '/' + page + '/"'), id + ': About submenu link missing: ' + page);
  }

  for (const locale of locales) {
    check(html.includes('href="' + base + locale + '/"'),
      id + ': language switcher is missing ' + locale);
  }
  for (const section of sections) {
    check(html.includes('href="' + base + lang + '/' + section + '/"'),
      id + ': primary section link missing: ' + section);
    const sectionPage = path.join(dist, 'kz', lang, section, 'index.html');
    const sectionHtml = await readFile(sectionPage, 'utf8');
    checkLocalizedHeader(sectionHtml, lang, lang + '/' + section);
    check(sectionHtml.includes('href="' + base + lang + '/"'),
      lang + '/' + section + ': missing local home link');
    check(sectionHtml.includes('<html lang="' + lang + '"'),
      lang + '/' + section + ': page language does not match URL');
  }

  const cards = [...html.matchAll(/<article\b[^>]*\bclass="[^"]*\bhome-v2__card--article\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0]);
  check(cards.length === 6, id + ': expected six recent site articles, got ' + cards.length);
  check(!html.includes('home-v2__card--statement') &&
    !html.includes('home-v2__card--principles'),
    id + ': redundant informational cards must not reappear on homepage');
  check(cards.filter(card => card.includes(base + lang + '/professionals/')).length <= 1,
    id + ': professional documents should not dominate the homepage');
  if (lang === 'ru') {
    const referralCard = cards.find(card => card.includes('rannee-vyyavlenie-autizma-marshrut-specialista'));
    if (referralCard) check(referralCard.includes('professional-early-referral-family-consultation.jpg'),
      id + ': early referral article needs its consultation photograph, not the diagram cover');
  }
  check(cards.some(card => card.includes(base + lang + '/parents/')),
    id + ': latest feed must contain a parent information article');
  if (lang === 'ru') {
    const meltdownCard = cards.find(card => card.includes('/meltdaun-i-shatdaun-pri-autizme/'));
    if (meltdownCard) check(meltdownCard.includes('parent-meltdown-overload-covering-ear.jpg'),
      id + ': meltdown article latest card must use the sound-discomfort cover');
    const meltdownPage = await readFile(
      path.join(dist, 'kz', lang, 'parents', 'meltdaun-i-shatdaun-pri-autizme', 'index.html'), 'utf8');
    check(meltdownPage.includes('parent-meltdown-overload-covering-ear.jpg'),
      id + ': meltdown article must use its new sound-discomfort cover');
  }
  if (lang === 'ru') {
    const communicationCard = cards.find(card => card.includes('/kak-autichnye-deti-obshchayutsya/'));
    if (communicationCard) check(communicationCard.includes('parent-communication-drawings-family.jpg'),
      id + ': communication article should have its specific family drawing cover');
    const communicationArticleHtml = await readFile(
      path.join(dist, 'kz', lang, 'parents', 'kak-autichnye-deti-obshchayutsya', 'index.html'), 'utf8');
    check(communicationArticleHtml.includes('parent-communication-drawings-family.jpg'),
      id + ': published communication article cover is not updated');
  }
  check(cards.some(card => card.includes(base + lang + '/help-kazakhstan/')),
    id + ': Kazakhstan support must be represented on the homepage');
  if (lang === 'ru') {
    check(cards.some(card => card.includes(base + lang + '/research/')),
      id + ': published research explainers are omitted from the homepage');
    const researchCards = cards.filter(card => card.includes(base + lang + '/research/'));
    check(researchCards.length === 1, id + ': expected one scientific update');
    check(researchCards.every(card => card.includes('images/editorial/photos/research-')),
      id + ': research highlights must use locally hosted, topic-specific photographs');
    const images = researchCards.map(card => card.match(/src="([^"]*\/images\/editorial\/photos\/research-[^"]+\.jpg)"/)?.[1]);
    check(images.every(Boolean) && new Set(images).size === researchCards.length,
      id + ': research highlights must not share the same image');
  }

  for (const anchor of ['editorial', 'privacy', 'accessibility']) {
    check(html.includes('href="' + base + lang + '/about/policies/#' + anchor + '"'),
      id + ': footer policy link missing: ' + anchor);
  }
  check(html.includes('href="' + base + lang + '/about/contact/"'), id + ': contact link missing');
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
check(main.includes('body:not(.home-v2) .site-header {') &&
  main.includes('background: linear-gradient(90deg, #294960'),
  'Localized content pages must use the shared dark blue header');
const header = await readFile('src/components/SiteHeader.astro', 'utf8');
check(css.includes('@media (max-width: 42rem)') && css.includes('@media (max-width: 56rem)'),
  'Homepage responsive mobile breakpoints missing');
check(main.includes('@media (max-width: 56rem)') && main.includes('.nav-disclosure__summary'),
  'Mobile primary navigation is not implemented');
check(css.includes('.home-v2__card:focus-within'), 'Keyboard focus not visible on full featured card');
check(main.includes('width: min(calc(100% - 2.5rem), 94rem)') &&
  main.includes('flex-wrap: nowrap'), 'Desktop navigation must have a wide, non-wrapping header');
check(main.includes('@media (min-width: 56.001rem) and (max-width: 80rem)') &&
  main.includes('@media (max-width: 80rem)'), 'Compact navigation breakpoint missing');
check(header.includes("window.matchMedia('(max-width: 80rem)')") &&
  header.includes("window.matchMedia('(min-width: 80.001rem)"), 'Header CSS and JS navigation breakpoints differ');
check(css.includes('.home-v2 .primary-nav .primary-nav__submenu a') &&
  css.includes('color: var(--home-blue-deep);'), 'Homepage About menu must use dark text on white');
check(css.includes('.home-v2 .primary-nav__dropdown > summary') &&
  css.includes('color: rgb(255 255 255 / 90%);'), 'About trigger must be readable in the dark header');
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
  console.log('Prelaunch navigation QA passed: 3 language-specific homepages, 18 section routes, 18 balanced recent article cards, footer anchors, missing-translation routing, image labels, focus and >=4.5:1 secondary-text contrast.');
}
