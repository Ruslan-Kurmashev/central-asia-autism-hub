#!/usr/bin/env python3
"""Rebuild the 15 AutismHub parent PDFs with the canonical 11pt print body.

Runs AFTER legacy generators and replaces their outputs. Source activity facts
stay in existing JSON/Python data; no real child data or third-party imagery.
Original vector sequences are placed in the matching printable exercises.
"""
from __future__ import annotations
import ast
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
from pypdf import PdfReader
from svglib.svglib import svg2rlg

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"public"/"downloads"
INK=HexColor("#1C3C55")
NAVY=HexColor("#245A82")
MUTED=HexColor("#526778")
EDGE=HexColor("#B8CDDC")
FONT_REG=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
FONT_BOLD=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not FONT_REG.is_file() or not FONT_BOLD.is_file():
    raise RuntimeError("Readable Cyrillic DejaVu fonts are required")
pdfmetrics.registerFont(TTFont("AH-Print",str(FONT_REG)))
pdfmetrics.registerFont(TTFont("AH-Print-Bold",str(FONT_BOLD)))
CSS=(ROOT/"src"/"styles"/"typography.css").read_text(encoding="utf-8")
def css_points(token):
    match=re.search(r"--"+re.escape(token)+r":\s*([0-9]+(?:\.[0-9]+)?)pt\s*;",CSS)
    if not match:
        raise RuntimeError("Missing canonical print typography token: "+token)
    return float(match.group(1))
SIZE=css_points("type-print-body")
H1=css_points("type-print-h1")
H2=css_points("type-print-h2")
if SIZE < 11:
    raise RuntimeError("Body print token must be at least 11pt")
NORMAL=ParagraphStyle("AH-Body",fontName="AH-Print",fontSize=SIZE,leading=SIZE*1.56,textColor=INK,spaceAfter=11,alignment=TA_LEFT,allowWidows=0,allowOrphans=0)
LABEL=ParagraphStyle("AH-Label",parent=NORMAL,fontName="AH-Print-Bold",fontSize=SIZE,leading=SIZE*1.45,textColor=NAVY,spaceBefore=6,spaceAfter=6)
SECTION=ParagraphStyle("AH-Subheading",parent=LABEL,fontSize=H2,leading=H2*1.35,spaceBefore=9,spaceAfter=10)
TITLE=ParagraphStyle("AH-Title",parent=LABEL,fontSize=H1,leading=H1*1.25,spaceAfter=14)
SMALL=ParagraphStyle("AH-Footer",parent=NORMAL,fontSize=9,leading=12,spaceAfter=5,textColor=MUTED)
OUTPUTS=[]
ART=(ROOT/"public"/"images"/"editorial")
def ptext(s,style=NORMAL):
    return Paragraph(escape(str(s)).replace("\n","<br/>"),style)
def intro(story,title,subtitle):
    story.append(ptext(title,TITLE))
    if subtitle:story.append(ptext(subtitle))
def heading(story,s):
    story.append(ptext(s,SECTION))
def item(story,lab,text):
    story.append(ptext(lab,LABEL))
    story.append(ptext(text))
def write_lines(story,n=2):
    for _ in range(n):
        story.append(Spacer(1,15))
        story.append(HRFlowable(width="100%",thickness=.65,color=EDGE))
        story.append(Spacer(1,9))
def field(story,question,hint="",n=2):
    story.append(ptext(question,LABEL))
    if hint:story.append(ptext(hint))
    write_lines(story,n)
def newpage(story):
    story.append(PageBreak())
def diagram(story,relative):
    svg=ART/relative
    if not svg.is_file():
        raise RuntimeError(f"Source illustration missing: {svg}")
    drawing=svg2rlg(str(svg))
    if drawing is None or drawing.width <=0 or drawing.height<=0:
        raise RuntimeError(f"Source illustration cannot render: {svg}")
    scale=min(1.0,510/drawing.width,182/drawing.height)
    drawing.scale(scale,scale)
    drawing.width*=scale
    drawing.height*=scale
    story.append(drawing)
    story.append(Spacer(1,11))
