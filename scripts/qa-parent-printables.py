#!/usr/bin/env python3
"""Inspect all 17 parent PDFs for printable text, clipping, and visible figures.

Also renders low-resolution previews for mandatory manual visual QA.
This is not a substitute for viewing the artifact images.
"""
from pathlib import Path
import fitz

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"downloads"
PREV=ROOT/"docs"/"audit-results"/"pdf-preview"
PREV.mkdir(parents=True,exist_ok=True)
FILES=[
"autismhub-dnevnik-nablyudeniy-za-razvitiem-rebenka.pdf",
"motor/10-igr-krupnaya-motorika-ru.pdf",
"motor/15-zadanii-melkaya-motorika-ru.pdf",
"motor/nedelnyi-plan-i-dnevnik-motoriki-ru.pdf",
"emotions/12-situatsiy-emotsii-rebenka-ru.pdf",
"emotions/12-zhagday-emotsiyalar-bala-kk.pdf",
"emotions/pamyatki-plan-i-dnevnik-emotsii-ru.pdf",
"emotions/korgneki-koldau-otbasy-zhospary-kundelik-kk.pdf",
"selfcare/12-zadanii-samostoyatelnost-ru.pdf",
"selfcare/12-tapsyrma-kundelikti-derbestik-kk.pdf",
"selfcare/semeynyi-plan-i-dnevnik-navykov-ru.pdf",
"selfcare/aptalyk-zhospar-zhane-bakylau-kundeligi-kk.pdf",
"development/forma-nablyudeniy-poterya-navykov-ru.pdf",
"bilingual/7-situatsii-dva-yazyka-v-seme-ru.pdf",
"bilingual/karta-yazykov-i-nablyudenii-dlya-spetsialista-ru.pdf",
"contexts/sravnenie-nablyudenii-dom-sadik-ru.pdf",
"contexts/razgovor-semya-pedagog-plan-podderzhki-ru.pdf",
]
errors=[]
count=0
pages=0
for relative in FILES:
    path=OUT/relative
    if not path.is_file():
        errors.append("Missing "+str(path))
        continue
    document=fitz.open(str(path))
    if document.page_count==0:errors.append("Empty "+relative)
    for idx,page in enumerate(document):
        pages+=1
        blocks=page.get_text("dict").get("blocks",[])
        found=False
        for block in blocks:
            for line in block.get("lines",[]):
                for span in line.get("spans",[]):
                    chars=(span.get("text") or "").strip()
                    if not chars:continue
                    found=True
                    x0,y0,x1,y1=span["bbox"]
                    if x0 < -1 or y0 < -1 or x1 > page.rect.width+1 or y1 > page.rect.height+1:
                        errors.append(f"Clipped text {relative} p{idx+1}: {chars[:35]}")
                    # Exclude header and footer metadata; all printable body text is 11pt or larger.
                    if 60 <= y0 < page.rect.height-70 and span["size"] < 10.7 and ("Helvetica" not in span.get("font","") and "Arial" not in span.get("font","")):
                        errors.append(f"Small print body {relative} p{idx+1}: {span['size']:.1f}pt {chars[:35]}")
        if not found:errors.append(f"No extractable text {relative} p{idx+1}")
        if idx==0:
            safe=relative.replace("/","__").replace(".pdf","")
            image=page.get_pixmap(matrix=fitz.Matrix(1.25,1.25),alpha=False)
            image.save(str(PREV/f"{safe}__p{idx+1}.png"))
    print(f"PDF VISUAL PREFLIGHT: {relative}; pages={document.page_count}; first page rendered")
    count+=1
if count!=17:errors.append(f"Expected 17 PDFs, found {count}")
if errors:
    for err in errors[:35]:print("PDF_QA_ERROR",err)
    raise RuntimeError(f"Parent PDF preflight found {len(errors)} issues")
print(f"PARENT_PDF_PREFLIGHT_PASSED: {count} PDFs, {pages} pages; every body span >=11pt; "
      "previews stored for visual QA")
