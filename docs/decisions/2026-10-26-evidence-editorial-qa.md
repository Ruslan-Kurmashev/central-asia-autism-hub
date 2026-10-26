# Decision: audited evidence integrity and scheduled editorial QA

- Date: 2026-10-26
- Status: approved staged process improvement
- Supersedes: the operational absence of a populated claim register and an automatic multilingual content-inventory gate
- Scope: editorial evidence register, translation structure and review deadlines

Add claim-to-source records for specific consequential claims, without treating their existence as endorsement. The initial comparisons in `docs/evidence/` remain `pending` until responsible human editor sign-off. Keep the existing whole-article human review tracker independent of the claim ledger.

Enforce structural integrity with `check:evidence-register` and `check:translation-parity`. These checks may detect metadata inconsistencies but do not establish medical, linguistic or legal accuracy.

Run a read-only weekly `reviewDueAt` inventory in GitHub Actions. Report overdue and soon-due items; never silently rewrite `publishedAt`, `updatedAt`, `translationStatus`, `sourceStatusCheckedAt` or `docs/audit/article-review-tracker.json`.

Authoritative instructions: `docs/evidence/README.md`, `docs/release-and-browser-qa.md`, `docs/04-editorial-evidence-medical-safety.md` and `AGENTS.md`.