def foot(canvas,doc):
    canvas.saveState()
    canvas.setStrokeColor(EDGE)
    canvas.line(40,44,A4[0]-40,44)
    canvas.setFont("AH-Print",9)
    canvas.setFillColor(MUTED)
    canvas.drawString(40,30,"AutismHub · Образовательный материал · Не диагностический тест")
    canvas.drawRightString(A4[0]-40,30,str(doc.page))
    canvas.restoreState()
def build(name,title,story,min_pages=1,expected_illustrations=0):
    path=BASE/name
    path.parent.mkdir(parents=True,exist_ok=True)
    doc=SimpleDocTemplate(str(path),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=51,bottomMargin=60,title="AutismHub - "+title,author="AutismHub",pageCompression=1)
    doc.build(story,onFirstPage=foot,onLaterPages=foot)
    pdf=PdfReader(str(path))
    if len(pdf.pages)<min_pages or path.stat().st_size<12500:
        raise RuntimeError(f"PDF too short or empty: {path.name}")
    for n,page in enumerate(pdf.pages,1):
        if len(page.extract_text() or "")<85:
            raise RuntimeError(f"Unreadable or empty page {n} in {path.name}")
    if expected_illustrations:
        # Diagrams are vector Form XObjects or vector page drawing commands;
        # byte-size, source existence and layout are checked below by CI.
        if len(pdf.pages)<expected_illustrations:raise RuntimeError("Illustration pages missing")
    OUTPUTS.append((path,len(pdf.pages)))
    print(f"UPGRADED PDF OK: {path.name}, pages={len(pdf.pages)}, bytes={path.stat().st_size}, body={SIZE}pt")

def json_data(relative,key):
    return json.loads((ROOT/relative).read_text(encoding="utf-8"))[key]
def literal_list(relative,name):
    tree=ast.parse((ROOT/relative).read_text(encoding="utf-8"))
    for stmt in tree.body:
        if isinstance(stmt,ast.Assign):
            for target in stmt.targets:
                if isinstance(target,ast.Name) and target.id==name:
                    return ast.literal_eval(stmt.value)
    raise RuntimeError(f"Source list {name} not found in {relative}")

motor=json.loads((ROOT/"scripts/data/parent-motor-activity-pack-ru.json").read_text(encoding="utf-8"))
gross=motor["gross"];fine=motor["fine"]
BODIES=[
    ("Что понадобится","materials"),
    ("Как делать","steps"),
    ("Как упростить","easier"),
    ("По желанию усложнить","harder"),
    ("Безопасность","safety"),
]
def activity_page(story,entry,title,figure=None):
    intro(story,title,entry["title"])
    if figure:diagram(story,figure)
    for lab,key in BODIES:
        item(story,lab,entry[key])
def many_activities(out,title,entries,illustrations={}):
    story=[]
    for n,entry in enumerate(entries):
        if n:newpage(story)
        activity_page(story,entry,title,illustrations.get(entry["id"]))
    build(out,title,story,min_pages=len(entries),expected_illustrations=len(illustrations))

figures={
 "G01":"motor/motor-diagram-walking-line.svg",
 "G02":"motor/motor-diagram-rolling-ball.svg",
 "G04":"motor/motor-diagram-step-over-towel.svg",
 "G06":"motor/motor-diagram-avoid-objects.svg",
 "F01":"motor/motor-diagram-clothes-pegs.svg",
 "F02":"motor/motor-diagram-tear-paper.svg",
 "F03":"motor/motor-diagram-play-dough.svg",
 "F04":"motor/motor-diagram-spoon-transfer.svg",
}
many_activities("motor/10-igr-krupnaya-motorika-ru.pdf","10 игр для крупной моторики",gross)
many_activities("motor/15-zadanii-melkaya-motorika-ru.pdf","15 заданий для мелкой моторики",fine)
lookup={entry["id"]:entry for entry in gross+fine}
chosen=["G01","G02","G04","G06","F01","F02","F03","F04"]
many_activities("motor/8-kartochek-motorika-ru.pdf","8 карточек с пошаговыми рисунками",[lookup[x] for x in chosen],figures)

