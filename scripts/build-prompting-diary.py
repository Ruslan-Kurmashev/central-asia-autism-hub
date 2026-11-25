"""Original printable observation sheet. No scoring or personal data upload."""
from pathlib import Path
import re
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfgen import canvas
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'public/downloads/selfcare/prompting-diary-ru.pdf'
CSS = '--type-print-body: 11pt; --type-print-h1: 20pt; --type-print-h2: 15pt;' if len(sys.argv) > 1 else (ROOT / 'src/styles/typography.css').read_text(encoding='utf-8')
def pt(name):
    return float(re.search(r'--type-print-' + name + r':\s*([\d.]+)pt', CSS).group(1))
S,H1,H2 = pt('body'),pt('h1'),pt('h2')
for face,name in [('DiaryP','DejaVuSans.ttf'),('DiaryPB','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(face,'/usr/share/fonts/truetype/dejavu/'+name))
INK,NAVY,LINE,PALE = map(HexColor,['#182D3E','#245A82','#AABDCB','#EDF4F8'])
W,H=A4
L=42
WIDTH=W-2*L
OUT.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(OUT),pagesize=A4,invariant=1)
c.setTitle('Дневник самостоятельности и подсказок')
c.setAuthor('Autism Hub Kazakhstan')
def p(t,b=False,size=S,color=INK):
    return Paragraph(escape(t),ParagraphStyle('P',fontName='DiaryPB' if b else 'DiaryP',fontSize=size,leading=size*1.4,textColor=color))
def draw(t,y,b=False,size=S,color=INK):
    q=p(t,b,size,color); _,h=q.wrap(WIDTH,H); q.drawOn(c,L,y-h); return y-h-10

def table(y,rows,blank=False):
    hdr=['День','Всего','Самостоятельно','С подсказкой','Не выполнено']
    widths=[67,55,145,121,WIDTH-388]
    data=[[p(t,True,S,NAVY) for t in hdr]]+[[p(t) for t in row] for row in rows]
    t=Table(data,colWidths=widths,rowHeights=[42]+[42 if blank else 34]*len(rows))
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('GRID',(0,0),(-1,-1),.7,LINE),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7)]))
    _,h=t.wrap(WIDTH,H); t.drawOn(c,L,y-h); return y-h-14

def header(n,sub):
    c.setFillColor(NAVY); c.rect(0,H-12,W,12,stroke=0,fill=1)
    y=draw('Autism Hub Kazakhstan  /  Материалы для родителей',H-35,True,S,NAVY)
    y=draw('Дневник самостоятельности и подсказок',y-4,True,H1,NAVY)
    y=draw(sub,y-3,True,H2)
    c.setStrokeColor(LINE); c.line(L,43,W-L,43)
    c.setFont('DiaryP',S); c.setFillColor(INK); c.drawString(L,26,'AutismHub  |  Не диагностический инструмент'); c.drawRightString(W-L,26,f'{n} / 2')
    return y

y=header(1,'Пример заполнения')
y=draw('Навык: поставить лёгкую небьющуюся чашку в доступное место после питья.',y,True)
y=draw('Вымышленные данные. Пять возможностей в день приведены только для примера, не как норма.',y)
y=table(y,[['Пн','5','1','4','0'],['Вт','5','2','3','0'],['Ср','5','3','2','0'],['Чт','5','4','0','1'],['Пт','5','4','1','0']])
y=draw('Как читать записи',y,True,H2,NAVY)
y=draw('В четверг ребёнок четыре раза действовал сам, один раз не выполнил действие. Не нужно повторять задание ради результата. Отказ не является ошибкой.',y)
y=draw('Самостоятельность: число действий без дополнительной подсказки делят на число наблюдавшихся возможностей и умножают на 100%. Нужные постоянные адаптации остаются доступными.',y)
y=draw('Если самостоятельность растёт и ребёнку комфортно, пробуйте уменьшать лишнюю помощь. При затруднениях пересмотрите условия. Не убирайте AAC и необходимые адаптации.',y)
y=draw('Наблюдайте обычные ситуации, не создавайте обязательное число попыток. Храните записи приватно.',y)
assert y>55,y
c.showPage()
y=header(2,'Чистый лист наблюдения')
y=draw('Навык: __________________________________________________',y)
y=draw('Период: ____________________    Условия: ___________________',y)
y=table(y,[['','','','',''] for _ in range(7)],True)
y=draw('Что помогло? Причины отказа, комфорт, вид подсказки:',y,True)
for _ in range(3):
    c.setStrokeColor(LINE); c.line(L,y-9,W-L,y-9); y-=25
assert y>100,y
y=draw('Заполняйте только полезные строки. Не ставьте оценки ребёнку. Не задерживайте необходимую помощь ради наблюдения.',y)
assert y>55,y
c.showPage(); c.save()
from pypdf import PdfReader
pdf=PdfReader(str(OUT)); assert len(pdf.pages)==2 and all('Самостоятельно' in (page.extract_text() or '') for page in pdf.pages)
print(OUT)
