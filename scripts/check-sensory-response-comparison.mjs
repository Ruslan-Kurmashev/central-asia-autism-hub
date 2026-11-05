import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const md=await readFile('src/content/pages/kz/ru/autism-sensory-sound-light-touch.md','utf8');
const css=await readFile('src/styles/article-v2.css','utf8');
const html=await readFile('dist/kz/ru/research/pochemu-zvuki-svet-i-prikosnoveniya-vosprinimayutsya-inache/index.html','utf8');
const provenance=await readFile('docs/editorial-image-sources.md','utf8');
const token=await readFile('src/styles/typography.css','utf8');
const labels=['Гиперреактивность','Гипореактивность','Поиск ощущений'];
const rowNames=['Что это','Как это может выглядеть','Пример'];
assert.ok(md.includes('publishedAt: 2026-10-15'),'Original publication date changed');
assert.ok(md.includes('translationKey: research-autism-sensory-differences'),'Translation key changed');
assert.ok(!md.includes('](/central-asia-autism-hub/images/research/sensory-responses-three-patterns.svg)'),'Obsolete diagram still referenced');
assert.equal((md.match(/<figure class="sensory-comparison"/g)||[]).length,1,'Expected one academic comparison');
assert.ok(md.includes('<table class="sensory-comparison__table">'),'Semantic table missing');
assert.ok(md.includes('<div class="sensory-comparison__mobile">'),'Mobile version missing');
assert.ok(md.includes('scope="col"') && md.includes('scope="row"'),'Accessible table headings missing');
for(const val of [...labels,...rowNames]){
  assert.ok(md.includes(val),'Comparison value missing: '+val);
  assert.ok(html.includes(val),'Published comparison value missing: '+val);
}
assert.equal((md.match(/<section class="sensory-comparison__group"/g)||[]).length,3,'Incorrect number of mobile comparison groups');
assert.equal((md.match(/<td>/g)||[]).length,9,'Expected a three-by-three comparison matrix');
assert.ok(html.includes('sensory-comparison__table') && html.includes('sensory-comparison__mobile'),'Neither rendering may be omitted');
assert.ok(!html.includes('images/research/sensory-responses-three-patterns.svg'),'Old illustration still in output');
assert.ok(css.includes('@media (max-width: 48rem)') && css.includes('.sensory-comparison__mobile'), 'Missing mobile-only reflow');
assert.ok(css.includes('.sensory-comparison__scroll') && css.includes('min-width: 58rem'), 'Desktop comparison must retain full-width, scrollable table');
assert.ok(!css.includes('@container (max-width: 55rem)'), 'Desktop reading column must not trigger mobile cards');
for(const v of ['--font-body','--font-editorial','--type-body','--type-h3','--type-small']){
 assert.ok(token.includes(v),'Site token not defined: '+v);
 assert.ok(css.includes('var('+v+')'),'Comparison fails to use site token: '+v);
}
assert.ok(provenance.includes('Academic sensory-response comparison in the RU research article'),'Provenance not documented');
console.log('SENSORY_RESPONSE_COMPARISON_OK: semantic 3-pattern academic comparison, site type tokens, mobile reflow and unchanged article identity.');
