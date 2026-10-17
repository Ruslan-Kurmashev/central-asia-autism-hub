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
    assert.match(published ?? '',/^\d{4}-\d{2}-\d{2}$/,'published article missing first date: '+current);
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
  assert.ok(item.checkedAt >= actual.published,'audit date predates first publication: '+name);
}
const waiting=all.filter(x=>!reviewed.has(x.path));
waiting.sort((a,b) => (tracker.auditOrder.indexOf(a.section)-tracker.auditOrder.indexOf(b.section)) ||
 a.published.localeCompare(b.published) || a.path.localeCompare(b.path));
console.log('Editorial audit tracker PASS: '+reviewed.size+' of '+all.length+' published articles completed, '+waiting.length+' pending.');
console.log('Published articles by section/language:',JSON.stringify(Object.fromEntries([...sections].sort())));
console.log('Next outstanding entries:',waiting.slice(0,6).map(x=>x.path).join(', '));