days=[
("Понедельник","Катим большой мягкий мяч или мнём бумагу."),
("Вторник","Обходим крупные отметки или используем крупные наклейки."),
("Среда","Двигаемся под музыку или открываем лёгкие контейнеры."),
("Четверг","Дорожка на полу или лепка безопасным тестом."),
("Пятница","Прокатываем мяч в широкие ворота или перелистываем книгу."),
("Суббота","Переносим мягкие игрушки или играем с липучками."),
("Воскресенье","Отдых или любимая безопасная игра по выбору ребёнка."),
]
story=[]
intro(story,"Недельный план без обязательных норм","Примеры занятий для вдохновения. Ребёнок может выбрать другой вариант или отказаться.")
for day,action in days:
    item(story,day,action)
    write_lines(story,1)
newpage(story)
intro(story,"Дневник наблюдений","Отмечайте интересы, комфорт и помощь, а не баллы.")
for q in ["Какую игру выбрал ребёнок?","Что получилось с удобной поддержкой?","Когда ребёнок попросил помощь или паузу?","Какие условия сделали игру приятнее?","Что хочу спросить у специалиста?"]:
    field(story,q,n=2)
build("motor/nedelnyi-plan-i-dnevnik-motoriki-ru.pdf","Недельный план и дневник моторики",story,2)

emotion=literal_list("scripts/build-parent-emotion-resources.py","CARDS")
story=[]
for i,(sit,action,phrase,avoid) in enumerate(emotion):
    if i:newpage(story)
    intro(story,"12 ситуаций: эмоции и саморегуляция",f"{i+1}. {sit}")
    item(story,"Что попробовать",action)
    item(story,"Можно сказать",phrase)
    item(story,"Чего избегать",avoid)
    item(story,"Напоминание","Эмоция не является плохим поведением. При угрозе травмы, подозрении на боль или новых тяжёлых симптомах обратитесь за соответствующей помощью.")
build("emotions/12-situatsiy-emotsii-rebenka-ru.pdf","12 ситуаций: эмоции",story,min_pages=12)

story=[]
intro(story,"Пауза · Помоги · Тише · Стоп","Это примеры сообщений, не обязательная система AAC. Слова, жесты и индивидуальные способы общения также важны.")
for label,explain in [
("ПАУЗА","Предоставьте перерыв в необязательном действии, если это безопасно."),
("ПОМОГИ","Окажите доступную помощь, уточнив предпочтение ребёнка."),
("ТИШЕ","По возможности уменьшите громкость или предложите другое место."),
("СТОП","Остановите нежелательное необязательное действие.")]:
    heading(story,label)
    story.append(ptext(explain))
    write_lines(story,1)
newpage(story)
intro(story,"Семейный план поддержки","Шаблон до, во время и после сильного напряжения; не медицинский кризисный протокол.")
for q in ["ДО: что уменьшает нагрузку?","ВО ВРЕМЯ: как обеспечить безопасность?","ПОСЛЕ: что помогает восстановиться?","Как ребёнок просит помощь, паузу или отказ?"]:
    field(story,q,n=2)
newpage(story)
intro(story,"Дневник эмоций и саморегуляции","Записывайте факты, не ставьте оценки и не приписывайте намерения.")
for q in ["Ситуация и условия до эпизода","Что ребёнок сделал или показал?","Что изменили взрослые?","Что помогло или не подошло?","Что обсудить со специалистом?"]:
    field(story,q,n=2)
build("emotions/pamyatki-plan-i-dnevnik-emotsii-ru.pdf","Карточки, план и дневник саморегуляции",story,3)

