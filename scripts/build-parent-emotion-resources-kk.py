#!/usr/bin/env python3
"""Build Kazakh translations of the two parent emotion-support PDFs.

Translations follow the current Russian canonical printables produced by
scripts/rebuild-parent-printables.py. These are educational examples, not a
validated AAC system, a diagnostic instrument or a crisis protocol.
"""
from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "downloads" / "emotions"
DEST.mkdir(parents=True, exist_ok=True)
STYLES = (ROOT / "src" / "styles" / "typography.css").read_text(encoding="utf-8")


def pt(token: str) -> float:
    matched = re.search(r"--" + re.escape(token) + r":\s*([0-9]+(?:\.[0-9]+)?)pt\s*;", STYLES)
    if not matched:
        raise RuntimeError("Missing typography token " + token)
    return float(matched.group(1))


BODY_SIZE = pt("type-print-body")
H1_SIZE = pt("type-print-h1")
H2_SIZE = pt("type-print-h2")
if BODY_SIZE < 11:
    raise RuntimeError("Printable body must be at least 11 pt")

regular = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not regular.is_file() or not bold.is_file():
    raise RuntimeError("DejaVuSans fonts with Kazakh glyphs required")
pdfmetrics.registerFont(TTFont("AutismHubKK", str(regular)))
pdfmetrics.registerFont(TTFont("AutismHubKKBold", str(bold)))

INK = HexColor("#173B56")
ACCENT = HexColor("#215C88")
BORDER = HexColor("#B9CFDF")
MUTED = HexColor("#4E687B")
NORMAL = ParagraphStyle("KK body", fontName="AutismHubKK", fontSize=BODY_SIZE,
                        leading=BODY_SIZE * 1.53, textColor=INK, spaceAfter=12,
                        alignment=TA_LEFT, allowWidows=0, allowOrphans=0)
LABEL = ParagraphStyle("KK label", parent=NORMAL, fontName="AutismHubKKBold",
                       textColor=ACCENT, spaceBefore=10, spaceAfter=5)
SECTION = ParagraphStyle("KK subsection", parent=LABEL, fontSize=H2_SIZE,
                         leading=H2_SIZE * 1.35, spaceBefore=14, spaceAfter=9)
TITLE = ParagraphStyle("KK title", parent=LABEL, fontSize=H1_SIZE,
                       leading=H1_SIZE * 1.3, spaceAfter=17)


def p(story, string, style=NORMAL):
    story.append(Paragraph(escape(string).replace("\n", "<br/>"), style))


def pair(story, label, text):
    p(story, label, LABEL)
    p(story, text)


def free_lines(story, n=2):
    for _ in range(n):
        story.extend([Spacer(1, 15), HRFlowable(width="100%", thickness=.7, color=BORDER), Spacer(1, 9)])


def field(story, label, n=2):
    p(story, label, LABEL)
    free_lines(story, n)


def footer(canvas, doc):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(BORDER)
    canvas.line(42, 44, w - 42, 44)
    canvas.setFont("AutismHubKK", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 29, "AutismHub | Ата-аналарға арналған білім беру материалы")
    canvas.drawRightString(w - 42, 29, str(doc.page))
    canvas.restoreState()


def make(name, title, content, expected_pages):
    path = DEST / name
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=42, rightMargin=42,
                            topMargin=48, bottomMargin=62, title="AutismHub - " + title,
                            author="AutismHub", pageCompression=1)
    doc.build(content, onFirstPage=footer, onLaterPages=footer)
    pdf = PdfReader(str(path))
    if len(pdf.pages) != expected_pages:
        raise RuntimeError(f"Wrong PDF page count: {name}: {len(pdf.pages)} != {expected_pages}")
    if path.stat().st_size < 12000:
        raise RuntimeError("PDF is suspiciously small: " + name)
    if any(len(page.extract_text() or "") < 100 for page in pdf.pages):
        raise RuntimeError("Missing searchable text in " + name)
    print(f"KAZAKH EMOTION PDF OK: {name}; {len(pdf.pages)} pages, {path.stat().st_size} bytes")


