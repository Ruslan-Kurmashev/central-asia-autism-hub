/**
 * Static acceptance checks for the shared one-page long-form article navigation.
 * Scope: all built, locale-specific article pages (not course/listing pages).
 * Interactive scrolling still needs a separate real-browser visual pass.
 */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const locales = ['ru', 'kk', 'en'];
const root = path.resolve('dist/kz');
const results = Object.fromEntries(locales.map((locale) => [locale, 0]));
let chapterLinks = 0;
let skillLossGuideChecked = false;

async function visit(directory, locale) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, item.name);
    if (item.isDirectory()) { await visit(target, locale); continue; }
    if (!item.isFile() || item.name !== 'index.html') continue;
    const html = await readFile(target, 'utf8');
    if (!html.includes('article-v2__page')) continue;
    const relative = path.relative(root, target);
    assert.ok(html.includes('article-v2__sidebar'), relative + ': no table of contents sidebar');
    assert.ok(html.includes('article-v2__toc-panel'), relative + ': no desktop/mobile TOC panel');
    assert.ok(html.includes('article-v2__toc-progress') || html.includes('article-v2__toc-empty'),
      relative + ': current section indicator / empty state missing');
    assert.ok(html.includes('article-v2__body'), relative + ': article body missing');
    assert.ok(!html.includes('data-article-next-chapter'), relative + ': unexpected forced pagination');
    const sidebar = html.match(/<aside class="article-v2__sidebar"[^>]*>([\s\S]*?)<\/aside>/)?.[1] ?? '';
    const tocLinks = [...sidebar.matchAll(/<a\s+href="#([^"]+)"/g)];
    const h2Ids = new Set([...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
    for (const match of tocLinks) {
      const id = match[1];
      assert.ok(h2Ids.has(id),
        relative + ': navigation must link to a top-level H2 section, not a nested H3: #' + id);
      chapterLinks++;
    }
    const shownTotal = sidebar.match(/data-toc-current[^>]*>[\s\S]*?<\/span>\s*\/\s*(\d+)/)?.[1];
    if (tocLinks.length > 0) {
      assert.ok(shownTotal, relative + ': section progress total is missing');
      assert.equal(Number(shownTotal), tocLinks.length,
        relative + ': section progress total must equal the number of main sections');
    }
    if (locale === 'ru' && relative.includes('rebenok-perestal-delat-to-chto-umel-poterya-navykov/')) {
      assert.equal(tocLinks.length, 13,
        'Skill-loss guide must show exactly 13 numbered chapters, excluding 11 H3s and the summary');
      skillLossGuideChecked = true;
    }
    results[locale]++;
  }
}

for (const locale of locales) {
  await visit(path.join(root, locale), locale);
  assert.ok(results[locale] > 0, locale + ': no published one-page articles tested');
}
assert.ok(chapterLinks > 50, 'too few linked chapter headings in built articles');
assert.ok(skillLossGuideChecked, 'the Russian skill-loss article must be included in navigation QA');

const css = await readFile('src/styles/article-v2.css', 'utf8');
const layout = await readFile('src/layouts/ArticleLayout.astro', 'utf8');
assert.ok(css.includes('.article-v2__sidebar {\n  position: sticky;'),
  'desktop sidebar must be sticky rather than just an inner details element');
assert.ok(css.includes('max-height: calc(100dvh'), 'long navigation must remain scrollable in a small viewport');
assert.ok(css.includes("a[aria-current='location']"), 'active TOC link must have a visible style');
assert.ok(css.includes('.article-v2__toc-panel {\n    position: absolute;'),
  'mobile contents must open as an overlay without moving the article text');
assert.ok(css.includes('scroll-margin-top: var(--article-anchor-offset'),
  'anchor jumps must account for the sticky site header');
assert.ok(layout.includes("link.setAttribute('aria-current', 'location')"),
  'current chapter highlight must follow reader scroll position');
assert.ok(layout.includes("articleToc.open = false"), 'mobile TOC must close after a topic selection');
assert.ok(layout.includes("new ResizeObserver(updateOffsets)"),
  'article anchors must account for responsive site-header height');
assert.ok(layout.includes('<slot />'), 'article body must remain entirely present in one document');

console.log('One-page article navigation PASS:', results, 'articles with', chapterLinks,
  'valid in-page topic links; sticky desktop TOC, tracked active section and compact mobile menu.');


/**
 * Cross-check every published Markdown article against its rendered navigation.
 * Nested H3s, as well as unnumbered summaries after numbered chapters, must
 * not inflate the counter shown to readers.
 */
