import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/**
 * Parent-publication readability gate.
 * Validates semantic text structure in every published RU/KK/EN parent article,
 * including newly added files. The ArticleLayout already provides the one H1.
 * Medical assertions and translations are not changed by this checker.
 */
const root = path.resolve('src/content/pages/kz');
const locales = ['ru', 'kk', 'en'];
const errors = [];
const counts = {};
let articles = 0;
let headingsChecked = 0;
let tablesFound = 0;

for (const locale of locales) {
  const dir = path.join(root, locale);
  const entries = (await readdir(dir)).filter(file => /\.mdx?$/.test(file));
  let published = 0;
  for (const file of entries) {
    const source = await readFile(path.join(dir, file), 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatter) {
      errors.push(locale + '/' + file + ': missing article frontmatter');
      continue;
    }
    const field = name =>
      frontmatter[1].match(new RegExp('^' + name + ':\\s*(.+)$', 'm'))?.[1]?.trim();
    if (field('section') !== 'parents' || field('draft') !== 'false') continue;
    published++;
    articles++;
    if (field('language') !== locale) {
      errors.push(locale + '/' + file + ': language does not match its directory');
    }
    const body = source.slice(frontmatter[0].length);
    // Remove fenced code blocks so code samples do not count as headings.
    const lines = body.split(/\r?\n/);
    let fence = null;
    const headings = [];
    for (let i = 0; i < lines.length; i++) {
      const matchFence = lines[i].match(/^\s*(```+|~~~+)/);
      if (matchFence) {
        if (!fence) fence = matchFence[1][0];
        else if (matchFence[1][0] === fence) fence = null;
        continue;
      }
      if (fence) continue;
      const match = lines[i].match(/^ {0,3}(#{1,6})[ \t]+(.+?)\s*$/);
      if (!match) continue;
      headings.push({ level: match[1].length, text: match[2], line: i + 1 });
    }

    if (!headings.length) {
      errors.push(locale + '/' + file + ': no Markdown section headings (H2) found');
    } else if (headings[0].level !== 2) {
      errors.push(locale + '/' + file + ':' + headings[0].line + ': article body must begin with H2');
    }
    for (let i = 0; i < headings.length; i++) {
      const item = headings[i];
      headingsChecked++;
      if (item.level === 1) {
        errors.push(locale + '/' + file + ':' + item.line + ': duplicate H1 - article layout already renders title');
      }
      if (i && item.level > headings[i - 1].level + 1) {
        errors.push(locale + '/' + file + ':' + item.line + ': skipped heading level H' + headings[i - 1].level + ' -> H' + item.level);
      }
    }
    if (/<h1\b/i.test(body)) {
      errors.push(locale + '/' + file + ': embedded HTML H1 is forbidden');
    }
    if (/<font\b/i.test(body) || /font-(?:size|family)\s*:/i.test(body)) {
      errors.push(locale + '/' + file + ': article-local typography overrides are forbidden');
    }
    if (locale === 'ru' && /\bEvidence verdict\s*:/i.test(body)) {
      errors.push(locale + '/' + file + ': untranslated editorial label Evidence verdict');
    }
    tablesFound += (body.match(/^\|(?:.+)\|\s*$/gm) || []).length;
  }
  counts[locale] = published;
  if (published === 0) errors.push('No published parent articles in ' + locale);
}

if (errors.length) {
  console.error('Parents article typography/editorial structure FAILED:\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Parents article editorial structure passed: ' + articles +
    ' published articles ' + JSON.stringify(counts) + ', ' + headingsChecked +
    ' semantic headings, ' + tablesFound + ' Markdown table rows checked.');
}