# Order and meaning correspond one-to-one with the original 12 Russian cards.
# (Situation, what to try, possible phrase, what to avoid.)
SITUATIONS = [
    (
        "Ойынды аяқтау",
        "Келесі әрекетті алдын ала көрсетіңіз. Алдымен қай ойыншықты сөреге қоюды баланың өзіне таңдауды ұсыныңыз.",
        "Жақында кешкі ас ішеміз. Машинаны осында қалдыруға болады.",
        "Қауіпсіздік үшін қажет болмаса, затты алдын ала ескертпей алып қоймаңыз.",
    ),
    (
        "Дүкенде тым шулы",
        "Шулы жерден алыстаңыз. Сыртқа шығуды немесе тыныштау орынды ұсыныңыз. Бала үйренген болса, есту мүшесін қорғайтын құралдарды қолданыңыз.",
        "Шу қатты екен. Сыртқа шыға аламыз.",
        "Үйрету мақсатында баланы жағымсыз шуға төзуге мәжбүрлемеңіз.",
    ),
    (
        "Мұнара құрастыру қиын болып тұр",
        "Баланың қиналғанын мойындаңыз. Көмек немесе үзіліс ұсыныңыз, бас тартуын қабылдаңыз.",
        "Қиын екен. Көмектесейін бе, әлде үзіліс жасаймыз ба?",
        "Бала келіспесе, құрастырғанын өз бетіңізше түзетпеңіз.",
    ),
    (
        "Киіну керек",
        "Бір қысқа нұсқау беріңіз. Балаға қауіпсіз әрі ыңғайлы киім арасынан таңдауға мүмкіндік беріңіз.",
        "Алдымен шұлық киеміз бе, әлде футболка ма?",
        "Жағымсыз жанасуға немесе жайсыз матаға күштемеңіз.",
    ),
    (
        "Бас тартқаннан кейін қатты ашулану",
        "Баланың эмоциясын мойындаңыз, маңызды шекараны сақтап, қауіпсіз балама ұсыныңыз.",
        "Ашуланып тұрсың. Ұруға болмайды. Мен жаныңдамын.",
        "Эмоцияны сезінуге тыйым салмаңыз, баланы қорламаңыз.",
    ),
    (
        "Балабақшадан кейін тыныштық қажет",
        "Бірден көп сұрақ қоймаңыз. Қажет болса, су, тамақ, демалыс немесе таныс әрекет ұсыныңыз.",
        "Демалуға болады. Мен жаныңдамын.",
        "Баланы бірден сөйлесуге мәжбүрлемеңіз.",
    ),
    (
        "Үйге қонақтар келеді",
        "Кім келетінін алдын ала айтыңыз. Баланың қай жерде болатынын таңдауына және қатыспауына мүмкіндік беріңіз.",
        "Бізге қонақтар келеді. Осында немесе басқа бөлмеде бола аласың.",
        "Балаға жайсыз болса, құшақтауды немесе сәлемдесуді талап етпеңіз.",
    ),
    (
        "Үйреншікті жол өзгерді",
        "Өзгерісті қысқаша түсіндіріңіз. Мүмкін болса, одан кейін не болатынын суретпен немесе картадан көрсетіңіз.",
        "Бүгін басқа жолмен барамыз. Содан кейін үйге қайтамыз.",
        "Баланың уайымын жоққа шығармаңыз және ұзақ түсіндірумен шаршатпаңыз.",
    ),
    (
        "Бала мәселесін жеткізе алмай тұр",
        "Қолжетімді ым, сурет немесе AAC тәсілін ұсыныңыз. Денедегі жайсыздық бар-жоғын да тексеріңіз.",
        "Ауырды ма? Тынышырақ па? Үзіліс пе? Қолыңнан келсе, көрсет.",
        "Қандай жағдай болса да ауызша жауап беруді талап етпеңіз.",
    ),
    (
        "Күту керек",
        "Күтуді түсінікті етіңіз. Балаға ұнайтын қауіпсіз затты немесе айналысатын әрекетті таңдауды ұсыныңыз.",
        "Күтіп отырғанда кітап немесе ойыншық алуға болады.",
        "Нақты білмесеңіз, қанша күтетінін дәл айтып уәде бермеңіз.",
    ),
    (
        "Бала өзіне қол тигізгенді қаламайды",
        "Жеке кеңістігін құрметтеңіз. Жанаспай көмектесуді ұсыныңыз немесе ыңғайлы қашықтыққа шегініңіз.",
        "Саған қол тигізбеймін. Қажет болса, мен осындамын.",
        "Құшақтауды немесе ұстап тұруды зорлап жасамаңыз.",
    ),
    (
        "Ұйықтар алдында қиындық туындады",
        "Шу мен жарықты азайтыңыз, үйреншікті реттілікке оралыңыз. Аштықты, ауырсынуды және өзге жайсыздықты тексеріңіз.",
        "Қазір тыныш. Қаласаң, кейін кітап оқимыз.",
        "Көп тапсырма немесе міндетті жаттығу қоспаңыз.",
    ),
]

