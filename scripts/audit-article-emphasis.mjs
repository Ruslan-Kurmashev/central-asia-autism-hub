import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Complete source inventory, independent of the collection's publication status.
const roots = ['src/content/pages/kz/ru', 'src/content/pages/kz/kk', 'src/content/pages/kz/en', 'src/content/research'];
const stats = { inspected: 0, published: 0, byLanguage: {}, boldLabels: 0, bulletsWithLabels: 0, definitionLabels: 0, tableLabels: 0, boldInlineSegments: 0, withoutEmphasis: 0 };
const suspicious = [];
const reviewCandidates = [];
const candidateCounts = { groupedPlainParagraphs: 0, plainListLabels: 0 };
for (const directory of roots) {
  for (const filename of await readdir(directory)) {
    if (!/\.mdx?$/.test(filename)) continue;
    const source = await readFile(join(directory, filename), 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) throw new Error('Missing frontmatter: ' + filename);
    stats.inspected++;
    const meta = match[1];
    if (!/^draft:\s*false\s*$/m.test(meta)) continue;
    stats.published++;
    const language = meta.match(/^language:\s*(\w+)/m)?.[1] ?? 'ru';
    stats.byLanguage[language] = (stats.byLanguage[language] ?? 0) + 1;
    const body = source.slice(match[0].length);
    const lines = body.split(/\r?\n/);
    if (!/\*\*[^*\n]+\*\*/.test(body)) stats.withoutEmphasis++;
    // Flag unformatted category labels for a human editorial pass. No automated content rewrite.
    const listLabel = /^\s*(?:[-*+]\s+|\d+[.)]\s+)(?!\*\*)([\p{Lu}][\p{L}\s()-]{3,65}?)[.:]\s+(?!\[)(.{8,})$/u;
    const paraLabel = /^(?!\*\*|#|>|[-*]|\||\d+[.)])([\p{Lu}][\p{L}\s()-]{4,55}?)[.]\s+([\p{Lu}].{8,})$/u;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i], entry = listLabel.exec(line);
      if (entry && entry[1].trim().split(/\s+/).length <= 6 &&
          !/^(?:предыдущ|следующ|вернуться|далее|также по теме|previous|next|further)/iu.test(entry[1].trim()) &&
          !line.includes('](') && !/^\s*[-*]\s+https?:/iu.test(line)) {
        candidateCounts.plainListLabels++;
        if (reviewCandidates.length < 150) reviewCandidates.push([language, filename, i + 1, 'list', entry[1].trim(), line.slice(0, 145)]);
      }
      const m = paraLabel.exec(line);
      if (m && m[1].trim().split(/\s+/).length <= 6) {
        const neighbor = [i-2,i-1,i+1,i+2].some(j => j>=0&&j<lines.length&&paraLabel.test(lines[j]));
        if (neighbor) {
          candidateCounts.groupedPlainParagraphs++;
          if (reviewCandidates.length < 150) reviewCandidates.push([language, filename, i + 1, 'group', m[1].trim(), line.slice(0, 145)]);
        }
      }
    }
    for (const line of lines) {
      if (/^\s*\*\*[^*\n]{1,100}\*\*/.test(line)) stats.boldLabels++;
      if (/^\s*(?:[-*+]|\d+\.)\s+\*\*[^*\n]+\*\*/.test(line)) stats.bulletsWithLabels++;
      if (/^\s*\*\*[^*\n]{1,65}\*\*\s*(?:\([^)]{1,110}\)\s*)?(?:-|:|означает|это|is\b|means\b)/iu.test(line)) stats.definitionLabels++;
      if (/^\|\s*\*\*[^*\n]+\*\*/.test(line)) stats.tableLabels++;
      if (/[^*\s]\s+\*\*[^*\n]+\*\*/.test(line)) stats.boldInlineSegments++;
      // Editorial review queue only. No automatic rewriting of ambiguous prose.
      if ((line.match(/\*\*/g) ?? []).length > 12 && suspicious.length < 20) suspicious.push(filename);
    }
  }
}
console.log('Editorial emphasis audit (published articles): ' + JSON.stringify(stats));
if (suspicious.length) console.log('Long emphasis lines for manual inspection: ' + [...new Set(suspicious)].join(', '));
console.log('Unformatted labels for editorial review: ' + JSON.stringify({counts:candidateCounts, cases:reviewCandidates}));
if (stats.published < 200) throw new Error('Article inventory unexpectedly incomplete');
