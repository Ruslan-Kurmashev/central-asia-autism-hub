/**
 * Enforces the evidence register's structure and referential integrity.
 * Never infers medical accuracy or automatically upgrades pending to verified.
 */
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const path='docs/evidence/claims-register.csv';
const data=await readFile(path,'utf8');

function parseCsv(source) {
  const rows=[]; let row=[], field='', quote=false;
  for(let i=0;i<source.length;i++){
    const c=source[i];
    if(quote){
      if(c==='"' && source[i+1]==='"'){field+='"';i++;} else if(c==='"'){quote=false;} else field+=c;
    } else if(c==='"'){
      if(field!=='')throw Error('Unexpected CSV quote at '+i);
      quote=true;
    } else if(c===','){row.push(field);field='';}
    else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
    else field+=c;
  }
  if(quote)throw Error('Unterminated quoted CSV field');
  if(row.length || field){row.push(field);rows.push(row);}
  return rows;
}
const rows=parseCsv(data);
const expected='claim_id,content_ref,claim_text,claim_type,source_title,doi_or_official_url,issuing_body_or_journal,source_date,population_and_jurisdiction,limitations,verification_status,checked_at,checked_by,next_review_due,notes'.split(',');
const errors=[];
if(JSON.stringify(rows[0])!==JSON.stringify(expected))errors.push('CSV header/schema mismatch');
const seen=new Set(),today=new Date().toISOString().slice(0,10);
const iso=x=>/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
for (const [i,row] of rows.slice(1).entries()){
  const n=i+2;
  if(row.length!==expected.length){errors.push('row '+n+': expected '+expected.length+' columns, got '+row.length);continue;}
  const o=Object.fromEntries(expected.map((k,j)=>[k,row[j]]));
  if(!/^ASD-\d{4}$/.test(o.claim_id)||seen.has(o.claim_id))errors.push('row '+n+': duplicate/invalid claim ID');
  seen.add(o.claim_id);
  for(const k of ['content_ref','claim_text','claim_type','source_title','doi_or_official_url','issuing_body_or_journal','source_date','population_and_jurisdiction','limitations','verification_status','next_review_due']){
    if(!o[k].trim())errors.push('row '+n+': missing '+k);
  }
  if(!/^src\/content\/(?:pages|research)\/[A-Za-z0-9_\/-]+\.mdx?$/.test(o.content_ref)||o.content_ref.includes('..')){
    errors.push('row '+n+': unsafe content path');continue;
  }
  let body='';
  try {body=await readFile(resolve(o.content_ref),'utf8');}
  catch {errors.push('row '+n+': missing content '+o.content_ref);continue;}
  const front=body.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]||'';
  if(!front.includes('draft: false'))errors.push('row '+n+': claim content is not explicitly published');
  if(!front.includes(o.claim_text))errors.push('row '+n+': exact claim not in article frontmatter');
  if(!front.includes(o.doi_or_official_url))errors.push('row '+n+': source URL not in metadata');
  if(!front.includes(o.source_title))errors.push('row '+n+': source title not in metadata');
  try{const u=new URL(o.doi_or_official_url);if(u.protocol!=='https:')errors.push('row '+n+': source not HTTPS');}
  catch{errors.push('row '+n+': invalid source URL');}
  for(const k of ['source_date','next_review_due']){
    if(!iso(o[k]))errors.push('row '+n+': invalid '+k);
  }
  if(o.checked_at && !iso(o.checked_at))errors.push('row '+n+': invalid checked_at');
  if(o.checked_at && o.checked_at>today)errors.push('row '+n+': future checked_at');
  if(!['pending','verified','needs_revision','withdrawn'].includes(o.verification_status))errors.push('row '+n+': unknown status');
  if(o.verification_status==='verified' && (!o.checked_at || !o.checked_by.trim() ||
    /ai-assisted|automated|human sign-off pending/i.test(o.checked_by))){
    errors.push('row '+n+': verified needs a real documented human check, not AI sign-off');
  }
  if(o.verification_status==='verified' && o.next_review_due<o.checked_at)errors.push('row '+n+': review due before verification');
}
console.log('[EVIDENCE_REGISTER] '+seen.size+' entries, '+errors.length+' integrity errors; no automated medical verification claimed');
for(const e of errors)console.error('[EVIDENCE_REGISTER_FAIL] '+e);
if(errors.length)process.exitCode=1;
