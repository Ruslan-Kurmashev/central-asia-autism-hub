/* Check external URLs referenced in generated HTML. Network access errors are inconclusive. */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const concurrency = 8;
const timeoutMs = 8500;
const failOnBroken = process.argv.includes('--fail-on-broken');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = await Promise.all(entries.map(async entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(name) : entry.isFile() && name.endsWith('.html') ? [name] : [];
  }));
  return results.flat();
}
function decodeAttribute(input) {
  return input.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/gi, "'");
}
const sources = new Map();
const pages = await htmlFiles(dist);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gi)) {
    try {
      const url = new URL(decodeAttribute(match[2]));
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      if (/^(localhost|127\.0\.0\.1)$/i.test(url.hostname)) continue;
      // Skip canonical and hreflang links belonging to this same static site:
      // new PR pages cannot resolve on the live domain before deployment.
      // The separate internal-link audit checks these routes in dist/.
      if (url.hostname === 'ruslan-kurmashev.github.io' &&
          url.pathname.startsWith('/central-asia-autism-hub/')) continue;
      url.hash = '';
      const key = url.href;
      if (!sources.has(key)) sources.set(key, new Set());
      sources.get(key).add(path.relative(dist, file));
    } catch {
      // The internal link audit handles relative URLs.
    }
  }
}
async function request(url, method, partial = true, browserAgent = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': browserAgent ? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' : 'AutismHub-LinkQA/1.0 (+https://github.com/Ruslan-Kurmashev/central-asia-autism-hub)',
        'accept': 'text/html,application/pdf,*/*',
        ...(method === 'GET' && partial ? { range: 'bytes=0-1023' } : {}),
      },
    });
    await response.body?.cancel().catch(() => {});
    return { status: response.status };
  } catch (error) {
    return { status: null, error: error?.cause?.code ?? error?.name ?? String(error) };
  } finally {
    clearTimeout(timer);
  }
}
async function check(url) {
  const head = await request(url, 'HEAD');
  if (head.status !== null && head.status >= 200 && head.status < 400) {
    return { url, state: 'ok', status: head.status, method: 'HEAD' };
  }
  const get = await request(url, 'GET');
  if (get.status !== null && get.status >= 200 && get.status < 400) {
    return { url, state: 'ok', status: get.status, method: 'GET' };
  }
  if (get.status === 404 || get.status === 410) {
    // Some servers reject a partial-range GET with 404 despite serving a full GET.
    // Retry without Range before labelling the original URL as genuinely broken.
    const full = await request(url, 'GET', false);
    if (full.status !== null && full.status >= 200 && full.status < 400) {
      return { url, state: 'ok', status: full.status, method: 'GET without Range' };
    }
    if (full.status === 404 || full.status === 410) {
      // A public page may reject a crawler-specific User-Agent. Confirm once
      // with the same request a normal browser would send, without Range.
      const browser = await request(url, 'GET', false, true);
      if (browser.status !== null && browser.status >= 200 && browser.status < 400) {
        return { url, state: 'ok', status: browser.status, method: 'browser-style GET' };
      }
      if (browser.status === 404 || browser.status === 410) {
        return { url, state: 'broken', status: browser.status, method: 'browser-style GET' };
      }
      return { url, state: 'inconclusive', status: browser.status ?? full.status,
        reason: browser.error ?? 'browser-style GET restricted' };
    }
    return { url, state: 'inconclusive', status: full.status ?? get.status, reason: full.error ?? 'full GET refused' };
  }
  return { url, state: 'inconclusive', status: get.status ?? head.status, reason: get.error ?? head.error ?? 'restricted or server error' };
}
const urls = [...sources.keys()];
let index = 0;
const results = [];
await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
  while (index < urls.length) {
    const url = urls[index++];
    results.push(await check(url));
  }
}));
results.sort((a, b) => a.state.localeCompare(b.state) || a.url.localeCompare(b.url));
const ok = results.filter(x => x.state === 'ok');
const broken = results.filter(x => x.state === 'broken');
const inconclusive = results.filter(x => x.state === 'inconclusive');
console.log('External URL audit: ' + pages.length + ' pages, ' + urls.length + ' unique links, ' +
  ok.length + ' reachable, ' + broken.length + ' confirmed 404/410, ' + inconclusive.length + ' inconclusive.');
for (const item of [...broken, ...inconclusive]) {
  const usedBy = [...sources.get(item.url)];
  console.log('[' + item.state.toUpperCase() + '] ' + (item.status ?? item.reason) + ' ' + item.url +
    ' (used by ' + usedBy.length + ' pages; example ' + usedBy.slice(0, 2).join(', ') + ')');
}
if (failOnBroken && broken.length) process.exitCode = 1;
