/** Release gate for the seven EN/KK research literacy articles and their assets.
 * Invoke after Astro build, alongside the existing RU research literacy test.
 * This check supplements, never replaces, the original gate.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const lessons = [
  ['01','study-process',11,4,6,6],
  ['02','study-designs',12,5,15,0],
  ['03','correlation',12,4,6,6],
  ['04','statistics',12,4,4,0],
  ['05','graphs',12,4,0,6],
  ['06','contradictions',14,4,6,0],
  ['07','critical-reading',15,5,6,0],
];
const base='/central-asia-autism-hub/';
const field=(text,key)=>text.match(new RegExp('^'+key+':\\s*(.*?)\\s*$','m'))?.[1]?.replace(/^["']|["']$/g,'')??'';
const urls=text=>[...text.matchAll(/^\s+url:\s*['"]?([^'"\r\n]+)['"]?\s*$/gm)].map(m=>m[1].trim());
const count=(text,re)=>(text.match(re)??[]).length;
const provenance=await readFile('docs/editorial-image-sources.md','utf8');
let checked=0;
for(const locale of ['en','kk']) {
  const listing=await readFile(path.join('dist/kz',locale,'research/topics/reading-research/index.html'),'utf8');
  assert.ok(listing.includes('research-topic-page__articles'),locale+': missing research listing');
  for(const [num,id,h2,refs,tableRows,checklist] of lessons){
    const name='research-literacy-'+id+'.md';
    const src=await readFile(path.join('src/content/pages/kz',locale,name),'utf8');
    const ru=await readFile(path.join('src/content/pages/kz/ru',name),'utf8');
    const parts=src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    assert.ok(parts, name+': invalid frontmatter');
    const [,fm,body]=parts;
    const ruFm=ru.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
    for(const [key,value] of Object.entries({language:locale,section:'research',topic:'reading-research',translationKey:'research-literacy-'+num,translationStatus:'checked',draft:'false',originalPublishedAt:field(ruFm,'publishedAt'),displayPublishedAt:field(ruFm,'displayPublishedAt')||field(ruFm,'publishedAt'),riskLevel:field(ruFm,'riskLevel'),disclaimerType:field(ruFm,'disclaimerType')})){
      assert.equal(field(fm,key),value,locale+' '+name+': '+key);
    }
    assert.ok(field(fm,'publishedAt')&&field(fm,'updatedAt'), name+': missing release dates');
    assert.equal(count(body,/^## /gm),h2,name+': section count');
    assert.equal(count(body,/^\|/gm),tableRows,name+': table rows');
    assert.equal(count(body,/^- \[ \]/gm),checklist,name+': checklist');
    assert.equal(urls(fm).length,refs,name+': number of sources');
    assert.deepEqual(urls(fm),urls(ruFm),name+': source URL parity');
    assert.ok(!/[\u2013\u2014;]/.test(src),name+': forbidden article punctuation');
    const slug=field(fm,'slug'); assert.ok(slug);
    const route=base+'kz/'+locale+'/research/'+slug+'/';
    assert.ok(listing.includes('href="'+route+'"'),route+': missing listing link');
    const html=await readFile(path.join('dist/kz',locale,'research',slug,'index.html'),'utf8');
    const diagram='research-literacy-'+id+'-diagram-'+locale+'.svg';
    assert.ok(body.includes(diagram)&&html.includes(diagram),route+': missing localized diagram');
    assert.ok(provenance.includes(diagram),diagram+': missing provenance');
    const svg=await readFile(path.join('dist/images/research',diagram),'utf8');
    assert.ok(svg.includes('lang="'+locale+'"')&&svg.includes('<title')&&svg.includes('<desc')&&!/<script\b/i.test(svg),diagram+': invalid SVG');
    assert.ok(html.includes('article-v2__sources'),route+': missing bibliography');
    if(id==='critical-reading'){
      for(const ext of ['pdf','docx']){
        const file='scientific-article-reading-'+locale+'.'+ext;
        assert.ok(html.includes(base+'downloads/research/'+file),route+': missing download link');
        const bytes=await readFile(path.join('dist/downloads/research',file));
        assert.ok(bytes.byteLength>2500,file+': invalid size');
        assert.equal(bytes.subarray(0,ext==='pdf'?4:2).toString(),ext==='pdf'?'%PDF':'PK',file+': invalid signature');
      }
    }
    checked++;
  }
}
assert.equal(checked,14);
console.log('RESEARCH_LITERACY_TRANSLATIONS_OK: 14 published translations, 14 localized diagrams, 4 worksheet downloads.');
