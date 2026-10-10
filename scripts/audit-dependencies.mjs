/* Print npm advisory details. Does not silently upgrade dependencies. */
import { spawnSync } from 'node:child_process';

function audit(label, args) {
  const result = spawnSync('npm', ['audit', '--json', ...args], {
    encoding: 'utf8', maxBuffer: 25 * 1024 * 1024, timeout: 120000,
  });
  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch {
    console.log('[AUDIT] ' + label + ' unavailable: ' + (result.stderr || result.stdout || result.error?.message).slice(0, 400));
    return;
  }
  const totals = data.metadata?.vulnerabilities || {};
  console.log('[AUDIT] ' + label + ': ' + JSON.stringify(totals));
  for (const [name, info] of Object.entries(data.vulnerabilities || {})) {
    const source = (info.via || []).map(item =>
      typeof item === 'string' ? item : (item.title || '') + ' (' + (item.url || 'no advisory URL') + ')'
    );
    const fix = info.fixAvailable === false ? 'none reported' :
      typeof info.fixAvailable === 'object' ? JSON.stringify(info.fixAvailable) : String(info.fixAvailable);
    console.log('  ' + info.severity + ' | ' + name + ' | installed affected range ' + info.range +
      ' | direct=' + Boolean(info.isDirect) + ' | fix=' + fix + ' | via=' + source.slice(0, 3).join('; '));
  }
  return totals;
}
audit('all dependencies, including development', []);
const production = audit('production dependencies only', ['--omit=dev']);
if (process.argv.includes('--fail-on-high-production') && production) {
  const severe = (production.high || 0) + (production.critical || 0);
  if (severe > 0) {
    console.error('[AUDIT] Production dependency tree has ' + severe + ' high/critical vulnerability warnings.');
    process.exitCode = 1;
  }
}
