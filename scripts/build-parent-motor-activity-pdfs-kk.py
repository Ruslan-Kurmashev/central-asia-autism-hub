#!/usr/bin/env python3
"""Generate three accessible Kazakh motor-activity resources.

The activities are an item-by-item translation of the canonical Russian data.
They are educational play ideas, not a validated assessment or therapy protocol.
Russian PDFs and their source data are never modified.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json
import re

import fitz
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "motor"
OUT.mkdir(parents=True, exist_ok=True)
RU = json.loads((ROOT / "scripts/data/parent-motor-activity-pack-ru.json").read_text(encoding="utf-8"))
KK = json.loads((ROOT / "scripts/data/parent-motor-activity-pack-kk.json").read_text(encoding="utf-8"))
for group, count in (("gross", 10), ("fine", 15)):
    original, translated = RU[group], KK[group]
    if len(original) != count or len(translated) != count:
        raise RuntimeError(f"{group}: expected {count} activities")
    if [x["id"] for x in original] != [x["id"] for x in translated]:
        raise RuntimeError(f"{group}: activity order or IDs changed in Kazakh translation")
    for row in translated:
        for key in ("title", "materials", "steps", "easier", "harder", "safety"):
            if not str(row.get(key, "")).strip():
                raise RuntimeError(f"{row['id']}: required translated field missing: {key}")

CSS = (ROOT / "src/styles/typography.css").read_text(encoding="utf-8")
def token(name):
    m = re.search(r"--" + re.escape(name) + r":\s*([0-9]+(?:\.[0-9]+)?)pt\s*;", CSS)
    if not m:
        raise RuntimeError("Missing approved PDF typography token " + name)
    return float(m.group(1))

BODY, H1, H2 = token("type-print-body"), token("type-print-h1"), token("type-print-h2")
if BODY < 11:
    raise RuntimeError("Print body must be at least 11pt")

FONTS = {
    "MotorKK": "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "MotorKKBold": "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
}
for name, path in FONTS.items():
    if not Path(path).is_file():
        raise RuntimeError("Required font missing " + path)
    pdfmetrics.registerFont(TTFont(name, path))

INK = HexColor("#203C52")
BLUE = HexColor("#245B82")
MUTED = HexColor("#526B7C")
RULE = HexColor("#BDCFDC")
W, H = A4

BODY_STYLE = ParagraphStyle(
    "kk-motor-body", fontName="MotorKK", fontSize=BODY,
    leading=BODY * 1.5, textColor=INK, spaceAfter=8,
    allowWidows=0, allowOrphans=0,
)
LABEL_STYLE = ParagraphStyle(
    "kk-motor-label", parent=BODY_STYLE,
    fontName="MotorKKBold", textColor=BLUE,
    spaceBefore=8, spaceAfter=3,
)
TITLE_STYLE = ParagraphStyle(
    "kk-motor-title", parent=BODY_STYLE,
    fontName="MotorKKBold", fontSize=H1, leading=H1 * 1.3,
    spaceAfter=12, textColor=BLUE,
)
SECTION_STYLE = ParagraphStyle(
    "kk-motor-section", parent=TITLE_STYLE,
    fontSize=H2, leading=H2 * 1.35, spaceAfter=8,
)

def text(value, style=BODY_STYLE):
    return Paragraph(escape(str(value)), style)

def header_footer(c, doc):
    c.saveState()
    c.setFillColor(BLUE)
    c.rect(0, H-13, W, 13, stroke=0, fill=1)
    c.setFillColor(MUTED)
    c.setFont("MotorKK", 8)
    c.drawString(42, H-34, "AUTISMHUB / АТА-АНАЛАРҒА АРНАЛҒАН МАТЕРИАЛ")
    c.setStrokeColor(RULE)
    c.line(42, 44, W-42, 44)
    c.drawString(42, 29, "Білім беру материалы. Ұпай да, диагноз да қойылмайды.")
    c.drawRightString(W-42, 29, str(doc.page))
    c.restoreState()

def build(filename, title, story, expected_pages, expected_tokens):
    path = OUT / filename
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, leftMargin=42, rightMargin=42,
        topMargin=53, bottomMargin=62,
        title="AutismHub - " + title, author="AutismHub",
        pageCompression=1,
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    reader = PdfReader(str(path))
    if len(reader.pages) != expected_pages:
        raise RuntimeError(f"{filename}: expected {expected_pages} pages, got {len(reader.pages)}")
    fulltext = "\n".join(page.extract_text() or "" for page in reader.pages)
    for needle in expected_tokens:
        if needle not in fulltext:
            raise RuntimeError(f"{filename}: missing content {needle}")
    if "�" in fulltext:
        raise RuntimeError(f"{filename}: broken font glyphs")
    with fitz.open(path) as pdf:
        for i, page in enumerate(pdf):
            if len(page.get_text().strip()) < 180:
                raise RuntimeError(f"{filename}: missing page text, page {i+1}")
            for block in page.get_text("dict")["blocks"]:
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        val = span["text"].strip()
                        if not val:
                            continue
                        x0, y0, x1, y1 = span["bbox"]
                        if x0 < -1 or y0 < -1 or x1 > W+1 or y1 > H+1:
                            raise RuntimeError(f"{filename}: clipped text p{i+1}: {val}")
                        if 60 < y0 < H-63 and span["size"] < 10.7:
                            raise RuntimeError(f"{filename}: small body text p{i+1}: {val}")
    print(f"Kazakh motor PDF OK: {filename}, {expected_pages} pages, {path.stat().st_size} bytes")

for group, filename, caption in [
    ("gross", "iri-motorikaga-10-oiyn-kk.pdf", "ІРІ МОТОРИКАҒА АРНАЛҒАН 10 ОЙЫН"),
    ("fine", "usak-motorikaga-15-tapsyrma-kk.pdf", "ҰСАҚ МОТОРИКАҒА АРНАЛҒАН 15 ТАПСЫРМА"),
]:
    story = []
    for i, row in enumerate(KK[group]):
        if i:
            story.append(PageBreak())
        story.extend([
            text(caption, SECTION_STYLE),
            text(f"{i+1}. {row['title']}", TITLE_STYLE),
            text("Балаға қолайлы әрекетті таңдаңыз. Үзіліс пен бас тарту мүмкіндігі сақталады."),
            HRFlowable(width="100%", color=RULE, thickness=0.8),
            Spacer(1, 12),
        ])
        for label, key in [
            ("Қажетті материалдар", "materials"),
            ("Қалай ойнаймыз", "steps"),
            ("Жеңілдету", "easier"),
            ("Бала қаласа, күрделендіру", "harder"),
            ("Қауіпсіздік", "safety"),
        ]:
            story.append(KeepTogether([text(label, LABEL_STYLE), text(row[key])]))
            story.append(Spacer(1, 8))
        story.extend([
            Spacer(1, 8),
            HRFlowable(width="100%", color=RULE, thickness=0.8),
            Spacer(1, 11),
            text("Балаға қысым жасамаңыз. Бұл ойын дамуға қатысты қорытынды жасауға арналмаған."),
        ])
    build(filename, caption, story, len(KK[group]), [x["title"] for x in KK[group]])

ideas = [
    ("Дүйсенбі", "Доп домалату / қағазды умаждау"),
    ("Сейсенбі", "Белгілер арасындағы жол / үлкен жапсырмалар"),
    ("Сәрсенбі", "Отырып қимылдау не билеу / қауіпсіз қақпақтар"),
    ("Бейсенбі", "Сызық бойымен жүру / қамырдан мүсіндеу"),
    ("Жұма", "Допқа кең қақпа жасау / кітап бетін аудару"),
    ("Сенбі", "Жұмсақ ойыншық тасу / жабысқақ бекіткіш"),
    ("Жексенбі", "Баланың сүйікті ойыны / өз қалауымен демалу"),
]
questions = [
    "Бала қандай әрекетті өзі таңдады?",
    "Қандай әрекетті өздігінен жасады?",
    "Не көмектесті, нені ыңғайлы етті?",
    "Бала не істегісі келмеді немесе не кедергі жасады?",
    "Көмекті, үзілісті немесе аяқтауды қалай сұрады?",
    "Маманмен қандай сұрақтарды талқылағым келеді?",
]
story = [
    text("АПТАЛЫҚ ЖОСПАР", TITLE_STYLE),
    text("Бұл жеті күнге міндетті бағдарлама емес, тек таңдауға болатын идеялар. "
         "Барлығын орындау да, өткізіп алған күннің орнын толтыру да қажет емес."),
    Spacer(1, 10),
]
for day, idea in ideas:
    story.append(KeepTogether([
        text(day + " - " + idea, LABEL_STYLE),
        text("Біздің нұсқа / не ұнады:"),
        Spacer(1, 4),
        HRFlowable(width="100%", thickness=0.65, color=RULE),
        Spacer(1, 7),
    ]))
story += [
    PageBreak(),
    text("ҚИМЫЛДЫ БАҚЫЛАУ КҮНДЕЛІГІ", TITLE_STYLE),
    text("Баланың жайлылығын, қызығушылығын және қалай қатысқанын белгілеңіз. "
         "Ұпай қоймаңыз, мәжбүрлеп дағдысын тексермеңіз."),
    text("Толтырылған жазбалардағы баланың жеке деректерін құпия сақтаңыз."),
    Spacer(1, 10),
]
for question in questions:
    story.extend([
        text(question, LABEL_STYLE),
        Spacer(1, 6),
        HRFlowable(width="100%", thickness=0.7, color=RULE),
        Spacer(1, 15),
        HRFlowable(width="100%", thickness=0.7, color=RULE),
        Spacer(1, 14),
    ])
story += [
    Spacer(1, 5),
    text("Ауырсыну, жаңа қимыл асимметриясы, елеулі құлау немесе бұрын тұрақты "
         "меңгерген дағдының жоғалуы байқалса, дәрігерге жүгініңіз. "
         "Күнделік толтыру үшін көмекті кейінге қалдырмаңыз."),
]
build(
    "aptalyk-zhospar-zhane-kimyl-kundeligi-kk.pdf",
    "Апталық жоспар мен қимылды бақылау күнделігі",
    story, 2, [day for day, _ in ideas] + questions,
)
