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
    for (const match of sidebar.matchAll(/<a\s+href="#([^"]+)"/g)) {
      const id = match[1];
      assert.ok(id && html.includes('id="' + id + '"'),
        relative + ': TOC anchor has no matching destination #' + id);
      chapterLinks++;
    }
    results[locale]++;
  }
}

for (const locale of locales) {
  await visit(path.join(root, locale), locale);
  assert.ok(results[locale] > 0, locale + ': no published one-page articles tested');
}
assert.ok(chapterLinks > 50, 'too few linked chapter headings in built articles');

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
