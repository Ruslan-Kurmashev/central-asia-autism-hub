"""Original AutismHub family checklist, four A4 pages. No scoring or data collection."""
from pathlib import Path
import argparse, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from xml.sax.saxutils import escape
ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--preview',action='store_true');ap.add_argument('--output-dir',type=Path,default=ROOT/'public/downloads/selfcare');args=ap.parse_args()
CSS='--type-print-body: 11pt; --type-print-h1: 20pt; --type-print-h2: 15pt;' if args.preview else (ROOT/'src/styles/typography.css').read_text(encoding='utf-8')
def pt(k):return float(re.search(r'--type-print-'+k+r':\s*([\d.]+)pt',CSS).group(1))
S,H1,H2=pt('body'),pt('h1'),pt('h2')
for f,n in [('SP','DejaVuSans.ttf'),('SPB','DejaVuSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(f,'/usr/share/fonts/truetype/dejavu/'+n))
INK,NAVY,LINE,PALE=map(HexColor,['#182D3E','#245A82','#AABDCB','#EDF4F8'])
W,H=A4; L=42; R=W-42; WIDTH=R-L
args.output_dir.mkdir(parents=True,exist_ok=True);out=args.output_dir/'special-pedagog-choice-ru.pdf'
c=canvas.Canvas(str(out),pagesize=A4,invariant=1);c.setTitle('Как выбрать специального педагога и оценить помощь');c.setAuthor('Autism Hub Kazakhstan')
def p(t,b=False,size=S,color=INK):return Paragraph(escape(t),ParagraphStyle('SP',fontName='SPB' if b else 'SP',fontSize=size,leading=size*1.42,textColor=color))
def draw(t,y,b=False,size=S,color=INK,x=L):
    q=p(t,b,size,color);_,h=q.wrap(R-x,H);q.drawOn(c,x,y-h);return y-h-9
def header(n,sub):
    c.setFillColor(NAVY);c.rect(0,H-12,W,12,fill=1,stroke=0)
    y=draw('Autism Hub Kazakhstan / Материалы для родителей',H-34,True,S,NAVY)
    y=draw('Как выбрать специального педагога',y-4,True,H1,NAVY)
    y=draw(sub,y-2,True,H2)
    c.setStrokeColor(LINE);c.line(L,44,R,44);c.setFont('SP',S);c.setFillColor(INK);c.drawString(L,26,'AutismHub | Материал для семьи, не официальный бланк');c.drawRightString(R,26,f'{n} / 4')
    return y-3
def check(t,y):
    c.setStrokeColor(NAVY);c.rect(L,y-13,11,11,fill=0,stroke=1);return draw(t,y,x=L+24)-1
def field(t,y,n=1):
    y=draw(t,y,True);c.setStrokeColor(LINE)
    for _ in range(n):c.line(L,y-10,R,y-10);y-=26
    return y-6
def end(y):
    assert y>58,('page overflow',y);c.showPage()
y=header(1,'Чек-лист перед началом занятий')
y=draw('Отметьте то, что удалось выяснить. Пустая отметка означает, что вопрос пока открыт, а не что специалист некомпетентен.',y)
for t in ['Уточнены профильное образование и квалификация.','Понятны должность, роль и границы компетенции.','Есть опыт работы с выбранной образовательной задачей.','Проведена исходная педагогическая оценка.','Цели согласованы с семьёй и ребёнком в доступной форме.','Объяснены методы и необходимые адаптации.','Доступны AAC, запрос помощи, перерыва и отказ.','Учитываются комфорт, согласие и безопасность.','Есть способ оценки прогресса и переноса навыка.','Согласованы условия и дата пересмотра программы.']:
    y=check(t,y)
y=draw('Когда стоит отказаться от услуги',y-5,True,H2,NAVY)
y=draw('Обещания вылечить аутизм, принуждение, удерживание ради ответа, ограничение коммуникации или базовых потребностей требуют особой осторожности. Одного серьёзного нарушения безопасности может быть достаточно для прекращения занятий.',y)
y=draw('Число отметок не является оценкой квалификации или качества помощи.',y)
end(y)
y=header(2,'Вопросы для первой консультации')
for t in ['Что ребёнок уже умеет? Что мешает участию?','Какая цель важна ребёнку и семье?','Какой метод вы предлагаете и почему?','Как сохранятся доступ к AAC, помощь и право на перерыв?','Как измерят результат в школе и дома?','Когда и по каким основаниям изменят программу?']:
    y=field(t,y,2)
y=draw('Уточните стоимость, условия оплаты и отмены, если услуга платная. Обсудите, кто получит доступ к записям о ребёнке.',y)
end(y)
y=header(3,'Индивидуальный план: заполненный пример')
y=draw('Все числа и обстоятельства вымышлены. Цель: подготовка материалов к знакомому заданию.',y)
rows=[['Исходный уровень','Два из пяти шагов выполнены без дополнительной помощи взрослого.'],['Цель','Готовить нужные материалы по доступному списку с меньшим количеством лишних напоминаний.'],['Метод','Показ, разбиение задачи на шаги, уменьшение избыточных подсказок.'],['Поддержка','Визуальный список, удобное рабочее место, доступ к AAC и помощи.'],['Наблюдение','Самостоятельные шаги, подсказки, комфорт и запросы помощи.'],['Пересмотр','Проверить удобство списка в классе и при смене задания, изменить план при необходимости.']]
data=[[p('Часть плана',True,S,NAVY),p('Пример',True,S,NAVY)]]+[[p(x,True),p(z)] for x,z in rows]
t=Table(data,colWidths=[128,WIDTH-128]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('GRID',(0,0),(-1,-1),.7,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]));_,th=t.wrap(WIDTH,H);t.drawOn(c,L,y-th);y-=th+15
y=draw('Не убирайте необходимые адаптации ради результата. Просьба о помощи и отказ не являются ошибками. Числа не задают норму или срок обучения.',y)
end(y)
y=header(4,'Согласование целей и оценка результата')
for t,n in [('Дата и участники обсуждения',1),('Значимая цель и исходные возможности',2),('Метод, условия и необходимая помощь',2),('Как ребёнок сможет попросить помощь или отказаться?',1),('Как наблюдать результат, комфорт и перенос?',2),('Дата пересмотра и решения по итогам',2)]:y=field(t,y,n)
y=draw('Храните заполненный лист приватно. Это материал для обсуждения, а не официальный бланк ИРП, диагностический инструмент или аттестация педагога.',y)
end(y);c.save();print(out)
