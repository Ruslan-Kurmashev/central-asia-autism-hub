// Probe CounterAPI using an isolated key, without touching the real visit total.
const origin = 'https://ruslan-kurmashev.github.io';
const key = 'ci-probe-20261030';
const base = 'https://counterapi.com/api/central-asia-autism-hub/visit/' + key;
const req = async (url) => {
  const response = await fetch(url, {
    headers: { Origin: origin, Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
    redirect: 'error',
  });
  const body = await response.text();
  console.log(JSON.stringify({
    status: response.status,
    contentType: response.headers.get('content-type'),
    allowOrigin: response.headers.get('access-control-allow-origin'),
    body: body.slice(0, 500),
  }));
  if (!response.ok) throw new Error('CounterAPI returned ' + response.status);
  const allowOrigin = response.headers.get('access-control-allow-origin');
  if (!allowOrigin || !['*', origin].includes(allowOrigin)) {
    throw new Error('CounterAPI does not permit cross-origin browser requests');
  }
  let data;
  try { data = JSON.parse(body); } catch { throw new Error('CounterAPI did not return JSON'); }
  if (!Number.isSafeInteger(data.value) || data.value < 0) throw new Error('Invalid numeric counter value');
  return data.value;
};
const incremented = await req(base);
const readonly = await req(base + '?readOnly=true');
if (readonly < incremented) throw new Error('Read-only counter unexpectedly decreased');
console.log('CounterAPI probe passed. Test counter only. Production key not touched.');
