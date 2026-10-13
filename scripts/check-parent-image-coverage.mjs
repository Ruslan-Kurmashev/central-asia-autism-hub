/**
 * Published editorial photograph coverage audit.
 *
 * Every published page, in each supported language, must display a locally
 * hosted, documented photo or original SVG with descriptive alternative text. This prevents
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
const sensoryDistinctFiles = new Set([
  'sensornye-osobennosti-pri-autizme',
  'sensory-based-strategies',
  'sensory-environmental-support',
  'ayres-sensory-integration',
  'stimming-i-povtoryayushchiesya-deystviya-pri-autizme',
  'sensory-diet',
  'auditory-integration-listening-programs',
  'sensory-overload-environmental-adaptations',
]);
const sensoryImageOwners = new Map();
const allParentImageOwners = new Map();
const editorialDistinctGroups = {
  communicationAAC: new Set([
    'aac',
    'aided-language-modelling',
    'communication-aac',
    'communication-partner-training',
    'functional-communication-training',
    'pecs',
    'speech-language-therapy',
    'video-modeling',
  ]),
  feeding: new Set([
    'arfid-assessment-support',
    'behavioral-feeding-interventions',
    'dietitian-nutrition-support',
    'feeding-therapy',
    'sensory-based-feeding-approaches',
  ]),
  behaviorLearning: new Set([
    'behavior-learning',
    'differential-reinforcement',
    'reinforcement',
    'functional-behavior-assessment',
    'task-analysis',
    'self-management',
    'naturalistic-intervention',
    'play-based-interventions',
    'rubi-parent-training',
    'ndbi',
    'imitation-reciprocal-imitation',
  ]),
};
const editorialImageOwners = Object.fromEntries(
  Object.keys(editorialDistinctGroups).map((group) => [group, new Map()]),
);


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
    const isVector = path.extname(localFile).toLowerCase() === '.svg';
    assert.ok(image.isFile() && (isVector ? image.size > 600 : image.size > 12000),
      `Missing, empty or truncated editorial image: ${article}: ${src}`);
    if (isVector) {
      const svg = await readFile(localFile, 'utf8');
      assert.match(svg, /<svg\b/i, `Invalid SVG image: ${article}`);
      assert.match(svg, /<title\b/i, `SVG lacks title: ${article}`);
      assert.match(svg, /<desc\b/i, `SVG lacks description: ${article}`);
      assert.ok(!/<script\b|onload\s*=|javascript:|<foreignObject\b/i.test(svg),
        `Unsafe SVG content: ${article}`);
    }
    assert.ok(documentation.includes(path.basename(localFile)),
      `Image provenance not documented: ${article}: ${src}`);

    if (locale === 'ru' && value(frontmatter, 'section') === 'parents') {
      // A distinct article cover is required for every published Russian parent page.
      const previousOwner = allParentImageOwners.get(src);
      assert.ok(!previousOwner,
        `Parent article cover reused between ${previousOwner} and ${article}: ${src}`);
      allParentImageOwners.set(src, article);
    }
    if (locale === 'ru' && distinctSet.has(file.replace(/\.mdx?$/, ''))) {
      assert.ok(!firstWave.has(src),
        `First-wave photographs must be distinct: ${article}, ${firstWave.get(src)}`);
      firstWave.set(src, article);
    }
    if (locale === 'ru' && sensoryDistinctFiles.has(file.replace(/\.mdx?$/, ''))) {
      assert.ok(!sensoryImageOwners.has(src),
        `Sensory article photographs must be distinct: ${article}, ${sensoryImageOwners.get(src)}`);
      sensoryImageOwners.set(src, article);
    }
    if (locale === 'ru' && value(frontmatter, 'section') === 'parents') {
      const fileKey = file.replace(/\.mdx?$/, '');
      for (const [group, names] of Object.entries(editorialDistinctGroups)) {
        if (!names.has(fileKey)) continue;
        const usedImages = editorialImageOwners[group];
        assert.ok(!usedImages.has(src),
          `Article covers within ${group} must be distinct: ${article}, ${usedImages.get(src)}`);
        usedImages.set(src, article);
      }
    }
    withImages++;
  }
  totals[locale] = { published, withImages, parents };
  assert.equal(withImages, published,
    `Published ${locale} articles lacking a featured image`);
}

for (const [group, files] of Object.entries(editorialDistinctGroups)) {
  assert.equal(editorialImageOwners[group].size, files.size,
    `All ${files.size} ${group} parent covers must be present and distinct`);
}
assert.equal(allParentImageOwners.size, totals.ru.parents,
  'Every published Russian parent article must have a distinct, documented cover');
assert.equal(sensoryImageOwners.size, sensoryDistinctFiles.size, 'Eight sensory-topic covers must be present and distinct');
assert.equal(firstWave.size, requiredDistinct.length,
  'First-wave editorial images are not complete or distinct');
for (const [locale, result] of Object.entries(totals)) {
  console.log(`${locale}: ${result.withImages}/${result.published} published pages include verified local images (${result.parents} parent articles).`);
}
console.log('All published content pages have verified, documented photos or SVGs and alt text.');
