import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const researchFolder = path.join(root, 'src', 'content', 'research');
const buildFolder = path.join(root, 'dist');

async function collect(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collect(fullPath)));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function metadata(markdown, file) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  const frontmatter = match[1];
  const field = (name) => {
    const result = frontmatter.match(new RegExp(`^${name}:[ \\t]*(.*)$`, 'm'));
    return result?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
  };
  return {
    published: field('draft') === 'false',
    language: field('language'),
    section: field('section'),
    slug: field('slug'),
    sourceUrl: field('sourceUrl'),
  };
}

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try next supported build folder convention.
    }
  }
  return null;
}

let checked = 0;
const errors = [];
for (const file of await collect(researchFolder)) {
  const info = metadata(await readFile(file, 'utf8'), file);
  if (!info.published) continue;

  if (!info.slug || !info.language || info.section !== 'research') {
    errors.push(`Invalid published research metadata in ${file}`);
    continue;
  }

  const relative = path.join('kz', info.language, 'research', info.slug, 'index.html');
  const entryPath = await firstExisting([
    path.join(buildFolder, relative),
    path.join(buildFolder, 'central-asia-autism-hub', relative),
  ]);

  if (!entryPath) {
    errors.push(`No built research article for ${relative}`);
    continue;
  }

  const html = await readFile(entryPath, 'utf8');
  if (!html.includes(info.sourceUrl)) {
    errors.push(`Missing original research link in ${entryPath}`);
  }

  const indexRelative = path.join('kz', info.language, 'research', 'index.html');
  const indexPath = await firstExisting([
    path.join(buildFolder, indexRelative),
    path.join(buildFolder, 'central-asia-autism-hub', indexRelative),
  ]);

  if (!indexPath || !(await readFile(indexPath, 'utf8')).includes(`${info.slug}/`)) {
    errors.push(`Research article not linked from its section: ${relative}`);
  }

  checked += 1;
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Research route check passed. Published research entries verified: ${checked}.`);
}
