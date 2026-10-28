# M-CHAT-R/F preview, licensing and safety gates

Date: 2026-10-28.

User request: a fast, always-available RU/KK/EN M-CHAT-R/F, linked from a parent article, printable as PDF containing only results, never questions or answers.

This draft PR includes three Astro static routes at /kz/{locale}/tools/mchat-preview/ with demo preparation, disabled question layout and sample report. The print dialog can Save as PDF. The print sheet explicitly says that screening was not performed and contains no real score. A labelled demonstration link is proposed in the Russian source article. Kazakh and English article links require a human language check.

No copyrighted M-CHAT-R/F questions, answers, scoring rules, follow-up forms, personal information capture, database, accounts or analytics changes are implemented. The preview is not a medical or screening service.

Before activating the real questionnaire: (1) obtain a written electronic licence from the instrument copyright owners permitting website use, Follow-Up, the chosen RU/KK/EN translations and printable result-only reports; (2) human clinical and bilingual review of licensed items and instructions, including Kazakh; (3) clinical scoring and Follow-Up decision-tree test fixtures; (4) update and approve AGENTS.md, information architecture, editorial-medical and privacy policy, technical plan, public privacy notice and formal decision record; (5) test confidentiality of in-browser responses, no URL/analytics leakage, printing, A4 output, Unicode and accessible keyboard interactions; (6) validate and visually inspect all language routes and 360/768/1440 px snapshots; (7) publish only after confirmed license, privacy/legal approval and final QA.

Official rights guidance: https://www.mchatscreen.com/mchat-rf/ (contact: mchatscreen2009@gmail.com). No assumption is made that non-profit status permits reposting the instrument.

Current output: design prototype ONLY. Save as PDF uses the browser print dialog, not one-click binary file download.

## Implementation update

The project owner reports having obtained permission for M-CHAT-R/F, but the permission text and its precise scope have not yet been independently inspected. The electronic first-stage questionnaire now uses the author-published RU/KK/EN texts, requires all 20 answers and applies original scoring with reversed items 2, 5 and 12. It does not automate the second-stage Follow-Up. Initial results of 3-7 are pending a proper Follow-Up interview. The report-only PDF contains no items or individual answers. Activation is conditional on permission scope, bilingual and clinical review, approved privacy changes and the final tests. No diagnostic claims are made.