const outlineRoots = [
  'src/content/pages/kz/ru', 'src/content/pages/kz/kk',
  'src/content/pages/kz/en', 'src/content/research',
];
const outlineStats = { ru: 0, kk: 0, en: 0 };
const outlineExceptions = [];
let nestedHeadingsExcluded = 0;
let unnumberedHeadingsExcluded = 0;
let outlineLinks = 0;

const metadata = (frontmatter, key) => {
  const line = frontmatter.match(new RegExp('^' + key + ':\\s*(.*)$', 'm'))?.[1]?.trim();
  return line?.replace(/^["']|["']$/g, '') ?? '';
};

for (const directory of outlineRoots) {
  for (const file of await readdir(directory)) {
    if (!/\.mdx?$/i.test(file)) continue;
    const sourcePath = path.join(directory, file);
    const source = await readFile(sourcePath, 'utf8');
    const matter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    assert.ok(matter, sourcePath + ': missing frontmatter');
    const frontmatter = matter[1];
    if (metadata(frontmatter, 'draft') !== 'false' ||
      metadata(frontmatter, 'translationStatus') === 'pending' ||
      !metadata(frontmatter, 'publishedAt') ||
      !metadata(frontmatter, 'updatedAt')) continue;
    const language = metadata(frontmatter, 'language');
    const section = metadata(frontmatter, 'section');
    const slug = metadata(frontmatter, 'slug');
    const key = metadata(frontmatter, 'translationKey');
    assert.ok(locales.includes(language) && section && slug && key,
      sourcePath + ': missing public route metadata');

    const headings = [];
    let fenced = false;
    let fenceMark = '';
    for (const line of source.slice(matter[0].length).split(/\r?\n/)) {
      const fence = line.match(/^\s*(\x60{3,}|~{3,})/);
      if (fence) {
        if (!fenced) { fenced = true; fenceMark = fence[1][0]; }
        else if (fence[1][0] === fenceMark) fenced = false;
        continue;
      }
      if (fenced) continue;
      const hit = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/u);
      if (hit) headings.push({
        depth: hit[1].length,
        text: hit[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_\x60~]/g, ''),
      });
    }
    const main = headings.filter(h => h.depth === 2);
    const numbered = main.filter(h => /^\d+[.)]\s/u.test(h.text));
    const isContext = key === 'parents-child-context-dependent-behaviour-home-preschool';
    const isBilingual = key === 'parents-bilingual-family-speech-development';
    const expected = isContext
      ? main.filter(h => /^(?:[1-9]|1[0-4])\.\s/u.test(h.text))
      : isBilingual ? main : numbered.length >= 2 ? numbered : main;

    const htmlPath = path.join(root, language, section, slug, 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const aside = html.match(/<aside class="article-v2__sidebar"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
    assert.ok(aside, sourcePath + ': published article missing generated TOC');
    const links = [...aside.matchAll(/<a\s+href="#([^"]+)"/g)].map(m => m[1]);
    assert.equal(links.length, expected.length,
      sourcePath + ': displayed ' + links.length + ' sections, expected ' + expected.length +
      ' from main H2 headings (' + main.length + ' H2, ' +
      headings.filter(h => h.depth === 3).length + ' H3)');
    assert.equal(new Set(links).size, links.length, sourcePath + ': repeated TOC anchor');
    const total = aside.match(/data-toc-current[^>]*>[\s\S]*?<\/span>\s*\/\s*(\d+)/)?.[1];
    if (expected.length > 0) {
      assert.equal(Number(total), expected.length, sourcePath + ': displayed progress count differs');
    } else {
      assert.ok(aside.includes('article-v2__toc-empty'), sourcePath + ': empty outline is not labelled');
    }
    nestedHeadingsExcluded += headings.filter(h => h.depth === 3).length;
    unnumberedHeadingsExcluded += main.length - expected.length;
    outlineLinks += links.length;
    outlineStats[language]++;
    const omitted = main.filter(h => !expected.includes(h));
    if (omitted.length) outlineExceptions.push({
      file: sourcePath, displayed: expected.length, skipped: omitted.map(h => h.text),
    });
  }
}
assert.deepEqual(outlineStats, results,
  'source-to-built article count mismatch: some published articles were not audited');
console.log('FULL ARTICLE TOC AUDIT PASS:', JSON.stringify({
  publishedArticles: outlineStats,
  checkedLinks: outlineLinks,
  nestedH3NotCounted: nestedHeadingsExcluded,
  otherH2NotCounted: unnumberedHeadingsExcluded,
  exceptions: outlineExceptions,
}));
