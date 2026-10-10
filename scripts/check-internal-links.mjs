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
    .filter((href) => href.startsWith('/') || href.startsWith('#'));
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
const missingAnchors = [];
const htmlCache = new Map();

async function hasAnchor(filePath, fragment) {
  if (!filePath.endsWith('.html')) return true;
  let anchors = htmlCache.get(filePath);
  if (!anchors) {
    const content = await readFile(filePath, 'utf8');
    anchors = new Set(
      [...content.matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/g)].map((match) => match[2]),
    );
    htmlCache.set(filePath, anchors);
  }
  return anchors.has(fragment);
}

function decodeFragment(href) {
  const hash = href.indexOf('#');
  if (hash === -1 || hash === href.length - 1) return null;
  const raw = href.slice(hash + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, 'utf8');
  const relativeSource = path.relative(process.cwd(), filePath);
  const hrefs = extractInternalHrefs(html);

  for (const href of hrefs) {
    if (href.startsWith('#')) {
      const fragment = decodeFragment(href);
      if (fragment && !(await hasAnchor(filePath, fragment))) {
        missingAnchors.push({ source: relativeSource, href });
      }
      continue;
    }

    if (href.startsWith('/kz/')) {
      badBaseLinks.push({ source: relativeSource, href });
      continue;
    }

    if (!href.startsWith(`${base}/`) && href !== base) {
      continue;
    }

    const candidates = targetCandidates(href);
    if (candidates.length === 0) continue;

    let foundFile = null;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        foundFile = candidate;
        break;
      }
    }

    if (!foundFile) {
      missingTargets.push({ source: relativeSource, href });
    } else {
      const fragment = decodeFragment(href);
      if (fragment && !(await hasAnchor(foundFile, fragment))) {
        missingAnchors.push({ source: relativeSource, href });
      }
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

if (badBaseLinks.length > 0 || missingTargets.length > 0 || badBaseImages.length > 0 || missingImages.length > 0 || missingAnchors.length > 0) {
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

  if (missingAnchors.length > 0) {
    console.error('Internal navigation links with missing target anchors:');
    missingAnchors.forEach(({ source, href }) =>
      console.error(`- ${source}: ${href}`)
    );
  }

  process.exitCode = 1;
} else {
  console.log(
    `Internal link check passed: ${htmlFiles.length} HTML pages checked, no root /kz/ links, missing targets, broken image sources, or missing anchor targets.`
  );
}
