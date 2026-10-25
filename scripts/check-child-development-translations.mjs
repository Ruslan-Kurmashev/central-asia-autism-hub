import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/pages/kz');
const site = path.resolve('dist/kz');
const base = '/central-asia-autism-hub/';
const files = [
  { ru:'child-different-behaviour-home-kindergarten.md',
    en:'child-different-behaviour-home-kindergarten.md',
    kk:'child-different-behaviour-home-kindergarten.md',
    count:14, pdfs:['contexts/home-preschool-observations', 'contexts/family-educator-meeting'] },
  { ru:'bilingual-family-speech-language-development.md',
    en:'bilingual-family-speech-language-development.md',
    kk:'bilingual-family-speech-language-development.md',
    count:12, pdfs:['bilingual/seven-two-language-situations', 'bilingual/family-language-map'] },
  { ru:'child-loss-of-acquired-skills.md',
    en:'child-loss-of-acquired-skills.md',
    kk:'child-loss-of-acquired-skills.md',
    count:13, pdfs:['development/skill-loss-observation'] },
];
const unpack = source => {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(m, 'Missing YAML metadata');
  return { meta:m[1], body:source.slice(m[0].length) };
};
const field = (front, k) =>
  front.match(new RegExp('^'+k+':\\s*(.+)$','m'))?.[1].trim().replace(/^["']|["']$/g,'') || '';
const headings = body => [...body.matchAll(/^(#{2,3})\s+(.+)$/gm)]
  .map(m=>({level:m[1].length,text:m[2]}));
const urls = front => [...front.matchAll(/^\s+url:\s*"([^"]+)"/gm)].map(m=>m[1]);
const keyPoints = front => (front.match(/^keyPoints:\r?\n((?:  - .+\r?\n)+)/m)?.[1]||'')
  .split(/\r?\n/).filter(v=>v.startsWith('  - ')).length;
let checked=0, checkedPdf=0;

for (const pair of files) {
  const original = unpack(await readFile(path.join(root,'ru',pair.ru),'utf8'));
  const sourceHeadings = headings(original.body);
  const sourceH2 = sourceHeadings.filter(x=>x.level===2).length;
  const sourceH3 = sourceHeadings.filter(x=>x.level===3).length;
  const sourceLinks=urls(original.meta);
  for (const language of ['en','kk']) {
    const translated=unpack(await readFile(path.join(root,language,pair[language]),'utf8'));
    const id=language+'/'+pair[language];
    for(const prop of ['section','topic','translationKey','featuredImage','riskLevel',
      'disclaimerType','author','editor']){
      assert.equal(field(translated.meta,prop),field(original.meta,prop),id+': '+prop+' mismatch');
    }
    assert.equal(field(translated.meta,'language'),language,id+': wrong locale');
    assert.equal(field(translated.meta,'draft'),'false',id+': not published');
    assert.equal(field(translated.meta,'translationStatus'),'checked',id+': translation not checked');
    assert.equal(field(translated.meta,'originalPublishedAt'),field(original.meta,'publishedAt'),
      id+': first publication date mismatch');
    assert.equal(field(translated.meta,'displayPublishedAt'),field(original.meta,'publishedAt'),
      id+': public display date mismatch');
    assert.deepEqual(urls(translated.meta),sourceLinks,id+': scientific links modified');
    assert.equal(keyPoints(translated.meta),keyPoints(original.meta),id+': key points lost');
    const hh=headings(translated.body);
    assert.equal(hh.filter(x=>x.level===2).length,sourceH2,id+': main headings lost');
    assert.equal(hh.filter(x=>x.level===3).length,sourceH3,id+': subsections lost');
    assert.equal(hh.filter(x=>x.level===2&&/^\d+\.\s/.test(x.text)).length,
      pair.count,id+': expected numbered chapters differ');
    assert.ok(translated.body.length > original.body.length*0.63,id+': likely abbreviated translation');
    assert.ok(field(translated.meta,'featuredImageAlt').length>30,id+': alt text absent');
    assert.ok(!/[;\u2014]/u.test(translated.body),id+': disallowed punctuation');
    for (const document of pair.pdfs){
      const filename=document+'-'+language+'.pdf';
      assert.ok(translated.body.includes(base+'downloads/'+filename),
        id+': missing translated download link '+filename);
      const pdf=path.resolve('public/downloads',filename);
      const size=(await stat(pdf)).size;
      assert.ok(size>10000,id+': PDF missing or suspiciously small '+filename);
      checkedPdf++;
    }
    const slug=field(translated.meta,'slug');
    const html=await readFile(path.join(site,language,'parents',slug,'index.html'),'utf8');
    assert.ok(html.includes(field(translated.meta,'featuredImage')),id+': hero image missing');
    assert.ok(html.includes('article-v2__toc-progress'),id+': TOC missing');
    const listing=await readFile(path.join(site,language,'parents','index.html'),'utf8');
    assert.ok(listing.includes(field(translated.meta,'featuredImage')) && listing.includes(slug),
      id+': article missing from parents listing');
    checked++;
  }
}
assert.equal(checked,6);
assert.equal(checkedPdf,10);
console.log('Child-development translations PASS:',checked,'articles,',checkedPdf,
  'localized PDF link/file checks, headings, sources, metadata, hero, listing and dates.');
