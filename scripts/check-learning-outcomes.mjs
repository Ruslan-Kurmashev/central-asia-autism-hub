import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Structural regression check for every published course entry in any locale.
// It verifies field completeness, not whether a third-party credential is valid.
const contentRoot = path.join('src', 'content', 'learning');
const problems = [];
let published = 0;
let drafts = 0;
const languages = { ru: 0, kk: 0, en: 0 };
const unique = new Set();

async function visit(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await visit(filepath));
    else if (entry.isFile() && /\.mdx?$/.test(entry.name)) found.push(filepath);
  }
  return found;
}

function getFrontmatter(text, filename) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!block) { problems.push(`${filename}: frontmatter missing`); return null; }
  const fields = {};
  const lines = block[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (!match) continue;
    const [, name, raw] = match;
    if (/^[>|][-+]?\s*$/.test(raw)) {
      let collected = [];
      for (; i+1 < lines.length && (/^\s+/.test(lines[i+1]) || lines[i+1] === ''); i++) {
        collected.push(lines[i+1].trim());
      }
      fields[name] = collected.join(' ').trim();
    } else if (raw.startsWith('"')) {
      try { fields[name] = JSON.parse(raw); }
      catch { fields[name] = raw.replace(/^"|"$/g, ''); }
    } else {
      fields[name] = raw.trim();
    }
  }
  return fields;
}

for (const filename of await visit(contentRoot)) {
  const fm = getFrontmatter(await readFile(filename, 'utf8'), filename);
  if (!fm) continue;
  if (fm.draft === 'true') { drafts++; continue; }
  if (fm.draft !== 'false') {
    problems.push(`${filename}: draft must be explicit true or false`);
    continue;
  }
  published++;
  if (!Object.hasOwn(languages, fm.language)) {
    problems.push(`${filename}: missing or invalid language`);
  } else {
    languages[fm.language]++;
  }
  if (fm.section !== 'learning') problems.push(`${filename}: section must be learning`);
  const identifier = `${fm.translationKey}:${fm.language}`;
  if (!fm.translationKey) problems.push(`${filename}: translationKey missing`);
  else if (unique.has(identifier)) problems.push(`${filename}: duplicate translationKey + language`);
  unique.add(identifier);

  for (const key of ['registrationStatus', 'completionOutcome']) {
    const value = fm[key];
    if (typeof value !== 'string' || value.trim().length < 20) {
      problems.push(`${filename}: ${key} must contain a clear explanation (at least 20 characters)`);
    }
  }
  if (typeof fm.registrationStatus === 'string' &&
      /(?:признан(?:ие|ы|о|а|ия)?|recognis(?:ed|ed)|recogniz(?:ed|ation)|таныл(?:уы|ады|ған)?)[^.!?\n]{0,100}(?:казахстан|қазақстан|kazakhstan)|(?:казахстан|қазақстан|kazakhstan)[^.!?\n]{0,100}(?:признан|recognis|recogniz|таныл)/iu.test(fm.registrationStatus)) {
    problems.push(`${filename}: recognition claims do not belong in the course access field`);
  }
}

if (published === 0) problems.push('No published learning entries found; audit cannot pass on an empty catalogue.');
console.log(`Learning outcomes audit: ${published} published entries across ${JSON.stringify(languages)}, ${drafts} drafts.`);
for (const issue of problems) console.error('LEARNING QA: ' + issue);
if (problems.length) process.exitCode = 1;
else console.log('Every published learning entry explains access and outcomes separately.');
