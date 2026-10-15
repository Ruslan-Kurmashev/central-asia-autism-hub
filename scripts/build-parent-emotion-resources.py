#!/usr/bin/env python3
"""Build original AutismHub printable parent emotional-support resources.

Not a screening scale, crisis intervention protocol, diagnostic tool, or
substitute for medical assessment. No child data collected or transmitted.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/"public"/"downloads"/"emotions"
OUTPUT.mkdir(parents=True,exist_ok=True)
REG=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
BOLD=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not REG.is_file() or not BOLD.is_file():
    raise RuntimeError("Missing DejaVuSans Cyrillic fonts")
pdfmetrics.registerFont(TTFont("ParentEmotion",str(REG)))
pdfmetrics.registerFont(TTFont("ParentEmotionBold",str(BOLD)))

W,H=A4
L,R=41,W-41
INK=HexColor("#1E394F")
BLUE=HexColor("#245985")
LIGHT=HexColor("#EDF4F8")
MUTED=HexColor("#53697A")
BORDER=HexColor("#C7D7E4")
GOLD=HexColor("#AA7F4F")

def label(c,x,y,s,size=9,bold=False,color=INK):
    c.setFont("ParentEmotionBold" if bold else "ParentEmotion",size)
    c.setFillColor(color)
    c.drawString(x,y,s)

def write(c,x,y,s,width=495,size=8.4,leading=13,bold=False,color=INK):
    name="ParentEmotionBold" if bold else "ParentEmotion"
    for part in str(s).split("\n"):
        for line in simpleSplit(part,name,size,width) if part else [""]:
            label(c,x,y,line,size,bold,color)
            y-=leading
    return y

def top(c,title,page,total):
    c.setFillColor(BLUE)
    c.rect(0,H-15,W,15,fill=1,stroke=0)
    label(c,L,H-43,"AUTISMHUB / ПРАКТИЧЕСКИЕ МАТЕРИАЛЫ",8,True,BLUE)
    label(c,L,H-66,title,12,True,INK)
    c.setStrokeColor(BORDER)
    c.line(L,H-77,R,H-77)
    c.line(L,40,R,40)
    label(c,L,26,"Авторский образовательный материал  |  15.10.2026",7,color=MUTED)
    c.setFont("ParentEmotion",7)
    c.setFillColor(MUTED)
    c.drawRightString(R,26,f"{page}/{total}")

def band(c,y,t):
    c.setFillColor(LIGHT);c.roundRect(L,y-12,R-L,28,6,stroke=0,fill=1)
    label(c,L+12,y-3,t,9,True,BLUE)
    return y-36

CARDS=[
("Заканчиваем игру","Заранее покажите, что будет дальше. Предложите выбрать, какую игрушку поставить на полку первой.","Скоро ужин. Машинку можно оставить здесь.","Не забирайте предмет без предупреждения, если это не требуется для безопасности."),
("Слишком шумно в магазине","Отойдите от шума. Предложите выход или спокойное место. При привычке используйте средства защиты слуха.","Громко. Можем выйти.","Не заставляйте терпеть неприятный шум ради тренировки."),
("Не получается построить башню","Признайте огорчение, предложите помощь либо паузу и примите отказ.","Трудно. Хочешь помочь или сделать перерыв?","Не исправляйте постройку без согласия."),
("Нужно одеться","Оставьте одну короткую инструкцию. Позвольте выбрать безопасную удобную одежду.","Сначала носки или футболка?","Не принуждайте к неприятному прикосновению и ткани."),
("Сильная злость после отказа","Признайте эмоцию, сохраните важную границу и предложите безопасный вариант.","Ты злишься. Бить нельзя. Я рядом.","Не запрещайте само чувство и не унижайте ребёнка."),
("После сада нужна тишина","Не начинайте с множества вопросов. При необходимости предложите воду, еду, отдых и привычное занятие.","Можно отдохнуть. Я рядом.","Не требуйте немедленного общения."),
("Пришли гости","Предупредите, кто придёт. Оставьте выбор места и возможность не участвовать.","Придут гости. Можно побыть здесь или в другой комнате.","Не требуйте объятий, приветствий через дискомфорт."),
("Изменился маршрут","Коротко объясните изменение. По возможности покажите на картинке или карте, что будет после.","Сегодня другая дорога. Потом будем дома.","Не отрицайте переживание и не перегружайте объяснениями."),
("Не может сообщить проблему","Предложите доступный жест, картинку, AAC и проверку физического дискомфорта.","Больно? Тише? Пауза? Покажи, если можешь.","Не требуйте устного ответа любой ценой."),
("Нужно подождать","Сделайте ожидание предсказуемым, предложите любимую безопасную вещь или вариант занятия.","Пока ждём, можно книгу или игрушку.","Не обещайте точного срока без уверенности."),
("Не хочет прикосновений","Уважайте пространство. Предложите помощь без касания либо отойдите на удобное расстояние.","Не трогаю. Я здесь, если понадоблюсь.","Не навязывайте обнимание и удерживание."),
("Сложно перед сном","Уменьшите шум и свет, вернитесь к привычному порядку, проверьте голод, боль и другой дискомфорт.","Сейчас тихо. Потом книга, если хочешь.","Не добавляйте множество заданий или обязательных упражнений.")
]

def block(c,y,number,item):
    title,tryit,phrase,avoid=item
    height=300
    if y-height<42:raise ValueError("Card outside page")
    c.setStrokeColor(BORDER)
    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(L,y-height,R-L,height,8,stroke=1,fill=1)
    c.setFillColor(LIGHT);c.roundRect(L+1,y-42,R-L-2,41,7,stroke=0,fill=1)
    label(c,L+13,y-26,f"{number}. {title}",10.3,True,BLUE)
    pos=y-63
    for name,body in [("Что попробовать",tryit),("Можно сказать",phrase),("Не нужно",avoid)]:
        label(c,L+13,pos,name,8.6,True,BLUE if name!="Не нужно" else GOLD)
        pos-=18
        pos=write(c,L+13,pos,body,width=R-L-26,size=9.0,leading=15)
        pos-=17
    if pos<y-height+11:raise ValueError(f"Text overflow card {number} {pos=}")
    return y-height-16

def cards():
    out=OUTPUT/"12-situatsiy-emotsii-rebenka-ru.pdf"
    c=canvas.Canvas(str(out),pagesize=A4)
    c.setTitle("AutismHub - 12 ситуаций: эмоции и саморегуляция ребёнка")
    for page in range(6):
        top(c,"12 жизненных ситуаций и короткие фразы",page+1,6)
        y=H-96
        for j in range(2):
            i=page*2+j
            y=block(c,y,i+1,CARDS[i])
        c.showPage()
    c.save()
    return out,6

def rule(c,x,y,width):
    c.setStrokeColor(BORDER);c.line(x,y,x+width,y)

def field(c,y,name,n=2):
    label(c,L,y,name,9.0,True,BLUE)
    y-=22
    for _ in range(n):
        rule(c,L,y,R-L)
        y-=25
    return y-16

def templates():
    out=OUTPUT/"pamyatki-plan-i-dnevnik-emotsii-ru.pdf"
    c=canvas.Canvas(str(out),pagesize=A4)
    c.setTitle("AutismHub - Визуальные подсказки, семейный план, дневник")
    top(c,"Карточки сообщений и поддержки",1,3)
    write(c,L,H-106,"Показывайте карточки только если ребёнку понятны изображения. Любой жест, слово, взгляд на предмет или AAC тоже может быть сообщением. Не требуйте карточки перед помощью.",size=9.1,leading=15)
    messages=[
        ("ПАУЗА","Предложить безопасный перерыв","||"),
        ("ПОМОГИ","Ответить на просьбу о помощи","+"),
        ("ТИШЕ","По возможности уменьшить шум","~"),
        ("СТОП","Прекратить необязательное действие","X")
    ]
    for i,(word,explain,symbol) in enumerate(messages):
        col=i%2;row=i//2
        x=L+col*267;y=H-216-row*230
        c.setStrokeColor(BORDER);c.setFillColor(HexColor("#FFFFFF"))
        c.roundRect(x,y-200,247,200,12,stroke=1,fill=1)
        c.setFillColor(LIGHT);c.circle(x+124,y-78,44,stroke=0,fill=1)
        label(c,x+113,y-86,symbol,20,True,BLUE)
        label(c,x+24,y-140,word,13,True,BLUE)
        write(c,x+24,y-158,explain,width=205,size=8.5,leading=13)
    write(c,L,79,"Это пример визуальной поддержки, не единая система AAC и не средство диагностики.",size=8.2,leading=12,color=MUTED)
    c.showPage()

    top(c,"Наш семейный план поддержки",2,3)
    y=H-103
    y=write(c,L,y,"Заполняйте только полезные поля. При боли, новых симптомах или опасном поведении обратитесь к квалифицированному специалисту.",size=8.8,leading=15)-20
    y=band(c,y,"ДО: что обычно помогает уменьшить нагрузку?")
    y=field(c,y,"Например: отдых, предупреждение о переходах, доступный выбор.")
    y=band(c,y+9,"ВО ВРЕМЯ: как обеспечить безопасность и поддержку?")
    y=field(c,y,"Что уменьшить, какую помощь предложить, какое сообщение принять?")
    y=band(c,y+9,"ПОСЛЕ: что помогает восстановиться?")
    y=field(c,y,"Что предложить без давления и расспросов?")
    y=band(c,y+9,"ДОСТУПНОЕ ОБЩЕНИЕ")
    y=field(c,y,"Как ребёнок просит помощь, паузу, тишину и отказывается?",1)
    if y<56:raise ValueError(f"Plan page overflow: {y}")
    c.showPage()

    top(c,"Лист наблюдения и вопросы для консультации",3,3)
    y=H-102
    y=write(c,L,y,"Описывайте конкретные действия и условия без диагнозов, приписывания намерений и подсчёта баллов.",size=8.8,leading=15)-20
    for name in [
        "Дата и место. Что происходило ДО ситуации?",
        "Что ребёнок сделал или каким способом сообщил о потребности?",
        "Было ли что-то важное: боль, шум, голод, усталость, изменение плана?",
        "Что попробовали взрослые и что изменилось?",
        "Что ребёнок выбрал, что помогло и что не подошло?",
        "Что хочу обсудить со специалистом?"
    ]:
        y=field(c,y,name,2)
    if y<54:raise ValueError(f"Diary page overflow: {y}")
    c.showPage()
    c.save()
    return out,3

for path,count in [cards(),templates()]:
    if not path.is_file() or path.stat().st_size<15000:raise RuntimeError(f"Generated PDF missing/truncated: {path}")
    pdf=PdfReader(str(path))
    if len(pdf.pages)!=count:raise RuntimeError(f"Wrong PDF page count: {path}")
    if any(len(page.extract_text() or "")<100 for page in pdf.pages):raise RuntimeError(f"PDF has missing selectable text: {path}")
    print(f"Parent emotion PDF OK: {path.name}; pages={count}; bytes={path.stat().st_size}")
