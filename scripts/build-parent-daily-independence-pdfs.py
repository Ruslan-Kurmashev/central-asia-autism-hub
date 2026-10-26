#!/usr/bin/env python3
"""Generate AutismHub parent daily-living PDF aids for static Pages builds.

Educational unscored printables; no child information is read or uploaded.
"""
from pathlib import Path
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"downloads"/"selfcare"
OUT.mkdir(parents=True,exist_ok=True)
src=ROOT/"scripts"/"data"/"parent-daily-independence-tasks-ru.json"
TASKS=json.loads(src.read_text(encoding="utf-8"))["tasks"]
NORMAL="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
if not Path(NORMAL).is_file() or not Path(BOLD).is_file():
    raise RuntimeError("DejaVuSans Cyrillic font missing")
pdfmetrics.registerFont(TTFont("SelfCare",NORMAL))
pdfmetrics.registerFont(TTFont("SelfCareBold",BOLD))
W,H=A4;L,R=40,W-40
INK=HexColor("#213A50");NAVY=HexColor("#285B86");PALE=HexColor("#EDF4F8")
LINE=HexColor("#C6D8E4");MUTED=HexColor("#5D6F7D")
GOLD=HexColor("#9B7044")

def txt(c,x,y,s,size=8.7,b=False,col=INK):
    c.setFont("SelfCareBold" if b else "SelfCare",size)
    c.setFillColor(col)
    c.drawString(x,y,str(s))

def para(c,x,y,t,width=493,size=8.2,leading=13,b=False,col=INK):
    f="SelfCareBold" if b else "SelfCare"
    for part in str(t).split("\n"):
        lines=simpleSplit(part,f,size,width) if part else [""]
        for s in lines:
            txt(c,x,y,s,size,b,col)
            y-=leading
    return y

def head(c,title,n,total,desc=""):
    c.setFillColor(NAVY);c.rect(0,H-15,W,15,stroke=0,fill=1)
    txt(c,L,H-41,"AUTISMHUB  /  ПРАКТИКА ДЛЯ РОДИТЕЛЕЙ",8.5,True,NAVY)
    txt(c,L,H-62,title,11,True)
    c.setStrokeColor(LINE);c.line(L,H-73,R,H-73);c.line(L,37,R,37)
    if desc:para(c,L,H-88,desc,size=8.5,leading=13)
    txt(c,L,24,"Авторский шаблон  ·  15.10.2026  ·  Не шкала и не терапевтический протокол",7,col=MUTED)
    c.setFont("SelfCare",7.5);c.setFillColor(MUTED);c.drawRightString(R,24,f"{n}/{total}")

def activity(c,top,a):
    h=312;y=top
    c.setStrokeColor(LINE);c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(L,y-h,R-L,h,9,stroke=1,fill=1)
    c.setFillColor(PALE);c.roundRect(L+1,y-39,R-L-2,38,7,stroke=0,fill=1)
    txt(c,L+12,y-25,f"{a['id']}  {a['title']}  /  {a['group']}",9.5,True,NAVY)
    y-=55
    for name,k in [
        ("Что понадобится","materials"),
        ("Как участвовать","steps"),
        ("Проще","easier"),
        ("Если захочется усложнить","harder"),
        ("Важно для безопасности","safety"),
    ]:
        txt(c,L+12,y,name,8.15,True,GOLD if k=="safety" else NAVY)
        y-=15
        y=para(c,L+12,y,a[k],width=R-L-25,size=8.15,leading=12.1)
        y-=8
    if y<top-h+10:raise RuntimeError(f"Card overflows: {a['id']} -> {y}")
    return top-h-14

def make_cards():
    path=OUT/"12-zadanii-samostoyatelnost-ru.pdf"
    c=canvas.Canvas(str(path),pagesize=A4)
    c.setTitle("AutismHub - 12 навыков самостоятельности для семьи")
    for i in range(6):
        head(c,"12 домашних заданий для самостоятельности",i+1,6)
        y=H-90
        for a in TASKS[2*i:2*i+2]:y=activity(c,y,a)
        c.showPage()
    c.save()
    return path,6

def form_field(c,y,label,n=2):
    txt(c,L,y,label,8.6,True,NAVY);y-=20
    for _ in range(n):
        c.setStrokeColor(LINE);c.line(L,y,R,y);y-=24
    return y-13

def make_plan():
    path=OUT/"semeynyi-plan-i-dnevnik-navykov-ru.pdf"
    c=canvas.Canvas(str(path),pagesize=A4)
    c.setTitle("AutismHub - Семейный план самостоятельности и наблюдения")
    head(c,"Недельный план: один удобный шаг",1,2,"Это идеи, а не график обязательных занятий. В любой день можно оставить только отдых или привычную помощь.")
    suggestions=[
      ("Пн","Поправить край футболки"),("Вт","Положить ложку на стол"),
      ("Ср","Намочить руки или взять полотенце"),("Чт","Открыть липучку"),
      ("Пт","Поместить игрушку в коробку"),("Сб","Подтянуть носок"),
      ("Вс","Свободный выбор семьи или отдых"),
    ]
    y=H-135
    for day,tip in suggestions:
        ht=76
        c.setStrokeColor(LINE);c.roundRect(L,y-ht,R-L,ht,7,stroke=1,fill=0)
        txt(c,L+11,y-22,day,9.7,True,NAVY)
        txt(c,L+64,y-22,tip,8.6)
        txt(c,L+11,y-45,"Наш вариант / что помогло:",8.2,col=MUTED)
        c.line(L+11,y-63,R-12,y-63)
        y-=ht+8
    if y<48:raise RuntimeError("Weekly plan clipped")
    c.showPage()
    head(c,"Дневник наблюдения и вопросов",2,2,"Не ставьте баллов и не сравнивайте с другими детьми. Не публикуйте личные данные ребёнка.")
    y=H-129
    for q in [
      "Какой бытовой шаг ребёнок выбрал сам?",
      "Что он смог сделать с комфортной поддержкой?",
      "Что мешало: обстановка, одежда, поза, боль, усталость?",
      "Как ребёнок просил помощь или сообщал об отказе?",
      "Какие условия или адаптации сделали шаг удобнее?",
      "Какие вопросы стоит обсудить со специалистом?",
    ]:y=form_field(c,y,q)
    if y<45:raise RuntimeError(f"Observation form clipped {y}")
    c.showPage();c.save()
    return path,2

for path,n in [make_cards(),make_plan()]:
    pdf=PdfReader(str(path))
    if not path.is_file() or path.stat().st_size<13000:raise RuntimeError(f"PDF missing: {path}")
    if len(pdf.pages)!=n:raise RuntimeError(f"Page count wrong: {path}")
    if any(len(page.extract_text() or "")<100 for page in pdf.pages):raise RuntimeError(f"Missing selectable text: {path}")
    print(f"Self-care PDF OK: {path.name}; pages={n}; bytes={path.stat().st_size}")
