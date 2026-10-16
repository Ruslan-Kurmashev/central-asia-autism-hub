#!/usr/bin/env python3
"""Original AutismHub printable family-educator worksheets for context differences.

Educational observation forms, not diagnostic instruments or behaviour protocols.
Blank PDF is generated statically; no personal information is transmitted.
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
OUT=ROOT/"public"/"downloads"/"contexts"
OUT.mkdir(parents=True,exist_ok=True)
regular=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold=Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not regular.is_file() or not bold.is_file():raise RuntimeError("DejaVuSans Cyrillic font not found")
pdfmetrics.registerFont(TTFont("CTX",str(regular)))
pdfmetrics.registerFont(TTFont("CTXBold",str(bold)))
W,H=A4;L,R=41,W-41
INK=HexColor("#213B51");BLUE=HexColor("#245A83");MUTED=HexColor("#5A6B79")
PALE=HexColor("#EEF5F9");EDGE=HexColor("#C3D8E5")

def txt(c,x,y,s,size=8.6,bold=False,col=INK):
    c.setFont("CTXBold" if bold else "CTX",size);c.setFillColor(col);c.drawString(x,y,s)

def wrap(c,x,y,s,width=480,size=8.25,leading=13,col=INK):
    for part in str(s).split("\n"):
        for line in simpleSplit(part,"CTX",size,width) if part else [""]:
            txt(c,x,y,line,size,col=col);y-=leading
    return y

def heading(c,topic,n,total,subtitle):
    c.setFillColor(BLUE);c.rect(0,H-15,W,15,fill=1,stroke=0)
    txt(c,L,H-40,"AUTISMHUB  /  СЕМЬЯ И ПЕДАГОГИ",8.6,True,BLUE)
    txt(c,L,H-62,topic,11.2,True)
    c.setStrokeColor(EDGE);c.line(L,H-74,R,H-74)
    yy=wrap(c,L,H-94,subtitle,size=8.55,leading=13.4)
    c.line(L,40,R,40)
    txt(c,L,26,"Материал для наблюдений, без баллов и диагнозов  ·  16.10.2026",7.1,col=MUTED)
    c.setFont("CTX",7.5);c.setFillColor(MUTED);c.drawRightString(R,26,f"{n}/{total}")
    return yy-12

def field(c,y,label,helper="",count=2):
    c.setFillColor(PALE);c.roundRect(L,y-18,R-L,27,5,fill=1,stroke=0)
    txt(c,L+10,y-9,label,8.65,True,BLUE)
    y-=37
    if helper:y=wrap(c,L+8,y,helper,width=R-L-16,size=7.8,leading=12,col=MUTED)-8
    for _ in range(count):
        c.setStrokeColor(EDGE);c.line(L+8,y,R-8,y);y-=25
    return y-16

def make_observation():
    path=OUT/"sravnenie-nablyudenii-dom-sadik-ru.pdf"
    c=canvas.Canvas(str(path),pagesize=A4)
    c.setTitle("AutismHub - Сравнение наблюдений дома и в детском саду")
    y=heading(c,"Два места - разные условия",1,2,
        "Не нужно делать из ребёнка объект постоянной проверки. Запишите одну конкретную ситуацию без интерпретаций и обвинений.")
    y=field(c,y,"Какую ситуацию рассматриваем?",
        "Например: сборы утром, время после садика, групповой обед, шумная прогулка.")
    y=field(c,y,"Что увидели дома?",
        "Дата, действие ребёнка, обстановка, кто был рядом, что помогло.")
    y=field(c,y,"Что заметили в садике / школе?",
        "Отдельные факты от педагога. Если данных нет, оставьте пустым.")
    y=field(c,y,"Какие условия отличаются?",
        "Шум, число людей, язык, скорость переходов, знакомство с взрослым, помощь.")
    y=field(c,y,"Какие сильные стороны и интересы заметны в обоих местах?",
        "Что ребёнок любит, выбирает, сам инициирует, как сообщает просьбы.",1)
    if y<55:raise ValueError(f"Observation page 1 overflow {y}")
    c.showPage()
    y=heading(c,"Уточняем, что помогает ребёнку",2,2,
        "Этот лист помогает задать вопросы, не поставить диагноз. Обсуждайте изменения с учётом мнения ребёнка и согласия семьи.")
    y=field(c,y,"Какие сигналы ребёнка могли быть незаметны?",
        "Например: тихий отказ, движение к выходу, просьба о помощи, напряжение без плача.")
    y=field(c,y,"Что уже помогало?",
        "Пауза, тихое место, предупреждение, доступный взрослый, знакомые предметы.")
    y=field(c,y,"Как ребёнок показывает отказ, усталость или просьбу о перерыве?",
        "Слово, жест, картинка, AAC, движение, другое индивидуальное сообщение.")
    y=field(c,y,"Что хотим уточнить вместе с педагогом?",
        "Один конкретный вопрос по условиям, а не по «правильности поведения».")
    y=field(c,y,"Если нужна профессиональная помощь, о чём спросим специалиста?",
        "При боли, потере навыков, травмах, частом дистрессе обратитесь за оценкой без задержки.",1)
    if y<55:raise ValueError(f"Observation page 2 overflow {y}")
    c.showPage();c.save()
    return path,2

def make_meeting():
    path=OUT/"razgovor-semya-pedagog-plan-podderzhki-ru.pdf"
    c=canvas.Canvas(str(path),pagesize=A4)
    c.setTitle("AutismHub - Разговор семьи и педагога: совместный план")
    y=heading(c,"Встреча семьи и педагога",1,2,
        "Обсуждаем не «кто прав», а какие условия облегчают ребёнку участие. Обменивайтесь только необходимой информацией с согласия семьи.")
    y=field(c,y,"Что ребёнку нравится и что у него получается?",
        "Интересы, любимые занятия, сильные стороны, способы выразить выбор.")
    y=field(c,y,"Что дома и в группе происходит по-разному?",
        "Два конкретных примера. Не оценивайте характер и мотивы.")
    y=field(c,y,"Какие ситуации требуют поддержки?",
        "Переходы, шум, туалет, обед, свободная игра, ожидание, общение.")
    y=field(c,y,"Что говорят сам ребёнок и взрослые?",
        "Слова, жесты, AAC, предпочтения ребёнка; мнения участников могут отличаться.")
    y=field(c,y,"Одна общая цель для удобства и безопасности",
        "Например: ребёнок может попросить перерыв доступным способом.",1)
    if y<54:raise ValueError(f"Meeting page 1 overflow {y}")
    c.showPage()
    y=heading(c,"Короткий план поддержки",2,2,
        "Пример организационного документа, не индивидуальный клинический план и не кризисная инструкция. Ребёнок не обязан скрывать особенности, чтобы считаться успешным.")
    y=field(c,y,"Что меняем в условиях?",
        "Например: заранее показываем переход, уменьшаем шум, обеспечиваем тихое место.")
    y=field(c,y,"Какую поддержку предлагаем?",
        "Короткие инструкции, выбор, визуальная подсказка, AAC или знакомый взрослый.")
    y=field(c,y,"Как узнаем, что ребёнку стало удобнее?",
        "Качество участия, добровольное общение, спокойное восстановление, меньше боли или дистресса - без числовой шкалы.")
    y=field(c,y,"Кто и как передаёт короткие наблюдения?",
        "Только согласованный минимум, без личных данных в общедоступных чатах.")
    y=field(c,y,"Когда снова поговорим и что можно изменить?",
        "Назначьте дату обсуждения при необходимости; не считайте план доказательством эффективности.",1)
    if y<54:raise ValueError(f"Meeting page 2 overflow {y}")
    c.showPage();c.save()
    return path,2

for path,n in (make_observation(),make_meeting()):
    if not path.is_file() or path.stat().st_size<13000:raise ValueError(f"Empty PDF: {path}")
    pdf=PdfReader(str(path))
    if len(pdf.pages)!=n or any(len(p.extract_text() or "")<180 for p in pdf.pages):
        raise ValueError(f"PDF validation failed: {path.name}")
    print(f"Contexts PDF OK: {path.name}; pages={n}; bytes={path.stat().st_size}")
