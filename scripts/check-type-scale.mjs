import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// Fail-closed typography gate shared by PR validation and deployment.
// Covers site components, every article Markdown/MDX source and CMS styles.
const root = process.cwd();
const canonical = path.join(root, 'src/styles/typography.css');
const cmsMirror = path.join(root, 'public/admin/typography.css');
const ignoredDirectories = new Set(['.git', '.astro', 'dist', 'node_modules']);
const extensions = new Set(['.css', '.astro', '.html', '.md', '.mdx']);
const violations = [];
let filesChecked = 0;

const reference = await readFile(canonical, 'utf8');
const mirror = await readFile(cmsMirror, 'utf8');
const sizes = new Set([...reference.matchAll(/(--type-[a-z0-9-]+)\s*:/g)].map(match => match[1]));
const fonts = new Set([...reference.matchAll(/(--font-[a-z0-9-]+)\s*:/g)].map(match => match[1]));

if (reference !== mirror) {
  violations.push('public/admin/typography.css: CMS type tokens differ from src/styles/typography.css');
}
for (const required of ['--type-body', '--type-reading', '--type-h1', '--type-h2', '--type-h3']) {
  if (!sizes.has(required)) violations.push('src/styles/typography.css: missing ' + required);
}
for (const required of ['--font-body', '--font-editorial']) {
  if (!fonts.has(required)) violations.push('src/styles/typography.css: missing ' + required);
}

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(full);
      continue;
    }
    if (!extensions.has(path.extname(entry.name).toLowerCase())) continue;
    if (full === canonical || full === cmsMirror) continue;

    filesChecked++;
    const content = await readFile(full, 'utf8');
    const relative = path.relative(root, full).replaceAll(path.sep, '/');
    const position = offset => content.slice(0, offset).split('\n').length;
    const error = (offset, message) => violations.push(relative + ':' + position(offset) + ': ' + message);

    // Reject direct, invalid, undefined or unrelated CSS size/family variables.
    // This includes Astro <style> blocks and inline HTML style attributes.
    for (const match of content.matchAll(/\b(font-size|font-family)\s*:\s*([^;}\r\n]+)/gi)) {
      const kind = match[1].toLowerCase();
      const value = match[2].trim();
      if (kind === 'font-size') {
        const token = value.match(/^var\((--type-[a-z0-9-]+)\)(?:\s*!important)?$/i);
        if (!token || !sizes.has(token[1])) error(match.index, 'unapproved font size: ' + value);
      } else {
        const token = value.match(/^var\((--font-[a-z0-9-]+)\)$/i);
        if (value !== 'inherit' && (!token || !fonts.has(token[1]))) {
          error(match.index, 'unapproved font family: ' + value);
        }
      }
    }

    // Do not allow shorthand or JS-based overrides to bypass the CSS rule.
    for (const match of content.matchAll(/\bfont\s*:\s*([^;}\r\n]+)/gi)) {
      if (!/^(?:inherit|initial|unset|revert)$/.test(match[1].trim())) {
        error(match.index, 'CSS font shorthand is forbidden; use font-family and font-size tokens');
      }
    }
    for (const match of content.matchAll(/\b(?:fontSize|fontFamily)\s*:\s*[^,}\r\n]+/g)) {
      error(match.index, 'inline font styling is forbidden; use CSS type tokens');
    }
    for (const match of content.matchAll(/\bfont-size\s*=\s*["'][^"']+["']/gi)) {
      error(match.index, 'font-size HTML/SVG attributes are forbidden');
    }
    for (const match of content.matchAll(/<font\b/gi)) {
      error(match.index, 'HTML font tags are forbidden in pages and publications');
    }
    for (const match of content.matchAll(/(--type-[a-z0-9-]+|--font-[a-z0-9-]+)\s*:/g)) {
      error(match.index, 'type token ' + match[1] + ' may only be declared in the canonical stylesheet');
    }

    // Article layouts render the page H1. An article body must not create a
    // duplicate H1, including through Markdown or raw HTML.
    if (/^src\/content\/(pages|research)\//.test(relative) && /\.(md|mdx)$/.test(relative)) {
      const withoutFrontmatter = content.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, '');
      const bodyLines = withoutFrontmatter.split(/\r?\n/);
      let fenced = false;
      let fenceChar = '';
      const body = bodyLines.map(line => {
        const open = line.match(/^\s*(```+|~~~+)/);
        if (open) {
          if (!fenced) { fenced = true; fenceChar = open[1][0]; }
          else if (open[1][0] === fenceChar) { fenced = false; }
          return '';
        }
        return fenced ? '' : line;
      }).join('\n');
      for (const match of body.matchAll(/^#\s+\S.*$/gm)) {
        error(content.indexOf(match[0]), 'article Markdown must not have H1; the article layout owns H1');
      }
      for (const match of body.matchAll(/<h1\b/gi)) {
        error(content.indexOf(match[0]), 'article HTML must not have H1; use an H2 section heading');
      }
    }
  }
}

await scan(path.join(root, 'src'));
await scan(path.join(root, 'public'));

if (violations.length) {
  console.error('AutismHub typography publication law FAILED:');
  violations.forEach(item => console.error(' - ' + item));
  process.exitCode = 1;
} else {
  console.log('AutismHub typography publication law passed: ' + filesChecked +
    ' site/CMS files checked, ' + sizes.size + ' size tokens and ' + fonts.size + ' families.');
}
