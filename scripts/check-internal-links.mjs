import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDir = path.join(process.cwd(), 'dist');
const badPatterns = [
  /href=["']\/kz\//g,
  /href=["']https:\/\/ruslan-kurmashev\.github\.io\/kz\//g,
];

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

const violations = [];

for (const filePath of await collectHtmlFiles(distDir)) {
  const contents = await readFile(filePath, 'utf8');

  for (const pattern of badPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(contents)) {
      violations.push(path.relative(process.cwd(), filePath));
      break;
    }
  }
}

if (violations.length > 0) {
  console.error('Broken GitHub Pages internal links found:');
  violations.forEach((file) => console.error(`- ${file}`));
  process.exitCode = 1;
} else {
  console.log('Internal link check passed: no root /kz/ links in built HTML.');
}
