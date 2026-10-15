#!/usr/bin/env python3
"""Generate AutismHub three-page unscored child development observation diary."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "autismhub-dnevnik-nablyudeniy-za-razvitiem-rebenka.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)
for normal, bold in [
    ("/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf", "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"),
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf", "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"),
]:
    if Path(normal).is_file() and Path(bold).is_file():
        break
else:
    raise RuntimeError("No usable Cyrillic font available")
pdfmetrics.registerFont(TTFont("AH", normal))
pdfmetrics.registerFont(TTFont("AHB", bold))
C = canvas.Canvas(str(OUT), pagesize=A4)
C.setTitle("AutismHub - Дневник наблюдений за развитием ребёнка")
W, H = A4
L, R = 42, W-42
NAVY=HexColor("#123D62")
TEXT=HexColor("#182D3E")
MUTED=HexColor("#526574")
PALE=HexColor("#E8F1F6")
LINE=HexColor("#C3D1DC")

def txt(x,y,s,size=9,bold=False,color=TEXT):
    C.setFont("AHB" if bold else "AH",size)
    C.setFillColor(color)
    C.drawString(x,y,s)

def para(x,y,s,size=9.4,leading=16,width=500,bold=False,color=TEXT):
    face="AHB" if bold else "AH"
    for part in s.split("\n"):
        lines=simpleSplit(part,face,size,width) if part else [""]
        for line in lines:
            txt(x,y,line,size,bold,color)
            y-=leading
    return y

def stroke(x1,y1,x2,y2):
    C.setStrokeColor(LINE)
    C.setLineWidth(.7)
    C.line(x1,y1,x2,y2)

def header(page,label):
    C.setFillColor(NAVY)
    C.rect(0,H-16,W,16,stroke=0,fill=1)
    txt(L,H-42,"AutismHub",12,True,NAVY)
    txt(L+110,H-42,label,9,color=MUTED)
    stroke(L,H-52,R,H-52)
    txt(L,27,"Дневник наблюдений / материал для семьи / 15.10.2026",7.6,color=MUTED)
    C.setFont("AH",8)
    C.setFillColor(MUTED)
    C.drawRightString(R,27,f"{page} / 3")

def section(y,label):
    C.setFillColor(PALE)
    C.roundRect(L,y-21,R-L,29,7,stroke=0,fill=1)
    txt(L+11,y-13,label,10,True,NAVY)
    return y-44

def record_box(y,index):
    boxh=184
    C.setStrokeColor(LINE)
    C.roundRect(L,y-boxh,R-L,boxh,7,stroke=1,fill=0)
    txt(L+12,y-22,f"НАБЛЮДЕНИЕ {index}",9.4,True,NAVY)
    txt(L+180,y-22,"Дата: __________  Возраст: __________",8.4,color=MUTED)
    yy=y-45
    for label in [
        "Где и в какой ситуации это произошло?",
        "Что конкретно сделал / сказал / показал ребёнок?",
        "Какие условия, помощь или реакции окружающих были важны?",
        "Что получилось / что осталось непонятным?",
    ]:
        txt(L+12,yy,label,8.3,color=MUTED)
        stroke(L+12,yy-15,R-12,yy-15)
        yy-=31
    return y-boxh-16

header(1,"Как пользоваться дневником")
txt(L,H-92,"Дневник наблюдений",18.7,True,NAVY)
txt(L,H-121,"за развитием ребёнка",18.7,True,NAVY)
y=para(L,H-149,"Этот лист помогает запомнить реальные примеры из повседневной жизни и обсудить их при необходимости. Это не диагностический тест и не шкала развития.",9.8,17,R-L)-10
y=section(y,"Как записывать наблюдения")
y=para(L,y,"1. Выберите обычную ситуацию: игру, еду, прогулку, одевание, общение.\n2. Опишите действие: что ребёнок сделал, сказал, показал или попросил.\n3. Отметьте условия: шум, усталость, знакомое место, помощь взрослого.\n4. Запишите, что получилось и что хотелось бы уточнить.",9.6,20,R-L)-11
y=section(y,"Пример записи: описываем факты, а не ставим оценки")
y=para(L,y,"«14 октября, обед. Ребёнок подошёл к холодильнику, взял меня за руку и подвёл к воде. Я предложила стакан, он кивнул и взял его».",9.6,17,R-L)-12
C.setFillColor(PALE)
C.roundRect(L,y-64,R-L,71,6,stroke=0,fill=1)
y=para(L+12,y-11,"Важно: записывайте не только трудности, но и интересы, сильные стороны и удобные способы общения. Жесты, картинки и AAC тоже являются способами коммуникации.",9,15,R-L-24)-30
y=para(L,y,"Не нужно многократно проверять навык или заставлять ребёнка повторять действие ради записи. Не существует обязательного числа наблюдений в день.",9.2,16,R-L)-21
y=section(y,"Что делать с записями")
y=para(L,y,"На странице 2 запишите несколько отдельных ситуаций. На странице 3 отметьте, что изменилось, и подготовьте конкретные вопросы для специалиста. Можно заполнять только те поля, которые вам полезны.",9.3,17,R-L)-17
para(L,y,"Если ребёнок потерял ранее устойчивые речевые, социальные или двигательные навыки, не откладывайте обращение за медицинской консультацией ради заполнения дневника.",9,15.5,R-L,color=NAVY)
C.showPage()

header(2,"Листы наблюдений")
txt(L,H-92,"Короткие записи реальных ситуаций",15.5,True,NAVY)
para(L,H-112,"Не требуется заполнять все строки. Наблюдайте в обычной жизни без специальных проверок.",9,15,R-L,color=MUTED)
y=H-143
for idx in range(1,4):
    y=record_box(y,idx)
C.showPage()

header(3,"Итоги и вопросы специалисту")
txt(L,H-92,"Что я заметил(а) за это время",15.5,True,NAVY)
txt(L,H-117,"Период наблюдения: с ________________ по ________________",9.1,color=MUTED)
y=H-154
for label in [
    "Новые умения, интересы и сильные стороны ребёнка",
    "В каких ситуациях ему легче общаться, играть и участвовать?",
    "Какие трудности или изменения повторялись?",
    "Что помогало ребёнку? Какая помощь требовалась?",
]:
    txt(L,y,label,8.6,True,NAVY)
    stroke(L,y-15,R,y-15)
    y-=39
    stroke(L,y+11,R,y+11)
    y-=19
y=section(y,"Вопросы к специалисту")
for i in range(1,4):
    txt(L,y,f"{i}.",9.3,True,NAVY)
    stroke(L+21,y-2,R,y-2)
    y-=42
y=section(y,"Перед консультацией")
y=para(L,y,"Возьмите 2-3 конкретных примера и расскажите, что ребёнок уже умеет, что вас беспокоит, когда это началось и как часто повторяется. Спросите, нужна ли дополнительная оценка развития, слуха или другая консультация.",9.2,16,R-L)-14
para(L,y,"Этот дневник - организационный шаблон AutismHub, не валидированный скрининговый инструмент. По этим записям нельзя подтвердить или исключить аутизм и другие состояния.",8.9,15,R-L,color=MUTED)
C.save()
assert OUT.is_file() and OUT.stat().st_size > 10000
print("Generated",OUT,OUT.stat().st_size,"bytes")
