/*
 * Browser layout and external-source QA for the 12 original RU regional research articles.
 * No runtime dependencies. Run after Astro has built dist/.
 * Browser checks are automated diagnostics, not human visual inspection.
 */
import { readdir, readFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sourceDir = path.join(root, 'src/content/pages/kz/ru');
const base = '/central-asia-autism-hub';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const isRegional = text => /^topic:\s*kazakhstan-research\s*$/m.test(text)
  && /^draft:\s*false\s*$/m.test(text)
  && /^language:\s*ru\s*$/m.test(text);
const fileNames = (await readdir(sourceDir)).filter(x => x.endsWith('.md'));
const articles = [];
for (const filename of fileNames) {
  const markdown = await readFile(path.join(sourceDir, filename), 'utf8');
  if (isRegional(markdown)) articles.push({ slug: filename.slice(0, -3), markdown });
}
articles.sort((a, b) => a.slug.localeCompare(b.slug));
if (articles.length !== 12) throw Error('Expected 12 published RU regional science articles, found ' + articles.length);
console.log('REGIONAL_QA: ' + articles.length + ' published RU articles.');

const suffixToMime = {
  '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.html': 'text/html; charset=utf-8',
};
const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base + '/')) { res.writeHead(404);res.end();return; }
    pathname = pathname.slice(base.length);
    const target = path.resolve(dist, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(dist + path.sep)) { res.writeHead(403);res.end();return; }
    let file = target;
    const st = await stat(file).catch(() => null);
    if (st?.isDirectory()) file = path.join(file, 'index.html');
    const bytes = await readFile(file);
    res.setHeader('Content-Type', suffixToMime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(bytes);
  } catch {
    res.writeHead(404);res.end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
let chrome = null;
let profile = null;
let socket = null;
let browserOk = false;
const errors = [];
const checks = [];
try {
  let executable = null;
  for (const name of ['google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser']) {
    if (spawnSync('which', [name], { encoding: 'utf8' }).status === 0) { executable = name;break; }
  }
  if (!executable) {
    console.log('BROWSER_INCONCLUSIVE: No Chromium/Chrome executable available on runner.');
  } else {
    profile = await mkdtemp(path.join(os.tmpdir(), 'autismhub-series-qa-'));
    chrome = spawn(executable, [
      '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
      '--no-first-run','--no-default-browser-check','--remote-debugging-port=0',
      '--user-data-dir=' + profile,'about:blank',
    ], { stdio: 'ignore' });
    let debugPort = null;
    for (let i = 0; i < 150; i++) {
      try {
        debugPort = Number((await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
        if (debugPort) break;
      } catch {}
      if (chrome.exitCode !== null) break;
      await delay(120);
    }
    if (!debugPort) throw Error('Chrome did not expose a debugging port');
    const targets = await (await fetch('http://127.0.0.1:' + debugPort + '/json/list')).json();
    const tab = targets.find(t => t.type === 'page');
    if (!tab) throw Error('Chrome page target not found');
    socket = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    let nextId = 0;
    const pending = new Map();
    socket.addEventListener('message', event => {
      const response = JSON.parse(event.data);
      if (!response.id || !pending.has(response.id)) return;
      const handlers = pending.get(response.id);
      pending.delete(response.id);
      response.error ? handlers.reject(Error(JSON.stringify(response.error))) : handlers.resolve(response.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
    await send('Page.enable');
    await send('Runtime.enable');
    const modes = [
      ['mobile-360', 360], ['tablet-768', 768],
      ['desktop-1440', 1440], ['zoom-200-reflow-720', 720],
    ];
    const expression = '(' + (() => {
      const body = document.querySelector('.article-body');
      const tables = [...document.querySelectorAll('.article-body table')];
      const nodes = [...document.querySelectorAll('.article-body h2,.article-body h3,.article-body p,.article-body ul,.article-body ol,.article-body table,.article-body img,.article-body blockquote')];
      const clipped = nodes.filter(node => {
        const b = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return b.width > 1 && (b.right > innerWidth + 3 || b.left < -3) && style.position !== 'absolute';
      }).slice(0, 3).map(node => node.tagName.toLowerCase() + ':' + (node.textContent || '').trim().slice(0, 30));
      const brokenImages = [...document.querySelectorAll('.article-v2__page img')].filter(img => img.complete && img.naturalWidth === 0).map(img => img.getAttribute('src')).slice(0, 3);
      return { width: innerWidth, scroll: document.documentElement.scrollWidth, title: document.querySelectorAll('h1').length,
        main: !!document.querySelector('main'), body: !!body, tables: tables.length,
        cards: tables.filter(t => getComputedStyle(t).display === 'block').length, clipped, brokenImages };
    }).toString() + ')()';
    for (const [mode, width] of modes) {
      await send('Emulation.setDeviceMetricsOverride',{ width, height: 900, deviceScaleFactor: 1, mobile: false });
      for (const article of articles) {
        const url = 'http://127.0.0.1:' + address.port + base + '/kz/ru/research/' + article.slug + '/';
        const navigation = await send('Page.navigate', { url });
        if (navigation.errorText) throw Error('Navigation failed for ' + article.slug + ': ' + navigation.errorText);
        // Page.navigate can return before the new document finishes loading.
        // Waiting a fixed 275 ms sometimes inspected an interim document.
        // Require the requested path and document.readyState=complete first.
        const expectedPath = new URL(url).pathname;
        const deadline = Date.now() + 10000;
        let lastState = '';
        let ready = false;
        while (Date.now() < deadline) {
          const snapshot = await send('Runtime.evaluate', {
            expression: '({ pathname: location.pathname, readyState: document.readyState })',
            returnByValue: true,
          });
          const current = snapshot.result?.value;
          lastState = JSON.stringify(current ?? null);
          if (current?.pathname === expectedPath && current?.readyState === 'complete') {
            ready = true;
            break;
          }
          await delay(100);
        }
        if (!ready) throw Error('Page not ready for ' + article.slug + ' (' + mode + '): ' + lastState);
        const evaluated = await send('Runtime.evaluate', { expression, returnByValue: true });
        const m = evaluated.result?.value;
        if (!m) throw Error('No browser result for ' + article.slug);
        const issues = [];
        if (m.scroll > m.width + 3) issues.push('horizontal page overflow: ' + m.scroll + ' > ' + m.width);
        if (m.title !== 1 || !m.main || !m.body) issues.push('missing heading/main/article text');
        if (m.clipped.length) issues.push('content outside viewport: ' + m.clipped.join(', '));
        if (m.brokenImages.length) issues.push('broken images: ' + m.brokenImages.join(', '));
        if (width <= 608 && m.tables && m.cards !== m.tables) issues.push('non-responsive tables ' + m.cards + '/' + m.tables);
        if (issues.length) errors.push({ mode, slug: article.slug, issues });
        checks.push({ mode, slug: article.slug, tables: m.tables, issues: issues.length });
      }
      console.log('BROWSER_MODE ' + mode + ': ' + articles.length + ' pages checked.');
    }
    browserOk = true;
  }
} catch (error) {
  console.log('BROWSER_INCONCLUSIVE: ' + error.message);
} finally {
  socket?.close();
  if (chrome) {
    chrome.kill('SIGTERM');
    await new Promise(resolve => { chrome.once('exit', resolve); setTimeout(resolve, 1800).unref(); });
  }
  if (profile) await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  await new Promise(resolve => server.close(resolve));
}

for (const issue of errors) console.log('BROWSER_ISSUE ' + JSON.stringify(issue));
console.log('BROWSER_SUMMARY: ' + checks.length + ' render checks, ' + errors.length + ' issues, engine=' + (browserOk ? 'Chromium' : 'inconclusive') + '.');
const urls = new Map();
for (const article of articles) {
  for (const match of article.markdown.matchAll(/https:\/\/[^\s<>\"'\])]+/g)) {
    let link = match[0].replace(/[.,;]+$/, '');
    try {
      const parsed = new URL(link);
      if (parsed.hostname === 'ruslan-kurmashev.github.io') continue;
      parsed.hash = '';
      if (!urls.has(parsed.href)) urls.set(parsed.href, new Set());
      urls.get(parsed.href).add(article.slug);
    } catch {}
  }
}
let cursor=0;
const list=[...urls.keys()];
const checked=[];
async function attemptLink(link, method) {
  const controller = new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try {
    const result=await fetch(link, { method, signal:controller.signal, redirect:'follow',
      headers:{'user-agent':'Mozilla/5.0 AutismHub-Research-QA/1.0','accept':'text/html,application/pdf,*/*'} });
    await result.body?.cancel().catch(()=>{});
    return result.status;
  } catch { return null; }
  finally { clearTimeout(timer); }
}
await Promise.all(Array.from({length:Math.min(12,list.length)},async()=>{
  while(cursor<list.length){
    const link=list[cursor++];
    let status=await attemptLink(link,'HEAD');
    if (!(status>=200 && status<400)) status=await attemptLink(link,'GET');
    const state=status===404||status===410?'broken':status>=200&&status<400?'ok':'inconclusive';
    checked.push({link,state,status,usedBy:[...urls.get(link)]});
  }
}));
const counts={ok:0,broken:0,inconclusive:0};
for(const result of checked){counts[result.state]++;if(result.state!=='ok')console.log('EXTERNAL_'+result.state.toUpperCase()+' '+JSON.stringify(result));}
console.log('EXTERNAL_SUMMARY: '+list.length+' URLs; '+JSON.stringify(counts)+'.');
if(errors.length)process.exitCode=1;
