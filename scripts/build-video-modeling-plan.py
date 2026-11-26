"""Reproduce the owner-approved four-page video-modeling printable.
Original editorial resource. No collection of child data or scoring.
"""
from pathlib import Path
import re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/downloads/selfcare/video-modeling-plan-ru.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
CSS=(ROOT/'src/styles/typography.css').read_text(encoding='utf-8')
def pt(token):
    return float(re.search(r'--type-print-'+token+r':\s*([\d.]+)pt',CSS).group(1))
S,T,U=pt('body'),pt('h1'),pt('h2')
assert (S,T,U)==(11,20,15), 'Review approved layout if canonical print tokens change'
for face,name in [('VM','DejaVuSans.ttf'),('VMB','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(face,'/usr/share/fonts/truetype/dejavu/'+name))
W,H=A4
L,R=42,W-42
INK,NAVY,LINE,PALE=map(HexColor,['#182D3E','#245A82','#AABDCB','#EDF4F8'])
c=canvas.Canvas(str(OUT),pagesize=A4,invariant=1)
c.setTitle('План подготовки обучающего видео и дневник наблюдения')
c.setAuthor('Autism Hub Kazakhstan')
def text(x,y,s,b=False,size=S,color=INK):
    face='VMB' if b else 'VM'
    assert x+pdfmetrics.stringWidth(s,face,size)<=R+1,('Text overflow',s)
    c.setFont(face,size)
    c.setFillColor(color)
    c.drawString(x,H-y,s)
def lines(y,*ss,x=L,b=False,size=S,color=INK):
    for i,s in enumerate(ss):
        text(x,y+i*15.4,s,b,size,color)
def line(x0,y0,x1,y1,w=1):
    c.setStrokeColor(LINE)
    c.setLineWidth(w)
    c.line(x0,H-y0,x1,H-y1)
def header(n,title):
    c.setFillColor(NAVY)
    c.rect(0,H-12,W,12,fill=1,stroke=0)
    text(L,46,'Autism Hub Kazakhstan / Материалы для родителей',True,S,NAVY)
    text(L,85.4,title,True,T,NAVY)
    line(L,H-44,R,H-44)
    text(L,H-27,'AutismHub | Не диагностический инструмент')
    c.setFont('VM',S)
    c.drawRightString(R,H-27,f'{n} / 4')
def heading(y,s):
    text(L,y,s,True,U,NAVY)
def table(top,widths,heights,headers,rows):
    xs=[L]
    for width in widths[:-1]:
        xs.append(xs[-1]+width)
    bottom=top+sum(heights)
    c.setFillColor(PALE)
    c.rect(L,H-top-heights[0],R-L,heights[0],fill=1,stroke=0)
    yy=top
    line(L,yy,R,yy,.7)
    for ht in heights:
        yy+=ht
        line(L,yy,R,yy,.7)
    for x in xs+[R]:
        line(x,top,x,bottom,.7)
    yy=top
    for i,row in enumerate([headers]+rows):
        for x,cell in zip(xs,row):
            for j,s in enumerate(cell.split('\n')):
                if s:
                    text(x+8,yy+19+j*15.4,s,i==0,S,NAVY if i==0 else INK)
        yy+=heights[i]
def field(y,label,n):
    text(L,y,label,True)
    for i in range(n):
        line(L,y+27.4+i*27,R,y+27.4+i*27)

header(1,'План видео: заполненный пример')
lines(113.4,'Навык: сложить небольшое полотенце привычным удобным способом.')
lines(137.8,'Формат: показ руками взрослого. При необходимости отдельные короткие',
      'фрагменты. Все примеры в документе вымышлены.')
table(166.6,[65,R-L-65],[40]+[31.4]*4,['Шаг','Что показать'],[
 ['1','Положить полотенце на доступный стол.'],
 ['2','Расправить ткань, показать края.'],
 ['3','Сложить полотенце пополам.'],
 ['4','Положить сложенное полотенце на полку.']])
heading(364.2,'Подготовка')
lines(390.2,'Похожее полотенце, доступный стол и полка, устойчивый телефон. Камера',
      'показывает руки и предметы. Не снимаем ребёнка.')
heading(437,'После просмотра')
lines(463,'Предложить попробовать. При необходимости показать один шаг или помочь.',
      'Допустить другой удобный способ складывания. При отказе прекратить попытку.')
lines(502.8,'Не нужно назначать обязательное время просмотра. Учитывайте комфорт,',
      'безопасность и доступность задачи.')
c.showPage()

header(2,'План видео: чистый лист')
field(113.4,'Навык и цель',2)
field(199.8,'Что уже получается? Что нужно адаптировать?',2)
field(286.2,'Формат, модель, предметы и ракурс',1)
table(334.6,[65,R-L-65],[40]+[55]*4,['Шаг','Что показать'],[[str(i),''] for i in range(1,5)])
field(619.6,'Как предложить практику и помощь?',1)
lines(679,'По возможности снимайте взрослого или предметы. Учитывайте согласие участников,',
      'доступ к записи и срок удаления. Не снимайте интимные действия.')
c.showPage()

header(3,'Наблюдение: заполненный пример')
lines(113.4,'Навык: сложить полотенце. Условные записи, не данные исследования и не','норматив развития.')
table(142.2,[120,180,R-L-300],[40,46.8,46.8,46.8,62.2],['Ситуация','Видео и помощь','Результат и комфорт'],[
 ['Дома, знакомое\nполотенце','Взрослый включил видео,\nпоказал край ткани.','Сложил после жеста. Попросил\nзакончить.'],
 ['Дома, знакомое\nполотенце','Сам включил видео.','Сложил без помощи взрослого.'],
 ['Дома, другое\nполотенце','Понадобился показ одного\nшага.','Сложил с помощью.'],
 ['Позднее,\nобычная\nситуация','Видео было доступно.','Отказался. Практику не\nпродолжали.']])
heading(416.8,'Как понять результат')
lines(442.8,'Самостоятельное обращение к видео может быть полезной адаптацией. Выполнение',
      'после жеста взрослого отмечайте отдельно. Отказ не следует считать ошибкой','ребёнка.')
heading(505,'Перенос и сохранение')
lines(531,'Проверяйте в обычной ситуации с другим предметом и спустя время, не убирая',
      'нужную поддержку. Если не было возможности наблюдать, не записывайте неуспех.')
lines(570.8,'Пересмотрите формат, если запись не помогает или вызывает дискомфорт. Не',
      'создавайте обязательное число попыток.')
c.showPage()

header(4,'Наблюдение: чистый лист')
field(113.4,'Навык и период наблюдения',1)
table(161.8,[120,180,R-L-300],[40]+[55]*6,['Дата и\nситуация','Видео и помощь','Результат и комфорт'],[['','',''] for _ in range(6)])
field(556.8,'Перенос, сохранение, что стоит изменить',2)
lines(643.2,'Заполняйте только полезные строки. Храните записи приватно. Не публикуйте',
      'сведения о ребёнке в общих чатах и социальных сетях.')
c.showPage()
c.save()
pdf=PdfReader(str(OUT))
assert len(pdf.pages)==4 and all('AutismHub' in (page.extract_text() or '') for page in pdf.pages)
print('Video modeling printable:',OUT)
