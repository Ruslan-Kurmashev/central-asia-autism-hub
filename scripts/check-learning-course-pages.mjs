/** The course catalogue must never interpose a page with only copied provider metadata. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const base = '/central-asia-autism-hub/';
const locales = ['ru', 'kk', 'en'];
let catalogEntries = 0;
let onSitePages = 0;
let directExternalLinks = 0;
let checkedVideos = 0;
const byKey = new Map();

const field = (frontmatter, name) =>
  frontmatter.match(new RegExp('^' + name + ':\\s*(.*)$', 'm'))?.[1]
    ?.replace(/^["']|["']$/g, '') ?? '';

const catalogSource = await readFile(
  path.join(root, 'src/components/LearningCatalog.astro'), 'utf8');
const routeSource = await readFile(
  path.join(root, 'src/pages/kz/[lang]/learning/[slug].astro'), 'utf8');
const eligibilitySource = await readFile(path.join(root, 'src/lib/learning.ts'), 'utf8');
assert.ok(catalogSource.includes('hasOnSiteLearning(entry.data)'),
  'Course catalogue must use the shared on-site eligibility check');
assert.ok(routeSource.includes('hasOnSiteLearning(data)'),
  'Course pages must use the same eligibility check as the catalogue');
assert.ok(eligibilitySource.includes('lesson.youtubeVideoId'),
  'Metadata alone must never qualify for an internal course page');

for (const locale of locales) {
  const contentDir = path.join(root, 'src/content/learning/kz', locale);
  const catalog = await readFile(
    path.join(root, 'dist/kz', locale, 'learning/index.html'), 'utf8');
  const cards = [...catalog.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0]);
  const files = (await readdir(contentDir)).filter(file => /\.mdx?$/.test(file));
  const expectedLocalRoutes = [];
  let publishedPerLocale = 0;

  for (const file of files) {
    const markdown = await readFile(path.join(contentDir, file), 'utf8');
    const front = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    assert.ok(front, file + ': invalid frontmatter');
    if (field(front, 'draft') !== 'false') continue;
    const slug = field(front, 'slug');
    const key = field(front, 'translationKey');
    const externalUrl = field(front, 'externalUrl');
    assert.ok(slug && key && externalUrl,
      file + ': missing course slug, translation key or official provider link');

    const previous = byKey.get(key);
    if (previous) assert.equal(previous, slug, key + ': inconsistent cross-language slug');
    else byKey.set(key, slug);

    const courseCards = cards.filter(card => card.includes('href="' + externalUrl + '"'));
    assert.equal(courseCards.length, 1,
      file + ': each course must retain exactly one official external destination');
    const card = courseCards[0];
    const localRoute = base + 'kz/' + locale + '/learning/' + slug + '/';
    const fullPath = path.join(root, 'dist/kz', locale, 'learning', slug, 'index.html');
    const ids = [...front.matchAll(/^    youtubeVideoId:\s*"([A-Za-z0-9_-]{11})"/gm)]
      .map(match => match[1]);

    if (ids.length > 0) {
      // Internal pages are allowed only for usable, source-credited videos.
      assert.ok(card.includes('href="' + localRoute + '"'),
        file + ': on-site video is not reachable directly from the catalogue');
      const html = await readFile(fullPath, 'utf8');
      for (const name of [
        'learning-view__hero', 'learning-view__breadcrumb', 'learning-view__section',
        'learning-view__disclaimer', 'learning-view__sources', externalUrl,
        'learning-view__back', 'data-video-activate', 'data-video-host',
      ]) assert.ok(html.includes(name), file + ': missing on-site learning element ' + name);
      assert.ok(!/<iframe\b/i.test(html), file + ': video loads before visitor interaction');
      for (const id of ids) {
        assert.ok(html.includes('data-youtube-id="' + id + '"'),
          file + ': embedded player trigger missing for ' + id);
        assert.ok(html.includes('https://www.youtube.com/watch?v=' + id),
          file + ': original YouTube link missing for ' + id);
        checkedVideos++;
      }
      expectedLocalRoutes.push(slug);
      onSitePages++;
    } else {
      // For all metadata-only external courses, the catalogue must directly
      // link to the provider, and the build must NOT generate a duplicate page.
      assert.ok(!card.includes('href="' + localRoute + '"'),
        file + ': pointless intermediary page linked from the catalogue');
      await assert.rejects(readFile(fullPath, 'utf8'), { code: 'ENOENT' },
        file + ': pointless intermediary page unexpectedly built');
      assert.ok(!card.includes('course-catalogue__external-link'),
        file + ': an external-only course must have one clear primary action');
      directExternalLinks++;
    }
    publishedPerLocale++;
    catalogEntries++;
  }

  assert.equal(cards.length, publishedPerLocale,
    locale + ': published learning cards and course entries differ');
  assert.ok(publishedPerLocale >= 29, locale + ': published learning entries disappeared');

  const localDirs = (await readdir(
    path.join(root, 'dist/kz', locale, 'learning'), { withFileTypes: true }))
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  assert.deepEqual(localDirs, expectedLocalRoutes.sort(),
    locale + ': internal course pages must exist only when on-site lessons are available');
}
assert.ok(onSitePages >= 3 && checkedVideos >= 9,
  'Required three-language CDC pilot video pages disappeared');
assert.equal(catalogEntries, onSitePages + directExternalLinks,
  'All published course entries must have exactly one appropriate primary action');

const view = await readFile(path.join(root, 'src/components/LearningCourseView.astro'), 'utf8');
for (const required of [
  'data-video-activate',
  "document.createElement('iframe')",
  "button.addEventListener('click'",
  'youtube-nocookie.com/embed/',
  'strict-origin-when-cross-origin',
  'rel="noopener noreferrer external"',
]) assert.ok(view.includes(required), 'Privacy or source attribution missing: ' + required);

console.log('Learning journey QA passed: ' + catalogEntries +
  ' localized listings; ' + onSitePages +
  ' meaningful on-site video pages; ' + directExternalLinks +
  ' external-only cards linking directly to providers; ' + checkedVideos +
  ' original source-credited video placements.');
