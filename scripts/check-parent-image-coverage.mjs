/**
 * Published parent-page artwork audit.
 *
 * All published Russian parent articles must have a real locally hosted
 * editorial image and a useful alternative description. The first wave
 * (16) and completion wave (45) have unique images within each wave.
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
const completionWave = [
  'after-autism-assessment-kazakhstan',
  'aided-language-modelling',
  'antecedent-based-interventions',
  'arfid-assessment-support',
  'auditory-integration-listening-programs',
  'autism-pmpk-vkk-mse-kazakhstan',
  'ayres-sensory-integration',
  'behavior-learning',
  'behavioral-feeding-interventions',
  'communication-partner-training',
  'daily-living-participation',
  'daily-living-skills-training',
  'development-milestones',
  'dietitian-nutrition-support',
  'differential-reinforcement',
  'first-30-days-after-autism-diagnosis-kazakhstan',
  'functional-behavior-assessment',
  'functional-communication-training',
  'how-to-read-evidence',
  'imitation-reciprocal-imitation',
  'joint-attention',
  'monitoring-support-outcomes',
  'movement-physical-activity',
  'naturalistic-intervention',
  'ndbi',
  'neyropsihologicheskaya-korrektsiya',
  'occupational-therapy',
  'otsenka-trudnostey-pitaniya',
  'pecs',
  'peer-mediated-intervention',
  'physical-therapy-physiotherapy',
  'play-based-interventions',
  'prompting-and-prompt-fading',
  'reinforcement',
  'self-management',
  'sensory-based-feeding-approaches',
  'sensory-based-strategies',
  'sensory-diet',
  'sensory-overload-environmental-adaptations',
  'special-pedagog-defektolog',
  'task-analysis',
  'therapeutic-exercise-lfk',
  'toileting-interventions',
  'video-modeling',
  'weighted-items',
];
const requiredSet = new Set(required);
const completionSet = new Set(completionWave);
const completionImages = new Map();
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
    continue;
  }
  withImage += 1;
  assert.ok(alt.length >= 30, `Missing descriptive featuredImageAlt on ${id}`);
  assert.ok(src.startsWith(`${base}images/editorial/`),
    `Article photo not hosted in site assets: ${id}`);
  const local = path.join(publicDir, src.slice(base.length));
  const image = await stat(local);
  assert.ok(image.isFile() && image.size > (src.endsWith('.svg') ? 1000 : 12000),
    `Missing, empty or truncated photo ${src}`);
  if (requiredSet.has(id)) {
    assert.ok(!seenImageBy.has(src),
      `First wave photo reused: ${id}, ${seenImageBy.get(src)}`);
    seenImageBy.set(src, id);
  }
  if (completionSet.has(id)) {
    assert.ok(!completionImages.has(src),
      `Completion wave photo reused: ${id}, ${completionImages.get(src)}`);
    completionImages.set(src, id);
  }
}

assert.equal(seenImageBy.size, required.length, 'Some first-wave visual choices are missing');
assert.equal(completionImages.size, completionWave.length, 'Some completion-wave visuals are missing');
assert.equal(missing.length, 0, `Published parent pages lack images: ${missing.join(', ')}`);
assert.equal(withImage, parents, 'All published parent pages must have a featured image');
console.log(`Russian pages: ${published} published; ${parents} parent pages.`);
console.log(`Parent featured images: ${withImage}/${parents}; missing: ${missing.length}.`);
console.log(`All parent visuals validated: first wave ${required.length}, completion wave ${completionWave.length}, plus previously illustrated pages.`);
if (missing.length) {
  console.log('Parent pages still awaiting editorial photographs:');
  for (const item of missing) console.log(`- ${item}`);
}
