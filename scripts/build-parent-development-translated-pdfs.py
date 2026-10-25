#!/usr/bin/env python3
"""Build fully localised, printable AutismHub parent resources for three articles.
Educational, unscored worksheets, not medical triage or diagnostic instruments.
The PDFs contain no submitted personal data and are generated at build time.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
REG = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not REG.exists() or not BOLD.exists():
    raise RuntimeError("DejaVu Unicode fonts required")
pdfmetrics.registerFont(TTFont("HubPrint", str(REG)))
pdfmetrics.registerFont(TTFont("HubPrintBold", str(BOLD)))
W, H = A4
L, R = 42, W - 42
NAVY, INK, GRAY, RULE, PALE = [HexColor(x) for x in
    ("#25577C", "#263A49", "#566B7A", "#BCCEDC", "#EDF4F8")]
BASE = ROOT / "public" / "downloads"

def draw_text(c, x, y, value, size=8.3, bold=False, color=INK, width=None, leading=None):
    font = "HubPrintBold" if bold else "HubPrint"
    c.setFont(font, size)
    c.setFillColor(color)
    if width is None:
        c.drawString(x, y, str(value))
        return y - (leading or size + 6)
    for para in str(value).split("\n"):
        for line in simpleSplit(para, font, size, width) if para else [""]:
            c.drawString(x, y, line)
            y -= leading or size + 5
    return y

def page(c, lang, title, subtitle, index):
    c.setFillColor(NAVY)
    c.rect(0, H - 16, W, 16, fill=1, stroke=0)
    draw_text(c, L, H - 40, "AUTISMHUB  /  "+("PARENT RESOURCES" if lang == "en" else "АТА-АНАЛАРҒА МАТЕРИАЛДАР"),
              8, True, NAVY)
    y = draw_text(c, L, H - 64, title, size=12, bold=True, color=INK, width=R-L, leading=18)
    y = draw_text(c, L, y - 6, subtitle, size=8.4, color=GRAY, width=R-L, leading=13)
    c.setStrokeColor(RULE)
    c.line(L, 42, R, 42)
    draw_text(c, L, 26, "AutismHub / 2026-10-16 / "+(
        "No scores, diagnosis or automatic data collection" if lang == "en" else
        "Ұпай, диагноз және деректі автоматты жинау жоқ"), 7, color=GRAY)
    c.setFont("HubPrint", 8)
    c.drawRightString(R, 26, str(index))
    return y - 14

def card(c, y, label, note, blank=False):
    x = L + 12
    c.setFillColor(PALE)
    c.roundRect(L, y - 29, R-L, 34, 7, fill=1, stroke=0)
    y = draw_text(c, x, y - 17, label, 9, True, NAVY, width=R-L-25, leading=14) - 12
    y = draw_text(c, x, y, note, 8.25, color=INK, width=R-L-26, leading=13) - 7
    if blank:
        for _ in range(2):
            c.setStrokeColor(RULE)
            c.line(x, y, R-9, y)
            y -= 25
    y -= 19
    if y < 69:
        raise ValueError("PDF page overflow: "+label)
    return y

DATA = {
"en": {
"home-preschool-observations": {
 "folder":"contexts", "title":"Observations at home and preschool",
 "subtitle":"A two-setting discussion sheet, not a behaviour test or a diagnosis.",
 "intro":"Write short factual examples from home and preschool. There is no need to monitor the child constantly or collect identifying information.",
 "pages":[[
  ("What did the child do or communicate?","Record one concrete episode without labels such as 'bad' or 'manipulative'.",True),
  ("Where and when did it happen?","Home, preschool or another setting, time and people present.",True),
  ("What were the conditions?","Noise, transitions, demands, language, sleep, illness or pain, if known.",True)
 ],[
  ("How could the child request help or a break?","Words, gestures, pictures, AAC, familiar adults or other accessible communication.",True),
  ("Which supports were available?","Advance warning, quiet space, choice, visual cues and help.",True),
  ("What should we ask the other adults?","Compare accounts without assuming one person is wrong or blaming the child.",True)
 ]], "warning":"Do not share identifiable notes in public chats. Seek health or safeguarding advice for pain, loss of skills, suspected harm or acute danger."
},
"family-educator-meeting": {
 "folder":"contexts", "title":"Family and educator meeting",
 "subtitle":"A short support discussion, not an individual medical or crisis plan.",
 "intro":"Begin with the child's strengths and the conditions in which participation is comfortable. Use only necessary private information.",
 "pages":[[
  ("What works well?","Describe where the child is interested, comfortable and able to communicate.",True),
  ("One priority situation","For example, transition from free play to lunch. Describe the issue factually.",True),
  ("How does the child express their view?","Words, gestures, AAC, behaviours indicating discomfort or refusal.",True)
 ],[
  ("One safe environmental change","For example, advance notice, accessible break, predictable choices or quieter space.",True),
  ("Who will offer support?","Agree which adults will provide understandable help. Respect existing plans.",True),
  ("How will we review comfort and participation?","Look at wellbeing, communication and choice, not just visible compliance.",True)
 ]], "warning":"This is not a substitute for professional safeguarding, clinical assessment, an existing individual support plan or emergency care."
},
"seven-two-language-situations": {
 "folder":"bilingual", "title":"Seven situations in two family languages",
 "subtitle":"Everyday Kazakh and Russian phrases to support communication, not a language test.",
 "intro":"Use the language you speak naturally. Accept gestures, AAC and words in either language. These are examples, not mandatory drills.",
 "pages":[[
  ("1. Breakfast / Таңғы ас","RU: «Ты хочешь воду?» KZ: «Су ішесің бе?» Offer a familiar cup and accept any clear answer.",False),
  ("2. Walk / Серуен","RU: «Смотри, мяч!» KZ: «Қара, доп!» Follow the child's interest. No demand to repeat.",False),
  ("3. Book / Кітап","RU: «Где кот?» KZ: «Мысық қайда?» Pointing to the picture is a valid response.",False),
  ("4. Help / Көмек","RU: «Помочь?» KZ: «Көмектесейін бе?» Accept a gesture, word, AAC or action.",False)
 ],[
  ("5. More / Тағы","RU: «Ещё?» KZ: «Тағы ма?» Do not withhold needed items until a word is spoken.",False),
  ("6. Refusal / Жоқ","RU: «Не хочешь? Хорошо». KZ: «Қаламайсың ба? Жарайды». Respect optional refusal.",False),
  ("7. Family story / Отбасы","Tell a short story in a familiar language and show a picture if the child enjoys it.",False),
  ("What matters most","Respond to meaning, keep family languages and seek assessment of all languages and hearing if concerned. Loss of acquired skills needs timely medical review.",False)
 ]], "warning":"This worksheet is not a speech-language assessment, treatment programme or validated translation protocol."
},
"family-language-map": {
 "folder":"bilingual", "title":"Family language map and observations",
 "subtitle":"A private consultation preparation form covering all the child's languages.",
 "intro":"Share examples with an appropriate speech-language or medical professional. Do not score or repeatedly test your child.",
 "pages":[[
  ("Languages the child hears and uses","At home, preschool, with grandparents and in the community.",True),
  ("Who uses each language?","For example, mother uses Russian and Kazakh, grandparent uses Kazakh.",True),
  ("When does the child understand messages?","Give contextual examples, including gestures or objects used.",True)
 ],[
  ("How does the child communicate needs?","Words, gestures, pictures, AAC, refusal and preferred language.",True),
  ("What are the child's communication strengths?","Interests, preferred partners and accessible methods.",True),
  ("Questions for the professional","How will every relevant language and hearing be assessed? Is interpretation needed?",True)
 ]], "warning":"This is not a standardised vocabulary test. Do not use word counts alone to diagnose a disorder."
},
"skill-loss-observation": {
 "folder":"development", "title":"Changes in previously acquired skills",
 "subtitle":"Preparation for a healthcare consultation. This form must never delay care.",
 "intro":"A previously reliable skill may have changed. The family does not need to prove regression before asking for help.",
 "pages":[[
  ("1. Which skill was previously stable?","A familiar word, gesture, independent walking, using a spoon or another concrete ability.",True),
  ("2. When and how often did the child use it?","For example, most days at home or during a familiar game.",True),
  ("3. What changed and approximately when?","Describe a specific action, not a diagnosis. It is fine if the date is uncertain.",True),
  ("4. Where do you notice the change?","At home, preschool, with different people or in different languages.",True)
 ],[
  ("5. Any other symptoms or changes?","Illness, weakness, hearing, pain, injury, sleep changes or unusual episodes.",True),
  ("6. What have other adults noticed?","Family members and educators may describe different settings.",True),
  ("7. What would you like to ask the doctor?","Hearing, speech, movement or neurological assessment, warning signs and follow-up.",True)
 ]], "warning":"Sudden weakness, a new gait abnormality, seizures, altered consciousness, breathing difficulty or other acute danger require urgent medical attention. Do not wait for this worksheet."
}
},
"kk": {
"home-preschool-observations": {
 "folder":"contexts", "title":"Үй мен балабақшадағы бақылау",
 "subtitle":"Екі ортадағы жағдайды салыстыру парағы. Тест те, диагноз да емес.",
 "intro":"Үйде және балабақшада болған нақты оқиғаларды қысқаша жазыңыз. Баланы үздіксіз бақылау немесе жеке деректі жинау міндетті емес.",
 "pages":[[
  ("Бала не істеді немесе нені білдірді?","«Жаман» не «әдейі істеді» демей, бір нақты әрекетті сипаттаңыз.",True),
  ("Оқиға қашан және қайда болды?","Үй, балабақша, уақыт және жанында болған адамдар.",True),
  ("Қандай жағдай болды?","Шу, ауысу, талап, тіл, ұйқы, ауру немесе ауырсыну, белгілі болса.",True)
 ],[
  ("Бала көмек не үзілісті қалай сұрай алады?","Сөз, ым, сурет, AAC, таныс ересек немесе басқа тәсіл.",True),
  ("Қандай қолдау қолжетімді болды?","Алдын ала ескерту, тыныш орын, таңдау, көрнекі белгі, көмек.",True),
  ("Басқа ересектерден нені сұрау керек?","Кім дұрыс деп дауламай, нақты байқауларды салыстырыңыз.",True)
 ]], "warning":"Жеке дерегі бар парақты ашық чатқа салмаңыз. Ауырсыну, дағды жоғалуы, қауіп немесе зорлық күдігі болса, тиісті маманға жүгініңіз."
},
"family-educator-meeting": {
 "folder":"contexts", "title":"Отбасы мен педагогтің кездесуі",
 "subtitle":"Қысқа қолдау жоспары. Медициналық және дағдарыстық жоспар емес.",
 "intro":"Алдымен баланың күшті жақтарын және қай жағдайда өзін жайлы сезінетінін талқылаңыз. Тек қажетті ақпаратты құпия бөлісіңіз.",
 "pages":[[
  ("Қандай жағдайлар сәтті өтеді?","Бала қайда қызығушылық танытады, жайлы сезінеді және байланыс орнатады?",True),
  ("Бір негізгі жағдайды таңдаңыз","Мысалы, ойыннан түскі асқа ауысу. Оқиғаны жорамалсыз жазыңыз.",True),
  ("Бала өз пікірін қалай білдіреді?","Сөз, ым, AAC, жайсыздық немесе бас тартуды білдіретін белгі.",True)
 ],[
  ("Ортадағы бір қауіпсіз өзгеріс","Алдын ала ескерту, түсінікті таңдау, үзіліс немесе тыныш орын.",True),
  ("Кім қандай қолдау көрсетеді?","Жауапты ересектерді келісіңіз, бар жеке жоспарды сақтаңыз.",True),
  ("Нәтижені қалай талқылаймыз?","Тек тілалғыштықты емес, жайлылық, қатысу, таңдау және байланыс мүмкіндігін бағалаңыз.",True)
 ]], "warning":"Бұл үлгі кәсіби қорғауды, дәрігерлік бағалауды, жеке қолдау жоспарын немесе жедел көмекті алмастырмайды."
},
"seven-two-language-situations": {
 "folder":"bilingual", "title":"Екі тілдегі жеті күнделікті жағдай",
 "subtitle":"Қазақша және орысша мысалдар. Тілді тексеруге арналмаған.",
 "intro":"Өзіңізге табиғи тілде сөйлесіңіз. Ым, сөз және AAC арқылы берілген жауапты қабылдаңыз. Мысалдар міндетті жаттығу емес.",
 "pages":[[
  ("1. Таңғы ас / Завтрак","Қаз: «Су ішесің бе?» Орыс: «Ты хочешь воду?» Үйреншікті кесені көрсетіп, кез келген түсінікті жауапты қабылдаңыз.",False),
  ("2. Серуен / Прогулка","Қаз: «Қара, доп!» Орыс: «Смотри, мяч!» Баланың қызығушылығын қолдаңыз. Сөзді қайталатпаңыз.",False),
  ("3. Кітап / Книга","Қаз: «Мысық қайда?» Орыс: «Где кот?» Суретті көрсету де жарамды жауап.",False),
  ("4. Көмек / Помощь","Қаз: «Көмектесейін бе?» Орыс: «Помочь?» Ым, сөз, AAC не әрекетті қабылдаңыз.",False)
 ],[
  ("5. Тағы / Ещё","Қаз: «Тағы ма?» Орыс: «Ещё?» Қажетті затты сөз айтқанша бермей қоюға болмайды.",False),
  ("6. Жоқ / Отказ","Қаз: «Қаламайсың ба? Жарайды». Орыс: «Не хочешь? Хорошо». Міндетті емес әрекеттен бас тартуды құрметтеңіз.",False),
  ("7. Отбасы / Семейная история","Таныс тілде қысқа әңгіме айтып, бала қаласа сурет көрсетіңіз.",False),
  ("Ең маңыздысы","Хабардың мағынасына жауап беріңіз, отбасы тілдерін сақтаңыз. Алаң болса барлық тіл мен естуді бағалатыңыз. Бұрынғы дағды жоғалса дәрігерге жүгініңіз.",False)
 ]], "warning":"Бұл парақ сөйлеу тесті, емдеу бағдарламасы немесе тексерілген аударма хаттамасы емес."
},
"family-language-map": {
 "folder":"bilingual", "title":"Отбасының тіл картасы",
 "subtitle":"Бала қолданатын барлық тіл туралы жеке кеңеске дайындық парағы.",
 "intro":"Мысалдарды логопедке немесе дәрігерге жеткізіңіз. Ұпай қоймаңыз және баланы қайта-қайта тексермеңіз.",
 "pages":[[
  ("Бала қандай тілдерді естиді және қолданады?","Үйде, балабақшада, ата-әжемен және басқа ортада.",True),
  ("Әр тілде кім сөйлейді?","Мысалы, анасы қазақша және орысша, әжесі қазақша.",True),
  ("Бала қай кезде хабарды түсінеді?","Ым мен заттық белгі бар-жоғын ескеріп, нақты мысал жазыңыз.",True)
 ],[
  ("Бала қажеттілігін қалай білдіреді?","Сөз, ым, сурет, AAC, бас тарту және ыңғайлы тіл.",True),
  ("Баланың коммуникациядағы күшті жағы қандай?","Қызығушылығы, жақсы көретін адамы, байланыс тәсілі.",True),
  ("Маманға сұрақтар","Барлық тіл мен есту қалай бағаланады? Аудармашы қажет пе?",True)
 ]], "warning":"Бұл стандартталған сөздік тест емес. Тек сөз саны арқылы диагноз қоюға болмайды."
},
"skill-loss-observation": {
 "folder":"development", "title":"Бұрынғы дағдылардың өзгеруі",
 "subtitle":"Дәрігерлік қабылдауға дайындық. Бұл парақ көмекті кешіктірмеуі керек.",
 "intro":"Бала бұрын тұрақты қолданған дағдысы өзгеруі мүмкін. Дәрігерге жүгіну үшін ата-ана регресті өзі дәлелдеуге міндетті емес.",
 "pages":[[
  ("1. Бұрын қандай тұрақты дағды болды?","Сөз, ым, өздігінен жүру, қасық ұстау немесе басқа нақты қабілет.",True),
  ("2. Қашан және қаншалықты жиі қолданды?","Мысалы, күн сайын үйде немесе таныс ойын кезінде.",True),
  ("3. Не өзгерді және шамамен қашан?","Диагноз емес, әрекетті сипаттаңыз. Дәл күнін білмеуге болады.",True),
  ("4. Өзгеріс қай жерде байқалады?","Үйде, балабақшада, түрлі адамдармен немесе әр тілде.",True)
 ],[
  ("5. Басқа симптом не өзгеріс бар ма?","Ауру, әлсіздік, есту, ауырсыну, жарақат, ұйқы немесе әдеттен тыс эпизод.",True),
  ("6. Басқа ересектер нені байқады?","Отбасы мен педагог әртүрлі жағдайды сипаттауы мүмкін.",True),
  ("7. Дәрігерге қандай сұрақ қойғыңыз келеді?","Есту, сөйлеу, қимыл, неврологиялық бағалау, қауіп белгілері және қайта келу.",True)
 ]], "warning":"Кенет әлсіздік, жаңа жүріс бұзылысы, құрысу, есінің бұзылуы, тыныстың қиындауы немесе басқа қауіпті белгі болса, шұғыл медициналық көмекке жүгініңіз. Парақ толғанша күтпеңіз."
}
}
}
FILES = {
"home-preschool-observations":"home-preschool-observations",
"family-educator-meeting":"family-educator-meeting",
"seven-two-language-situations":"seven-two-language-situations",
"family-language-map":"family-language-map",
"skill-loss-observation":"skill-loss-observation",
}
for lang, entries in DATA.items():
    for key, spec in entries.items():
        dest = BASE / spec["folder"] / (FILES[key] + "-" + lang + ".pdf")
        dest.parent.mkdir(parents=True, exist_ok=True)
        doc = canvas.Canvas(str(dest), pagesize=A4, pageCompression=1)
        doc.setTitle("AutismHub - " + spec["title"])
        doc.setAuthor("AutismHub")
        for index, blocks in enumerate(spec["pages"], 1):
            y = page(doc, lang, spec["title"], spec["subtitle"], index)
            if index == 1:
                y = draw_text(doc, L, y, spec["intro"], size=8.5,
                              width=R-L, leading=14) - 19
            for label, note, blank in blocks:
                y = card(doc, y, label, note, blank)
            y -= 12
            y = draw_text(doc, L, y, spec["warning"], 7.8,
                          width=R-L, leading=12, color=GRAY)
            if y < 52:
                raise ValueError("Footer note overflows: "+dest.name)
            doc.showPage()
        doc.save()
        pdf = PdfReader(str(dest))
        if len(pdf.pages) != 2 or dest.stat().st_size < 10000:
            raise RuntimeError("Invalid or too small PDF: "+str(dest))
        if any(len(p.extract_text() or "") < 300 for p in pdf.pages):
            raise RuntimeError("Missing selectable text: "+str(dest))
        print("Translated PDF OK:", dest.relative_to(ROOT), dest.stat().st_size)
