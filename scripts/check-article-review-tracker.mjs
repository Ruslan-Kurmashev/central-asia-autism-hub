/**
 * Audit inventory for every public AutismHub article.
 * Source of truth: published Markdown/MDX, not a static list.
 * Reviewed status requires a documented human editorial check,
 * and never implies external/independent clinical peer review.
 */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const tracker = JSON.parse(await readFile('docs/audit/article-review-tracker.json','utf8'));
assert.equal(tracker.schemaVersion, 1);
const reviewed = new Map();
for (const item of tracker.reviewed) {
  assert.ok(!reviewed.has(item.path), 'duplicate audit entry: ' + item.path);
  assert.ok(['corrected','checked_no_change'].includes(item.status), 'invalid status: ' + item.path);
  assert.ok(Array.isArray(item.checks) && item.checks.length >= 5, 'incomplete audit checklist: ' + item.path);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt), 'invalid audit date: ' + item.path);
  reviewed.set(item.path,item);
}
const all = [];
const sections = new Map();
const get = (front,key) => front.split(/\r?\n/).find(x=>x.startsWith(key+':'))
  ?.slice(key.length+1).trim().replace(/^["']|["']$/g,'');
async function walk(dir) {
  for (const e of await readdir(dir,{withFileTypes:true})) {
    const current=path.join(dir,e.name);
    if(e.isDirectory()){await walk(current);continue;}
    if(!e.isFile() || !/\.mdx?$/.test(e.name))continue;
    const source=await readFile(current,'utf8');
    const fm=source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if(!fm || get(fm,'draft')!=='false' || get(fm,'translationStatus')==='pending')continue;
    const published=get(fm,'publishedAt');
    assert.ok(published && !Number.isNaN(Date.parse(published)),
      'published article missing a valid first publication timestamp: '+current);
    const p=current.replaceAll('\\','/');
    const section=get(fm,'section')||'research';
    const lang=get(fm,'language')||'ru';
    const key=section+' / '+lang;
    sections.set(key,(sections.get(key)||0)+1);
    all.push({path:p,section,language:lang,published});
  }
}
await walk('src/content/pages');
await walk('src/content/research');
for(const [name,item] of reviewed){
  const actual=all.find(x=>x.path===name);
  assert.ok(actual,'audited page no longer public or not found: '+name);
  assert.equal(actual.published,item.firstPublishedAt,'first-publication date changed: '+name);
  assert.ok(Date.parse(item.checkedAt+'T23:59:59Z') >= Date.parse(actual.published),
    'audit date predates first publication: '+name);
}
// Historical audit entries must not be deleted when articles are consolidated.
// Retired originals must remain complete draft files with explicit static redirects.
// Modified destination articles move back into the pending human-review queue.
const previousReviewPaths = new Set(reviewed.keys());
const config = await readFile('astro.config.mjs', 'utf8');
const retired = tracker.retiredReviewed ?? [];
const recheck = tracker.needsRecheck ?? [];
const historicalPaths = new Set();
for (const record of retired) {
  assert.ok(!previousReviewPaths.has(record.path), 'retired audit still marked current: ' + record.path);
  assert.ok(!historicalPaths.has(record.path), 'duplicate historical audit: ' + record.path);
  historicalPaths.add(record.path);
  assert.ok(['corrected', 'checked_no_change'].includes(record.status), 'invalid previous audit status: '+record.path);
  assert.ok(Array.isArray(record.checks) && record.checks.length >= 5, 'lost retired audit checks: '+record.path);
  assert.equal(record.retiredAt, '2026-10-26', 'unknown retirement date: '+record.path);
  const original = await readFile(record.path, 'utf8');
  const originalFm = original.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(originalFm, 'retired source missing metadata: '+record.path);
  assert.equal(get(originalFm,'draft'), 'true', 'retired source must be draft: '+record.path);
  assert.equal(get(originalFm,'publishedAt'), record.firstPublishedAt, 'retired source publication date lost: '+record.path);
  assert.ok(typeof record.canonicalPath === 'string' && all.some(x=>x.path===record.canonicalPath),
    'retired page has no published canonical target: '+record.path);
  const canonical = await readFile(record.canonicalPath, 'utf8');
  const canonicalFm = canonical.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1];
  const fromSlug = get(originalFm,'slug'), toSlug = get(canonicalFm,'slug');
  assert.ok(fromSlug && toSlug && config.includes(
    "'/kz/ru/parents/"+fromSlug+"': '/kz/ru/parents/"+toSlug+"'"
  ), 'retired article missing exact static redirect: '+record.path);
}
for (const record of recheck) {
  assert.ok(!previousReviewPaths.has(record.path) && !historicalPaths.has(record.path),
    'changed article must not claim unchanged previous review: '+record.path);
  historicalPaths.add(record.path);
  assert.ok(['corrected', 'checked_no_change'].includes(record.status), 'invalid prior review status: '+record.path);
  assert.ok(Array.isArray(record.checks) && record.checks.length >= 5, 'lost previous checks: '+record.path);
  const current = all.find(x => x.path === record.path);
  assert.ok(current, 'changed canonical article no longer published: '+record.path);
  assert.equal(current.published, record.firstPublishedAt, 'changed canonical first date altered: '+record.path);
  assert.ok(record.reason && record.changedAt, 'missing reason for renewed human review: '+record.path);
}
assert.equal(retired.length, 10, 'ten explicitly retired support articles must be accounted for');
assert.equal(recheck.length, 6, 'six modified canonical articles require renewed editorial checks');

const waiting=all.filter(x=>!reviewed.has(x.path));
waiting.sort((a,b) => (tracker.auditOrder.indexOf(a.section)-tracker.auditOrder.indexOf(b.section)) ||
 a.published.localeCompare(b.published) || a.path.localeCompare(b.path));
console.log('Editorial audit tracker PASS: '+reviewed.size+' of '+all.length+' published articles completed, '+waiting.length+' pending, '+retired.length+' retired histories preserved, '+recheck.length+' needing re-review.');
console.log('Published articles by section/language:',JSON.stringify(Object.fromEntries([...sections].sort())));
console.log('Next outstanding entries:',waiting.slice(0,6).map(x=>x.path).join(', '));
