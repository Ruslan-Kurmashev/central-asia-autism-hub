#!/usr/bin/env python3
"""Original unscored AutismHub bilingual family communication worksheets.

These are educational supports, not diagnostic tests, therapy protocols, or
validated Russian/Kazakh language assessment instruments. No user data is stored.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"downloads"/"bilingual"
OUT.mkdir(parents=True, exist_ok=True)
normal=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not normal.is_file() or not bold.is_file():
    raise RuntimeError("DejaVu Cyrillic fonts are required")
pdfmetrics.registerFont(TTFont("AutismHubLang",str(normal)))
pdfmetrics.registerFont(TTFont("AutismHubLangB",str(bold)))
W,H=A4;L,R=42,W-42
NAVY=HexColor("#24577E");INK=HexColor("#223A4F")
MUTED=HexColor("#576D7D");EDGE=HexColor("#BFCFDB");PALE=HexColor("#EDF4F8")

def t(c,x,y,value,size=8.7,b=False,col=INK):
    c.setFont("AutismHubLangB" if b else "AutismHubLang",size)
    c.setFillColor(col);c.drawString(x,y,str(value))

def para(c,x,y,s,width=495,size=8.4,leading=14,col=INK):
    for section in str(s).split("\n"):
        for line in simpleSplit(section,"AutismHubLang",size,width) if section else [""]:
            t(c,x,y,line,size,col=col);y-=leading
    return y

def page(c,title,index,total):
    c.setFillColor(NAVY);c.rect(0,H-16,W,16,fill=1,stroke=0)
    t(c,L,H-40,"AUTISMHUB / МАТЕРИАЛЫ ДЛЯ РОДИТЕЛЕЙ",8.3,True,NAVY)
    t(c,L,H-63,title,11,True)
    c.setStrokeColor(EDGE);c.line(L,H-75,R,H-75);c.line(L,37,R,37)
    t(c,L,25,"16.10.2026 / Без баллов, без диагностики и хранения персональных данных",7.2,col=MUTED)
    c.setFont("AutismHubLang",7.6);c.setFillColor(MUTED);c.drawRightString(R,25,f"{index}/{total}")

def box(c,y,title,body,h=99):
    c.setStrokeColor(EDGE);c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(L,y-h,R-L,h,8,fill=1,stroke=1)
    c.setFillColor(PALE);c.roundRect(L+1,y-37,R-L-2,36,7,fill=1,stroke=0)
    t(c,L+12,y-24,title,9.3,True,NAVY)
    b=para(c,L+12,y-52,body,width=R-L-26,size=8.65,leading=14)
    if b<y-h+7: raise ValueError(f"Card overflow: {title} at {b}")
    return y-h-13

def field(c,y,title,sub="",rows=2):
    t(c,L,y,title,8.8,True,NAVY);y-=19
    if sub: y=para(c,L+3,y,sub,width=R-L-6,size=8,leading=12,col=MUTED)-8
    for _ in range(rows):
        c.setStrokeColor(EDGE);c.line(L+3,y,R-3,y);y-=25
    return y-18

def finalize(c,p,n):
    c.save()
    if not p.is_file() or p.stat().st_size<12000:raise ValueError(f"Empty PDF {p.name}")
    pdf=PdfReader(str(p))
    if len(pdf.pages)!=n or any(len(pg.extract_text() or "")<150 for pg in pdf.pages):
        raise ValueError(f"PDF validation failure {p.name}")
    print(f"Bilingual family PDF OK: {p.name}; pages={n}; bytes={p.stat().st_size}")

p=OUT/"7-situatsii-dva-yazyka-v-seme-ru.pdf"
c=canvas.Canvas(str(p),pagesize=A4);c.setTitle("AutismHub - Семь ситуаций для общения на двух языках")
stories=[
("Завтрак / Таңғы ас","Русский: «Ты хочешь воду?» Казахский: «Су ішесің бе?» Покажите привычную чашку. Примите жест или ответ на любом языке."),
("Прогулка / Серуен","Русский: «Смотри, мяч!» Казахский: «Қара, доп!» Поддержите интерес ребёнка. Не требуйте повторить название."),
("Книга / Кітап","Русский: «Где кот?» Казахский: «Мысық қайда?» Можно назвать картинки на любом привычном языке и принять указание пальцем."),
("Помощь / Көмек","Русский: «Помочь?» Казахский: «Көмектесейін бе?» Ответом может быть жест, слово, AAC или действие."),
("Продолжить / Тағы","Русский: «Ещё?» Казахский: «Тағы ма?» Реагируйте на понятную просьбу и не удерживайте необходимые вещи ради слова."),
("Отказ / Жоқ","Русский: «Не хочешь? Хорошо». Казахский: «Қаламайсың ба? Жарайды». Примите отказ, если действие необязательно."),
("Семейная история / Отбасы","Расскажите короткую семейную историю на удобном языке, покажите фотографию. Ребёнок может слушать, комментировать или выбрать другую тему."),
]
page(c,"7 ситуаций для общения в двуязычной семье",1,2)
y=para(c,L,H-102,"Идеи для естественного общения, а не домашние задания на перевод. Взрослый говорит на языке, которым ему удобно пользоваться. Казахские фразы даны как примеры; используйте привычный семье вариант.",size=8.9,leading=15)-19
for title,body in stories[:4]:y=box(c,y,title,body,h=117)
if y<49:raise ValueError(f"Page 1 overflow {y}")
c.showPage()
page(c,"7 ситуаций: продолжение и памятка",2,2)
y=H-103
for title,body in stories[4:]:y=box(c,y,title,body,h=117)
y-=8
y=para(c,L,y,"Что полезно помнить",size=10,leading=16,col=NAVY)-4
for note in [
    "Принимайте жесты, картинки, AAC, слова и фразы, даже если ребёнок смешивает языки.",
    "Важнее живое понятное общение и связь с близкими, чем строгая схема «один взрослый - один язык».",
    "Если есть вопросы о развитии речи и понимания, обсудите все используемые языки и слух со специалистом.",
    "Если ребёнок потерял ранее устойчивые слова, жесты или другие навыки, обращайтесь за медицинской оценкой без длительного ожидания."
]:
    y=para(c,L+7,y,"• "+note,width=R-L-9,size=8.45,leading=14)-11
if y<42:raise ValueError(f"Page 2 overflow {y}")
c.showPage();finalize(c,p,2)

p=OUT/"karta-yazykov-i-nablyudenii-dlya-spetsialista-ru.pdf"
c=canvas.Canvas(str(p),pagesize=A4);c.setTitle("AutismHub - Языковая карта семьи и наблюдения к консультации")
page(c,"Языковая карта семьи",1,2)
y=H-105
y=para(c,L,y,"Этот лист нужен для подготовки разговора с логопедом или врачом. Не нужно заполнять полностью или проверять ребёнка вопросами. Навыки оценивают профессионально, на всех языках.",size=8.9,leading=15)-16
for title,hint,n in [
("Какие языки слышит и использует ребёнок?","Дома, в детском саду, с родственниками, на прогулке.",2),
("Кто использует каждый язык?","Например: мама - русский и казахский; бабушка - казахский; сад - русский.",2),
("В каких ситуациях ребёнок понимает сообщения?","Приведите примеры действий без подсказки; учитывайте контекст.",2),
("Как ребёнок передаёт просьбу, интерес или отказ?","Слова, жест, AAC, изображение; на каких языках и с кем?",2),
("Что родители считают сильной стороной общения?","Интересы, предпочтения, любимые темы, способ общения.",2),
]:
    y=field(c,y,title,hint,n)
if y<49:raise ValueError(f"Map page clipped {y}")
c.showPage()

page(c,"Наблюдения и вопросы к специалисту",2,2)
y=H-106
y=para(c,L,y,"Указывайте собственные примеры без подсчёта «слов по норме». Примеры языков ниже не являются тестовыми заданиями.",size=8.7,leading=14)-18
for title,hint,n in [
("Пример одного сообщения ребёнка","Дата, с кем, на каком языке, что ребёнок сделал или сказал.",2),
("Пример понимания на русском или другом языке","Какая была ситуация? Были ли жесты, предметы или контекстные подсказки?",2),
("Пример понимания на казахском или другом языке","Что именно наблюдали? Не сравнивайте со словами из теста.",2),
("Что изменилось или беспокоит семью?","Если был регресс речи или других навыков, обратитесь к врачу без длительного ожидания.",2),
("Вопросы врачу или логопеду","Как оцениваются все языки и слух? Возможен ли специалист или переводчик?",2),
]:y=field(c,y,title,hint,n)
if y<49:raise ValueError(f"Consultation page clipped {y}")
c.showPage();finalize(c,p,2)
