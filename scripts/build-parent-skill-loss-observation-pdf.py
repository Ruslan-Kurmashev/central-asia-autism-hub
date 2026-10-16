#!/usr/bin/env python3
"""Create an unscored, non-diagnostic parent consultation preparation worksheet.

The sheet is not a medical triage form and explicitly must never delay care.
No parent or child data are collected during generation.
"""
from pathlib import Path

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "development" / "forma-nablyudeniy-poterya-navykov-ru.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
regular = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not regular.is_file() or not bold.is_file():
    raise RuntimeError("DejaVu Sans fonts required for Cyrillic PDF")
pdfmetrics.registerFont(TTFont("ChildSkills", str(regular)))
pdfmetrics.registerFont(TTFont("ChildSkillsB", str(bold)))

W, H = A4
LEFT, RIGHT = 43, W - 43
BLUE = HexColor("#234E73")
NAVY = HexColor("#18384F")
MUTED = HexColor("#516676")
EDGE = HexColor("#BFCFDB")
PALE = HexColor("#E9F1F7")

C = canvas.Canvas(str(OUTPUT), pagesize=A4)
C.setTitle("AutismHub - Наблюдения о потере ранее устойчивых навыков: подготовка к врачу")
C.setAuthor("AutismHub")


def word(x, y, s, size=9, bold=False, color=NAVY):
    C.setFont("ChildSkillsB" if bold else "ChildSkills", size)
    C.setFillColor(color)
    C.drawString(x, y, s)


def paragraph(x, y, text, width=480, size=8.6, leading=13.3, color=NAVY):
    for segment in text.split("\n"):
        for line in simpleSplit(segment, "ChildSkills", size, width) if segment else [""]:
            word(x, y, line, size, False, color)
            y -= leading
    return y


def start_page(n, title):
    C.setFillColor(BLUE)
    C.rect(0, H - 16, W, 16, fill=1, stroke=0)
    word(LEFT, H - 42, "AutismHub / Для разговора с медицинским специалистом", 9.2, True, BLUE)
    word(LEFT, H - 65, title, 12.5, True)
    C.setStrokeColor(EDGE)
    C.line(LEFT, H - 78, RIGHT, H - 78)
    C.line(LEFT, 40, RIGHT, 40)
    word(LEFT, 26, "Авторский организационный шаблон · 16.10.2026 · Без баллов", 7.3, color=MUTED)
    C.setFont("ChildSkills", 8)
    C.setFillColor(MUTED)
    C.drawRightString(RIGHT, 26, f"{n}/2")


def question(y, title, help_text, rows=2):
    C.setFillColor(PALE)
    C.roundRect(LEFT, y - 21, RIGHT - LEFT, 30, 7, fill=1, stroke=0)
    word(LEFT + 11, y - 12, title, 9.2, True, BLUE)
    y -= 39
    y = paragraph(LEFT + 5, y, help_text, width=RIGHT - LEFT - 10, size=8, leading=12, color=MUTED)
    y -= 9
    for _ in range(rows):
        C.setStrokeColor(EDGE)
        C.line(LEFT + 5, y, RIGHT - 5, y)
        y -= 26
    return y - 16

start_page(1, "Что ребёнок умел раньше и что изменилось")
y = paragraph(
    LEFT, H - 106,
    "Эта форма помогает запомнить конкретные изменения. Её не нужно заполнять целиком. "
    "При утрате ранее устойчивого навыка обратитесь к врачу без долгого ожидания.",
    size=9, leading=15
)
y -= 17
y = question(y, "1. Какой навык раньше был устойчивым?",
    "Например: самостоятельно говорил определённые слова, показывал жест, ходил, пользовался ложкой.")
y = question(y, "2. Как часто и в каких ситуациях ребёнок это делал?",
    "Пример: почти каждый день в знакомой игре, с близкими или в садике.")
y = question(y, "3. Что изменилось? Когда вы это заметили?",
    "Опишите наблюдаемые действия и примерную дату. Если не помните точно, так и скажите.")
y = question(y, "4. В каких условиях изменение заметно?",
    "Дома, в садике, на прогулке, с разными взрослыми или на разных языках.", rows=2)
if y < 49:
    raise ValueError(f"Page 1 content clipped: {y}")
C.showPage()

start_page(2, "Дополнительные наблюдения и вопросы врачу")
y = paragraph(
    LEFT, H - 106,
    "Не нужно проверять навыки через принуждение. Если старых записей нет, можно рассказать всё своими словами. "
    "Видео и дневник не заменяют осмотр.",
    size=8.9, leading=15
)
y -= 14
y = question(y, "5. Были ли другие изменения или симптомы?",
    "Например: слабость, боль, изменения сна и слуха, болезнь, травма или необычные эпизоды.")
y = question(y, "6. Что замечают другие взрослые?",
    "Например: воспитатель, родственники. Можно записать разные наблюдения без попытки выбрать единственное объяснение.")
y = question(y, "7. Какие вопросы хотите обсудить с врачом?",
    "Нужна ли оценка слуха, речи, движений или другой функции? Какие симптомы требуют более быстрого обращения?", rows=2)
C.setFillColor(PALE)
C.roundRect(LEFT, y - 96, RIGHT - LEFT, 106, 8, fill=1, stroke=0)
word(LEFT + 12, y - 11, "Не откладывайте медицинскую помощь ради этой формы", 9.1, True, BLUE)
warning = (
    "При внезапной слабости руки, ноги или лица, судорогах, потере сознания, "
    "затруднении дыхания и других острых опасных симптомах обращайтесь за экстренной помощью. "
    "Форма не определяет диагноз или срочность для конкретного ребёнка."
)
v = paragraph(LEFT + 12, y - 31, warning, width=RIGHT - LEFT - 24,
              size=8, leading=14)
if v < y - 90:
    raise ValueError("Safety note does not fit")
if y - 96 < 45:
    raise ValueError(f"Page 2 content clipped: {y - 96}")
C.showPage()
C.save()

if not OUTPUT.is_file() or OUTPUT.stat().st_size < 15000:
    raise RuntimeError("Parent skill loss PDF missing or truncated")
doc = PdfReader(str(OUTPUT))
if len(doc.pages) != 2:
    raise RuntimeError(f"Unexpected number of pages: {len(doc.pages)}")
if any(len(p.extract_text() or "") < 300 for p in doc.pages):
    raise RuntimeError("Missing selectable Cyrillic PDF text")
print(f"Child skill loss observation PDF OK: {OUTPUT.name}, pages=2, bytes={OUTPUT.stat().st_size}")
