// Probe the Hits SVG service using a dedicated QA-only counter, not the public site.
const url = 'https://hits.sh/autismhub-qa.example/site-counter-smoke.svg?label=QA&style=flat-square';
const response = await fetch(url, {
  headers: { Accept: 'image/svg+xml' },
  redirect: 'error',
  signal: AbortSignal.timeout(15000),
});
const body = await response.text();
console.log(JSON.stringify({
  status: response.status,
  contentType: response.headers.get('content-type'),
  length: body.length,
  svg: /<svg[\s>]/i.test(body),
}));
if (!response.ok) throw new Error('Hits counter returned HTTP ' + response.status);
if (!/<svg[\s>]/i.test(body) || !/\/svg\+xml/i.test(response.headers.get('content-type') || '')) {
  throw new Error('Hits counter did not return SVG');
}
console.log('Hits image counter smoke passed. Public badge not touched.');
