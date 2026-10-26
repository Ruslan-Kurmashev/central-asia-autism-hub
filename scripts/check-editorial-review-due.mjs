/**
 * Weekly due-date inventory. Log the work queue without changing article
 * dates, human editorial tracker or translation statuses.
 */
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const now=process.env.EDITORIAL_TODAY??new Date().toISOString().slice(0,10);
if(!/^\d{4}-\d{2}-\d{2}$/.test(now)||Number.isNaN(Date.parse(now)))throw Error('Invalid review date');
const horizon=new Date(Date.parse(now+'T00:00:00Z')+45*86400000).toISOString().slice(0,10);
const get=(s,k)=>s.match(new RegExp('^'+k+':\\s*(.*?)\\s*$','m'))?.[1]?.replace(/^["']|["']$/g,'')??'';
async function walk(folder){
 let arr=[];
 for(const d of await readdir(folder,{withFileTypes:true})){
  const p=path.join(folder,d.name);
  if(d.isDirectory())arr.push(...await walk(p));
  else if(d.isFile()&&/\.mdx?$/.test(p))arr.push(p);
 }return arr;
}
const items=[],missing=[];
for(const c of ['pages','research','learning']){
 for(const file of await walk('src/content/'+c)){
  const body=await readFile(file,'utf8'),front=body.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]??'';
  if(get(front,'draft')!=='false')continue;
  const due=get(front,'reviewDueAt');
  if(!due){missing.push(file);continue;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(due)||Number.isNaN(Date.parse(due))){
    throw Error(file+': invalid reviewDueAt');
  }
  if(due<=horizon)items.push({file,due,risk:get(front,'riskLevel'),language:get(front,'language'),
    status:due<now?'overdue':'due_soon'});
 }
}
items.sort((a,b)=>a.due.localeCompare(b.due)||a.file.localeCompare(b.file));
const riskWeight={high:0,moderate:1,lower:2};
const missingDetails=[];
for(const file of missing){
 const body=await readFile(file,'utf8'),front=body.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]??'';
 const meta={file,language:get(front,'language'),section:get(front,'section'),risk:get(front,'riskLevel'),
  publishedAt:get(front,'publishedAt'),updatedAt:get(front,'updatedAt'),title:get(front,'title')};
 missingDetails.push(meta);
}
missingDetails.sort((a,b)=>(riskWeight[a.risk]??3)-(riskWeight[b.risk]??3)||
 a.section.localeCompare(b.section)||a.file.localeCompare(b.file));
console.log('[EDITORIAL_MISSING_DUE_SUMMARY] '+JSON.stringify(
 Object.fromEntries(['high','moderate','lower'].map(level=>[level,missingDetails.filter(x=>x.risk===level).length]))));
for(const item of missingDetails)console.log('[EDITORIAL_MISSING_DUE] '+
 JSON.stringify({risk:item.risk,section:item.section,language:item.language,path:item.file,
  publishedAt:item.publishedAt,updatedAt:item.updatedAt}));

const report={generatedAt:now,upcomingThrough:horizon,overdue:items.filter(x=>x.status==='overdue').length,
 dueSoon:items.filter(x=>x.status==='due_soon').length,withoutReviewDate:missing.length,items,missing,missingDetails};
const target='docs/audit-results/editorial-review-due.json';
await mkdir(path.dirname(target),{recursive:true});await writeFile(target,JSON.stringify(report,null,2)+'\n');
console.log('[EDITORIAL_REVIEW_DUE] '+report.overdue+' overdue, '+report.dueSoon+' due soon, '+missing.length+' missing reviewDueAt');
for(const e of items.slice(0,20))console.log('[EDITORIAL_REVIEW_ITEM] '+e.due+' '+e.risk+' '+e.file);
const summary=process.env.GITHUB_STEP_SUMMARY;
if(summary){
 const {appendFile}=await import('node:fs/promises');
 await appendFile(summary,'## AutismHub editorial review queue\n\n'+
 'As of '+now+': '+report.overdue+' overdue, '+report.dueSoon+' due within 45 days, '+
 missing.length+' missing review date.\n\n'+
 items.slice(0,20).map(i=>'- '+i.status+' | '+i.due+' | '+i.file).join('\n')+'\n');
}
