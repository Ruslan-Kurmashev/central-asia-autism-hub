/**
 * Published parent-page artwork audit.
 *
 * Core articles from the first reviewed batch are required to have distinct,
 * self-hosted, correctly described image assets. Other published pages are
 * counted and listed for the next editorial selection pass without pretending
 * that the whole library has been completed.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const parentDir = path.resolve('src/content/pages/kz/ru');
const publicDir = path.resolve('public');
const base = '/central-asia-autism-hub/';
const required = [
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
const requiredSet = new Set(required);
const seenImageBy = new Map();
const missing = [];
const all = await readdir(parentDir);
let published = 0;
let withImage = 0;
let parents = 0;

const value = (text, key) => {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
};

for (const file of all.filter((name) => /\.mdx?$/.test(name)).sort()) {
  const raw = await readFile(path.join(parentDir, file), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, `Frontmatter missing in ${file}`);
  if (value(fm[1], 'draft') !== 'false') continue;
  published += 1;
  if (value(fm[1], 'section') !== 'parents') continue;
  parents += 1;
  const id = file.replace(/\.mdx?$/, '');
  const src = value(fm[1], 'featuredImage');
  const alt = value(fm[1], 'featuredImageAlt');

  if (!src) {
    missing.push(id);
    assert.ok(!requiredSet.has(id), `Core article has no featured image: ${id}`);
    continue;
  }
  withImage += 1;
  assert.ok(alt.length >= 30, `Missing descriptive featuredImageAlt on ${id}`);
  if (requiredSet.has(id)) {
    assert.ok(src.startsWith(`${base}images/editorial/`),
      `Core photo not hosted in own static assets: ${id}`);
    const local = path.join(publicDir, src.slice(base.length));
    const image = await stat(local);
    assert.ok(image.isFile() && image.size > 12000,
      `Missing, empty or truncated photo ${src}`);
    assert.ok(!seenImageBy.has(src),
      `First-wave articles reuse the same editorial image: ${id}, ${seenImageBy.get(src)}`);
    seenImageBy.set(src, id);
  }
}

assert.equal(seenImageBy.size, required.length, 'Some first-wave visual choices are missing');
console.log(`Russian pages: ${published} published; ${parents} parent pages.`);
console.log(`Parent featured images: ${withImage}/${parents}; missing: ${missing.length}.`);
console.log(`First image wave: ${required.length} distinct images with alt text and real local files validated.`);
if (missing.length) {
  console.log('Parent pages still awaiting editorial photographs:');
  for (const item of missing) console.log(`- ${item}`);
}
