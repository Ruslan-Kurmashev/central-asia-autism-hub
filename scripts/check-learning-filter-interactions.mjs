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
const resultWords = {ru:'учебных материалов',kk:'оқу материалы',en:'learning resources'};
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

  function input(value = 'all', options = []) {
    const listeners = {};
    return {
      value,
      options,
      addEventListener(event, callback) { listeners[event] = callback; },
      fire(event) {
        assert.equal(typeof listeners[event], 'function', 'Missing '+event+' event handler');
        listeners[event]();
      },
    };
  }
  function initialOptions(kind) {
    const pattern = new RegExp('<select\\b[^>]*\\bdata-course-'+kind+'\\b[^>]*>([\\s\\S]*?)<\\/select>');
    const markup = html.match(pattern)?.[1];
    assert.ok(markup, 'Missing '+kind+' dropdown in '+lang);
    return [...markup.matchAll(/<option\b[^>]*value="([^"]+)"[^>]*>([^<]*)<\/option>/g)]
      .map((option) => ({ value: option[1], textContent: option[2].trim(), dataset: {} }));
  }
  const search = input('');
  const audience = input('all', initialOptions('audience'));
  const language = input('all', initialOptions('language'));
  const topic = input('all', initialOptions('topic'));
  const result = { textContent: prefixes[lang]+': '+items.length+' '+resultWords[lang], dataset:{resultWord:resultWords[lang]} };
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

  // Independent reference implementation, not copied from the site code.
  function filteredCount(overrideKind, overrideValue) {
    const fields = {
      audience: audience.value,
      language: language.value,
      topic: topic.value,
    };
    if (overrideKind) fields[overrideKind] = overrideValue;
    const query = search.value.trim().toLowerCase();
    return items.filter(({dataset}) =>
      (!query || dataset.searchText.includes(query)) &&
      (fields.audience === 'all' || dataset.audience.split(' ').includes(fields.audience)) &&
      (fields.language === 'all' || dataset.language.split(' ').includes(fields.language)) &&
      (fields.topic === 'all' || dataset.topic === fields.topic)
    ).length;
  }
  function check(name) {
    const expected = filteredCount();
    assert.equal(items.filter((item) => !item.hidden).length, expected, lang+': visible count for '+name);
    assert.equal(result.textContent, prefixes[lang]+': '+expected+' '+resultWords[lang], lang+': displayed count for '+name);
    assert.equal(empty.hidden, expected !== 0, lang+': empty-state visibility for '+name);
    for (const [key, control] of Object.entries({audience,language,topic})) {
      for (const option of control.options) {
        const contextual = filteredCount(key,option.value);
        assert.ok(option.textContent.endsWith('('+contextual+')'),
          lang+': wrong '+key+' facet count for '+option.value+' / '+name+': '+option.textContent);
        assert.ok(option.dataset.baseLabel, 'Option label must be preserved without duplicating counts');
      }
    }
  }
  check('initial state');

  // Requested example: a parent seeking a Kazakh-language inclusion course.
  audience.value = 'parents';
  audience.fire('change');
  language.value = 'kk';
  language.fire('change');
  topic.value = 'inclusion';
  topic.fire('change');
  assert.equal(audience.value, 'parents', 'Audience must not be cleared by another filter');
  assert.equal(language.value, 'kk', 'Language must not be cleared by topic');
  assert.equal(topic.value, 'inclusion');
  check('parents + Kazakh + inclusion (possibly zero results)');

  // Removing the topic constraint keeps the other two choices.
  topic.value = 'all';
  topic.fire('change');
  assert.equal(audience.value,'parents');
  assert.equal(language.value,'kk');
  check('parents + Kazakh');

  // Requested example: a professional seeking an English autism course.
  audience.value = 'professionals';
  audience.fire('change');
  language.value = 'en';
  language.fire('change');
  topic.value = 'autism';
  topic.fire('change');
  assert.equal(audience.value,'professionals');
  assert.equal(language.value,'en');
  assert.equal(topic.value,'autism');
  check('professionals + English + autism');

  // Text search also intersects with existing criteria and does not reset them.
  search.value = 'iris';
  search.fire('input');
  assert.equal(audience.value,'professionals');
  assert.equal(language.value,'en');
  assert.equal(topic.value,'autism');
  check('professionals + English + autism + text');

  // The search must also cover access requirements and credential outcomes.
  // A user should be able to search for a completion certificate directly.
  audience.value = 'all';
  audience.fire('change');
  language.value = 'all';
  language.fire('change');
  topic.value = 'all';
  topic.fire('change');
  search.value = lang === 'en' ? 'certificate' : 'сертификат';
  search.fire('input');
  assert.ok(filteredCount() > 0, lang+': course access/outcomes must be searchable');
  check('search by certificate outcome');

  search.value = 'no-existing-course-such-token-zz123';
  search.fire('input');
  check('no matches under combined criteria');

  search.value = '';
  search.fire('input');
  check('cleared text, with other filters preserved');

  // Individual "All" choices remove only their own criterion.
  topic.value = 'all';
  topic.fire('change');
  assert.equal(audience.value,'professionals');
  assert.equal(language.value,'en');
  check('topic cleared');
  audience.value = 'all';
  audience.fire('change');
  assert.equal(language.value,'en');
  check('audience cleared');
  language.value = 'all';
  language.fire('change');
  check('all filters cleared');
  assert.equal(filteredCount(),items.length);

  // Back/forward must restore both selection state and facet counts.
  language.value='kk';
  audience.value='parents';
  assert.equal(typeof events.pageshow,'function');
  events.pageshow();
  check('restored combined selection');

}

const normalizedCounts = (counts) => JSON.stringify(
  Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))),
);
for (const [name, groups] of [
  ['language', langCounts], ['audience', audienceCounts], ['topic', topicCounts],
]) {
  assert.equal(new Set(groups.map(normalizedCounts)).size, 1,
    'Mismatched '+name+' totals across page translations: '+groups.map(normalizedCounts).join(' | '));
}
console.log('Interactive combined-filter regression PASS: parent + Kazakh + inclusion, specialist + English + autism, text search, empty state and contextual facet counts on RU/KK/EN.');
