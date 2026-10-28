#!/usr/bin/env python3
"""Build two accessible Kazakh parent printables without changing Russian PDFs.

The Kazakh content preserves all twelve source activities and the seven-day plan.
Both files are educational worksheets rather than validated scales or clinical plans.
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
    HRFlowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "selfcare"
OUT.mkdir(parents=True, exist_ok=True)
KK_SOURCE = ROOT / "scripts" / "data" / "parent-daily-independence-tasks-kk.json"
RU_SOURCE = ROOT / "scripts" / "data" / "parent-daily-independence-tasks-ru.json"
data = json.loads(KK_SOURCE.read_text(encoding="utf-8"))
tasks = data["tasks"]
ru = json.loads(RU_SOURCE.read_text(encoding="utf-8"))["tasks"]
if len(tasks) != 12 or [x["id"] for x in tasks] != [x["id"] for x in ru]:
    raise RuntimeError("Kazakh activities must match all 12 canonical Russian task IDs")

styles_css = (ROOT / "src" / "styles" / "typography.css").read_text(encoding="utf-8")
def typography(name):
    matched = re.search(r"--" + re.escape(name) + r":\s*([0-9]+(?:\.[0-9]+)?)pt\s*;", styles_css)
    if not matched:
        raise RuntimeError("Required canonical print type token missing: " + name)
    return float(matched.group(1))
BODY = typography("type-print-body")
H1 = typography("type-print-h1")
H2 = typography("type-print-h2")
if BODY < 11:
    raise RuntimeError("PDF body print font below approved 11 pt")
regular = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not regular.is_file() or not bold.is_file():
    raise RuntimeError("DejaVu Sans Kazakh-capable fonts required")
pdfmetrics.registerFont(TTFont("SelfcareKK", str(regular)))
pdfmetrics.registerFont(TTFont("SelfcareKKBold", str(bold)))

INK = HexColor("#203C52")
NAVY = HexColor("#245B82")
MUTED = HexColor("#526B7C")
RULE = HexColor("#BDCFDC")
BODY_STYLE = ParagraphStyle(
    "body", fontName="SelfcareKK", fontSize=BODY, leading=BODY*1.56,
    textColor=INK, spaceAfter=10, allowWidows=0, allowOrphans=0,
)
LABEL = ParagraphStyle(
    "label", parent=BODY_STYLE, fontName="SelfcareKKBold", textColor=NAVY,
    spaceAfter=5, spaceBefore=8,
)
TITLE = ParagraphStyle(
    "title", parent=LABEL, fontSize=H1, leading=H1*1.3, spaceAfter=15,
)
SECTION = ParagraphStyle(
    "section", parent=LABEL, fontSize=H2, leading=H2*1.3, spaceBefore=12, spaceAfter=9,
)
W, H = A4

def p(value, style=BODY_STYLE):
    return Paragraph(escape(str(value)), style)

def header_footer(c, doc):
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, H - 13, W, 13, stroke=0, fill=1)
    c.setFillColor(MUTED)
    c.setFont("SelfcareKK", 8)
    c.drawString(42, H - 34, "AUTISMHUB / АТА-АНАЛАРҒА АРНАЛҒАН МАТЕРИАЛ")
    c.setStrokeColor(RULE)
    c.line(42, 44, W-42, 44)
    c.drawString(42, 29, "Білім беру мысалы. Ұпай қойылмайды, диагноз қойылмайды.")
    c.drawRightString(W-42, 29, str(doc.page))
    c.restoreState()

def make_doc(filename, title, story, pages):
    dest = OUT / filename
    doc = SimpleDocTemplate(
        str(dest), pagesize=A4, leftMargin=42, rightMargin=42,
        topMargin=53, bottomMargin=62, title="AutismHub - " + title,
        author="AutismHub", pageCompression=1
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    pdf = PdfReader(str(dest))
    if len(pdf.pages) != pages:
        raise RuntimeError(f"{filename}: expected {pages} pages, got {len(pdf.pages)}")
    for index, page in enumerate(pdf.pages):
        content = page.extract_text() or ""
        if len(content) < 200 or "�" in content:
            raise RuntimeError(f"{filename}: missing/unreadable Kazakh text on page {index+1}")
    with fitz.open(dest) as f:
        for i, page in enumerate(f):
            for line in page.get_text("dict")["blocks"]:
                for row in line.get("lines", []):
                    for span in row.get("spans", []):
                        text = span["text"].strip()
                        if not text:
                            continue
                        x0,y0,x1,y1 = span["bbox"]
                        if x0 < -1 or y0 < -1 or x1 > W+1 or y1 > H+1:
                            raise RuntimeError(f"{filename}: clipped text on page {i+1}: {text}")
                        if 60 < y0 < H-63 and span["size"] < 10.7:
                            raise RuntimeError(f"{filename}: small body text on page {i+1}: {text}")
    print(f"Self-care KK PDF OK: {filename}, pages={pages}, bytes={dest.stat().st_size}")
    return dest

story = []
for index, activity in enumerate(tasks):
    if index:
        story.append(PageBreak())
    story.extend([
        p("12 ТҰРМЫСТЫҚ ТАПСЫРМА", SECTION),
        p(f"{index+1}. {activity['title']}", TITLE),
        p("Киіну, тамақтану, гигиена және үй істеріне қатысудың қолжетімді қадамдары."),
        HRFlowable(width="100%", thickness=0.8, color=RULE),
        Spacer(1, 15),
    ])
    for label, key in [
        ("Қажетті материалдар", "materials"),
        ("Бала қалай қатыса алады", "steps"),
        ("Жеңілдету жолы", "easier"),
        ("Бала дайын болса, келесі қадам", "harder"),
        ("Қауіпсіздік", "safety"),
    ]:
        story.append(KeepTogether([p(label, LABEL), p(activity[key])]))
        story.append(Spacer(1, 8))
    story.extend([
        HRFlowable(width="100%", thickness=0.8, color=RULE),
        Spacer(1, 13),
        p("Балаға қолайлы бір қадам жеткілікті. Көмек, үзіліс немесе бас тарту мүмкіндігі сақталады."),
    ])
make_doc("12-tapsyrma-kundelikti-derbestik-kk.pdf", "Күнделікті дербестікке арналған 12 тапсырма", story, 12)

ideas = [
    ("Дүйсенбі", "Футболканың етегін түзету."),
    ("Сейсенбі", "Үстелге ыңғайлы кесені қою."),
    ("Сәрсенбі", "Қол жуғаннан кейін сүлгіні алу."),
    ("Бейсенбі", "Жабысқақ бекіткішті ашу."),
    ("Жұма", "Үлкен ойыншықты қорапқа салу."),
    ("Сенбі", "Ыңғайлы шұлықты жоғары тарту."),
    ("Жексенбі", "Сүйікті әрекетті таңдау немесе демалу."),
]
questions = [
    "Бала қай қадамды өзі таңдады?",
    "Ересектің көмегімен не істей алды?",
    "Көмек сұрауын немесе бас тартуын қалай білдірді?",
    "Қай орта жағдайын өзгерткен дұрыс болар еді?",
    "Маманға қандай сұрақ қойғымыз келеді?",
]
story = [
    p("БІР АПТАҒА АРНАЛҒАН ЖОСПАР", TITLE),
    p("Жеті күнге арналған міндетті емес идеялар. Ересектің көмегі немесе демалыс ең ыңғайлы таңдау болуы мүмкін."),
    p("Бұл кесте міндетті жаттығу бағдарламасы емес. Өткізіп алған күнді өтеу қажет емес."),
    Spacer(1, 12)
]
for day, idea in ideas:
    story.append(KeepTogether([
        p(day + "  -  " + idea, LABEL),
        p("Біздің нұсқамыз немесе не көмектесті:"),
        Spacer(1, 3),
        HRFlowable(width="100%", thickness=0.7, color=RULE),
        Spacer(1, 5),
    ]))
story.extend([
    PageBreak(),
    p("ОТБАСЫНЫҢ БАҚЫЛАУ КҮНДЕЛІГІ", TITLE),
    p("Балаға не ыңғайлы, нені өзі таңдайды, қай жерде қолдау қажет? Ұпай қоймаңыз және басқа балалармен салыстырмаңыз."),
    p("Толтырылған жазбалардағы жеке деректерді құпия сақтаңыз."),
    Spacer(1, 12),
])
for q in questions:
    story.extend([p(q, LABEL), Spacer(1, 17),
        HRFlowable(width="100%", thickness=0.7, color=RULE), Spacer(1, 23),
        HRFlowable(width="100%", thickness=0.7, color=RULE), Spacer(1, 17)])
make_doc("aptalyk-zhospar-zhane-bakylau-kundeligi-kk.pdf", "Апталық жоспар мен бақылау күнделігі", story, 2)
