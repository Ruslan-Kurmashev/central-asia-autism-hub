import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Flag repealed acts if referenced in the current source list of a published article.
// Historical discussion of repealed acts in article prose remains permitted.
const root = path.resolve('src/content/pages/kz');
const locales = ['ru', 'en', 'kk'];
const withdrawn = {
  V1700014995: 'Order No. 66 of 14 February 2017 was repealed in 2021',
  V2200026513: 'Order No. 6 of 12 January 2022 was superseded by Order No. 92 of 29 April 2025',
};
let checked = 0;
const violations = [];
for (const locale of locales) {
  const dir = path.join(root, locale);
  for (const name of (await readdir(dir)).filter(name => /\.mdx?$/.test(name))) {
    const raw = await readFile(path.join(dir, name), 'utf8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if (!fm) throw new Error('Missing metadata: ' + locale + '/' + name);
    if (!/^draft:\s*false\s*$/m.test(fm)) continue;
    checked++;
    const urls = [...fm.matchAll(/^\s+url:\s*["']([^"']+)["']/gm)].map(match => match[1]);
    for (const url of urls) {
      for (const [code, message] of Object.entries(withdrawn)) {
        if (url.includes('/docs/' + code)) {
          violations.push(locale + '/' + name + ': ' + message + ' (' + url + ')');
        }
      }
    }
  }
}
console.log('Kazakhstan legal source audit: ' + checked + ' published language-specific pages.');
for (const violation of violations) console.error('REPEALED SOURCE: ' + violation);
if (violations.length) process.exitCode = 1;
else console.log('No known repealed PMPK / school-support rules cited in current sources.');
