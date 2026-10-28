# Decision: three-language M-CHAT-R initial screening

**Date:** 2026-10-28
**Project:** AutismHub Kazakhstan
**Decision owner:** project owner

## Decision

The owner requested a fast, freely accessible M-CHAT online tool in RU, KK and EN, directly linked from the parent-development guide, with downloadable/printable results only (not questions and answers). On 28 October the owner stated that permission from the instrument rightsholders had been obtained and requested implementation and publication. This is an owner statement, not a licence document independently verified in this repository.

## Scope and restrictions

- The site may prepare the full 20-item first-stage M-CHAT-R using the authors' EN, Russian and Kazakh editions, preserving all wording and item order, with reverse-scored items 2, 5 and 12.
- The original second-stage Follow-Up must not be simulated as a yes/no questionnaire: it is an interviewer-administered flowchart with professional judgment in some branches. For initial scores 3-7, the site must display Follow-Up required and clearly state that the M-CHAT-R/F is incomplete.
- The tool may not diagnose or exclude autism, automatically recommend treatments or claim independent validation or native-language proofreading.
- Privacy baseline: no accounts, server submission, saved answers, query parameters, localStorage or per-answer analytics. Only score, age in completed months, date, status and general advice are printed. Client-side browser Print/Save as PDF is used.
- Preserve the original copyright notice in the questionnaire and printed result. Do not suggest that GitHub's public source files grant open-source rights to questionnaire text.
- Before public activation, obtain written scope confirmation allowing: public electronic hosting of the exact three editions, any permitted digital enhancement, use in a public GitHub repository, and results-only PDF. A general statement "permission received" does not resolve the actual scope.
- Obtain native-language and medical verification of exact wording (especially the older Kazakh edition), official scoring, Follow-Up boundaries, age restrictions, report and any local next-step guidance.
- Run type-scale, validate, specific scoring tests, browser click-path and mobile/desktop tests and verify the deployed website.

## Superseded provisions

This scoped decision amends the previous unconditional "no screening tool" MVP restriction in AGENTS.md, docs/03, docs/04, docs/05 and docs/07, but **does not** authorise an unreviewed clinical launch or any database, account, persistent data collection or diagnostic service.

**Status:** implementation staged in draft PR #203; clinical and licence gates outstanding until substantiated and reviewed.
