#!/usr/bin/env python3
"""Generate AutismHub's four-page self-management plan and original evidence charts."""
from pathlib import Path
import argparse, re, html
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from xml.sax.saxutils import escape

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--output-dir',type=Path,default=ROOT/'public/downloads/selfcare')
parser.add_argument('--chart-dir',type=Path,default=ROOT/'public/images/editorial/diagrams')
parser.add_argument('--preview',action='store_true',help='Use canonical current print values outside checkout')
args=parser.parse_args()
args.output_dir.mkdir(parents=True,exist_ok=True)
args.chart_dir.mkdir(parents=True,exist_ok=True)
CSS='--type-print-body: 11pt; --type-print-h1: 20pt; --type-print-h2: 15pt;' if args.preview else (ROOT/'src/styles/typography.css').read_text(encoding='utf-8')
def pt(k): return float(re.search(r'--type-print-'+k+r':\s*([\d.]+)pt',CSS).group(1))
S,H1,H2=pt('body'),pt('h1'),pt('h2')
for f,n in [('SM','DejaVuSans.ttf'),('SMB','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(f,'/usr/share/fonts/truetype/dejavu/'+n))
INK,NAVY,LINE,PALE=map(HexColor,['#182D3E','#245A82','#AABDCB','#EDF4F8'])
W,H=A4; L=42; R=W-42; WIDTH=R-L
out=args.output_dir/'self-management-plan-ru.pdf'
c=canvas.Canvas(str(out),pagesize=A4,invariant=1)
c.setTitle('Мой план самостоятельности');c.setAuthor('Autism Hub Kazakhstan')
def p(t,b=False,size=S,color=INK):
    return Paragraph(escape(t),ParagraphStyle('SM',fontName='SMB' if b else 'SM',fontSize=size,leading=size*1.42,textColor=color))
def draw(t,y,b=False,size=S,color=INK):
    q=p(t,b,size,color);_,h=q.wrap(WIDTH,H);q.drawOn(c,L,y-h);return y-h-9
def header(n,sub):
    c.setFillColor(NAVY);c.rect(0,H-12,W,12,fill=1,stroke=0)
    y=draw('Autism Hub Kazakhstan / Материалы для родителей',H-34,True,S,NAVY)
    y=draw('Мой план самостоятельности',y-5,True,H1,NAVY)
    y=draw(sub,y-2,True,H2)
    c.setStrokeColor(LINE);c.line(L,44,R,44)
    c.setFont('SM',S);c.setFillColor(INK);c.drawString(L,26,'AutismHub | Не диагностический инструмент');c.drawRightString(R,26,f'{n} / 4')
    return y-3
def table(y,heads,rows,widths,heights=None):
    data=[[p(s,True,S,NAVY) for s in heads]]+[[p(s) for s in row] for row in rows]
    t=Table(data,colWidths=widths,rowHeights=heights)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('GRID',(0,0),(-1,-1),.7,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    _,h=t.wrap(WIDTH,H)
    # Verify that an explicit row height can hold its wrapped text.
    if heights:
        for i,row in enumerate(data):
            for q,w in zip(row,widths):
                _,qh=q.wrap(w-16,H)
                assert qh+16<=heights[i]+0.01,(i,q.text,qh,heights[i])
    t.drawOn(c,L,y-h);return y-h-13
def field(y,label,n=1):
    y=draw(label,y,True)
    c.setStrokeColor(LINE)
    for _ in range(n):c.line(L,y-13,R,y-13);y-=26
    return y-7
def end(y):
    assert y>58,('page overflow',y)
    c.showPage()
# Page 1: a real choice, not a compliance target.
y=header(1,'Индивидуальный план: пример')
y=draw('Все примеры вымышлены. Цель и способ помощи выбирают вместе с ребёнком.',y)
y=table(y,['Что планируем','Пример'],[
 ['Моя цель','Собрать нужные вещи в рюкзак перед школой.'],
 ['Мой выбор','Удобнее подготовить вещи вечером, по списку с картинками.'],
 ['Инструмент','Список рядом с рюкзаком. Вещи лежат в доступном месте.'],
 ['Какая помощь остаётся','Можно попросить найти учебник или помочь с тяжёлыми вещами.'],
 ['Что хотим изменить','Реже напоминать о каждом предмете, если список помогает.']],[150,WIDTH-150])
y=draw('Пример списка на выбранный день',y,True,H2,NAVY)
for s in ['Проверить расписание.','Положить нужные тетради и учебники.','Взять пенал.','Взять бутылку воды.']:
    c.setStrokeColor(NAVY);c.rect(L,y-14,11,11,fill=0,stroke=1);q=p(s);_,h=q.wrap(WIDTH-25,H);q.drawOn(c,L+25,y-h);y-=max(h,14)+5
y-=6
y=draw('Список можно менять. Просьба о помощи и отказ не являются ошибками. Не нужно заслуживать воду, еду или отдых.',y)
end(y)
# Page 2: blank plan and checklist.
y=header(2,'Индивидуальный план: чистый лист')
y=field(y,'Моя цель и зачем она мне нужна',2)
y=field(y,'Какой инструмент я выбираю?',1)
y=field(y,'Какую помощь я хочу сохранить?',2)
y=draw('Мой список действий',y,True,H2,NAVY)
for _ in range(5):
    c.setStrokeColor(NAVY);c.rect(L,y-17,12,12,stroke=1,fill=0);c.setStrokeColor(LINE);c.line(L+25,y-17,R,y-17);y-=30
y-=4
y=field(y,'Как понять, что инструмент помогает?',1)
y=draw('Можно изменить цель, список или способ помощи. Заполняйте только те поля, которые полезны.',y)
end(y)
# Page 3: filled-in observation, distinguish requested assistance and tool use.
y=header(3,'Наблюдение: заполненный пример')
y=draw('Навык: подготовить рюкзак. Вымышленные ситуации, не данные исследования и не норма развития.',y)
y=table(y,['Ситуация','Инструмент и помощь','Что дальше'],[
 ['Пн, вечером','Взрослый напомнил о списке. Собрал вещи с помощью.','Оставить список рядом с рюкзаком.'],
 ['Вт, вечером','Сам открыл список, попросил помочь найти учебник.','Сохранить возможность просить помощь.'],
 ['Другое расписание','Список устарел. Планировали вместе.','Обновить список.'],
 ['Усталость','Отложил сбор. Взрослый помог.','Пересмотреть нагрузку и время.']],[100,218,WIDTH-318])
y=draw('На что обращать внимание',y,True,H2,NAVY)
y=draw('Самостоятельное обращение к списку и выполнение после напоминания записывают отдельно. Просьба о помощи может быть проявлением самостоятельности.',y)
y=draw('Сохранение: помогает ли список спустя время? Перенос: удобно ли им пользоваться при изменении расписания? Не создавайте лишних попыток ради записей.',y)
y=draw('Если ребёнку неудобно, можно изменить инструмент, вернуться к совместному планированию или отложить задачу. Не уменьшайте необходимый уход и присмотр.',y)
end(y)
# Page 4: blank family observation.
y=header(4,'Наблюдение: чистый лист')
y=field(y,'Навык и период наблюдения',1)
y=table(y,['Дата и ситуация','Инструмент, помощь и комфорт','Что дальше'],[['','',''] for _ in range(6)],[105,224,WIDTH-329],[49]+[55]*6)
y=field(y,'Что стало удобнее? Что стоит изменить?',2)
y=draw('Храните записи у семьи. Не ставьте оценки ребёнку. Если возможности для наблюдения не было, не записывайте её как неуспех.',y)
end(y)
c.save()
# Original charts, source Aydin et al. (2025), DOI 10.1007/s10803-024-06355-w.
# Chart text is internal lettering, not page CSS; all values have a selectable text alternative in the article.
def chart(filename,title,labels,values,notes,desc):
    w=660; barmax=475; start=24; dy=76; bottom=88+len(labels)*dy; h=bottom+len(notes)*32+18
    ss=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="chart-title chart-desc">',f'<title id="chart-title">{html.escape(title)}</title>',f'<desc id="chart-desc">{html.escape(desc)}</desc>',f'<rect width="{w}" height="{h}" rx="12" fill="#ffffff"/>','<g fill="#183b53" font-family="DejaVu Sans, Arial, sans-serif" font-size="24">',f'<text x="24" y="36" font-weight="700">{html.escape(title)}</text>','<text x="24" y="66">Число работ из 15</text>']
    for i,(label,n) in enumerate(zip(labels,values)):
        y=105+i*dy; bw=barmax*n/15
        ss.extend([f'<text x="24" y="{y}">{html.escape(label)}</text>',f'<rect x="{start}" y="{y+12}" width="{barmax}" height="25" rx="3" fill="#edf2f6"/>',f'<rect x="{start}" y="{y+12}" width="{bw:.3f}" height="25" rx="3" fill="#397d96"/>',f'<text x="{start+barmax+12}" y="{y+34}" font-weight="700">{n} из 15</text>'])
    for i,note in enumerate(notes):ss.append(f'<text x="24" y="{bottom+20+i*32}" font-size="23">{html.escape(note)}</text>')
    ss.append('</g></svg>');(args.chart_dir/filename).write_text('\n'.join(ss)+'\n',encoding='utf-8')
chart('self-management-components-ru.svg','Компоненты самоуправления',['Самонаблюдение','Самоинструкция','Самостоятельная фиксация','Самоподкрепление','Самостоятельный выбор','Самооценка'],[11,3,2,2,1,1],['Категории пересекаются.','Частота изучения, не эффективность.','Aydin et al., 2025 (онлайн 2024).'], '15 исследований. Самонаблюдение 11, самоинструкция 3, самостоятельная фиксация 2, самоподкрепление 2, самостоятельный выбор 1, самооценка 1. Категории пересекаются.')
chart('self-management-evidence-limits-ru.svg','Ограничения исследований',['WWC полностью или с оговорками','Оценивали сохранение','Оценивали перенос','WWC без оговорок'],[9,7,5,1],['Одна работа без оговорок входит в число 9.','Наличие измерений, не успешность навыка.','Aydin et al., 2025 (онлайн 2024).'],'15 работ. 9 соответствовали WWC полностью или с оговорками, включая одну без оговорок. 7 оценивали сохранение, 5 перенос. Не показатель эффективности.')
print(out)
