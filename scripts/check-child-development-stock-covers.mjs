/** All published parent articles in the child-development subsection must have
 * their own real, licensed stock photo for both the card and the article hero.
 * Source-of-truth Markdown determines both placements.
 */
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('src/content/pages/kz/ru');
const base = '/central-asia-autism-hub/';
const manifest = await readFile('scripts/sync-editorial-photos.mjs', 'utf8');
const docs = await readFile('docs/editorial-image-sources.md', 'utf8');
const owners = new Map();
const parentListing = await readFile('dist/kz/ru/parents/index.html', 'utf8');
let scanned = 0;
for (const name of (await readdir(dir)).filter(x => /\.mdx?$/.test(x))) {
  const raw = await readFile(path.join(dir, name), 'utf8');
  const meta = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const field = key => meta.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g,'') ?? '';
  if (field('section') !== 'parents' || !['child-development', 'development-concerns'].includes(field('topic')) ||
      field('draft') !== 'false' || field('translationStatus') === 'pending') continue;
  scanned++;
  const img = field('featuredImage');
  const alt = field('featuredImageAlt');
  assert.ok(img.startsWith(base + 'images/editorial/') && /\.jpe?g$/i.test(img),
    name + ': featured cover must be an actual stock photograph, not an SVG / AI illustration');
  assert.ok(alt.length > 45, name + ': missing descriptive photograph alt text');
  const filename = path.basename(img);
  assert.ok(!owners.has(img), name + ': image reused from ' + owners.get(img));
  owners.set(img, name);
  const bytes = await stat(path.resolve('public', img.slice(base.length)));
  assert.ok(bytes.isFile() && bytes.size > 15000, name + ': absent or invalid photo file');
  if (img.includes('/images/editorial/photos/')) {
    assert.ok(manifest.includes("'" + filename + "'"), name + ': missing photo downloader entry');
  }
  assert.ok(docs.includes(filename), name + ': stock provenance not documented');
  const slug = field('slug');
  const htmlPath = path.join('dist/kz/ru/parents', slug, 'index.html');
  const built = await readFile(htmlPath, 'utf8');
  assert.ok(built.includes('class="article-v2__hero-art') && built.includes(img),
    name + ': built article hero must contain its featured photograph');
  assert.ok(parentListing.includes(img), name + ': subsection listing must use the same photograph');
}
assert.ok(scanned >= 12, 'Child-development coverage unexpectedly small: ' + scanned);
console.log('Full development subsection real stock covers PASS:', scanned,
  'published Russian articles, distinct photos with documented source, valid files and HTML heroes.');

// Ensure the emotionally supportive photo is tied to a verified Central Asian
// stock source rather than relying on inferred nationality from appearance.
const regulatedCover = await readFile(path.join(dir, 'child-emotion-regulation-support-at-home.md'), 'utf8');
assert.ok(regulatedCover.includes('parent-emotion-coregulation-tashkent-18427960.jpg'),
  'The emotion regulation guide must use the new regionally documented photograph');
assert.ok(manifest.includes("['parent-emotion-coregulation-tashkent-18427960.jpg', '18427960']"),
  'The real Pexels image must be downloaded and verified');
assert.ok(docs.includes('https://www.pexels.com/photo/mother-hugging-daughter-in-darkness-18427960/') &&
  docs.includes('Ташкентской области'), 'Region-specific source and image provenance missing');

const emotionHtml = await readFile('dist/kz/ru/parents/emotsii-samoregulyatsiya-kak-pomoch-rebenku/index.html', 'utf8');
const approvedInfographic = 'emotion-three-moments-reference.png';
const approvedUrl = '/central-asia-autism-hub/images/editorial/' + approvedInfographic;
assert.ok(emotionHtml.includes('class="emotion-reference-figure"'),
  'Missing user-approved infographic placement');
assert.equal((emotionHtml.match(/emotion-three-moments-reference.png/g) || []).length, 2,
  'Article must link full-resolution file and show it exactly once');
assert.ok(emotionHtml.includes(approvedUrl), 'Generated article must use the locally deployed infographic');
assert.ok(!emotionHtml.includes('emotion-moment-card') && !emotionHtml.includes('parent-emotion-stage-01-prepare.svg'),
  'Previous separate cards must not remain visible');
assert.ok(docs.includes('images/editorial/' + approvedInfographic),
  'User-approved image provenance missing from editorial records');
const originalPng = await readFile(path.resolve('public/images/editorial', approvedInfographic));
assert.ok(originalPng.length > 1000000 &&
  originalPng.subarray(0,8).toString('hex') === '89504e470d0a1a0a',
  'Original generated image must be a complete valid PNG file');
console.log('Emotion stages QA PASS: user-approved full-size illustration published, old scheme removed.');
