# M-CHAT-R release readiness: first-stage questionnaire and parent-readable PDF

Date: 2026-10-28. Release candidate PR: #204. Status: **not publicly released / not clinically signed off**.

## Scope implemented

- The complete original 20-item first-stage M-CHAT-R in RU, KK and EN, statically hosted in Astro. The live Follow-Up interview is **not** implemented.
- Scores 0 through 20 computed locally. Items 2, 5, 12 are reverse scored. The code rejects incomplete answers and ages outside 16–30 months.
- Exactly three initial outcome interpretations: 0–2 low, 3–7 Follow-Up needed (M-CHAT-R/F remains incomplete), 8–20 positive initial screen warranting developmental evaluation and early-intervention eligibility assessment.
- All three outcomes have an accessible, parent-readable explanation and specific next steps, verified as present in screen text and A4 print output: what the result means, what to do, where to seek help in Kazakhstan and how to prepare for an appointment.
- Technical score is secondary to parent actions. The report contains date, age in months, score, Follow-Up status, general explanation and copyright notice, **not** the original questions or individual answers.
- Local, volatile browser-only answers. No accounts, database, analytics events for answers, local storage or server-side respondent data.
- Contextual links from the matching RU, KK and EN parent-development articles. Public privacy policy updated for all three languages.

## Technical QA

- Automated scoring tests cover all 21 possible totals and incomplete answers. Chromium exercises every score from 0–20 on each of RU/KK/EN at 360/768/1440 px.
- Verify category boundaries 2→3 and 7→8, full-screen guidance and PDF guidance parity, local Kazakhstan help link, 20 questions, 40 answer controls and no horizontal overflow.
- Generate boundary-case PDFs per language for scores 0, 2, 3, 7, 8, 20. Verify all are A4, one page, with no original question or item answer embedded. Do not claim that only checking 0/3/20 tests all 21 totals.
- Required project CI: `npm run check:type-scale`, `npm run validate`, browser QA and link diagnostics on the final PR commit. Review PDFs and screenshots, including line breaks and Kazakh characters.

## Outstanding legal and clinical gates

Project owner reported obtaining permission from M-CHAT-R/F rightsholders. **The permission text and its exact scope have not been inspected in this repository.** Website hosting, public GitHub source distribution, all chosen linguistic versions, digital scoring and result-only PDFs must be covered. The authors expressly prohibit republishing the instrument on a website without an agreement: https://www.mchatscreen.com/mchat-rf/ .

The exact approved Kazakh edition and Russian edition, translations of explanatory advice, Kazakhstan healthcare referral text and algorithm still require independent qualified language and medical review. Do not label AI-authored translation as human checked. Do not declare a diagnostic instrument, a completed Follow-Up or formal clinical certification. Stop public merge/deployment until these gates are documented.

M-CHAT-R/F initial scoring source: https://www.mchatscreen.com/mchat-rf/scoring/
Kazakhstan referral context: https://old.adilet.zan.kz/rus/docs/V2500035745
