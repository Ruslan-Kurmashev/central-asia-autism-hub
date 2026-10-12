import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const src = path.join(root, 'src');
const tokenPath = path.join(src, 'styles', 'typography.css');
const excluded = new Set(['.git', '.astro', 'dist', 'node_modules']);
const checkedExtensions = new Set(['.css', '.astro', '.html', '.md', '.mdx']);
const violations = [];

const tokens = await readFile(tokenPath, 'utf8');
const sizes = new Set([...tokens.matchAll(/(--type-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const families = new Set([...tokens.matchAll(/(--font-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
if (!sizes.has('--type-body') || !sizes.has('--type-reading') || !sizes.has('--type-h1') || !families.has('--font-body')) {
  violations.push('src/styles/typography.css: required typography tokens missing');
}

async function visit(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(item.name)) continue;
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) { await visit(filename); continue; }
    if (!checkedExtensions.has(path.extname(item.name).toLowerCase()) || filename === tokenPath) continue;
    const content = await readFile(filename, 'utf8');
    const relative = path.relative(root, filename);
    const line = (offset) => content.slice(0, offset).split('\n').length;
    const flag = (offset, message) => violations.push(`${relative}:${line(offset)}: ${message}`);

    // Rules apply equally to global CSS, scoped Astro styles and inline styles.
    for (const m of content.matchAll(/\b(font-size|font-family)\s*:\s*([^;}\r\n]+)/gi)) {
      const property = m[1].toLowerCase();
      const value = m[2].trim();
      if (property === 'font-size') {
        const parsed = value.match(/^var\((--type-[a-z0-9-]+)\)(?:\s*!important)?$/i);
        if (!parsed || !sizes.has(parsed[1])) flag(m.index, `unsupported font-size "${value}"`);
      } else {
        const parsed = value.match(/^var\((--font-[a-z0-9-]+)\)$/i);
        if (value !== 'inherit' && (!parsed || !families.has(parsed[1]))) {
          flag(m.index, `unsupported font-family "${value}"`);
        }
      }
    }
    // Reject font shorthand tricks that bypass the font-size / font-family audit.
    for (const m of content.matchAll(/(?:^|[;{\s])font\s*:\s*([^;}\r\n]+)/gm)) {
      if (!/^(?:inherit|initial|unset|revert)$/.test(m[1].trim())) flag(m.index, 'font shorthand is not allowed');
    }
    for (const m of content.matchAll(/\b(?:fontSize|fontFamily)\s*:\s*[^,}\r\n]+/g)) {
      flag(m.index, 'inline JS font styling is not allowed; use a CSS class and typography token');
    }
    for (const m of content.matchAll(/\bfont-size\s*=\s*["'][^"']+["']/g)) {
      flag(m.index, 'SVG font-size attribute is not allowed; use a CSS token');
    }
    for (const m of content.matchAll(/(--type-[a-z0-9-]+|--font-[a-z0-9-]+)\s*:/g)) {
      flag(m.index, `typography token ${m[1]} must be defined in src/styles/typography.css`);
    }
  }
}
await visit(src);
if (violations.length) {
  console.error('Typography design-system violations:');
  violations.forEach((v) => console.error(' - ' + v));
  process.exitCode = 1;
} else {
  console.log(`Typography contract passed: ${sizes.size} size tokens and ${families.size} font families.`);
}
