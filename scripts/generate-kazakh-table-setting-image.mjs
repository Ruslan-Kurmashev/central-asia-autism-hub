// Build-time localized illustration: same approved artwork, Kazakh SVG lettering.
// Do not edit the protected base WebP, and do not change existing RU/EN pages.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/images/editorial/diagrams/child-daily-independence-table-setting-user-approved-v3.webp");
const output = resolve(root, "public/images/editorial/diagrams/child-daily-independence-table-setting-kk.svg");
const base64 = readFileSync(source).toString("base64");

const panels = [
  [18, 14, 682, 515],
  [710, 14, 681, 515],
  [18, 539, 682, 503],
  [710, 539, 681, 503]
];
const clips = [
  [27, 20, 665, 363],
  [724, 20, 660, 363],
  [27, 549, 665, 343],
  [724, 549, 660, 343]
];
const lines = [
  [52, 425, 42, true, "1. Төсенішті қоямыз"],
  [52, 467, 29, false, "Алдымен бала ересекпен бірге үстелге"],
  [52, 504, 29, false, "сырғымайтын төсенішті қояды."],
  [745, 425, 42, true, "2. Кесені қоямыз"],
  [745, 467, 29, false, "Содан кейін бала төсеніштің үстіне"],
  [745, 504, 29, false, "орнықты кесені қояды."],
  [52, 930, 42, true, "3. Қасықты қосамыз"],
  [52, 974, 29, false, "Содан соң бала қасына қауіпсіз"],
  [52, 1010, 29, false, "қасықты қояды."],
  [745, 930, 42, true, "4. Орын дайын"],
  [745, 970, 27, false, "Біртіндеп бала үстел басындағы орнын"],
  [745, 1001, 27, false, "өзі дайындайды. Қажет болса,"],
  [745, 1032, 27, false, "көмек сақталады."]
];
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1448" height="1086" viewBox="0 0 1448 1086" role="img">',
  "<title>Үстел басындағы орынды дайындаудың төрт қадамы</title>",
  "<desc>Төсеніш, кесе және қасықты ретімен қою. Балаға қажет кезде ересек адам көмектеседі.</desc>",
  "<defs>",
  '<image id="sourceArt" href="data:image/webp;base64,' + base64 + '" width="1448" height="1086"/>',
  ...clips.map(([x,y,w,h],i) => '<clipPath id="p' + (i+1) + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/></clipPath>'),
  "</defs>",
  '<rect width="1448" height="1086" fill="#e9f6ff"/>',
  ...panels.map(([x,y,w,h])=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="20" fill="white" stroke="#c5e9fb" stroke-width="4"/>'),
  ...clips.map((_,i)=>'<use xlink:href="#sourceArt" clip-path="url(#p'+(i+1)+')"/>'),
  ...lines.map(([x,y,size,bold,value])=>'<text x="'+x+'" y="'+y+'" fill="#0a2970" font-family="Arial, Noto Sans, DejaVu Sans, sans-serif" font-size="'+size+'" font-weight="'+(bold?"700":"400")+'">'+esc(value)+'</text>'),
  "</svg>"
].join("\n") + "\n";
writeFileSync(output, svg, "utf8");
console.log("Generated Kazakh table-setting instructional SVG from protected base WebP");
