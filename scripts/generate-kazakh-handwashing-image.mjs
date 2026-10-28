// Preserve the approved four-panel handwashing art and localize only its captions.
// This build-time asset is for the Kazakh article. Protected original WebP stays untouched.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/images/editorial/diagrams/child-daily-independence-handwashing-steps.webp");
const output = resolve(root, "public/images/editorial/diagrams/child-daily-independence-handwashing-steps-kk.svg");
const base64 = readFileSync(source).toString("base64");

const cover = [
  [64, 400, 632, 136],
  [748, 400, 647, 136],
  [64, 900, 632, 154],
  [748, 900, 647, 154],
];
const lines = [
  [83, 439, 36, true, "1. Қолды сулаймыз"],
  [83, 479, 27, false, "Алдымен бала қолын жайлы"],
  [83, 515, 27, false, "температурадағы суға тосады."],

  [772, 439, 36, true, "2. Сабын аламыз"],
  [772, 479, 27, false, "Содан кейін бала сабын алып,"],
  [772, 515, 27, false, "оны қолына жағады."],

  [83, 939, 28, true, "3. Алақан мен саусақты ысқылаймыз"],
  [83, 979, 26, false, "Бала алақанын, қолының сыртын"],
  [83, 1014, 26, false, "және саусақтарының арасын"],
  [83, 1046, 26, false, "шамамен 20 секунд ысқылайды."],

  [772, 939, 34, true, "4. Шаямыз және сүртеміз"],
  [772, 983, 27, false, "Соңында бала сабынды шайып,"],
  [772, 1020, 27, false, "қолын таза сүлгімен сүртеді."],
];
const escapeXml = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086" role="img">',
  "<title>Қолды жуудың төрт қадамы</title>",
  "<desc>Анасы мен баласы қолын сулайды, сабын жағады, шамамен 20 секунд ысқылайды, соңында шайып, сүлгімен құрғатады.</desc>",
  '<image href="data:image/webp;base64,' + base64 + '" width="1448" height="1086"/>',
  ...cover.map(([x,y,w,h]) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#ffffff"/>'),
  ...lines.map(([x,y,size,bold,value]) =>
    '<text x="' + x + '" y="' + y + '" fill="#0b2e73" font-family="DejaVu Sans, Arial, Noto Sans, sans-serif" font-size="' + size + '" font-weight="' + (bold ? "700" : "400") + '">' + escapeXml(value) + '</text>'),
  "</svg>",
].join("\n") + "\n";
writeFileSync(output, svg, "utf8");
console.log("Generated Kazakh handwashing diagram from original approved four-panel illustration");
