# Privacy review: client-side M-CHAT-R first stage

Date: 2026-10-28. Status: pre-release evaluation.

**Purpose:** allow a parent to complete a 20-item screening questionnaire and export its initial result, not submit a family history to AutismHub.

**Processed locally:** 20 yes/no answers, age in completed months, computed score, initial category, Follow-Up-needed flag, local date for printed report. No child's name, date of birth, address, identity or family history is requested.

**Processing location:** JavaScript in visitor's browser memory only. No response upload, cookies, localStorage, IndexedDB, telemetry, server API or health-data collection is implemented. Navigating away loses the entries.

**Printing:** system browser print window, with PDF option, includes only age (months), date, score, first-stage category, Follow-Up status, next-step text and copyright. No question or individual answer is printed. The saved PDF may remain on the visitor's device or print service and is under their control.

**Hosting and analytics:** GitHub Pages can process technical request metadata, including IP. The public privacy statement and any analytics must not present response collection as disabled if a new script starts capturing form events. Avoid putting answers in URLs or console logs.

**Threats and tests:** accidental server requests, page-analytics auto-collection, browser autofill history, browser extensions and printing cloud destinations, losing work on refresh, accidental shared-device disclosure, screen reader/keyboard errors, cross-language switches resetting the answers.

**Release gate:** inspect generated bundle for network endpoints; test all values 0-20, incompletes, age 16-30, reload behavior, report-only print output, mobile/desktop/keyboard, and public privacy page. Do not state legal compliance certification solely from absence of a backend.
