/* Licensed editorial photo downloads for AutismHub articles.
 * Real Pexels photographs, individually credited in docs/editorial-image-sources.md.
 * Generated public files are intentionally not committed; CI downloads and validates
 * each file before the static site is built and deployed. No remote hotlinks in HTML.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const folder = path.join(process.cwd(), 'public/images/editorial/photos');
const photos = [
  ['kz-help-001.jpg', '10341112'],
  ['kz-help-002.jpg', '6692939'],
  ['kz-help-003.jpg', '4101416'],
  ['kz-help-004.jpg', '8970647'],
  ['kz-help-005.jpg', '8923952'],
  ['kz-help-006.jpg', '5905445'],
  ['kz-help-007.jpg', '5668469'],
  ['kz-help-008.jpg', '8815849'],
  ['parent-movement-equipment.jpg', '36717697'],
  ['parent-toileting-bathroom.jpg', '6444254'],
  ['parent-communication-cards.jpg', '8250913'],
  ['parent-sensory-headphones.jpg', '4065846'],
  ['parent-weighted-blanket.jpg', '11125918'],
  ['parent-schedule-planner.jpg', '30101192'],
  ['parent-hygiene-tools.jpg', '7262385'],
  ['parent-food-ingredients.jpg', '9407242'],
  ['parent-food-plate.jpg', '6065175'],
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
  console.log(`All ${photos.length} licensed article photographs validated.`);
}
