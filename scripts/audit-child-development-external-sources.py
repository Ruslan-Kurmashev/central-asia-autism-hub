#!/usr/bin/env python3
"""Non-blocking external citation health report for all 12 child-development articles.

HTTP 403/429, robots restrictions, timeouts, paywalls and anti-bot responses are
NOT automatically classified as broken. Network errors require manual review.
Outputs a machine-readable JSON and short markdown report for maintainers.
"""
from __future__ import annotations
import concurrent.futures
import datetime as dt
import json
import re
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/"src"/"content"/"pages"/"kz"/"ru"
FILES=[
"development-milestones","when-to-discuss-development","child-development-home-observation",
"speech-language-understanding-development","everyday-communication-support-at-home",
"how-child-play-develops-parents-participation","home-motor-and-fine-motor-practice",
"child-emotion-regulation-support-at-home","child-daily-independence-practical-guide",
"child-loss-of-acquired-skills","bilingual-family-speech-language-development",
"child-different-behaviour-home-kindergarten",
]
OUT=ROOT/"docs"/"audit-results"
OUT.mkdir(parents=True,exist_ok=True)

by_url=defaultdict(list)
for i,filename in enumerate(FILES,1):
    f=ART/(filename+".md")
    text=f.read_text(encoding="utf-8")
    front=text.split("---",2)[1]
    for url in re.findall(r"(?m)^\s+url:\s*[\"']?(https?://\S+?)\s*[\"']?\s*$",front):
        by_url[url].append(i)

def check_one(url):
    request=urllib.request.Request(url,method="HEAD",headers={
        "User-Agent":"AutismHub-Citation-Audit/1.0 (educational site; no scraping)",
        "Accept":"text/html,application/pdf,*/*"
    })
    try:
        with urllib.request.urlopen(request,timeout=8) as resp:
            status=resp.status
            dest=resp.url
    except urllib.error.HTTPError as exc:
        status=exc.code
        dest=url
        if status in (400,405,501):
            # HEAD may be blocked on live source sites.
            try:
                req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (AutismHub citation QA)","Range":"bytes=0-100"})
                with urllib.request.urlopen(req,timeout=8) as resp:
                    status=resp.status
                    dest=resp.url
            except urllib.error.HTTPError as e2:
                status=e2.code
            except Exception:
                return {"url":url,"status":"review","code":status,"note":"HEAD blocked; GET unavailable"}
    except Exception as exc:
        return {"url":url,"status":"review","code":None,"note":type(exc).__name__}
    if 200<=status<400:
        category="reachable"
    elif status in (401,403,407,408,409,425,429,451):
        category="restricted"
    elif status in (404,410):
        category="candidate_broken"
    else:
        category="review"
    return {"url":url,"status":category,"code":status,"final_url":dest}

with concurrent.futures.ThreadPoolExecutor(max_workers=9) as pool:
    checks=list(pool.map(check_one,by_url))
for item in checks:
    item["articles"]=by_url[item["url"]]
counts=Counter(i["status"] for i in checks)
now=dt.datetime.now(dt.timezone.utc).isoformat()
payload={
 "date_utc":now,"files":len(FILES),
 "references_total":sum(len(v) for v in by_url.values()),
 "unique_urls":len(by_url),
 "counts":dict(counts),"results":checks,
 "interpretation":"Only 404/410 are candidate broken; restricted/timeouts are not proof of a broken source.",
}
(OUT/"child-development-external-sources.json").write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
lines=[
"# Проверка внешних источников: раздел «Развитие ребёнка»",
"",
f"Время UTC: {now}. Статей: {len(FILES)}. Ссылок: {sum(len(v) for v in by_url.values())}. Уникальных: {len(by_url)}.",
"",
f"HTTP-доступны: {counts['reachable']}; ограничены: {counts['restricted']}; возможная ошибка 404/410: {counts['candidate_broken']}; требуется проверка: {counts['review']}.",
"",
"HTTP 403/429 и тайм-аут не доказывают, что ссылка не работает в браузере.",
"",
]
for item in checks:
    if item["status"]!="reachable":
        lines.append(f"- [{item['status']}] {item.get('code','?')}: {item['url']} (статьи {','.join(map(str,item['articles']))})")
(OUT/"child-development-external-sources.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
print(f"EXTERNAL_SOURCE_QA: 12 articles; {payload['references_total']} citation entries; "
      f"{len(by_url)} unique URLs; reachable={counts['reachable']}; "
      f"restricted={counts['restricted']}; potential_404_410={counts['candidate_broken']}; "
      f"needs_manual_review={counts['review']}")
for item in checks:
    if item["status"]=="candidate_broken":
        print(f"EXTERNAL_SOURCE_POSSIBLE_BROKEN {item['code']} {item['url']}")
