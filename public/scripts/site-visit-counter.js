/* Aggregate session counter for the public site.
 * Approximate site visits, not people, families or confirmed readers.
 * Only a timestamp is kept in per-tab sessionStorage. No identifier, path,
 * search parameters, medical answers or referrer is transmitted.
 */
(() => {
  const widget = document.querySelector('[data-site-visit-counter]');
  if (!widget || !['ruslan-kurmashev.github.io', 'autismkz.com', 'www.autismkz.com'].includes(location.hostname)) return;

  const number = widget.querySelector('[data-visit-count]');
  if (!number) return;

  const endpoint = 'https://counterapi.com/api/central-asia-autism-hub/visit/all';
  const storageKey = 'autismhub-visit-last-activity-v1';
  const sessionWindow = 30 * 60 * 1000;
  const now = Date.now();
  let shouldCount = false;

  try {
    const last = Number(sessionStorage.getItem(storageKey));
    shouldCount = !Number.isFinite(last) || last <= 0 || now - last >= sessionWindow || now < last;
  } catch {
    // Session storage blocked: show the count read-only, do not inflate it.
  }

  const url = shouldCount ? endpoint : endpoint + '?readOnly=true';
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers: { Accept: 'application/json' },
  })
    .then((response) => {
      if (!response.ok) throw new Error('Counter unavailable');
      return response.json();
    })
    .then((data) => {
      const count = data && data.value;
      if (!Number.isSafeInteger(count) || count < 0) return;

      if (shouldCount) {
        try { sessionStorage.setItem(storageKey, String(now)); } catch { /* disabled */ }
      } else {
        try {
          if (sessionStorage.getItem(storageKey)) sessionStorage.setItem(storageKey, String(now));
        } catch { /* disabled */ }
      }

      const lang = widget.getAttribute('data-counter-locale') || 'ru';
      number.textContent = new Intl.NumberFormat(
        { ru: 'ru-RU', kk: 'kk-KZ', en: 'en-US' }[lang] || 'ru-RU',
      ).format(count);
      widget.hidden = false;
    })
    .catch(() => {
      // Never show a fabricated number or let counter failures affect the site.
    });
})();
