/**
 * Published editorial photograph coverage audit.
 *
 * Every published page, in each supported language, must display a locally
 * hosted, documented image with descriptive alternative text. This prevents
 * silent image omissions, missing downloaded assets and broken article heroes.
 * The original first-wave parent photographs must also remain distinct.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseDir = path.resolve('src/content/pages/kz');
const publicDir = path.resolve('public');
const documentation = await readFile(path.resolve('docs/editorial-image-sources.md'), 'utf8');
const base = '/central-asia-autism-hub/';
const requiredDistinct = [
  'what-is-autism',
  'when-to-discuss-development',
  'screening-assessment-diagnosis',
  'autism-diagnosis-kazakhstan',
  'autism-assessments-kazakhstan',
  'communication-aac',
  'aac',
  'types-of-autism-support',
  'choosing-support-by-goal',
  'how-to-choose-autism-specialist-support',
  'sensory-environmental-support',
  'adaptive-physical-activity',
  'development-interaction-play',
  'speech-language-therapy',
  'parent-mediated-intervention',
  'feeding-therapy',
];
const distinctSet = new Set(requiredDistinct);
const firstWave = new Map();
const totals = {};

function value(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
}

for (const locale of ['ru', 'en', 'kk']) {
  const directory = path.join(baseDir, locale);
  const files = (await readdir(directory)).filter(name => /\.mdx?$/.test(name)).sort();
  let published = 0;
  let withImages = 0;
  let parents = 0;
  for (const file of files) {
    const raw = await readFile(path.join(directory, file), 'utf8');
    const matched = raw.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(matched, `Frontmatter missing: ${locale}/${file}`);
    const frontmatter = matched[1];
    if (value(frontmatter, 'draft') !== 'false') continue;
    published++;
    if (value(frontmatter, 'section') === 'parents') parents++;
    const src = value(frontmatter, 'featuredImage');
    const alt = value(frontmatter, 'featuredImageAlt');
    const article = `${locale}/${file}`;

    assert.ok(src, `Published article missing featuredImage: ${article}`);
    assert.ok(alt.length >= 30, `Missing descriptive featuredImageAlt: ${article}`);
    assert.ok(src.startsWith(`${base}images/editorial/`),
      `Editorial image is not self-hosted: ${article}: ${src}`);
    const localFile = path.resolve(publicDir, src.slice(base.length));
    assert.ok(localFile.startsWith(publicDir + path.sep),
      `Unsafe editorial image path: ${article}`);
    const image = await stat(localFile);
    assert.ok(image.isFile() && image.size > 12000,
      `Missing, empty or truncated editorial photograph: ${article}: ${src}`);
    assert.ok(documentation.includes(path.basename(localFile)),
      `Image provenance not documented: ${article}: ${src}`);

    if (locale === 'ru' && distinctSet.has(file.replace(/\.mdx?$/, ''))) {
      assert.ok(!firstWave.has(src),
        `First-wave photographs must be distinct: ${article}, ${firstWave.get(src)}`);
      firstWave.set(src, article);
    }
    withImages++;
  }
  totals[locale] = { published, withImages, parents };
  assert.equal(withImages, published,
    `Published ${locale} articles lacking a featured photograph`);
}

assert.equal(firstWave.size, requiredDistinct.length,
  'First-wave editorial images are not complete or distinct');
for (const [locale, result] of Object.entries(totals)) {
  console.log(`${locale}: ${result.withImages}/${result.published} published pages include verified local photographs (${result.parents} parent articles).`);
}
console.log('All published content pages have verified, documented images and alt text.');
