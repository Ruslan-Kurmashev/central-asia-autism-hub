/**
 * Browser smoke QA for real visitor journeys in RU, KK and EN.
 * Run after "npm run build". Uses the Chromium already present on GitHub runners.
 * This complements static link / metadata / translation validation.
 */
import { readFile, writeFile, mkdtemp, mkdir, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const base = '/central-asia-autism-hub';
const dist = path.resolve('dist');
const outDir = path.resolve('docs/audit-results/site-browser-snapshots');
const locales = ['ru', 'kk', 'en'];
const widths = [360, 768, 1440];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const errors = [];
let checks = 0;
const verify = (test, message) => { checks++; if (!test) errors.push(message); };
const searchEntries = JSON.parse(await readFile(path.join(dist, 'search-index.json'), 'utf8')).entries;
const articleRoutes = Object.fromEntries(locales.map(locale => {
  const match = searchEntries.find(entry =>
    entry.language === locale && entry.translationKey === 'help-kazakhstan-start' &&
    entry.section === 'help-kazakhstan' && entry.kind !== 'course');
  if (!match) throw Error('Cannot find published help guide for ' + locale);
  return [locale, new URL(match.href, 'http://local.test').pathname];
}));

const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css',
  '.js':'text/javascript', '.svg':'image/svg+xml', '.json':'application/json',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png',
  '.webp':'image/webp', '.woff2':'font/woff2', '.pdf':'application/pdf' };
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let requestPath = decodeURIComponent(url.pathname);
    if (!requestPath.startsWith(base + '/')) { res.writeHead(404); res.end(); return; }
    requestPath = requestPath.slice(base.length);
    const relative = requestPath.replace(/^\/+/, '');
    let target = path.resolve(dist, relative);
    if (!(target === dist || target.startsWith(dist + path.sep))) {
      res.writeHead(403); res.end(); return;
    }
    const info = await stat(target).catch(() => null);
    if (!info || info.isDirectory()) target = path.join(target, 'index.html');
    const bytes = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const chromeName = ['google-chrome-stable','google-chrome','chromium','chromium-browser']
  .find(name => spawnSync('which',[name],{stdio:'ignore'}).status === 0);
