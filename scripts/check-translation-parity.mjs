/**
 * Inventory multilingual publication metadata parity.
 * Do not equate structural parity with quality of medical translation.
 * Existing missing language versions are warnings, never fabricated.
 */
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const roots=['pages','research','learning'];
const groups=new Map(),errors=[],notes=[];
async function walk(dir){
  let res=[];
  for(const e of await readdir(dir,{withFileTypes:true})){
    const file=path.join(dir,e.name);
    if(e.isDirectory())res.push(...await walk(file));
    else if(e.isFile()&&/\.mdx?$/.test(e.name))res.push(file);
  }
  return res;
}
const fld=(src,key)=>src.match(new RegExp('^'+key+':\\s*(.*?)\\s*$','m'))?.[1]?.replace(/^["']|["']$/g,'')??'';
let count=0;
for(const col of roots){
  for(const file of await walk('src/content/'+col)){
    const content=await readFile(file,'utf8'),fm=content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if(!fm){errors.push(file+': missing frontmatter');continue;}
    if(fld(fm,'draft')!=='false')continue;
    count++;
    const key=fld(fm,'translationKey'),lang=fld(fm,'language');
    if(!key || !['ru','kk','en'].includes(lang)){errors.push(file+': missing/invalid translation metadata');continue;}
    const id=col+':'+key,arr=groups.get(id)??[];
    arr.push({file,lang,section:fld(fm,'section'),status:fld(fm,'translationStatus'),
      published:fld(fm,'publishedAt'),original:fld(fm,'originalPublishedAt'),display:fld(fm,'displayPublishedAt'),
      risk:fld(fm,'riskLevel'),disclaimer:fld(fm,'disclaimerType')});
    groups.set(id,arr);
  }
}
let linked=0,partial=0;
for(const [key,items] of groups){
  if(items.length<2){partial++;continue;}
  linked++;
  const set=new Set();
  for(const item of items){
    if(set.has(item.lang))errors.push(key+': duplicate locale '+item.lang);
    set.add(item.lang);
  }
  const declared=items.filter(x=>x.status==='source');
  if(declared.length>1)errors.push(key+': multiple source versions');
  const source=declared[0];
  if(!source){notes.push(key+': no source-status locale to compare');continue;}
  for(const item of items){
    if(item===source)continue;
    if(item.section!==source.section)errors.push(item.file+': section differs from source');
    if(item.risk!==source.risk || item.disclaimer!==source.disclaimer)errors.push(item.file+': safety metadata differs');
    // First release dates are immutable and may differ for later translations.
    if(item.original && item.original!==source.published)errors.push(item.file+': originalPublishedAt differs from source publishedAt');
    if(item.display && item.display!==(source.display||source.published))errors.push(item.file+': displayPublishedAt differs from source display date');
    if(!item.original || !item.display)notes.push(item.file+': explicit display/original date metadata not complete');
  }
}
console.log('[TRANSLATION_PARITY] '+count+' public entries, '+groups.size+' translation groups, '+linked+' multilingual, '+partial+' single-language, '+notes.length+' notes, '+errors.length+' errors');
for(const n of notes.slice(0,20))console.log('[TRANSLATION_NOTE] '+n);
for(const err of errors.slice(0,40))console.error('[TRANSLATION_FAIL] '+err);
if(errors.length)process.exitCode=1;