selfcare=json_data("scripts/data/parent-daily-independence-tasks-ru.json","tasks")
many_activities("selfcare/12-zadanii-samostoyatelnost-ru.pdf","12 домашних заданий для самостоятельности",selfcare)
seq=literal_list("scripts/build-parent-daily-independence-pdfs.py","SEQUENCES")
selfcare_figures=[
 "selfcare-shirt-sequence.svg",
 "selfcare-handwashing-sequence.svg",
 "selfcare-table-sequence.svg",
 "selfcare-bag-sequence.svg"
]
if len(seq)!=4:raise RuntimeError("Four self-care sequences expected")
story=[]
for i,(name,steps) in enumerate(seq):
    if i:newpage(story)
    intro(story,"Визуальная последовательность",name)
    diagram(story,selfcare_figures[i])
    for step,name,description in steps:
        story.append(ptext(f"Шаг {step}. {name}",LABEL))
        story.append(ptext(description))
    story.append(ptext("Необязательно выполнять все шаги самостоятельно. Помощь взрослого и адаптации допустимы."))
build("selfcare/4-vizualnye-posledovatelnosti-ru.pdf","4 визуальные последовательности",story,4,4)

story=[]
intro(story,"Самостоятельность: пример на неделю","Необязательные идеи. Помощь взрослого и отдых могут быть лучшим вариантом.")
ideas=[
("Понедельник","Поправить край футболки."),
("Вторник","Поставить удобную чашку на стол."),
("Среда","Взять полотенце после мытья рук."),
("Четверг","Открыть липучку."),
("Пятница","Положить большую игрушку в коробку."),
("Суббота","Подтянуть удобный носок."),
("Воскресенье","Выбрать любимое действие или отдохнуть.")
]
for day,idea in ideas:
    item(story,day,idea)
    write_lines(story,1)
newpage(story)
intro(story,"Самостоятельность: заметки для семьи","Что удобно, что ребёнок выбирает и где нужна поддержка?")
for q in ["Какой шаг ребёнок выбрал сам?","Что получилось с помощью взрослого?","Как ребёнок попросил помощь или отказался?","Что в обстановке хотелось бы изменить?","Какие вопросы задать специалисту?"]:
    field(story,q,n=2)
build("selfcare/semeynyi-plan-i-dnevnik-navykov-ru.pdf","Недельный план самостоятельности",story,2)

story=[]
intro(story,"Потеря ранее устойчивых навыков","Форма для беседы с врачом, не для постановки диагноза. Не откладывайте обращение ради заполнения.")
for q in ["Какой конкретный навык ребёнок раньше регулярно использовал?","Когда и где ребёнок выполнял это действие?","Что перестал делать, когда заметили?","В каких ситуациях изменение особенно заметно?"]:
    field(story,q,n=2)
newpage(story)
intro(story,"Дополнительные наблюдения и вопросы","При внезапной слабости, судорогах, нарушении сознания и других острых опасных симптомах нужна экстренная помощь.")
for q in ["Сопутствующие симптомы, боль, изменения слуха или движения","Что замечают другие взрослые?","Какие вопросы хотите обсудить с врачом?"]:
    field(story,q,n=3)
build("development/forma-nablyudeniy-poterya-navykov-ru.pdf","Наблюдения о потере навыков",story,2)

bilingual=literal_list("scripts/build-parent-bilingual-language-pdfs.py","stories")
story=[]
intro(story,"7 ситуаций для общения на двух языках","Русский и казахский: бытовые примеры, не переводческий или речевой тест.")
for i,(heading_text,example) in enumerate(bilingual):
    if i==4:
        newpage(story)
        intro(story,"Ещё три ситуации","Принимайте жесты, AAC и слова любого привычного языка.")
    item(story,heading_text,example)
    story.append(Spacer(1,7))
build("bilingual/7-situatsii-dva-yazyka-v-seme-ru.pdf","7 русско-казахских ситуаций",story,2)

story=[]
intro(story,"Языковая карта семьи","Запишите по желанию только то, что помогает разговору со специалистом.")
for q in ["Какие языки слышит и использует ребёнок?","С кем и в каких местах используется каждый язык?","Как ребёнок выражает просьбы, интерес и отказ?","Что ребёнок понимает в знакомых ситуациях?"]:
    field(story,q,n=2)
newpage(story)
intro(story,"Примеры для консультации","Не переводите самостоятельно стандартизированные тесты и не оценивайте ребёнка по одному языку.")
for q in ["Пример общения на русском или другом языке","Пример общения на казахском или другом языке","Что изменилось или вызывает вопросы?","Что спросить о проверке слуха и оценке всех языков?"]:
    field(story,q,n=2)