if (!chromeName) {
  await new Promise(resolve => server.close(resolve));
  throw Error('BROWSER_INCONCLUSIVE: Chromium/Chrome executable missing');
}
let profile, chrome, socket;
try {
  // Some GitHub runners fail to start headless Chrome on the first attempt.
  // Retry with a clean profile and print a short diagnostic instead of
  // silently exiting without any browser assertions.
  const variants = ['--headless=new', '--headless', '--headless=new'];
  let debugPort = null;
  for (let retry=0;retry<variants.length && !debugPort;retry++){
    profile = await mkdtemp(path.join(os.tmpdir(),'autismhub-visitor-qa-'));
    let stderr = '';
    chrome = spawn(chromeName,[variants[retry],'--no-sandbox','--disable-gpu',
      '--disable-dev-shm-usage','--no-first-run','--remote-debugging-port=0',
      '--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
    chrome.stderr?.on('data',bytes=>{stderr=(stderr+String(bytes)).slice(-1200);});
    chrome.on('error',e=>{stderr=(stderr+' '+String(e)).slice(-1200);});
    for(let attempt=0;attempt<120;attempt++){
      try {
        debugPort = Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);
        if(debugPort)break;
      } catch {}
      if(chrome.exitCode!==null)break;
      await delay(100);
    }
    if(!debugPort){
      console.warn('Chrome start retry '+(retry+1)+': exit='+chrome.exitCode+' '+stderr.slice(-500));
      if(chrome.exitCode===null)chrome.kill('SIGTERM');
      await delay(250);
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100}).catch(()=>{});
      profile=null;
    }
  }
  if(!debugPort)throw Error('BROWSER_INCONCLUSIVE: Chrome debugger did not start after three attempts');
  const targets = await (await fetch('http://127.0.0.1:'+debugPort+'/json/list')).json();
  const tab = targets.find(t=>t.type==='page');
  if(!tab)throw Error('Chrome page target unavailable');
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
  });
  const pending=new Map();
  let next=0;
  socket.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id || !pending.has(msg.id))return;
    const p=pending.get(msg.id);pending.delete(msg.id);
    msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++next;
    pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
  });
  await send('Page.enable');await send('Runtime.enable');
  const evaluate=async code=>{
    const r=await send('Runtime.evaluate',{expression:'('+code+')()',returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw Error(r.exceptionDetails.text || 'JavaScript evaluation error');
    return r.result?.value;
  };
  const browserUrl = pathname => 'http://127.0.0.1:'+port+pathname;
  async function navigate(pathname,width){
    await send('Emulation.setDeviceMetricsOverride',{width,height:920,deviceScaleFactor:1,mobile:false});
    const url=browserUrl(pathname);
    const navigation=await send('Page.navigate',{url});
    if(navigation.errorText)throw Error('Failed to navigate '+pathname+': '+navigation.errorText);
    const expected = new URL(url).pathname;
    let ready=false,last='';
    for(let attempt=0;attempt<130;attempt++){
      const r=await evaluate(()=>({path:location.pathname,state:document.readyState}));
      last=JSON.stringify(r);
      if(r?.path===expected&&r?.state==='complete'){ready=true;break;}
      await delay(75);
    }
    if(!ready)throw Error('Timed out loading '+pathname+' ('+last+')');
    await delay(60);
  }
  async function screenshot(lang,width,kind='home') {
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
    if(!shot.data)throw Error('No screenshot data for '+lang+' '+width);
    await mkdir(outDir,{recursive:true});
    await writeFile(path.join(outDir,lang+'-'+kind+'-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
  for(const locale of locales){
    for(const width of widths){
      const marker=locale+' / '+width;
      console.log('USER_JOURNEY '+marker);
      await navigate(base+'/kz/'+locale+'/',width);
      let v=await evaluate(()=>({
        lang:document.documentElement.lang,
        h1:document.querySelectorAll('main h1').length,
        main:!!document.querySelector('main'),
        overflow:document.documentElement.scrollWidth-innerWidth,
        navOpen:document.querySelector('.nav-disclosure')?.open,
        navbar:!!document.querySelector('.primary-nav'),
        languages:[...document.querySelectorAll('.language-switcher a')].map(a=>a.getAttribute('href')),
        brokenImages:[...document.images].filter(img=>img.complete&&img.naturalWidth===0).map(x=>x.src).slice(0,5),
      }));
      verify(v.lang===locale,marker+': wrong HTML lang');
      verify(v.h1===1&&v.main,marker+': missing or repeated main heading');
      verify(v.overflow<=3,marker+': horizontal overflow by '+v.overflow+'px');
      verify(v.navbar&&v.languages.length===3,marker+': navigation / language switch unavailable');
      verify(v.brokenImages.length===0,marker+': broken images '+v.brokenImages);
      verify(v.navOpen===(width>1280),marker+': responsive navigation has unexpected open state');
      if(width<=1280){
        let toggled=await evaluate(()=>{
          const panel=document.querySelector('.nav-disclosure');
          panel.querySelector('summary').click();
          return {open:panel.open,visible:!!panel.querySelector('.primary-nav')};
        });
        verify(toggled.open&&toggled.visible,marker+': mobile navigation did not open');
      }
      await screenshot(locale,width);
      if(width===360){
        const eventTest=await evaluate(()=>{
          const board=document.querySelector('[data-events-board]');
          const webinar=board?.querySelector('[data-event-filter="webinar"]');
          const all=board?.querySelector('[data-event-filter="all"]');
          if(!board||!webinar||!all)return {present:false};
          webinar.click();
          const active=webinar.getAttribute('aria-pressed');
          const visible=[...board.querySelectorAll('[data-event-kind]')].filter(el=>!el.hidden);
          const types=visible.map(el=>el.dataset.eventKind);
          all.click();
          return {present:true,active,types,all:all.getAttribute('aria-pressed')};
        });
        verify(eventTest.present&&eventTest.active==='true'&&eventTest.all==='true',
          marker+': event category controls do not react');
        verify(eventTest.types?.every(x=>x==='webinar'),marker+': event filter shows another event type');
      }
      // Static catalogue and in-browser filtering across all three languages.
      await navigate(base+'/kz/'+locale+'/learning/',width);
      const course=await evaluate(()=>{
        const root=document.querySelector('.course-catalogue');
        const items=[...document.querySelectorAll('[data-course-item]')];
        const lang=document.querySelector('[data-course-language]');
        const search=document.querySelector('[data-course-search]');
        if(!root||!lang||!search)return {present:false};
        const initial=items.filter(el=>!el.hidden).length;
        lang.value='en';lang.dispatchEvent(new Event('change',{bubbles:true}));
        const filtered=items.filter(el=>!el.hidden);
        const correct=filtered.every(el=>(el.dataset.language||'').split(' ').includes('en'));
        search.value='__not_a_real_course_18395__';search.dispatchEvent(new Event('input',{bubbles:true}));
        const none=items.filter(el=>!el.hidden).length;
        const empty=document.querySelector('[data-course-empty]')?.hidden===false;
        search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
        lang.value='all';lang.dispatchEvent(new Event('change',{bubbles:true}));
        return {present:true,total:items.length,initial,filtered:filtered.length,correct,none,empty,
          restored:items.filter(el=>!el.hidden).length,
          external:items.every(el=>!!el.querySelector('a[target="_blank"][rel*="noopener"]'))};
      });
      verify(course.present&&course.total>=21,marker+': course catalogue missing');
      verify(course.initial===course.total&&course.restored===course.total,marker+': course list not restored');
      verify(course.correct&&course.filtered>0,marker+': English course language filter failed');
      verify(course.none===0&&course.empty,marker+': course empty state incorrect');
      verify(course.external,marker+': course has no safe external registration link');
      // The global search uses an asynchronously fetched local JSON index.
      await navigate(base+'/kz/'+locale+'/search/?q='+encodeURIComponent(locale==='en'?'autism':'аутизм'),width);
      let searched=false,latest='';
      for(let attempt=0;attempt<90;attempt++){
        const state=await evaluate(()=>({
          list:document.querySelectorAll('[data-search-results] li').length,
          status:document.querySelector('[data-search-status]')?.textContent||'',
          input:document.querySelector('[data-search-query]')?.value||'',
        }));
        latest=JSON.stringify(state);
        if(state.list>0){searched=true;break;}
        await delay(90);
      }
      verify(searched,marker+': global search produced no results ('+latest.slice(0,240)+')');
      // Public guide: content, headings and functioning table-of-contents anchors.
      await navigate(articleRoutes[locale],width);
      const article=await evaluate(()=>{
        const body=document.querySelector('.article-v2__body');
        const toc=document.querySelector('.article-v2__sidebar a[href^="#"]');
        const headingId=toc?.getAttribute('href')?.slice(1);
        const target=headingId?document.getElementById(headingId):null;
        if(toc && target)toc.click();
        return {
          present:!!body,textLength:body?.textContent?.length||0,
          heading:document.querySelectorAll('main h1').length,
          toc:!!toc,anchor:!!target,hash:location.hash.slice(1),
          overflow:document.documentElement.scrollWidth-innerWidth,
          brokenImages:[...document.images].filter(img=>img.complete&&img.naturalWidth===0).map(x=>x.src).slice(0,5),
        };
      });
      verify(article.present&&article.heading===1&&article.textLength>1800,
        marker+': published guide has incomplete body');
      verify(article.toc&&article.anchor&&article.hash,
        marker+': article table of contents does not navigate');
      verify(article.overflow<=3,marker+': article overflows viewport '+article.overflow);
      verify(article.brokenImages.length===0,marker+': missing article images '+article.brokenImages);
      // Detect clipped article headings/captions and forcibly broken words in table cells.
      // Tables may scroll in a deliberate wrapper. Horizontal page overflow remains a failure.
      const textLayout = await evaluate(() => {
        const nodes = [...document.querySelectorAll(
          'main h1, .article-v2__body h2, .article-v2__body h3, .article-v2__body figcaption, .article-v2__body th, .article-v2__body td'
        )];
        const clipped = [];
        const forcedBreaks = [];
        for (const el of nodes) {
          if (!el.getClientRects().length || el.clientWidth === 0) continue;
          const css = getComputedStyle(el);
          const isTableCell = el.matches('th, td');
          if (isTableCell && css.wordBreak === 'break-all') {
            forcedBreaks.push(el.textContent.trim().slice(0, 60));
          }
          if (el.scrollWidth > el.clientWidth + 3 &&
              (['hidden','clip'].includes(css.overflowX) || css.textOverflow === 'ellipsis')) {
            clipped.push(el.textContent.trim().slice(0, 60));
          }
        }
        return {clipped:clipped.slice(0,8),forcedBreaks:forcedBreaks.slice(0,8)};
      });
      verify(textLayout.clipped.length===0,marker+': clipped article text '+JSON.stringify(textLayout.clipped));
      verify(textLayout.forcedBreaks.length===0,marker+': forced midword table wrapping '+JSON.stringify(textLayout.forcedBreaks));
      await evaluate(() => { window.scrollTo(0,0); return true; });
      await screenshot(locale,width,'article');
    }
  }

  // Retired support URLs must remain reachable as static, base-path-aware redirects.
  const mergedSupportRedirects = [["kommunikatsiya-i-aac","aac"],["aided-language-modelling","aac"],["antecedent-based-interventions","povedenie-i-obuchenie"],["play-based-interventions","razvitie-vzaimodeystvie-i-igra"],["joint-attention","razvitie-vzaimodeystvie-i-igra"],["sensory-based-strategies","sensornye-osobennosti-i-adaptatsiya-sredy"],["sensory-diet","sensornye-osobennosti-i-adaptatsiya-sredy"],["samostoyatelnost-i-povsednevnye-navyki","obuchenie-povsednevnym-navykam"],["task-analysis","obuchenie-povsednevnym-navykam"],["adapted-cbt-autistic-people","cognitive-behavioral-therapy"]];
  for (const [oldSlug, newSlug] of mergedSupportRedirects) {
    const source = path.join(dist, 'kz', 'ru', 'parents', oldSlug, 'index.html');
    const destination = path.join(dist, 'kz', 'ru', 'parents', newSlug, 'index.html');
    const html = await readFile(source, 'utf8').catch(() => '');
    verify(/http-equiv=["']refresh["']/i.test(html) && html.includes(newSlug),
      'Merged support redirect missing or wrong: ' + oldSlug + ' -> ' + newSlug);
    verify(await stat(destination).then(() => true).catch(() => false),
      'Merged support target is not generated: ' + newSlug);
  }

  // Parent support taxonomy must open on click and expose every published RU resource exactly once.
  for (const width of widths) {
    await navigate(base + '/kz/ru/parents/', width);
    const state = await evaluate(() => {
      const support = document.querySelector('details#support');
      support?.querySelector(':scope > summary')?.click();
      const subgroups = [...(support?.querySelectorAll('.section-v2__support-subgroup') || [])];
      const allLinks = subgroups.flatMap(item => [...item.querySelectorAll('.section-v2__article-row[href]')])
        .map(a => a.getAttribute('href'));
      subgroups[0]?.querySelector(':scope > summary')?.click();
      return {
        outerOpen: support?.open || false,
        innerCount: subgroups.length,
        firstOpen: subgroups[0]?.open || false,
        articleCount: allLinks.length,
        uniqueArticleCount: new Set(allLinks).size,
        primaryCount: subgroups.reduce((count, group) => count + group.querySelectorAll(':scope > .section-v2__article-list > .section-v2__article-row[href]').length, 0),
        supplementaryCount: subgroups.reduce((count, group) => count + group.querySelectorAll('.section-v2__support-supplementary-link[href]').length, 0),
        weightedInSensory: !!support?.querySelector('#support-sensory a[href$="/weighted-items/"]'),
        weightedInOther: !!support?.querySelector('#support-other a[href$="/weighted-items/"]'),
        unassignedCount: support?.querySelectorAll('.section-v2__support-unassigned a').length || 0,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    console.log('USER_JOURNEY_SUPPORT ' + width + ' ' + JSON.stringify(state));
    verify(state.outerOpen && state.firstOpen && state.innerCount === 10,
      'Parent support ' + width + ': nested accordion did not open ten groups');
    verify(state.articleCount === 45 && state.uniqueArticleCount === 45 && state.unassignedCount === 0,
      'Parent support ' + width + ': missing, duplicated or unassigned article links');
    verify(state.primaryCount === 36 && state.supplementaryCount === 9,
      'Parent support ' + width + ': unexpected editorial main/detailed article split ' + JSON.stringify(state));
    verify(state.weightedInSensory && !state.weightedInOther,
      'Parent support ' + width + ': weighted aid safety article assigned to wrong category');
    verify(state.overflow <= 3, 'Parent support ' + width + ': horizontal overflow ' + state.overflow);
    await evaluate(() => {
      const target = document.querySelector('#support .section-v2__support-subgroup');
      if (!target) return false;
      const y = window.scrollY + target.getBoundingClientRect().top - (window.innerWidth <= 768 ? 150 : 90);
      window.scrollTo({ top: y, behavior: 'instant' });
      return true;
    });
    await delay(200);
    await screenshot('ru', width, 'support');
  }

  // A translated support group must never silently display resources in the wrong language.
  for (const locale of ['kk', 'en']) {
    await navigate(base + '/kz/' + locale + '/parents/', 360);
    const localizedSupport = await evaluate(() => {
      const support = document.querySelector('details#support');
      support?.querySelector(':scope > summary')?.click();
      const groups = [...(support?.querySelectorAll('.section-v2__support-subgroup') || [])];
      const hrefs = groups.flatMap(group => [...group.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
      return {
        groupCount: groups.length,
        links: hrefs.length,
        allLocal: hrefs.every(href => href?.includes('/kz/' + document.documentElement.lang + '/parents/')),
        emptyStates: groups.filter(group => group.querySelector('.section-v2__empty')).length,
      };
    });
    console.log('USER_JOURNEY_SUPPORT_TRANSLATION ' + locale + ' ' + JSON.stringify(localizedSupport));
    verify(localizedSupport.groupCount === 10 && localizedSupport.allLocal,
      'Parent support ' + locale + ': missing group or incorrect-language article links');
  }

  // Exercise the exact changed, published URLs rather than only smoke-test examples.
  const changedFile = path.resolve('docs/audit-results/changed-page-routes.json');
  const changedPages = JSON.parse(await readFile(changedFile, 'utf8')).routes;
  for (const [index, route] of changedPages.entries()) {
    for (const width of widths) {
      await navigate(route.pathname, width);
      const state = await evaluate(() => {
        const main = document.querySelector('main');
        const imgs = [...main?.querySelectorAll('img') || []];
        const clipped = [...main?.querySelectorAll('h1,h2,h3,figcaption,th,td') || []]
          .filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 3 &&
            ['hidden','clip'].includes(getComputedStyle(el).overflowX))
          .map(el => el.textContent.trim().slice(0, 90)).slice(0, 5);
        return {
          main: Boolean(main), h1: main?.querySelectorAll('h1').length || 0,
          contentLength: main?.textContent?.trim().length || 0,
          overflow: document.documentElement.scrollWidth - innerWidth,
          broken: imgs.filter(img => img.complete && img.naturalWidth === 0)
            .map(img => img.getAttribute('src')).slice(0, 5),
          clipped,
        };
      });
      const marker = 'CHANGED_PAGE ' + route.pathname + ' / ' + width;
      verify(state.main && state.h1 === 1 && state.contentLength > 200, marker + ': missing article content/H1');
      verify(state.overflow <= 3, marker + ': page overflows viewport by ' + state.overflow);
      verify(state.broken.length === 0, marker + ': broken images ' + JSON.stringify(state.broken));
      verify(state.clipped.length === 0, marker + ': clipped headings, captions or cells ' + JSON.stringify(state.clipped));
      await evaluate(() => { scrollTo(0, 0); return true; });
      // Screenshot filename is sanitized and intentionally limited in length.
      const safeName = route.pathname.replace(/[^a-z0-9-]+/gi, '-').slice(-70);
      await screenshot('changed-' + index, width, safeName);
      console.log('USER_JOURNEY_CHANGED ' + JSON.stringify({ route:route.pathname, width, ...state }));
    }
  }

  // A Markdown task checklist must have checkbox squares without extra bullet markers.
  for (const width of widths) {
    const route = base + '/kz/ru/parents/pervye-30-dney-posle-diagnoza-autizma-v-kazakhstane/';
    await navigate(route, width);
    const state = await evaluate(() => {
      const heading = [...document.querySelectorAll('.article-v2__body h2')]
        .find(h => h.textContent?.trim() === 'Короткий чек-лист');
      const list = heading?.nextElementSibling;
      const items = list?.matches('ul') ? [...list.querySelectorAll(':scope > li')] : [];
      const other = document.querySelector('.article-v2__body ul:not(:has(input[type="checkbox"])) li');
      return {
        heading: Boolean(heading),
        items: items.length,
        checkboxes: items.filter(item => Boolean(item.querySelector('input[type="checkbox"]'))).length,
        markers: items.map(item => getComputedStyle(item).listStyleType),
        regularMarker: other ? getComputedStyle(other).listStyleType : null,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    console.log('USER_JOURNEY_CHECKLIST ' + width + ' ' + JSON.stringify(state));
    verify(state.heading && state.items === 8 && state.checkboxes === 8,
      'Parent checklist ' + width + ': missing heading, items or checkboxes');
    verify(state.markers.length === 8 && state.markers.every(marker => marker === 'none'),
      'Parent checklist ' + width + ': extra bullet markers ' + JSON.stringify(state.markers));
    verify(state.regularMarker === 'disc',
      'Parent checklist ' + width + ': ordinary list markers unexpectedly changed');
    verify(state.overflow <= 3, 'Parent checklist ' + width + ': horizontal overflow');
    await evaluate(() => {
      const heading = [...document.querySelectorAll('.article-v2__body h2')]
        .find(h => h.textContent?.trim() === 'Короткий чек-лист');
      heading?.scrollIntoView({ block: 'start' });
      return true;
    });
    await delay(150);
    await screenshot('ru', width, 'diagnosis-checklist');
  }

  // Regression: multi-column parent play tables must never split Russian words.
  for (const width of [360, 768, 900, 1440]) {
    const route = base + '/kz/ru/parents/kak-razvivaetsya-igra-rebenka-i-uchastie-roditeley/';
    await navigate(route, width);
    const state = await evaluate(() => {
      const wrappers = [...document.querySelectorAll('.article-comparison-table-scroll')];
      const tables = wrappers.map(w => w.querySelector('table'));
      const splitWords = [];
      const invalidStyles = [];
      for (const [index, table] of tables.entries()) {
        for (const cell of table.querySelectorAll('tbody tr > :first-child')) {
          const css = getComputedStyle(cell);
          if (css.overflowWrap !== 'normal' || css.wordBreak !== 'normal' || css.hyphens !== 'none') {
            invalidStyles.push(index + ': ' + cell.textContent.trim().slice(0, 50));
          }
          const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node.textContent || '';
            for (const match of text.matchAll(/[А-Яа-яЁё]{2,}/g)) {
              const range = document.createRange();
              range.setStart(node, match.index);
              range.setEnd(node, match.index + match[0].length);
              if ([...range.getClientRects()].filter(rect => rect.width > 0).length > 1) {
                splitWords.push(match[0]);
              }
            }
          }
        }
      }
      return {
        wrapperCount: wrappers.length,
        columnCounts: tables.map(t => t.querySelectorAll('thead th').length),
        splitWords: splitWords.slice(0, 10),
        invalidStyles: invalidStyles.slice(0, 10),
        overflow: document.documentElement.scrollWidth - innerWidth,
        mobileCardCount: tables.filter(t => getComputedStyle(t).display === 'block').length,
        scrollCount: wrappers.filter(w => w.scrollWidth > w.clientWidth + 3).length,
      };
    });
    console.log('USER_JOURNEY_PLAY_TABLES ' + width + ' ' + JSON.stringify(state));
    verify(state.wrapperCount === 2 && state.columnCounts.join(',') === '3,4',
      'Play tables ' + width + ': expected two wrapped 3/4-column tables');
    verify(state.invalidStyles.length === 0 && state.splitWords.length === 0,
      'Play tables ' + width + ': broken words ' + JSON.stringify(state));
    verify(state.overflow <= 3, 'Play tables ' + width + ': page horizontal overflow ' + state.overflow);
    if (width <= 768) verify(state.mobileCardCount === 2 && state.scrollCount === 0,
      'Play tables ' + width + ': expected responsive cards without horizontal scrolling');
    if (width === 900) verify(state.scrollCount >= 1,
      'Play tables ' + width + ': wide table should scroll inside the labelled region');
  }

  // Verify actual browser rendering, not just Markdown source or AST nodes.
  for (const width of [360, 1440]) {
    await navigate(base+'/kz/ru/parents/kak-autichnye-deti-obshchayutsya/',width);
    const emphasis=await evaluate(()=>{
      const body=document.querySelector('.article-v2__body');
      const paragraph=[...(body?.querySelectorAll('p')||[])].find(
        p=>p.textContent?.trim().startsWith('Жесты и движения.')
      );
      const label=paragraph?.querySelector('strong');
      return {
        text:label?.textContent?.trim()||'',
        className:label?.className||'',
        labelWeight:label?getComputedStyle(label).fontWeight:null,
        paragraphWeight:paragraph?getComputedStyle(paragraph).fontWeight:null,
      };
    });
    console.log('USER_JOURNEY_EMPHASIS '+width+' '+JSON.stringify(emphasis));
    verify(emphasis.text==='Жесты и движения.' &&
      emphasis.className.includes('article-key-label') &&
      Number(emphasis.labelWeight)>=600 &&
      Number(emphasis.labelWeight)>Number(emphasis.paragraphWeight),
      'ru communication / '+width+': semantic category label not visibly bold');
  }

  // Verify the exact parent article that previously showed a 24-item TOC,
  // small table columns and a placeholder instead of a stock photograph.
  for (const width of [360, 768, 1440]) {
    await navigate(base+'/kz/ru/parents/pochemu-rebenok-vedet-sebya-po-raznomu-doma-i-v-sadike/', width);
    const layout = await evaluate(() => {
      const toc=document.querySelector('.article-v2__sidebar nav');
      const rows=[...document.querySelectorAll('.context-comparison-table-scroll table')];
      const images=[...document.querySelectorAll('.article-v2__hero-art img')];
      const image=images.find(x=>x.src.includes('parent-context-home-preschool-pexels-7780915.jpg'));
      const first=rows[0]?.querySelector('td');
      const scroll=document.querySelector('.context-comparison-table-scroll');
      return {
        sectionCount:toc?.querySelectorAll('li').length || 0,
        headings:[...(toc?.querySelectorAll('a')||[])].map(x=>x.textContent?.trim()).slice(-2),
        tables:rows.length,
        cellWrap:first?getComputedStyle(first).overflowWrap:'',
        coverFound:!!image,
        coverLoaded:!!image?.naturalWidth,
        insideWidth:scroll?.clientWidth || 0,
        scrollWidth:scroll?.scrollWidth || 0,
        pageOverflow:document.documentElement.scrollWidth - innerWidth,
        diagram:(()=>{
          const cards=[...document.querySelectorAll('.context-observation-card')];
          const icons=cards.flatMap(card=>[...card.querySelectorAll('img')]);
          return {
            count:cards.length,
            labels:cards.map(card=>card.querySelector('figcaption strong')?.textContent?.trim()||''),
            iconsLoaded:icons.length===6 && icons.every(img=>img.complete && img.naturalWidth>0),
            overlapping:cards.some(card=>{
              const art=card.querySelector('.context-observation-card__images');
              const caption=card.querySelector('figcaption');
              if(!art || !caption)return true;
              return caption.getBoundingClientRect().top < art.getBoundingClientRect().bottom + 4;
            }),
          };
        })(),
      };
    });
    console.log('USER_JOURNEY_CONTEXT_ARTICLE '+width+' '+JSON.stringify(layout));
    verify(layout.diagram.count===3 &&
      layout.diagram.labels.join('|')==='Условия|Поддержка|Участие' &&
      layout.diagram.iconsLoaded && !layout.diagram.overlapping,
      'Context article '+width+': three captioned illustrations must load without overlap');
    verify(layout.sectionCount===14,'Context article '+width+': TOC must have 14 sections');
    verify(layout.tables===4,'Context article '+width+': all four tables should be scroll-safe');
    verify(layout.coverFound&&layout.coverLoaded,'Context article '+width+': local Pexels photo not loaded');
    verify(layout.cellWrap!=='anywhere','Context article '+width+': broken word wrapping still enabled');
    verify(layout.pageOverflow<=3,'Context article '+width+': horizontal document overflow');
    if(width===1440)verify(layout.scrollWidth>layout.insideWidth,
      'Context article '+width+': dense comparison table needs a horizontal scrollbar');
    else verify(layout.scrollWidth<=layout.insideWidth+3,
      'Context article '+width+': stacked mobile comparison cards should not scroll horizontally');
  }
  // M-CHAT-R first-stage checks: all three languages, three viewport sizes,
  // both reversed items and risk branches, and results-only print content.
  for(const locale of locales){
    for(const width of widths){
      await navigate(base+'/kz/'+locale+'/tools/mchat-r/',width);
      const marker='MCHAT '+locale+'/'+width;
      const staticCheck=await evaluate(()=>({
        heading:document.querySelectorAll('main h1').length,
        questions:document.querySelectorAll('[data-question]').length,
        answerGroups:document.querySelectorAll('[data-question] input[type=radio]').length,
        overflow:document.documentElement.scrollWidth-innerWidth,
        printText:document.querySelector('.mchat__print')?.textContent||'',
        firstQuestion:document.querySelector('[data-question] legend')?.textContent||''
      }));
      verify(staticCheck.heading===1&&staticCheck.questions===20&&staticCheck.answerGroups===40,marker+': missing official questions or answer options');
      verify(staticCheck.overflow<=3,marker+': horizontal overflow');
      verify(!staticCheck.printText.includes(staticCheck.firstQuestion.trim()),marker+': question leaked into printable report');
      const scenario=await evaluate(()=>{
        const root=document.querySelector('[data-mchat]');
        const age=root?.querySelector('#mchat-age');
        const questions=[...root.querySelectorAll('[data-question]')];
        const fill=(score)=>{
          root.querySelector('[data-reset]')?.click();
          age.value='18';root.querySelector('[data-start]')?.click();
          for(let i=0;i<20;i++){
            const elevated=i<score;
            const yes=[2,5,12].includes(i+1)?elevated:!elevated;
            const input=questions[i]?.querySelector('input[value="'+(yes?'yes':'no')+'"]');
            if(!input)return false;
            input.checked=true;
            input.dispatchEvent(new Event('change',{bubbles:true}));
          }
          for(let i=0;i<20;i++)root.querySelector('[data-next]')?.click();
          return !root.querySelector('[data-view=result]').hidden;
        };
        window.__mchatQaFill=fill;
        const all=[];
        for(let score=0;score<=20;score++){
          const completed=fill(score);
          all.push({
            requested:score,completed,
            score:root.querySelector('[data-result-score]')?.textContent?.trim(),
            category:root.querySelector('[data-result-category]')?.textContent?.trim(),
            meaning:root.querySelector('[data-result-meaning]')?.textContent?.trim(),
            advice:root.querySelector('[data-result-advice]')?.textContent?.trim(),
            follow:root.querySelector('[data-result-follow]')?.textContent?.trim(),
            pdfScore:root.querySelector('[data-print-score]')?.textContent?.trim(),
            pdfMeaning:root.querySelector('[data-print-meaning]')?.textContent?.trim(),
            pdfAdvice:root.querySelector('[data-print-advice]')?.textContent?.trim(),
            pdfFollow:root.querySelector('[data-print-follow]')?.textContent?.trim()
          });
        }
        const printed=root.querySelector('.mchat__print')?.textContent||'';
        const firstQuestion=questions[0]?.querySelector('legend')?.textContent?.trim()||'';
        return {
          all, complete:root.dataset.complete, 
          resultHasQuestion:printed.includes(firstQuestion),
          guidanceCount:root.querySelectorAll('.mchat__guidance h3').length,
          printGuidanceCount:root.querySelectorAll('.mchat__print-step h3').length,
          helpLink:root.querySelector('.mchat__guidance a')?.getAttribute('href')
        };
      });
      verify(scenario.all.length===21&&scenario.all.every(x=>x.completed),marker+': one or more of 21 complete-answer scenarios failed');
      verify(scenario.all.every(x=>x.score===x.requested+' / 20'&&x.pdfScore===x.score),marker+': wrong score on screen or PDF');
      verify(scenario.all.every(x=>x.category?.length>10&&x.meaning?.length>45&&x.advice?.length>80&&x.follow?.length>4),marker+': missing clear outcome, meaning, next step or follow-up status');
      verify(scenario.all.every(x=>x.pdfMeaning===x.meaning&&x.pdfAdvice===x.advice&&x.pdfFollow===x.follow),marker+': printable report differs from displayed results');
      const categoryOf=(score)=>score<=2?'low':score<=7?'moderate':'high';
      for(const band of ['low','moderate','high']){
        const entries=scenario.all.filter(x=>categoryOf(x.requested)===band);
        verify(entries.length===(band==='low'?3:band==='moderate'?5:13),marker+': wrong number of scores in '+band+' range');
        verify(new Set(entries.map(x=>x.category)).size===1&&new Set(entries.map(x=>x.meaning)).size===1&&new Set(entries.map(x=>x.follow)).size===1,marker+': inconsistent guidance inside '+band+' range');
      }
      verify(new Set([0,3,8].map(i=>scenario.all[i]?.category)).size===3,marker+': category thresholds not distinct at 0,3,8');
      verify(scenario.all[3].follow!==scenario.all[2].follow&&scenario.all[8].follow!==scenario.all[7].follow,marker+': incorrect Follow-Up transition at 2/3 or 7/8');
      verify(scenario.guidanceCount===3&&scenario.printGuidanceCount===3&&scenario.helpLink?.includes('/help-kazakhstan/'),marker+': parent guidance or Kazakhstan link is missing');
      verify(scenario.complete==='true'&&!scenario.resultHasQuestion,marker+': private answer/question leakage to PDF');
      console.log('USER_JOURNEY_MCHAT_ALL_SCORES '+JSON.stringify({locale,width,checked:scenario.all.length,low:scenario.all.slice(0,3).map(x=>x.score),moderate:scenario.all.slice(3,8).map(x=>x.score),high:scenario.all.slice(8).map(x=>x.score),overflow:staticCheck.overflow,failures:errors.filter(x=>x.startsWith(marker))}));
      if(width===1440){
        for(const score of [0,2,3,7,8,20]){
          const ok=await evaluate('()=>window.__mchatQaFill('+score+')');
          verify(ok,marker+': could not prepare PDF for score '+score);
          const printed=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
          verify(Boolean(printed?.data),marker+': Chromium PDF export failed for score '+score);
          if(printed?.data){
            await mkdir(outDir,{recursive:true});
            await writeFile(path.join(outDir,locale+'-mchat-score-'+score+'.pdf'),Buffer.from(printed.data,'base64'));
          }
        }
      }
      if(width===360||width===1440)await screenshot(locale,width,'mchat');
    }
  }
  console.log('USER_JOURNEY_SUMMARY '+checks+' assertions; '+errors.length+' problems; '+(locales.length*widths.length*3)+' route visits.');
  for(const message of errors)console.log('USER_JOURNEY_FAIL '+message);
  if(errors.length)process.exitCode=1;
} finally {
  socket?.close();
  if(chrome){chrome.kill('SIGTERM');await new Promise(resolve=>{
    if(chrome.exitCode!==null)return resolve();
    chrome.once('exit',resolve);setTimeout(resolve,1500).unref();
  });}
  if(profile)await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150}).catch(()=>{});
  await new Promise(resolve=>server.close(resolve));
}
