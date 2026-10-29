import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const contentRoots = ['src/content/pages', 'src/content/research', 'src/content/learning'];
const interfaceRoots = ['src/components', 'src/pages', 'src/data', 'src/i18n'];
const protectedInterfaceFiles = new Set([
  // Exact licensed questionnaire wording cannot be editorially rewritten.
  'src/data/mchat-licensed-items.ts',
]);
const fix = process.argv.includes('--fix');
const protectedSpans = /(https?:\/\/[^\s)\]>"']+|&(?:#(?:x[0-9a-f]+|\d+)|[a-z][a-z\d]+);|`[^`]*`|<[^>]*>)/gi;
const forbiddenDashes = /[\u2013\u2014]/g;

function listFiles(dir, pattern) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(full, pattern);
      return entry.isFile() && pattern.test(entry.name) ? [full] : [];
    });
}

function replacePunctuation(source) {
  let fenced = false;
  let rawBlock = false;
  const issues = [];
  const lines = source.split('\n');
  const updated = lines.map((line, index) => {
    if (/^\s*(?:```|~~~)/.test(line)) {
      fenced = !fenced;
      return line;
    }
    if (/^\s*<(?:script|style)(?:\s|>)/i.test(line)) rawBlock = true;
    if (fenced || rawBlock) {
      if (/^\s*<\/(?:script|style)>/i.test(line)) rawBlock = false;
      return line;
    }

    const parts = line.split(protectedSpans);
    let semicolons = 0;
    let dashes = 0;
    for (let i = 0; i < parts.length; i += 2) {
      semicolons += (parts[i].match(/;/g) ?? []).length;
      dashes += (parts[i].match(forbiddenDashes) ?? []).length;
      if (fix) parts[i] = parts[i].replace(/;/g, ',').replace(forbiddenDashes, '-');
    }

    if (semicolons || dashes) issues.push({ line: index + 1, semicolons, dashes });
    if (!fix || (!semicolons && !dashes)) return line;
    let changed = parts.join('');
    if (/^\s*[-*+]\s+/.test(changed) && /;\s*$/.test(line)) {
      changed = changed.replace(/,\s*$/, '');
    }
    return changed;
  });
  return { issues, result: updated.join('\n') };
}

let count = 0;
let affected = 0;
let totalSemicolons = 0;
let totalDashes = 0;
const diagnostics = [];

for (const root of contentRoots) {
  for (const file of listFiles(root, /\.mdx?$/i)) {
    count++;
    const source = readFileSync(file, 'utf8');
    const { issues, result } = replacePunctuation(source);
    if (!issues.length) continue;
    affected++;
    totalSemicolons += issues.reduce((sum, x) => sum + x.semicolons, 0);
    totalDashes += issues.reduce((sum, x) => sum + x.dashes, 0);
    if (fix) writeFileSync(file, result);
    for (const x of issues) {
      diagnostics.push(`${relative('.', file)}:${x.line}: ${x.semicolons} prose semicolon(s), ${x.dashes} non-ASCII dash(es)`);
    }
  }
}

let uiCount = 0;
for (const root of interfaceRoots) {
  for (const file of listFiles(root, /\.(?:astro|ts|js|mjs)$/i)) {
    if (protectedInterfaceFiles.has(relative('.', file))) continue;
    uiCount++;
    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const n = (lines[i].match(forbiddenDashes) ?? []).length;
      if (!n) continue;
      totalDashes += n;
      diagnostics.push(`${relative('.', file)}:${i + 1}: ${n} non-ASCII dash(es) in site copy`);
    }
  }
}

if (!totalSemicolons && !totalDashes) {
  console.log(`Article punctuation check passed: ${count} Markdown files, ${uiCount} site UI files; no prohibited prose semicolons or long dashes.`);
} else {
  console.error(`${fix ? 'Partially corrected' : 'Found'} ${totalSemicolons} prose semicolons and ${totalDashes} long dashes in ${affected} Markdown files and site UI.`);
  diagnostics.slice(0, 160).forEach((item) => console.error(item));
  if (diagnostics.length > 160) console.error(`...and ${diagnostics.length - 160} additional lines.`);
  // --fix applies to Markdown only. UI source strings require a deliberate edit.
  if (!fix || totalDashes) process.exitCode = 1;
}
