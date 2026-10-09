import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDir = path.join(process.cwd(), 'dist');
const base = '/central-asia-autism-hub';

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }

  return files;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function extractInternalHrefs(html) {
  return [...html.matchAll(/href=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/'));
}

function extractInternalImageSrcs(html) {
  return [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith('/'));
}

function stripQueryAndHash(href) {
  return href.split('#')[0].split('?')[0];
}

function targetCandidates(href) {
  const clean = stripQueryAndHash(href);
  let pathname = clean;

  if (pathname === base || pathname === `${base}/`) {
    pathname = '/';
  } else if (pathname.startsWith(`${base}/`)) {
    pathname = pathname.slice(base.length);
  } else {
    return [];
  }

  const relative = pathname.replace(/^\/+/, '');

  if (!relative) {
    return [path.join(distDir, 'index.html')];
  }

  if (relative.endsWith('/')) {
    return [path.join(distDir, relative, 'index.html')];
  }

  if (path.extname(relative)) {
    return [path.join(distDir, relative)];
  }

  return [
    path.join(distDir, relative, 'index.html'),
    path.join(distDir, `${relative}.html`),
  ];
}

const htmlFiles = await collectHtmlFiles(distDir);
const badBaseLinks = [];
const missingTargets = [];
const missingImages = [];
const badBaseImages = [];

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, 'utf8');
  const relativeSource = path.relative(process.cwd(), filePath);
  const hrefs = extractInternalHrefs(html);

  for (const href of hrefs) {
    if (href.startsWith('/kz/')) {
      badBaseLinks.push({ source: relativeSource, href });
      continue;
    }

    if (!href.startsWith(`${base}/`) && href !== base) {
      continue;
    }

    const candidates = targetCandidates(href);
    if (candidates.length === 0) continue;

    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }

    if (!found) {
      missingTargets.push({ source: relativeSource, href });
    }
  }

  const imageSrcs = extractInternalImageSrcs(html);
  for (const src of imageSrcs) {
    if (src.startsWith('/images/') || src.startsWith('/brand/')) {
      badBaseImages.push({ source: relativeSource, src });
      continue;
    }

    if (!src.startsWith(`${base}/`)) continue;

    const candidates = targetCandidates(src);
    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }

    if (!found) missingImages.push({ source: relativeSource, src });
  }
}

if (badBaseLinks.length > 0 || missingTargets.length > 0 || badBaseImages.length > 0 || missingImages.length > 0) {
  if (badBaseLinks.length > 0) {
    console.error('Broken GitHub Pages base-path links found:');
    badBaseLinks.forEach(({ source, href }) =>
      console.error(`- ${source}: ${href}`)
    );
  }

  if (missingTargets.length > 0) {
    console.error('Internal links with missing build targets found:');
    missingTargets.forEach(({ source, href }) =>
      console.error(`- ${source}: ${href}`)
    );
  }

  if (badBaseImages.length > 0) {
    console.error('Image URLs missing the GitHub Pages base path:');
    badBaseImages.forEach(({ source, src }) =>
      console.error(`- ${source}: ${src}`)
    );
  }

  if (missingImages.length > 0) {
    console.error('Image URLs with missing build assets:');
    missingImages.forEach(({ source, src }) =>
      console.error(`- ${source}: ${src}`)
    );
  }

  process.exitCode = 1;
} else {
  console.log(
    `Internal link check passed: ${htmlFiles.length} HTML pages checked, no root /kz/ links, missing targets, or broken image sources.`
  );
}
