/* Static HTML accessibility checks. Not a replacement for browser or screen-reader QA. */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('dist');
async function files(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const next = await Promise.all(entries.map(item => {
    const target = path.join(root, item.name);
    if (item.isDirectory()) return files(target);
    return Promise.resolve(item.isFile() && item.name.endsWith('.html') ? [target] : []);
  }));
  return next.flat();
}
const pages = await files(dir);
const errors = [];
const warnings = [];
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const relative = path.relative(dir, page);
  const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
  if (!lang) errors.push(relative + ': missing html lang');
  if (!/<meta\s+name=["']viewport["']/i.test(html)) errors.push(relative + ': missing viewport meta');
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(html)) errors.push(relative + ': missing main landmark');
  if (!/<a\b[^>]*\bhref=["']#main-content["']/i.test(html)) errors.push(relative + ': missing skip link');
  const headings = [...html.matchAll(/<h1(?:\s|>)/gi)];
  if (headings.length !== 1) warnings.push(relative + ': expected one H1, found ' + headings.length);
  const ids = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) errors.push(relative + ': duplicate id=' + match[1]);
    ids.add(match[1]);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=\s*(["'])(.*?)\1/i.test(m[0])) errors.push(relative + ': img without alt attribute');
  }
  for (const m of html.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi)) {
    if (!/\brel=["'][^"']*\bnoopener\b/i.test(m[0])) warnings.push(relative + ': target=_blank without rel=noopener');
  }
}
console.log('Static HTML accessibility QA: ' + pages.length + ' pages; ' + errors.length + ' errors; ' + warnings.length + ' warnings.');
for (const s of errors.slice(0, 60)) console.error('[ERROR] ' + s);
for (const s of warnings.slice(0, 30)) console.log('[WARNING] ' + s);
if (errors.length) process.exitCode = 1;
