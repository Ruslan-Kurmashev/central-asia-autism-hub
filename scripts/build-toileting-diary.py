"""Generate the unscored toileting observation diary for AutismHub."""
from pathlib import Path
import re
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfgen import canvas
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'public/downloads/toileting/toileting-diary-ru.pdf'
if len(sys.argv) > 1:
    # Local preview uses the same canonical tokens as the site.
    CSS = '--type-print-body: 11pt; --type-print-h1: 20pt; --type-print-h2: 15pt;'
else:
    CSS = (ROOT / 'src/styles/typography.css').read_text(encoding='utf-8')
def pt(name):
    return float(re.search(r'--type-print-' + name + r':\s*([\d.]+)pt', CSS).group(1))
S, H1, H2 = pt('body'), pt('h1'), pt('h2')
for face, name in [('Diary','DejaVuSans.ttf'),('DiaryBold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(face, '/usr/share/fonts/truetype/dejavu/' + name))
INK, NAVY, LINE, PALE = map(HexColor, ['#182D3E','#245A82','#AABDCB','#EDF4F8'])
W,H = A4
L = 42
WIDTH = W-2*L
OUT.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(OUT), pagesize=A4, invariant=1)
c.setTitle('Дневник наблюдения за туалетными навыками')
c.setAuthor('Autism Hub Kazakhstan')
def p(text, width=WIDTH, bold=False, size=S, color=INK):
    return Paragraph(escape(text), ParagraphStyle('DiaryText',fontName='DiaryBold' if bold else 'Diary',fontSize=size,leading=size*1.4,textColor=color))
def draw(text,y,bold=False,size=S,color=INK):
    q=p(text,bold=bold,size=size,color=color); _,h=q.wrap(WIDTH,H); q.drawOn(c,L,y-h); return y-h-9

def table(y,rows,blank=False):
    headers=['Время','Событие','Поддержка','Наблюдения']
    widths=[60,156,116,WIDTH-332]
    data=[[p(t,bold=True,color=NAVY) for t in headers]]+[[p(t,width=w-16) for t,w in zip(row,widths)] for row in rows]
    t=Table(data,colWidths=widths,rowHeights=[32]+[48 if blank else 64]*len(rows))
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('GRID',(0,0),(-1,-1),.7,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    _,h=t.wrap(WIDTH,H); t.drawOn(c,L,y-h); return y-h-14

def header(n,subtitle):
    c.setFillColor(NAVY); c.rect(0,H-12,W,12,stroke=0,fill=1)
    y=draw('Autism Hub Kazakhstan  /  Материалы для родителей',H-34,True,S,NAVY)
    y=draw('Дневник наблюдения за туалетными навыками',y-7,True,H1,NAVY)
    y=draw(subtitle,y-4,True,H2)
    c.setStrokeColor(LINE); c.line(L,43,W-L,43)
    c.setFont('Diary',S); c.setFillColor(INK); c.drawString(L,26,'AutismHub  |  Не диагностический инструмент'); c.drawRightString(W-L,26,f'{n} / 2')
    return y

y=header(1,'Пример заполнения')
y=draw('Наблюдайте привычный режим несколько дней. Семь дней - удобный ориентир, а не обязательный срок. Записывайте факты, помощь и видимые признаки дискомфорта.',y)
y=draw('Дата: условный пример. Все записи вымышлены.',y-5,True)
y=table(y,[['08:10','Стул в подгузнике','Без подсказки','Напрягался.'],['10:25','Мочеиспускание вне туалета','Без подсказки','Сигнал не замечен.'],['12:40','Мочеиспускание в туалете','Напоминание','Видимого дискомфорта нет.']])
y=draw('Как пользоваться',y,True,H2,NAVY)
y=draw('Отмечайте мочеиспускание и стул отдельно. Если сигнал не замечен, не делайте вывод, что его не было. Не меняйте питьё, сон или доступ к туалету ради записей.',y)
y=draw('При боли, запоре или новых мочевых симптомах обратитесь к врачу. При внезапной невозможности помочиться нужна неотложная помощь. Не откладывайте обращение ради дневника.',y)
y=draw('Храните записи приватно. Не размещайте их в общих чатах и социальных сетях. Передавайте специалисту только необходимую информацию.',y)
assert y>60,y
c.showPage()
y=header(2,'Чистый лист наблюдения')
y=draw('Дата: ____________________',y,True)
y=draw('Распечатайте эту страницу для каждого дня наблюдений. Заполняйте только нужные строки.',y)
y=table(y,[['','','',''] for _ in range(8)],True)
y=draw('Дополнительные наблюдения или вопросы специалисту:',y,True)
for _ in range(2):
    c.setStrokeColor(LINE); c.line(L,y-11,W-L,y-11); y-=25
y=draw('Записи остаются у семьи. Не откладывайте медицинскую помощь ради заполнения листа.',y-3)
assert y>55,y
c.showPage(); c.save()
from pypdf import PdfReader
pdf=PdfReader(str(OUT)); assert len(pdf.pages)==2 and all('Наблюдения' in (page.extract_text() or '') for page in pdf.pages)
print(OUT)
