import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Complete source inventory, independent of the collection's publication status.
const roots = ['src/content/pages/kz/ru', 'src/content/pages/kz/kk', 'src/content/pages/kz/en', 'src/content/research'];
const stats = { inspected: 0, published: 0, byLanguage: {}, boldLabels: 0, bulletsWithLabels: 0, definitionLabels: 0, tableLabels: 0, boldInlineSegments: 0, withoutEmphasis: 0 };
const suspicious = [];
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
if (stats.published < 200) throw new Error('Article inventory unexpectedly incomplete');
