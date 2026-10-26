import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'docs/visual-references/manifest.json');
const errors = [];
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (manifest.schemaVersion !== 1) errors.push('Unsupported visual reference manifest version');
if (!Array.isArray(manifest.lockedRepositoryExamples) || !manifest.lockedRepositoryExamples.length) {
  errors.push('No protected repository examples listed');
}
const seen = new Set();
for (const image of manifest.lockedRepositoryExamples ?? []) {
  const p = image.path;
  if (typeof p !== 'string' || !/^public\/images\/[a-z0-9_\/-]+\.(png|jpg|jpeg|webp|svg)$/i.test(p) ||
    p.includes('..') || seen.has(p)) {
    errors.push('Unsafe or duplicate locked image path: ' + String(p));
    continue;
  }
  seen.add(p);
  try {
    const bytes = await readFile(path.resolve(root, p));
    const size = (await stat(path.resolve(root, p))).size;
    if (bytes.length !== image.bytes || size !== image.bytes) {
      errors.push(p + ': file size changed: ' + bytes.length + ' vs ' + image.bytes);
    }
    const h = createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
    if (h !== image.gitBlobSha1) {
      errors.push(p + ': original approved image changed; review rights/approval before updating its hash');
    }
  } catch (e) {
    errors.push(p + ': missing/unreadable protected image: ' + e.message);
  }
}
if (!Array.isArray(manifest.ownerSuppliedComparators) || manifest.ownerSuppliedComparators.length !== 2) {
  errors.push('Owner source pair needs two documented images');
}
for (const item of manifest.ownerSuppliedComparators ?? []) {
  if (!/^[a-f0-9]{64}$/.test(item.sha256 ?? '') ||
    !Array.isArray(item.sizePx) || item.sizePx.some(n => !Number.isInteger(n) || n <= 0)) {
    errors.push('Invalid source fingerprint metadata for ' + (item.originalFilename ?? '(unknown)'));
  }
  if (item.storageStatus !== 'project_attachment_not_in_git' && !item.repositoryPath) {
    errors.push('A stored reference requires a real repositoryPath: ' + item.originalFilename);
  }
}
console.log('[VISUAL_REFERENCES] ' + (manifest.lockedRepositoryExamples?.length ?? 0) +
  ' locked in-repo samples checked, ' + (manifest.ownerSuppliedComparators?.length ?? 0) +
  ' source references documented, ' + errors.length + ' errors');
for (const error of errors) console.error('[VISUAL_REFERENCES_FAIL] ' + error);
if (errors.length) process.exitCode = 1;