build("bilingual/karta-yazykov-i-nablyudenii-dlya-spetsialista-ru.pdf","Языковая карта и наблюдения",story,2)

context_q=[
 ["В какой ситуации ребёнок находился?","Что увидели дома?","Что наблюдал педагог?","Какие условия могли отличаться?"],
 ["Как ребёнок просил паузу или помощь?","Что помогло в каждой обстановке?","Какие интересы заметны и дома, и в группе?","Что стоит вместе уточнить у специалиста?"],
]
story=[]
for i,queries in enumerate(context_q):
    if i:newpage(story)
    intro(story,"Разные условия: дом и детский сад","Наблюдайте факты без оценивания характера ребёнка.")
    for q in queries:field(story,q,n=2)
build("contexts/sravnenie-nablyudenii-dom-sadik-ru.pdf","Сравнение наблюдений",story,2)

context_plan=[
 ["Что ребёнку нравится и что ему удаётся?","Какие трудности возникают в каждом месте?","Как ребёнок выражает предпочтения и отказ?","Какую общую небольшую цель выберем?"],
 ["Какие изменения среды можно попробовать?","Какую поддержку и коммуникацию согласуем?","Что поможет заметить комфорт и участие?","Кто и как кратко передаёт необходимые наблюдения?"],
]
story=[]
for i,queries in enumerate(context_plan):
    if i:newpage(story)
    intro(story,"Разговор семьи и педагога","Договаривайтесь о безопасности и доступном участии без обвинений.")
    for q in queries:field(story,q,n=2)
build("contexts/razgovor-semya-pedagog-plan-podderzhki-ru.pdf","Семейный и педагогический план",story,2)

# The observation diary originally uses hardcoded 7-9pt body. Rebuild using
# the same factual content and 11pt canonical reading scale.
story=[]
intro(story,"Дневник наблюдений за развитием","Организационный лист для семьи. Не диагностика, не шкала, не тест на аутизм.")
heading(story,"Как записывать наблюдения")
for line in [
"Выберите естественную ситуацию: игра, еда, прогулка, одевание, общение.",
"Опишите действие: что ребёнок сделал, сказал, показал или попросил.",
"Отметьте условия: шум, усталость, знакомая среда, помощь взрослого.",
"Запишите, что получилось и что стоит уточнить у специалиста.",
]:
    story.append(ptext(line))
heading(story,"Пример")
story.append(ptext("14 октября, обед: ребёнок подошёл к холодильнику, подвёл взрослого к воде и показал на стакан. Взрослый предложил воду, ребёнок кивнул."))
story.append(ptext("Не заставляйте ребёнка многократно демонстрировать навык ради записи. При потере ранее устойчивых навыков не откладывайте медицинское обращение."))
newpage(story)
intro(story,"Короткие записи реальных ситуаций","Заполните только полезные поля. Можно сделать одну запись.")
for number in range(1,3):
    heading(story,f"Наблюдение {number}")
    for q in ["Дата и ситуация","Что ребёнок сделал или сказал?","Что помогло или мешало?"]:
        field(story,q,n=1)
newpage(story)
intro(story,"Сильные стороны и вопросы","Отмечайте как трудности, так и удачные действия, интересы и предпочтения ребёнка.")
for q in ["Новые умения и интересы ребёнка","Что помогает ему участвовать?","Какие изменения или трудности повторяются?","Что хотелось бы обсудить со специалистом?"]:
    field(story,q,n=2)
build("autismhub-dnevnik-nablyudeniy-za-razvitiem-rebenka.pdf","Дневник наблюдений",story,3)

if len(OUTPUTS)!=15:
    raise RuntimeError(f"Expected to upgrade 15 PDFs; upgraded {len(OUTPUTS)}")
print(f"PDF_PRINT_QA_COMPLETE: {len(OUTPUTS)} PDFs, {sum(n for _,n in OUTPUTS)} A4 pages, canonical main text {SIZE}pt")
