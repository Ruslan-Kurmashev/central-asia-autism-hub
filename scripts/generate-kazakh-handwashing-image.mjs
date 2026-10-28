// Build the Kazakh handwashing figure from the protected project artwork.
// Clip to illustration-only regions: original Russian caption pixels are never drawn.
// Do not overwrite the source WebP or modify other language versions.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/images/editorial/diagrams/child-daily-independence-handwashing-steps.webp");
const output = resolve(root, "public/images/editorial/diagrams/child-daily-independence-handwashing-steps-kk-v2.svg");
const base64 = readFileSync(source).toString("base64");

const cards = [
  [20, 16, 698, 512],
  [730, 16, 699, 512],
  [20, 538, 698, 532],
  [730, 538, 699, 532],
];
// Coordinates in the 1448 x 1086 original illustration.
// The top captions start below y=384; lower captions start below y=888.
// Do not render those original caption areas, even under new Kazakh text.
const art = [
  [30, 23, 678, 361],
  [739, 23, 680, 361],
  [30, 545, 678, 343],
  [739, 545, 680, 343],
];
const lines = [
  [64, 424, 37, true, "1. Қолды сулаймыз"],
  [64, 466, 27, false, "Алдымен бала қолын жайлы"],
  [64, 505, 27, false, "температурадағы суға тосады."],

  [752, 424, 37, true, "2. Сабын аламыз"],
  [752, 466, 27, false, "Содан кейін бала сабын алып,"],
  [752, 505, 27, false, "оны қолына жағады."],

  [64, 927, 28, true, "3. Алақан мен саусақты ысқылаймыз"],
  [64, 971, 25, false, "Бала алақанын, қолының сыртын"],
  [64, 1005, 25, false, "және саусақтарының арасын"],
  [64, 1039, 25, false, "шамамен 20 секунд ысқылайды."],

  [752, 927, 34, true, "4. Шаямыз және сүртеміз"],
  [752, 970, 27, false, "Соңында бала сабынды шайып,"],
  [752, 1009, 27, false, "қолын таза сүлгімен сүртеді."],
];
const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086" role="img">',
  "<title>Қолды жуудың төрт қадамы</title>",
  "<desc>Қолды сулау, сабын жағу, шамамен 20 секунд ысқылау, сабынды шайып, қолды сүлгімен құрғату.</desc>",
  "<defs>",
  '<image id="sourceArt" href="data:image/webp;base64,' + base64 + '" width="1448" height="1086"/>',
  ...art.map(([x, y, w, h], i) =>
    '<clipPath id="art' + i + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/></clipPath>'),
  "</defs>",
  '<rect width="1448" height="1086" fill="#eaf7ff"/>',
  ...cards.map(([x, y, w, h]) =>
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="19" fill="#ffffff"/>'),
  ...art.map((_, i) =>
    '<use href="#sourceArt" clip-path="url(#art' + i + ')"/>'),
  ...lines.map(([x, y, size, bold, text]) =>
    '<text x="' + x + '" y="' + y + '" fill="#0b2e73" font-family="DejaVu Sans, Noto Sans, Arial, sans-serif" font-size="' + size + '" font-weight="' + (bold ? "700" : "400") + '">' + escapeXml(text) + '</text>'),
  ...cards.map(([x, y, w, h]) =>
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="19" fill="none" stroke="#bde7fa" stroke-width="4"/>'),
  "</svg>",
].join("\n") + "\n";

writeFileSync(output, svg, "utf8");
console.log("Generated clean Kazakh handwashing diagram without original Russian caption layer");
