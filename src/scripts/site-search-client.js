// Static, browser-only search. Queries are never sent to an external search service.
const labels = {
  ru: { loading: 'Загрузка каталога…', failure: 'Не удалось загрузить поиск. Обновите страницу.', empty: 'По запросу ничего не найдено. Попробуйте другое слово или раздел.', found: 'Найдено: ', count: ' материалов', onlyRussian: 'Только на русском', course: 'Курс', article: 'Материал', shown: 'Показано: ' },
  kk: { loading: 'Каталог жүктелуде…', failure: 'Іздеуді жүктеу мүмкін болмады. Бетті жаңартыңыз.', empty: 'Ештеңе табылмады. Басқа сөзді немесе бөлімді таңдаңыз.', found: 'Табылды: ', count: ' материал', onlyRussian: 'Тек орыс тілінде', course: 'Курс', article: 'Материал', shown: 'Көрсетілді: ' },
  en: { loading: 'Loading catalogue…', failure: 'Search could not load. Please refresh the page.', empty: 'No results. Try another term or section.', found: 'Found: ', count: ' resources', onlyRussian: 'Russian only', course: 'Course', article: 'Resource', shown: 'Showing: ' },
};
const normalize = (text) => String(text || '')
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/ё/g, 'е')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim();
const words = (value) => normalize(value).split(' ').filter(Boolean);

for (const root of document.querySelectorAll('[data-site-search]')) {
  const locale = root.dataset.locale;
  const tr = labels[locale] || labels.en;
  const form = root.querySelector('[data-search-form]');
  const queryInput = root.querySelector('[data-search-query]');
  const sectionInput = root.querySelector('[data-search-section]');
  const includeRu = root.querySelector('[data-search-ru]');
  const status = root.querySelector('[data-search-status]');
  const results = root.querySelector('[data-search-results]');
  const more = root.querySelector('[data-search-more]');
  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  queryInput.value = initialQuery.slice(0, 120);
  let items = [];
  let matches = [];
  let shown = 0;
  let loadError = false;
  const pageSize = 18;

  const hrefSafe = (href) => typeof href === 'string'
    && href.startsWith(root.dataset.base || '/')
    && !href.includes('..');

  const draw = () => {
    const fragment = document.createDocumentFragment();
    matches.slice(shown, shown + pageSize).forEach((item) => {
      if (!hrefSafe(item.href)) return;
      const li = document.createElement('li');
      li.className = 'site-search__result';
      const meta = document.createElement('p');
      meta.className = 'site-search__result-meta';
      meta.textContent = item.sectionLabel + ' · ' + (item.kind === 'course' ? tr.course : tr.article) +
        (item.language !== locale ? ' · ' + tr.onlyRussian : '');
      const title = document.createElement('h2');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.title;
      title.append(a);
      const summary = document.createElement('p');
      summary.className = 'site-search__result-description';
      summary.textContent = item.summary;
      li.append(meta, title, summary);
      fragment.append(li);
    });
    results.append(fragment);
    shown = Math.min(matches.length, shown + pageSize);
    more.hidden = shown >= matches.length;
    if (matches.length) status.textContent = tr.found + matches.length + tr.count +
      (shown < matches.length ? ' · ' + tr.shown + shown : '');
  };

  const search = () => {
    const q = queryInput.value.trim();
    const selected = sectionInput.value;
    results.replaceChildren();
    more.hidden = true;
    shown = 0;
    const params = new URLSearchParams(window.location.search);
    if (q) params.set('q', q); else params.delete('q');
    if (selected !== 'all') params.set('section', selected); else params.delete('section');
    window.history.replaceState(null, '', window.location.pathname + (params.size ? '?' + params : '') + window.location.hash);
    if (!q) { status.textContent = root.dataset.initial || (locale === 'ru' ? 'Введите запрос.' : locale === 'kk' ? 'Іздеу сөзін енгізіңіз.' : 'Enter a search term.'); return; }
    if (loadError) { status.textContent = tr.failure; return; }
    if (!items.length) { status.textContent = tr.loading; return; }
    const terms = words(q);
    if (!terms.length) { status.textContent = tr.empty; return; }
    const localKeys = new Set(items.filter((item) => item.language === locale).map((item) => item.translationKey));
    matches = items
      .filter((item) => (item.language === locale || (item.language === 'ru' && includeRu?.checked && !localKeys.has(item.translationKey))) &&
        (selected === 'all' || item.section === selected))
      .map((item) => {
        const title = item.normalizedTitle;
        const summary = item.normalizedSummary;
        const body = item.normalizedText;
        const applicable = terms.every((term) => title.includes(term) || summary.includes(term) || body.includes(term));
        if (!applicable) return null;
        const score = terms.reduce((sum, term) => sum +
          (title.includes(term) ? 15 : 0) + (summary.includes(term) ? 7 : 0) +
          (body.includes(term) ? 2 : 0), 0) + (item.language === locale ? 20 : 0);
        return { ...item, score };
      }).filter(Boolean)
      .sort((a, b) => b.score - a.score || b.updated.localeCompare(a.updated) ||
        a.title.localeCompare(b.title, locale))
      .map((item) => ({
        ...item, sectionLabel: sections[item.section] || item.section,
      }));
    if (!matches.length) { status.textContent = tr.empty; return; }
    draw();
  };
  const sections = {
    parents: locale === 'ru' ? 'Родителям' : locale === 'kk' ? 'Ата-аналарға' : 'For parents',
    professionals: locale === 'ru' ? 'Специалистам' : locale === 'kk' ? 'Мамандарға' : 'For professionals',
    research: locale === 'ru' ? 'Исследования' : locale === 'kk' ? 'Зерттеулер' : 'Research',
    'help-kazakhstan': locale === 'ru' ? 'Помощь в Казахстане' : locale === 'kk' ? 'Қазақстандағы көмек' : 'Kazakhstan support',
    learning: locale === 'ru' ? 'Курсы' : locale === 'kk' ? 'Курстар' : 'Courses',
  };
  const queryArgs = new URLSearchParams(window.location.search);
  const initialSection = queryArgs.get('section');
  if (initialSection && Array.from(sectionInput.options).some((o) => o.value === initialSection)) sectionInput.value = initialSection;
  const loading = fetch(root.dataset.index, { credentials: 'same-origin' })
    .then((response) => { if (!response.ok) throw new Error('search-index'); return response.json(); })
    .then((data) => {
      if (!Array.isArray(data.entries)) throw new Error('search-index-shape');
      items = data.entries.map((item) => ({
        ...item,
        normalizedTitle: normalize(item.title),
        normalizedSummary: normalize(item.summary),
        normalizedText: normalize(item.searchText),
      }));
      search();
    })
    .catch(() => { loadError = true; status.textContent = tr.failure; });
  status.textContent = tr.loading;
  form.addEventListener('submit', (event) => { event.preventDefault(); void loading.then(search); });
  queryInput.addEventListener('input', () => { search(); });
  sectionInput.addEventListener('change', search);
  includeRu?.addEventListener('change', search);
  more.addEventListener('click', draw);
}
