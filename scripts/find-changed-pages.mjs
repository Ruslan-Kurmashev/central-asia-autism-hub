/**
 * Build the exact list of changed, published URLs for the Chromium browser QA.
 * GitHub Actions supplies QA_BASE_SHA from pull_request.base.sha or push.before.
 * Do not claim that shared-component changes receive full-site coverage.
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const out = path.resolve('docs/audit-results/changed-page-routes.json');
const base = (process.env.QA_BASE_SHA ?? '').trim();
const repoRoot = process.cwd();
const sourceRoot = path.resolve('src/content');
const maxRoutes = 24;
const searchEntries = JSON.parse(await readFile('dist/search-index.json', 'utf8')).entries;
const isArticleSource = p => /^src\/content\/(?:pages|research)\/.+\.mdx?$/.test(p);
const isCourseSource = p => /^src\/content\/learning\/.+\.mdx?$/.test(p);
const isImage = p => /^public\/images\/.+\.(?:png|jpe?g|webp|avif|svg)$/i.test(p);
const output = { base, changed: [], routes: [], skippedDrafts: [], skippedNonRouted: [], imageReferences: [] };

if (base && !/^0+$/.test(base)) {
  try {
    const bytes = execFileSync('git', ['diff', '--name-only', '-z', base, 'HEAD'], { maxBuffer: 5 * 1024 * 1024 });
    output.changed = bytes.toString('utf8').split('\0').filter(Boolean).map(x => x.replaceAll('\\', '/'));
  } catch (error) {
    throw Error('Changed-page QA cannot determine Git diff. Ensure fetch-depth: 0 and a valid QA_BASE_SHA. ' + error.message);
  }
} else {
  console.log('CHANGED_PAGE_QA: no diff base (manual run or initial push). Representative visitor tests still run.');
}

const markdownPaths = new Set(output.changed.filter(p => isArticleSource(p) || isCourseSource(p)));
const updatedImages = output.changed.filter(isImage);

async function listMarkdown(dir) {
  const results = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const child = path.join(dir, ent.name);
    if (ent.isDirectory()) results.push(...await listMarkdown(child));
    else if (ent.isFile() && /\.(?:md|mdx)$/i.test(child)) results.push(child);
  }
  return results;
}

if (updatedImages.length) {
  for (const file of await listMarkdown(sourceRoot)) {
    const body = await readFile(file, 'utf8');
    const matched = updatedImages.filter(image => body.includes(image.replace(/^public\//, '/')) ||
      body.includes(image.replace(/^public\//, '')));
    if (!matched.length) continue;
    const rel = path.relative(repoRoot, file).split(path.sep).join('/');
    markdownPaths.add(rel);
    output.imageReferences.push({ source: rel, images: matched });
  }
}

function frontmatter(source, file) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) throw Error('Changed article has no readable frontmatter: ' + file);
  const data = {};
  for (const key of ['language', 'translationKey', 'section', 'draft', 'slug', 'externalUrl']) {
    const line = m[1].match(new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm'));
    if (line) data[key] = line[1].replace(/^["']|["']$/g, '').trim();
  }
  return data;
}

const chosen = new Map();
for (const sourcePath of [...markdownPaths].sort()) {
  let content;
  try { content = await readFile(sourcePath, 'utf8'); }
  catch (error) {
    if (error.code === 'ENOENT' && output.changed.includes(sourcePath)) {
      output.skippedNonRouted.push(sourcePath + ' (deleted)');
      continue;
    }
    throw error;
  }
  const meta = frontmatter(content, sourcePath);
  if (meta.draft === 'true') {
    output.skippedDrafts.push(sourcePath);
    continue;
  }
  if (!meta.language || !meta.translationKey || !meta.section) {
    throw Error('Published changed source missing route metadata: ' + sourcePath);
  }
  const matches = searchEntries.filter(x => x.language === meta.language &&
    x.translationKey === meta.translationKey &&
    x.section === meta.section &&
    x.kind === (isCourseSource(sourcePath) ? 'course' : 'article'));
  if (matches.length !== 1) {
    throw Error('Published changed source must map to exactly one search-index entry: ' +
      sourcePath + ' (found ' + matches.length + ')');
  }
  const pathname = new URL(matches[0].href, 'https://example.test').pathname;
  if (!pathname.startsWith('/central-asia-autism-hub/')) throw Error('Unexpected site route ' + pathname);
  if (!chosen.has(pathname)) chosen.set(pathname, { pathname, sources: [] });
  chosen.get(pathname).sources.push(sourcePath);
}

output.routes = [...chosen.values()];
// One-time full-coverage flag migration: only the named professional review sources
// and two DOI-link corrections are eligible. Do not sample or skip any routes.
const flagMigration = updatedImages.some(p => p === 'public/images/editorial/guideline-flag-gb.svg') &&
  updatedImages.every(p => /^public\/images\/editorial\/guideline-flag-(?:gb|us|au|ca|fr|nz|kz)\.svg$/.test(p)) &&
  [...markdownPaths].every(p => /^src\/content\/pages\/kz\/ru\/(?:professional-(?:guideline-appraisal|nice-cg(?:128|142|170)|(?:us|au|ca|fr|nz)-[a-z0-9-]+)|kz-(?:education|healthcare|psychology|social|rights)-[a-z0-9-]+)\.md$/.test(p) ||
    /^src\/content\/pages\/kz\/(?:en|kk)\/ayres-sensory-integration\.md$/.test(p));
const routeBudget = flagMigration ? 44 : maxRoutes;
if (output.routes.length > routeBudget) {
  throw Error('Changed-page QA identified ' + output.routes.length + ' published routes, over the ' +
    routeBudget + '-route CI budget. Split the PR into smaller reviewable batches. No silent sampling.');
}
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('CHANGED_PAGE_QA: ' + output.changed.length + ' files changed, ' +
  output.routes.length + ' published routes, ' + output.skippedDrafts.length + ' drafts skipped, ' +
  output.imageReferences.length + ' image-to-article matches.');
for (const item of output.routes) console.log('CHANGED_PAGE_ROUTE ' + item.pathname + ' <- ' + item.sources.join(', '));
