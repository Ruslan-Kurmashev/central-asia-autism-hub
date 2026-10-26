#!/usr/bin/env python3
"""Build printable unscored Russian motor-activity resources for parents.

Source-of-truth exercises: scripts/data/parent-motor-activity-pack-ru.json
All printables are generic; do not enter or publish identifiable child data.
"""
from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "scripts" / "data" / "parent-motor-activity-pack-ru.json"
OUT = ROOT / "public" / "downloads" / "motor"
OUT.mkdir(parents=True, exist_ok=True)
# Remove the retired cards PDF if it exists from an earlier local build.
(OUT / "8-kartochek-motorika-ru.pdf").unlink(missing_ok=True)

NORMAL = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not NORMAL.is_file() or not BOLD.is_file():
    raise RuntimeError("DejaVuSans required for readable Cyrillic PDF; do not silently substitute")
pdfmetrics.registerFont(TTFont("AHMotor", str(NORMAL)))
pdfmetrics.registerFont(TTFont("AHMotorBold", str(BOLD)))
DATA = json.loads(SOURCE.read_text(encoding="utf-8"))

W,H=A4
LEFT,RIGHT=39,W-39
INK=HexColor("#19354F")
BLUE=HexColor("#245985")
GRAY=HexColor("#53697A")
PALE=HexColor("#EDF4F8")
EDGE=HexColor("#C8D9E4")
DARK=HexColor("#173F65")
ORANGE=HexColor("#966632")

def text(c,x,y,s,size=9,bold=False,color=INK):
    c.setFillColor(color)
    c.setFont("AHMotorBold" if bold else "AHMotor",size)
    c.drawString(x,y,s)

def lines(c,x,y,s,width=494,size=8.5,leading=13,color=INK,bold=False):
    font="AHMotorBold" if bold else "AHMotor"
    for part in str(s).split("\n"):
        wrapped=simpleSplit(part,font,size,width) if part else [""]
        for item in wrapped:
            text(c,x,y,item,size,bold,color)
            y-=leading
    return y

def header(c,label,part,page,total):
    c.setFillColor(DARK)
    c.rect(0,H-14,W,14,stroke=0,fill=1)
    text(c,LEFT,H-39,"AUTISMHUB  /  ПРАКТИЧЕСКИЕ МАТЕРИАЛЫ",8.5,True,BLUE)
    text(c,LEFT,H-57,label,10.6,True,INK)
    c.setStrokeColor(EDGE)
    c.line(LEFT,H-66,RIGHT,H-66)
    c.line(LEFT,35,RIGHT,35)
    text(c,LEFT,23,"Авторский учебный шаблон  ·  15.10.2026  ·  Не диагностический тест",7.1,color=GRAY)
    c.setFillColor(GRAY);c.setFont("AHMotor",7.6);c.drawRightString(RIGHT,23,f"{part}  ·  {page}/{total}")

def activity(c,entry,top,height=319,large=False):
    bottom=top-height
    c.setFillColor(colors.white);c.setStrokeColor(EDGE);c.setLineWidth(0.85)
    c.roundRect(LEFT,bottom,RIGHT-LEFT,height,9,stroke=1,fill=1)
    c.setFillColor(PALE)
    c.roundRect(LEFT+1,top-42,RIGHT-LEFT-2,41,8,stroke=0,fill=1)
    size_title=10.2 if not large else 11.1
    text(c,LEFT+13,top-26,f"{entry['id']}. {entry['title']}",size_title,True,BLUE)
    y=top-57
    labels=[
      ("Понадобится",entry["materials"]),
      ("Как делать",entry["steps"]),
      ("Как упростить",entry["easier"]),
      ("Если захочется усложнить",entry["harder"]),
      ("Безопасность",entry["safety"])
    ]
    for label,body in labels:
        text(c,LEFT+14,y,label,8.25,True,ORANGE if label=="Безопасность" else BLUE)
        y-=15
        y=lines(c,LEFT+14,y,body,width=RIGHT-LEFT-29,size=8.05 if not large else 8.65,leading=12.2 if not large else 13.4)
        y-=10 if not large else 12
    if y<bottom+9:
        raise RuntimeError(f"Card overflow: {entry['id']} bottom={bottom:.1f}, y={y:.1f}")

