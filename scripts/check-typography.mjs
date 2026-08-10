import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repositoryRoot = process.cwd();
const forbiddenCharacter = String.fromCodePoint(0x2014);
const ignoredDirectories = new Set(['.astro', '.git', 'dist', 'node_modules']);
const textExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(entryPath)));
    } else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

const violations = [];

for (const filePath of await collectTextFiles(repositoryRoot)) {
  const contents = await readFile(filePath, 'utf8');
  const lines = contents.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.includes(forbiddenCharacter)) {
      violations.push(`${path.relative(repositoryRoot, filePath)}:${index + 1}`);
    }
  });
}

if (violations.length > 0) {
  console.error('Forbidden U+2014 em dash found:');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log('Typography check passed: no U+2014 em dash found.');
}
