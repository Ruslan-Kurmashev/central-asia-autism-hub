import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const template = await readFile('src/components/LearningCatalog.astro', 'utf8');
const tsCode = template.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(tsCode, 'Learning catalogue browser logic not found');
const jsCode = ts.transpileModule(tsCode, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

const localeLabels = {
  ru: { ru: 'Русский', kk: 'Казахский', en: 'Английский', parents: 'Родителям', professionals: 'Специалистам' },
  kk: { ru: 'Орысша', kk: 'Қазақша', en: 'Ағылшынша', parents: 'Ата-аналарға', professionals: 'Мамандарға' },
  en: { ru: 'Russian', kk: 'Kazakh', en: 'English', parents: 'Parents', professionals: 'Professionals' },
};
const prefixes = {ru:'Найдено',kk:'Табылды',en:'Found'};
const langCounts = [];
const audienceCounts = [];
const topicCounts = [];

for (const lang of Object.keys(localeLabels)) {
  const html = await readFile('dist/kz/'+lang+'/learning/index.html', 'utf8');
  const cards = [...html.matchAll(/<article\b[^>]*\bdata-course-item\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(cards.length >= 21, 'Missing learning catalogue items in '+lang);

  function field(raw, name) { return raw.match(new RegExp('\\bdata-'+name+'="([^"]*)"'))?.[1] ?? ''; }
  const items = cards.map((raw) => ({
    hidden: false,
    dataset: {
      language: field(raw,'language'),
      audience: field(raw,'audience'),
      topic: field(raw,'topic'),
      searchText: field(raw,'search-text'),
    },
  }));
  const totals = {
    language: Object.fromEntries(['ru','kk','en'].map((key) => [
      key, items.filter((item) => item.dataset.language.split(' ').includes(key)).length,
    ])),
    audience: Object.fromEntries(['parents','professionals'].map((key) => [
      key, items.filter((item) => item.dataset.audience.split(' ').includes(key)).length,
    ])),
    topic: Object.fromEntries([...new Set(items.map((item) => item.dataset.topic).filter(Boolean))].map((key) => [
      key, items.filter((item) => item.dataset.topic === key).length,
    ])),
  };
  langCounts.push(totals.language);
  audienceCounts.push(totals.audience);
  topicCounts.push(totals.topic);

  for (const [kind, counts] of Object.entries(totals)) {
    const regex = new RegExp('<select\\b[^>]*\\bdata-course-'+kind+'\\b[^>]*>([\\s\\S]*?)<\\/select>');
    const menu = html.match(regex)?.[1];
    assert.ok(menu, 'Missing '+kind+' dropdown in '+lang);
    const options = Object.fromEntries([...menu.matchAll(/<option\b[^>]*value="([^"]+)"[^>]*>([^<]*)<\/option>/g)]
      .map((match) => [match[1], match[2].trim()]));
    assert.deepEqual(Object.keys(options).sort(), ['all',...Object.keys(counts)].sort(),
      'Unexpected '+kind+' dropdown options in '+lang);
    for (const [key, count] of Object.entries({all:items.length,...counts})) {
      assert.ok(options[key].endsWith('('+count+')'),
        'Wrong '+lang+' '+kind+' '+key+' count: '+options[key]+' instead of '+count);
      if (localeLabels[lang][key]) assert.ok(options[key].includes(localeLabels[lang][key]),
        'Wrong localized language or audience label for '+lang+' '+key);
    }
  }

  function input(value = 'all') {
    const listeners = {};
    return {
      value,
      addEventListener(event, callback) { listeners[event] = callback; },
      fire(event) {
        assert.equal(typeof listeners[event], 'function', 'Missing '+event+' event handler');
        listeners[event]();
      },
    };
  }
  const search = input('');
  const audience = input();
  const language = input();
  const topic = input();
  const result = { textContent: prefixes[lang]+': '+items.length, dataset:{} };
  const empty = { hidden: true };
  const controls = {
    '[data-course-search]': search,
    '[data-course-audience]': audience,
    '[data-course-language]': language,
    '[data-course-topic]': topic,
    '[data-course-result]': result,
    '[data-course-empty]': empty,
  };
  const root = {
    querySelector(selector) {return controls[selector] ?? null;},
    querySelectorAll() {return items;},
  };
  const events = {};
  runInNewContext(jsCode, {
    document: {querySelector(selector) {return selector === '.course-catalogue' ? root : null;}},
    window: {location:{hash:''}, addEventListener(event, fn){events[event]=fn;}},
  });
  function check(expected, name) {
    assert.equal(items.filter((item) => !item.hidden).length, expected, lang+': visible count for '+name);
    assert.equal(result.textContent, prefixes[lang]+': '+expected, lang+': displayed count for '+name);
    assert.equal(empty.hidden, expected !== 0, lang+': empty-state visibility for '+name);
  }
  check(items.length,'initial state');

  // Reproduce user's screenshot: previous English + inclusion + keyword
  // must not restrict the freshly chosen audience Specialists.
  language.value = 'en';
  topic.value = 'inclusion';
  search.value = 'will-not-match-any-course';
  audience.value = 'professionals';
  audience.fire('change');
  assert.equal(language.value, 'all');
  assert.equal(topic.value, 'all');
  assert.equal(search.value, '');
  check(totals.audience.professionals,'professionals after stale filters');

  // A newly chosen course language similarly overrides previous audience.
  language.value = 'kk';
  language.fire('change');
  assert.equal(audience.value, 'all');
  assert.equal(topic.value, 'all');
  check(totals.language.kk,'Kazakh after professionals');

  // A newly chosen subject overrides language and audience.
  audience.value = 'parents';
  search.value = 'will-not-match-any-course';
  topic.value = 'inclusion';
  topic.fire('change');
  assert.equal(language.value, 'all');
  assert.equal(audience.value, 'all');
  assert.equal(search.value, '');
  check(totals.topic.inclusion,'inclusive education after Kazakh');

  // New text search starts from the entire catalogue.
  search.value = 'unique-impossible-keyword-98347427';
  search.fire('input');
  assert.equal(topic.value, 'all');
  assert.equal(language.value, 'all');
  check(0,'empty text search');
  search.value = '';
  search.fire('input');
  check(items.length,'clear text search');

  // Browser back/forward restores counts and cards consistently.
  assert.equal(typeof events.pageshow,'function');
  events.pageshow();
  check(items.length,'pageshow');
}

for (const groups of [langCounts,audienceCounts,topicCounts]) {
  assert.equal(new Set(groups.map((group) => JSON.stringify(group))).size,1,
    'Mismatch in original-language, audience or topic totals across page translations');
}
console.log('Interactive catalogue filtering PASS: audience, original language, topic, text search and counters on RU/KK/EN.');