assert len(SITUATIONS) == 12

cards = []
for number, (situation, support, phrase, avoid) in enumerate(SITUATIONS, 1):
    if number > 1:
        cards.append(PageBreak())
    p(cards, "12 тұрмыстық жағдай: эмоциялар және өзін-өзі реттеу", TITLE)
    p(cards, f"{number}. {situation}", SECTION)
    pair(cards, "Не істеуге болады", support)
    pair(cards, "Не айтуға болады", phrase)
    pair(cards, "Неден аулақ болу керек", avoid)
    pair(cards, "Ескерту", "Эмоцияның өзі жаман мінез-құлық емес. Жарақат алу қаупі, ауырсынуға күдік немесе жаңа ауыр белгілер болса, тиісті кәсіби көмекке жүгініңіз.")
make("12-zhagday-emotsiyalar-bala-kk.pdf", "12 жағдай: эмоциялар және өзін-өзі реттеу", cards, 12)

# The second PDF follows the latest Russian canonical *print* version:
# communication messages, a before/during/after support plan, and an unscored diary.
plan = []
p(plan, "ҮЗІЛІС · КӨМЕКТЕС · ТЫНЫШЫРАҚ · ТОҚТА", TITLE)
p(plan, "Бұлар міндетті AAC жүйесі емес, хабар жеткізудің мысалдары ғана. Сөз, ым және бала қолданатын жеке қарым-қатынас тәсілдері де маңызды.")
for label, explanation in [
    ("ҮЗІЛІС", "Қауіпсіз болса, міндетті емес әрекеттен үзіліс жасауға мүмкіндік беріңіз."),
    ("КӨМЕКТЕС", "Баланың қалауын анықтап, түсінікті әрі қолжетімді көмек көрсетіңіз."),
    ("ТЫНЫШЫРАҚ", "Мүмкін болса, шуды азайтыңыз немесе басқа тыныш орын ұсыныңыз."),
    ("ТОҚТА", "Бала қаламайтын, міндетті емес әрекетті тоқтатыңыз."),
]:
    p(plan, label, SECTION)
    p(plan, explanation)
    free_lines(plan, 1)
plan.append(PageBreak())

p(plan, "Отбасының қолдау жоспары", TITLE)
p(plan, "Қатты күйзелуге дейінгі, оның кезіндегі және одан кейінгі әрекеттерге арналған үлгі. Бұл медициналық дағдарыс хаттамасы емес.")
for question in [
    "ДЕЙІН: жүктемені не азайтады?",
    "КЕЗІНДЕ: қауіпсіздікті қалай қамтамасыз етеміз?",
    "КЕЙІН: қалпына келуге не көмектеседі?",
    "Бала көмек, үзіліс немесе бас тартуды қалай білдіреді?",
]:
    field(plan, question, n=2)
plan.append(PageBreak())

p(plan, "Эмоциялар мен өзін-өзі реттеуді бақылау күнделігі", TITLE)
p(plan, "Тек нақты болған жағдайларды жазыңыз, баға қоймаңыз және баланың ниетін болжауды факт ретінде бермеңіз.")
for question in [
    "Жағдай және оған дейінгі орта мен шарттар",
    "Бала не істеді немесе қалай көрсетті?",
    "Ересектер нені өзгертті?",
    "Не көмектесті, не сәйкес келмеді?",
    "Маманмен нені талқылау керек?",
]:
    field(plan, question, n=2)
make("korgneki-koldau-otbasy-zhospary-kundelik-kk.pdf", "Хабарлар, отбасы жоспары және күнделік", plan, 3)
