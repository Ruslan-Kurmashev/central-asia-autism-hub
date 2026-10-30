/** Verify seven original reading-research guides, their diagrams, and reader worksheet. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const lessons=[
 ['01','study-process','kak-nachinaetsya-nauchnoe-issledovanie'],
 ['02','study-designs','tipy-nauchnyh-issledovanij-prostymi-slovami'],
 ['03','correlation','korrelyaciya-i-prichinnost-pochemu-svyaz-ne-prichina'],
 ['04','statistics','kak-ponimat-statistiku-nauchnyh-issledovanij'],
 ['05','graphs','kak-chitat-nauchnye-grafiki-i-tablicy'],
 ['06','contradictions','pochemu-issledovaniya-protivorechat-drug-drugu'],
 ['07','critical-reading','kak-prochitat-i-ocenit-nauchnuyu-statyu'],
];
const home='/central-asia-autism-hub/kz/ru/research/topics/reading-research/';
const dir=await readFile('dist/kz/ru/research/topics/reading-research/index.html','utf8');
const sources=await readFile('docs/editorial-image-sources.md','utf8');
assert.ok(dir.includes('research-topic-page__articles'), 'Missing science literacy listing');
for(const [num,id,slug] of lessons){
 const source=await readFile(path.join('src/content/pages/kz/ru','research-literacy-'+id+'.md'),'utf8');
 for(const required of ['section: research','topic: reading-research','translationKey: research-literacy-'+num,'translationStatus: source','draft: false','keyPoints:','sources:','evidenceLimitations:'])assert.ok(source.includes(required),id+' missing '+required);
 assert.ok((source.match(/^## /gm)??[]).length>=10,id+': insufficient section explanations');
 assert.ok((source.match(/^  - title:/gm)??[]).length>=4,id+': insufficient sources');
 assert.ok(!source.includes('\u2014'),id+': forbidden typography');
 const covers = {"study-process":"research-literacy-study-process-lab-notes.jpg","study-designs":"research-literacy-study-designs-research-team.jpg","statistics":"research-literacy-statistics-textbook.jpg","graphs":"research-literacy-graphs-paper-report.jpg","critical-reading":"research-literacy-critical-reading-highlighter.jpg","correlation":"research-literacy-correlation-chart-review.jpg","contradictions":"research-literacy-contradictions-review-team.jpg"};
 const cover = covers[id];
 assert.ok(source.includes(cover),id+': missing selected stock cover');
 assert.ok(sources.includes(cover),id+': stock cover provenance missing');
 const photo=await readFile(path.join('public/images/editorial/photos',cover));
 assert.ok(photo.length>12000 && photo[0]===255 && photo[1]===216 &&
   photo.at(-2)===255 && photo.at(-1)===217,id+': invalid JPEG');
 const diagram='research-literacy-'+id+'-diagram.svg';
 assert.ok(source.includes(diagram),id+': educational figure missing');
 assert.ok(sources.includes(diagram),id+': educational figure provenance missing');
 const svg=await readFile(path.join('public/images/research',diagram),'utf8');
 assert.ok(svg.includes('<title') && svg.includes('<desc') && !svg.includes('<script'),id+': invalid educational figure');

 const href='/central-asia-autism-hub/kz/ru/research/'+slug+'/';
 assert.ok(dir.includes('href="'+href+'"'),id+': not listed');
 const html=await readFile(path.join('dist/kz/ru/research',slug,'index.html'),'utf8');
 assert.ok(html.includes('research-literacy-'+id+'-diagram.svg'),id+': missing explanatory image in article');
 assert.ok(html.includes(cover),id+': new cover missing from article');
 assert.ok(dir.includes(cover),id+': new cover missing from directory');
 assert.ok(html.includes('article-v2__sources'),id+': missing source list');
}
const parent=await readFile('dist/kz/ru/research/index.html','utf8');
assert.ok(parent.includes('/research/topics/reading-research/'),'Missing literacy category');
for(const lang of ['kk','en']){
 const other=await readFile(path.join('dist/kz',lang,'research/topics/reading-research/index.html'),'utf8');
 for(const [, ,slug] of lessons) assert.ok(!other.includes('/kz/ru/research/'+slug+'/'),lang+' must not falsely display RU as translated');
}
const article=await readFile('dist/kz/ru/research/kak-prochitat-i-ocenit-nauchnuyu-statyu/index.html','utf8');
for(const ext of ['pdf','docx']){
 const filename='scientific-article-reading-ru.'+ext;
 assert.ok(article.includes('/central-asia-autism-hub/downloads/research/'+filename),'Missing '+ext+' link');
 const file=await readFile(path.join('dist/downloads/research',filename));
 assert.ok(file.byteLength>2000,'Missing downloadable '+ext);
 assert.ok(ext==='pdf'?file.subarray(0,4).toString()==='%PDF':file.subarray(0,2).toString()==='PK','Wrong '+ext+' signature');
}
console.log('RESEARCH_LITERACY_OK 7 published RU guides, 7 licensed stock covers and 7 retained teaching SVG figures, 2 downloadable reader forms, published directory and nontranslated locales.');
