/* Editorial photo downloads for Kazakhstan help and parent-facing articles.
 * Real Pexels photographs, individually credited in docs/editorial-image-sources.md.
 * Generated public files are intentionally not committed; CI downloads and validates
 * each file before the static site is built and deployed. No remote hotlinks in HTML.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const folder = path.join(process.cwd(), 'public/images/editorial/photos');
const photos = [
  ['professional-early-referral-family-consultation.jpg', '7653091'],
  ['kz-help-001.jpg', '10341112'],
  ['kz-help-002.jpg', '6692939'],
  ['kz-help-003.jpg', '4101416'],
  ['kz-help-004.jpg', '8970647'],
  ['kz-help-005.jpg', '8923952'],
  ['kz-help-006.jpg', '5905445'],
  ['kz-help-007.jpg', '5668469'],
  ['kz-help-008.jpg', '8815849'],
  ['parent-afk-equipment.jpg', '6339719'],
  ['parent-feeding-meal.jpg', '7074510'],
  ['parent-movement-equipment.jpg', '36717697'],
  ['parent-toileting-bathroom.jpg', '6444254'],
  ['parent-communication-cards.jpg', '8250913'],
  ['parent-sensory-headphones.jpg', '4065846'],
  ['parent-weighted-blanket.jpg', '11125918'],
  ['parent-schedule-planner.jpg', '30101192'],
  ['parent-hygiene-tools.jpg', '7262385'],
  ['parent-food-ingredients.jpg', '9407242'],
  ['parent-food-plate.jpg', '6065175'],
  ['parent-development-shape-sorter.jpg', '6692956'],
  ['parent-development-observation-notes.jpg', '7428213'],
  ['parent-daily-skills-folding-clothes.jpg', '4440571'],
  ['parent-daily-participation-setting-table.jpg', '5990733'],
  ['parent-occupational-fine-motor-beads.jpg', '5200772'],
  ['parent-lfk-exercise-mats.jpg', '6339731'],
  ['parent-physical-therapy-balance-board.jpg', '30483062'],
  ['parent-sensory-swing.jpg', '6035613'],
  ['parent-sensory-calm-space.jpg', '34652531'],
  ['parent-task-analysis-notes.jpg', '7718886'],
  ['parent-self-management-weekly-goals.jpg', '15713277'],
  ['parent-feeding-table-utensils.jpg', '6969720'],
  ['parent-nutrition-meal-planning.jpg', '8715631'],
  ['parent-feeding-food-textures.jpg', '31617910'],
  ['parent-arfid-food-variety.jpg', '5852329'],
  ['parent-sensory-everyday-fidget.jpg', '13417045'],
  ['parent-play-pretend-kitchen.jpg', '5093646'],
  ['parent-reinforcement-goal-stickers.jpg', '6192124'],
  ['parent-naturalistic-children-toys.jpg', '6693311'],
  ['parent-sensory-tactile-slime.jpg', '6144288'],
  ['parent-stimming-hand-stress-ball.jpg', '4498315'],
  ['parent-listening-headphones-tablet.jpg', '325057'],
  ['parent-sensory-light-blinds.jpg', '36197104'],
  ['parent-behavior-play-boardgame.jpg', '7296501'],
  ['parent-reinforcement-sticker-planner.jpg', '30101194'],
  ['parent-fba-clipboard-notes.jpg', '8036881'],
  ['parent-rubi-parent-reading.jpg', '7677771'],
  ['parent-ndbi-floor-play.jpg', '7780883'],
  ['parent-imitation-stacking-together.jpg', '7296470'],
  ['parent-communication-gestures-classroom.jpg', '13181131'],
  ['parent-aac-aided-pointing-pictures.jpg', '7269497'],
  ['parent-communication-partner-conversation.jpg', '6297601'],
  ['parent-functional-communication-toy-choice.jpg', '7985454'],
  ['parent-pecs-picture-choice-cards.jpg', '17925153'],
  ['parent-video-modeling-filming-kitchen.jpg', '12674086'],
  ['parent-neuropsych-educational-puzzle.jpg', '34594764'],
  ['parent-screening-doctor-child.jpg', '5998450'],
  ['parent-assessment-family-clinic.jpg', '8460030'],
  ['parent-cooccurring-medical-desk.jpg', '5407251'],
  ['parent-prompting-guided-puzzle.jpg', '7269455'],
  ['parent-autism-basics-family-outdoors.jpg', '4871817'],
  ['parent-joint-attention-play-floor.jpg', '7491262'],
  ['parent-kz-diagnosis-medical-documents.jpg', '7089620'],
  ['parent-first-month-written-plan.jpg', '5239918'],
  ['parent-special-educator-classroom.jpg', '8923153'],
  ['parent-outcomes-visual-chart.jpg', '7947671'],
  ['parent-evidence-article-highlighter.jpg', '5537544'],
  ['parent-kz-referral-multidisciplinary-team.jpg', '7800551'],
  ['research-development-life-paths.jpg', '18999124'],
  ['research-profiles-diverse-samples.jpg', '5428256'],
  ['research-communication-people-conversing.jpg', '7972533'],
  ['research-brain-cells-microscope.jpg', '9574392'],
  ['research-girls-diagnosis-conversation.jpg', '5998448'],
  ['research-early-parent-child-play.jpg', '8504273'],
  ['research-eye-tracking-closeup-eye.jpg', '322070'],
  ['research-genetics-lab-pipette.jpg', '8442560'],
  ['research-vaccination-medical-syringe.jpg', '4492048'],
  ['research-sensory-colorful-fidget.jpg', '10412871'],
];

function isJpeg(bytes) {
  return bytes.length > 15000 && bytes[0] === 0xff && bytes[1] === 0xd8 &&
    bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
}

async function ensurePhoto(filename, photoId) {
  const output = path.join(folder, filename);
  try {
    if (isJpeg(await readFile(output))) {
      console.log(`Verified cached photo: ${filename}`);
      return;
    }
  } catch {
    // A first-time build has no cached images.
  }

  const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?fm=jpg&w=1280&q=82`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { accept: 'image/jpeg' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const mediaType = response.headers.get('content-type') ?? '';
      if (!mediaType.toLowerCase().includes('image/jpeg')) {
        throw new Error(`Unexpected media type ${mediaType}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!isJpeg(bytes) || bytes.length > 6000000) {
        throw new Error(`Invalid or oversized JPEG (${bytes.length} bytes)`);
      }
      await writeFile(output, bytes);
      console.log(`Downloaded and verified ${filename}: ${bytes.length} bytes`);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`Download attempt ${attempt} for ${filename}: ${error.message}`);
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  throw new Error(`Cannot acquire licensed photo ${filename} from Pexels: ${lastError?.message}`);
}

await mkdir(folder, { recursive: true });
const errors = [];
for (let i = 0; i < photos.length; i += 3) {
  const results = await Promise.allSettled(
    photos.slice(i, i + 3).map(([name, id]) => ensurePhoto(name, id)),
  );
  for (const result of results) {
    if (result.status === 'rejected') errors.push(result.reason?.message ?? 'Unknown download error');
  }
}
if (errors.length > 0) {
  console.error('Failed editorial photos:', errors.join('; '));
  process.exitCode = 1;
} else {
  console.log(`All ${photos.length} article photographs validated.`);
}
