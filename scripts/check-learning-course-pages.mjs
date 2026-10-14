/** Ensure all published learning entries have correct local routes and safe media controls. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const base = '/central-asia-autism-hub/';
const locales = ['ru','kk','en'];
let total = 0;
let videoCourses = 0;
let checkedVideos = 0;
const byKey = new Map();

const field = (frontmatter, name) =>
  frontmatter.match(new RegExp('^' + name + ':\\s*(.*)$','m'))?.[1]?.replace(/^["']|["']$/g,'') ?? '';

for (const locale of locales) {
  const contentDir = path.join(root, 'src/content/learning/kz', locale);
  const catalog = await readFile(path.join(root, 'dist/kz',locale,'learning/index.html'),'utf8');
  const files = (await readdir(contentDir)).filter(file=>/\\.mdx?$/.test(file));
  let perLocale = 0;
  const routeSlugs = new Set();
  for (const file of files) {
    const markdown = await readFile(path.join(contentDir,file),'utf8');
    const front = markdown.match(/^---\\r?\\n([\\s\\S]*?)\\r?\\n---/)?.[1];
    assert.ok(front, file + ': invalid frontmatter');
    if (field(front,'draft') !== 'false') continue;
    const slug = field(front,'slug'), key = field(front,'translationKey');
    const title = field(front,'title');
    const externalUrl = field(front,'externalUrl');
    assert.ok(slug && key && externalUrl, file + ': missing primary learning data');
    assert.ok(!routeSlugs.has(slug), 'Duplicate learning route in ' + locale + ': ' + slug);
    routeSlugs.add(slug);
    const previous = byKey.get(key);
    if (previous) assert.equal(previous, slug, key + ': inconsistent slug across translations');
    else byKey.set(key, slug);
    const route = base + 'kz/' + locale + '/learning/' + slug + '/';
    assert.ok(catalog.includes('href="' + route + '"'),
      file + ': course catalogue does not link to its own local page');
    assert.ok(catalog.includes(externalUrl),
      file + ': official course URL missing from catalogue');
    const html = await readFile(path.join(root,'dist/kz',locale,'learning',slug,'index.html'),'utf8');
    for(const text of [
      'learning-view__hero','learning-view__breadcrumb','learning-view__section',
      'learning-view__disclaimer','learning-view__sources',
      externalUrl,'learning-view__back'
    ]) assert.ok(html.includes(text), file + ': missing page structure/content: ' + text);
    assert.ok(!/<iframe\\b/i.test(html), file + ': YouTube loads before user consent');
    const videoIdFields = [...front.matchAll(/^    youtubeVideoId:\s*"([A-Za-z0-9_-]{11})"/gm)].map(m=>m[1]);
    if (videoIdFields.length) {
      videoCourses++;
      for (const id of videoIdFields) {
        assert.ok(html.includes('data-youtube-id="' + id + '"'), file + ': video trigger missing for ' + id);
        assert.ok(html.includes('https://www.youtube.com/watch?v=' + id),
          file + ': official unembedded fallback missing for video ' + id);
        checkedVideos++;
      }
      assert.ok(html.includes('data-video-activate') && html.includes('data-video-host'),
        file + ': consent-gated player placeholder missing');
    }
    total++;perLocale++;
  }
  assert.ok(perLocale >= 29, locale + ': lost learning resources');
}
assert.equal(videoCourses, 3, 'Pilot source-verified CDC video set must be localized to all 3 versions');
assert.equal(checkedVideos, 9, 'Three official CDC video excerpts per site locale are required');
const view = await readFile(path.join(root,'src/components/LearningCourseView.astro'),'utf8');
for (const requirement of [
  'data-video-activate',
  'document.createElement(\'iframe\')',
  'button.addEventListener(\'click\'',
  'youtube-nocookie.com/embed/',
  'strict-origin-when-cross-origin',
  'rel="noopener noreferrer external"'
]) assert.ok(view.includes(requirement), 'Player privacy guard missing: ' + requirement);
console.log('Learning internal page QA passed: ' + total +
  ' localized course pages, ' + videoCourses +
  ' embedded-video learning pages, ' + checkedVideos +
  ' consent-gated CDC video placements and official external fallbacks.');
