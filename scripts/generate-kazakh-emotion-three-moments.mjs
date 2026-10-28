// Localize only the three short headings of the existing owner-approved image.
// The approved PNG remains immutable. This standalone SVG embeds its original pixels.
// The background illustrations and actions are never regenerated or redrawn.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'public/images/editorial/emotion-three-moments-no-duplicate-title.png');
const dst = resolve(root, 'public/images/editorial/emotion-three-moments-kk.svg');
const buffer = readFileSync(src);
if (buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
  || buffer.readUInt32BE(16) !== 2179 || buffer.readUInt32BE(20) !== 722) {
  throw Error('The approved emotion illustration has changed or is not the expected 2179x722 PNG');
}
const image64 = buffer.toString('base64');
const W = 2179, H = 722;
// Original screenshot coordinates are 736 x 241 px and faithfully map onto
// the approved 2179 x 722 master image. Cover the entire Russian title-pill,
// not just the letters, to avoid double text or ghosted lettering.
const scaleX = W / 736, scaleY = H / 241;
const pills = [
  { x:82, y:18, w:112, h:29, label:'1. ДЕЙІН' },
  { x:299, y:18, w:151, h:29, label:'2. КЕЗІНДЕ' },
  { x:543, y:18, w:123, h:29, label:'3. КЕЙІН' },
];
const n = num => Number(num.toFixed(2)).toString();
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="2179" height="722" viewBox="0 0 2179 722" role="img">',
  '<title>Балаға қолдаудың үш кезеңі: дейін, кезінде, кейін</title>',
  '<desc>Алдымен таңдау ұсынылады, қиын сәтте ересек сабырмен қасында қалады, кейін бала демалады.</desc>',
  '<image href="data:image/png;base64,' + image64 + '" x="0" y="0" width="2179" height="722"/>',
  ...pills.flatMap(p => {
    const x=n(p.x*scaleX), y=n(p.y*scaleY),
      width=n(p.w*scaleX), height=n(p.h*scaleY), radius=n(14.5*scaleY),
      mid=n((p.x+p.w/2)*scaleX), baseline=n(39*scaleY);
    return [
      '<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="'+radius+'" fill="#d8effe"/>',
      '<text x="'+mid+'" y="'+baseline+'" fill="#0b2680" font-family="DejaVu Sans, Noto Sans, Arial, sans-serif" font-size="'+n(16*scaleY)+'" font-weight="700" text-anchor="middle">'+p.label+'</text>',
    ];
  }),
  '</svg>',
].join('\n') + '\n';
writeFileSync(dst, svg, 'utf8');
if (pills.length !== 3 || !['1. ДЕЙІН','2. КЕЗІНДЕ','3. КЕЙІН'].every(s => svg.includes(s))) {
  throw Error('Kazakh stage caption QA failed');
}
console.log('Generated Kazakh three-panel support diagram from protected original PNG');