def book(filename,label,entries,category):
    path=OUT/filename
    c=canvas.Canvas(str(path),pagesize=A4,pageCompression=1)
    c.setTitle(f"AutismHub - {label}")
    total=(len(entries)+1)//2
    for page in range(total):
        header(c,label,category,page+1,total)
        for pos,entry in enumerate(entries[page*2:page*2+2]):
            activity(c,entry,H-87-pos*349,height=332)
        c.showPage()
    c.save()
    return path,total

gross,p_g=book("10-igr-krupnaya-motorika-ru.pdf","10 игр для крупной моторики",DATA["gross"],"Крупная моторика")
fine,p_f=book("15-zadanii-melkaya-motorika-ru.pdf","15 заданий для мелкой моторики",DATA["fine"],"Мелкая моторика")

schedule=OUT/"nedelnyi-plan-i-dnevnik-motoriki-ru.pdf"
c=canvas.Canvas(str(schedule),pagesize=A4,pageCompression=1)
c.setTitle("AutismHub - Недельный план и дневник движений")
header(c,"Недельный план без обязательных норм","План",1,2)
y=H-103
y=lines(c,LEFT,y,"Отмечайте только подходящие ребёнку занятия. План - пример идей, а не назначение выполнять каждый день.",width=RIGHT-LEFT,size=9.2,leading=15)
y-=11
proposals=[
  ("Понедельник","Катим мяч / мнём бумагу"),
  ("Вторник","Маршрут между отметками / наклейки"),
  ("Среда","Танец или движение сидя / безопасные крышки"),
  ("Четверг","Дорожка по линии / лепка"),
  ("Пятница","Большие ворота для мяча / листаем книгу"),
  ("Суббота","Переносим мягкие игрушки / липучки"),
  ("Воскресенье","Любимая игра ребёнка / отдых по выбору")
]
for day,idea in proposals:
    h=80
    c.setStrokeColor(EDGE);c.setFillColor(PALE)
    c.roundRect(LEFT,y-h,RIGHT-LEFT,h,6,stroke=1,fill=0)
    text(c,LEFT+10,y-17,day,9.3,True,BLUE)
    lines(c,LEFT+131,y-17,idea,width=RIGHT-LEFT-155,size=8.6,leading=13)
    text(c,LEFT+10,y-42,"Наш вариант / что понравилось:",8.1,color=GRAY)
    c.setStrokeColor(EDGE);c.line(LEFT+10,y-65,RIGHT-10,y-65)
    y-=h+7
if y<60:raise RuntimeError("Weekly plan clipped")
c.showPage()

header(c,"Наблюдения и вопросы для консультации","Дневник",2,2)
y=H-100
y=lines(c,LEFT,y,"Используйте этот лист, чтобы заметить комфорт ребёнка, интересы и способы участия. Не ставьте баллы и не проверяйте навыки через принуждение.",width=RIGHT-LEFT,size=9.0,leading=15)
y-=17
fields=[
  ("Какое занятие выбрал ребёнок?",""),("Что ребёнок делал самостоятельно?",""),
  ("Что помогало или делало занятие удобнее?",""),("Что ребёнок не захотел делать или что мешало?",""),
  ("Как ребёнок попросил помощь, паузу или завершение?",""),("Какие вопросы хочу обсудить со специалистом?","")
]
for label,_ in fields:
    text(c,LEFT,y,label,9,True,BLUE)
    y-=20
    for _ in range(2):
        c.setStrokeColor(EDGE);c.line(LEFT,y-5,RIGHT,y-5);y-=23
    y-=18
if y<73:raise RuntimeError("Observation form clipped")
y=lines(c,LEFT,78,"При боли, новой асимметрии движений, значимых падениях или утрате устойчивых навыков обратитесь к врачу. Не откладывайте обращение ради заполнения дневника.",width=RIGHT-LEFT,size=8.0,leading=12.3,color=GRAY)
c.showPage()
c.save()

# Validate exact page counts and text layer. pypdf is already installed in the Pages workflow.
from pypdf import PdfReader
expected={gross:p_g,fine:p_f,schedule:2}
for path,pages in expected.items():
    if not path.is_file() or path.stat().st_size<12000:
        raise RuntimeError(f"Missing/truncated PDF: {path}")
    doc=PdfReader(str(path))
    if len(doc.pages)!=pages:
        raise RuntimeError(f"Wrong page count {path.name}: {len(doc.pages)} instead of {pages}")
    if not all(len(p.extract_text() or "")>100 for p in doc.pages):
        raise RuntimeError(f"PDF lacks selectable text: {path}")
    print(f"Motor resource OK: {path.name}, {pages} pages, {path.stat().st_size} bytes")
