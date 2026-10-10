import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/pages/kz');
const pairs = [
  ['help-kazakhstan-start', 'autizm-komek-kazakstan-bastau'],
  ['development-concerns-kazakhstan', 'bala-damuy-boyynsha-komek-kazakstan'],
  ['verify-specialist-center-kazakhstan', 'autizm-maman-ortalyk-tekseru'],
  ['check-medical-license-kazakhstan', 'meditsinalyk-litsenziya-tekseru-kazakstan'],
  ['autism-kindergarten-kazakhstan', 'autizm-balabaksha-kazakstan'],
  ['autism-school-kazakhstan', 'autizm-mektep-kazakstan'],
  ['social-support-rights-kazakhstan', 'otbasy-aleumettik-koldau-kazakstan'],
  ['check-service-before-payment-kazakhstan', 'kyzmetti-tolemge-deyin-tekseru-kazakstan'],
];
const targetSlugs = new Set(pairs.map(([, slug]) => slug));
const unpack = text => {
  const matched = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  assert.ok(matched, 'Missing Markdown frontmatter');
  return { front: matched[1], body: matched[2] };
};
const prop = (front, name) => {
  const m = front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  assert.ok(m, `Frontmatter field missing: ${name}`);
  return m[1].trim().replace(/^"|"$/g, '');
};
const sources = front => [...front.matchAll(/^\s+url:\s*"([^"]+)"/gm)].map(x => x[1]);
const points = front => (front.match(/^  - "/gm) ?? []).length;
const headings = body => [...body.matchAll(/^#{2,3} /gm)].length;

for (const [ruId, kkSlug] of pairs) {
  const [ruText, kkText] = await Promise.all([
    readFile(path.join(root, 'ru', `${ruId}.md`), 'utf8'),
    readFile(path.join(root, 'kk', `kk-${ruId}.md`), 'utf8'),
  ]);
  const ru = unpack(ruText), kk = unpack(kkText);
  for (const key of ['section', 'topic', 'translationKey', 'featuredImage', 'author', 'editor', 'riskLevel']) {
    assert.equal(prop(ru.front,key),prop(kk.front,key), `${ruId}: mismatched ${key}`);
  }
  assert.equal(prop(kk.front, 'language'), 'kk');
  assert.equal(prop(kk.front, 'slug'), kkSlug);
  assert.ok(['pending','checked'].includes(prop(kk.front,'translationStatus')));
  assert.ok(
    !(prop(kk.front,'draft') === 'false' && prop(kk.front,'translationStatus') !== 'checked'),
    `${ruId}: unchecked translation must remain draft`
  );
  assert.deepEqual(sources(ru.front),sources(kk.front),`${ruId}: official source URL parity`);
  assert.equal(points(ru.front),points(kk.front),`${ruId}: key point parity`);
  assert.equal(headings(ru.body),headings(kk.body),`${ruId}: heading parity`);
  assert.ok(kk.body.length > ru.body.length * 0.70,`${ruId}: body unexpectedly abbreviated`);
  assert.ok(kk.front.includes('featuredImageAlt:'),`${ruId}: missing image accessibility text`);
  assert.ok(!kkText.includes(String.fromCharCode(0x2014)),`${ruId}: disallowed em dash`);

  const links = [...kk.body.matchAll(/\]\(\/central-asia-autism-hub\/kz\/kk\/help-kazakhstan\/([^/]+)\/\)/g)]
    .map(m => m[1]);
  for(const slug of links){
    assert.ok(targetSlugs.has(slug),`${ruId}: missing Kazakh translation for internal link ${slug}`);
  }

  if(prop(kk.front,'draft') === 'false'){
    const html = await readFile(
      path.resolve('dist','kz','kk','help-kazakhstan',kkSlug,'index.html'),'utf8'
    );
    assert.ok(html.includes('article-v2__layout'),`${ruId}: wrong article design`);
    assert.ok(html.includes(prop(kk.front,'featuredImage')),`${ruId}: missing matching photo`);
    assert.ok(html.includes('/central-asia-autism-hub/kz/kk/help-kazakhstan/'),
      `${ruId}: language route not visible`);
  }
  console.log(`Kazakh KZ-HLP ${ruId}: metadata, sources, structure, photos and internal links checked`);
}
console.log('All eight Kazakh Kazakhstan help translations passed structural parity checks.');
