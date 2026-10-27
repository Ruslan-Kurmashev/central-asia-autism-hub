/**
 * Immutable first-publication date policy for AutismHub content.
 *
 * On every push / PR compare the full changed-file set against the preceding
 * published git revision. Changing updatedAt is allowed; changing an existing
 * publishedAt is a hard build failure, including edits in multiple commits.
 *
 * GitHub Actions provides BASE_COMMIT for push events and checks out full history.
 */
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import process from 'node:process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const baseGiven = process.env.BASE_COMMIT?.trim() ?? '';
const fallback = 'HEAD^';
const base = baseGiven && !/^0+$/.test(baseGiven) && /^[0-9a-f]{40}$/i.test(baseGiven)
  ? baseGiven : fallback;
try { git('rev-parse', '--verify', base + '^{commit}'); }
catch {
  console.error('Cannot check immutable publication dates: base revision is unavailable (' + base + ').');
  process.exit(1);
}

function field(source, name) {
  const front = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  const raw = front.split(/\r?\n/).find((line) => line.startsWith(name + ':'))?.slice(name.length + 1).trim();
  return raw ? raw.replace(/^["']|["']$/g, '') : null;
}

function firstPublishedDate(source) {
  return field(source, 'publishedAt');
}

// First publication of an existing draft is allowed exactly once. Previously
// published material remains immutable, including when returned to draft.
function isFirstTranslationRelease(before, after, oldDate, newDate) {
  return oldDate === null && Boolean(newDate) &&
    field(before, 'draft') === 'true' &&
    field(before, 'translationStatus') === 'pending' &&
    field(after, 'draft') === 'false' &&
    field(after, 'translationStatus') === 'checked' &&
    Boolean(field(before, 'originalPublishedAt')) &&
    field(before, 'originalPublishedAt') === field(after, 'originalPublishedAt');
}

const changed = git('diff', '--name-status', '-M', base, 'HEAD', '--',
  'src/content/pages', 'src/content/research', 'src/content/learning')
  .split('\n').filter(Boolean);
const errors = [];
let compared = 0;
for (const row of changed) {
  const [status, ...paths] = row.split('\t');
  if (status.startsWith('A') || status.startsWith('D')) continue;
  const before = paths[0];
  const after = paths[paths.length - 1];
  if (!/\.mdx?$/.test(after) || !/\.mdx?$/.test(before)) continue;
  let prev;
  try { prev = git('show', base + ':' + before); }
  catch { errors.push('Unable to read baseline for ' + before); continue; }
  const oldDate = firstPublishedDate(prev);
  const current = await readFile(after, 'utf8');
  const now = firstPublishedDate(current);
  compared++;
  if (oldDate !== now && !isFirstTranslationRelease(prev, current, oldDate, now)) {
    errors.push(after + ': publishedAt changed from ' + (oldDate ?? '(none)') +
      ' to ' + (now ?? '(none)') + '. Keep an existing first publication date unchanged.');
  }
}
if (errors.length) {
  console.error('Original publication date policy FAILED:\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log('Original publication date lock PASS: ' + compared +
  ' existing article/course files checked since ' + base.slice(0, 12) +
  '; original publishedAt values preserved.');
