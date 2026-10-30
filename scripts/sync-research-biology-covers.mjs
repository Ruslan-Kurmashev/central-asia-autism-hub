/**
 * Download third-party Commons images used as research-biology article covers.
 * Entries are verified individually in docs/editorial-image-sources.md.
 * Fail closed if a file is missing, has an unexpected media type, or has unsafe SVG markup.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const assets = JSON.parse(await readFile('scripts/research-biology-cover-sources.json', 'utf8'));
const folder = path.resolve('public/images/research/verified');
await mkdir(folder, { recursive: true });
const userAgent = 'AutismHub-educational-images/1.0 (https://github.com/Ruslan-Kurmashev/central-asia-autism-hub; Wikimedia Commons attribution)';
const headers = { 'User-Agent': userAgent, Accept: 'application/json,image/*;q=0.9,*/*;q=0.1' };
function validFile(name, data) {
  if (data.length < 900 || data.length > 12000000) return false;
  if (name.endsWith('.jpg')) return data[0] === 255 && data[1] === 216 && data.at(-2) === 255 && data.at(-1) === 217;
  if (name.endsWith('.png')) return data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (name.endsWith('.svg')) {
    const xml = data.toString('utf8');
    return /<svg[\s>]/i.test(xml) && /<title\b/i.test(xml) && /<desc\b/i.test(xml) &&
      !/<script\b|<foreignObject\b|javascript:|onload\s*=|onerror\s*=/i.test(xml);
  }
  return false;
}
async function downloadOne(asset) {
  const output = path.join(folder, asset.filename);
  try {
    if (validFile(asset.filename, await readFile(output))) return;
  } catch {}
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('format', 'json');
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url|size|mime');
  api.searchParams.set('titles', 'File:' + asset.commonsFile);
  const lookup = await fetch(api, {headers, signal: AbortSignal.timeout(25000)});
  if (!lookup.ok) throw Error(asset.filename + ': Wikimedia API HTTP ' + lookup.status);
  const pages = Object.values((await lookup.json()).query?.pages ?? {});
  const info = pages[0]?.imageinfo?.[0];
  if (!info?.url || !info.url.startsWith('https://upload.wikimedia.org/')) {
    throw Error(asset.filename + ': no approved Wikimedia Commons original URL');
  }
  const expectedMime = asset.filename.endsWith('.jpg') ? 'image/jpeg' :
    asset.filename.endsWith('.png') ? 'image/png' : 'image/svg+xml';
  if (info.mime !== expectedMime) throw Error(asset.filename + ': unexpected Commons MIME ' + info.mime);
  let lastError;
  for (let attempt=1; attempt<=5; attempt++) {
    try {
      const response = await fetch(info.url, {headers, signal: AbortSignal.timeout(35000)});
      if (!response.ok) throw Error(asset.filename + ': image download HTTP ' + response.status);
      let bytes = Buffer.from(await response.arrayBuffer());
      if (asset.filename.endsWith('.svg')) {
        let xml = bytes.toString('utf8');
        const root = xml.match(/<svg\b[^>]*>/i);
        if (!root) throw Error(asset.filename + ': SVG root missing');
        const escapeXml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
        let accessible = '';
        if (!/<title\b/i.test(xml)) accessible += '<title>' + escapeXml(asset.caption) + '</title>';
        if (!/<desc\b/i.test(xml)) accessible += '<desc>' + escapeXml(asset.alt) + '</desc>';
        if (accessible) xml = xml.replace(root[0], root[0] + '\n' + accessible + '\n');
        bytes = Buffer.from(xml, 'utf8');
      }
      if (!validFile(asset.filename, bytes)) throw Error(asset.filename + ': invalid or unsafe image bytes');
      await writeFile(output, bytes);
      console.log('Verified Wikimedia original:', asset.filename, bytes.length, 'bytes');
      return;
    } catch (e) {
      lastError=e;
      if (attempt===5) break;
      const waitMs = attempt * 5500;
      console.warn(asset.filename + ': retry ' + attempt + ' after ' + waitMs + 'ms: ' + e.message);
      await new Promise(resolve=>setTimeout(resolve,waitMs));
    }
  }
  throw lastError;
}
const errors=[];
for (const asset of assets) {
  try { await downloadOne(asset); }
  catch (error) { errors.push(error?.message || 'Unknown download failure'); }
  // Protect the Commons API and upload servers from burst traffic.
  await new Promise(resolve=>setTimeout(resolve,1500));
}
if (errors.length) throw Error('Research covers cannot be published:\n'+errors.join('\n'));
console.log('Verified',assets.length,'licensed original research covers.');
