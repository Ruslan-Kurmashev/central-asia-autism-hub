import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const contentRoots = [
  'src/content/pages',
  'src/content/research',
  'src/content/learning',
];
const fix = process.argv.includes('--fix');
const protectedSpans = /(https?:\/\/[^\s)\]>"']+|&(?:#(?:x[0-9a-f]+|\d+)|[a-z][a-z\d]+);|`[^`]*`|<[^>]*>)/gi;

function listArticles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return listArticles(full);
      return entry.isFile() && /\.mdx?$/i.test(entry.name) ? [full] : [];
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
    let matches = 0;
    for (let i = 0; i < parts.length; i += 2) {
      matches += (parts[i].match(/;/g) ?? []).length;
      if (fix) parts[i] = parts[i].replace(/;/g, ',');
    }

    if (matches) issues.push({ line: index + 1, count: matches });
    if (!fix || !matches) return line;
    let changed = parts.join('');
    // A list item ending with punctuation should not acquire a dangling comma.
    if (/^\s*[-*+]\s+/.test(changed) && /;\s*$/.test(line)) {
      changed = changed.replace(/,\s*$/, '');
    }
    return changed;
  });

  return { issues, result: updated.join('\n') };
}

let articleCount = 0;
let changedCount = 0;
let punctuationCount = 0;
const diagnostics = [];
for (const root of contentRoots) {
  for (const file of listArticles(root)) {
    articleCount++;
    const source = readFileSync(file, 'utf8');
    const { issues, result } = replacePunctuation(source);
    if (!issues.length) continue;
    changedCount++;
    punctuationCount += issues.reduce((sum, issue) => sum + issue.count, 0);
    if (fix) writeFileSync(file, result);
    for (const issue of issues) {
      diagnostics.push(`${relative('.', file)}:${issue.line}: ${issue.count} prose semicolon(s)`);
    }
  }
}

if (!punctuationCount) {
  console.log(`Article punctuation check passed: ${articleCount} files, zero prose semicolons.`);
} else {
  console.error(`${fix ? 'Corrected' : 'Found'} ${punctuationCount} prose semicolons in ${changedCount} of ${articleCount} files.`);
  diagnostics.slice(0, 160).forEach((item) => console.error(item));
  if (diagnostics.length > 160) console.error(`...and ${diagnostics.length - 160} additional lines.`);
  if (!fix) process.exitCode = 1;
}
