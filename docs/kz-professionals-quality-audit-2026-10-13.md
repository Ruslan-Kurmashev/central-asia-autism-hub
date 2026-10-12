# Kazakhstan professional document library: editorial and technical QA

**Review date:** 2026-10-13

**Scope:** 25 published Russian-language document overviews in `src/content/pages/kz/ru/kz-{education,healthcare,psychology,social,rights}-*.md`; five index categories under `/kz/ru/professionals/kazakhstan-documents/`; Kazakh and English category placeholders.

## 1. What was checked

- All 25 source files are present under their intended topic group: 8 education, 5 healthcare, 3 psychological practice/qualifications, 5 social support, 4 rights/personal data/inclusion policy.
- Each of the 25 entries has a document passport, distinct slug and translationKey, author/editor and review date, limitations, source bibliography, locally hosted article-specific SVG and alt text.
- The published route for each document is linked from the correct category, and the article now links back through its actual category and Kazakhstan index.
- Existing published RU article links are not incorrectly repurposed for the incomplete KK/EN translations.
- Directory counts reflect actual publication: RU 25/25; KK 0/25 and EN 0/25 at this stage. Russian plural forms and descriptions distinguish published content from a publication roadmap.
- Static accessibility, internal links and typography are tested in the established GitHub Actions pipeline.
- Mobile-specific CSS now wraps long legal document titles and provides horizontal scrolling within narrow legal comparison tables. **This is a code-level safeguard, not proof of real-device visual testing.** A future browser-based viewport audit at 320, 375, 390, 768 and 1024 CSS px is still advisable.

Permanent test: `npm run check:kz-professional-library`. It validates generated pages and source metadata; it does not certify legal correctness.

## 2. Legal source checks conducted

The following **specific claims** were compared against primary documents accessible in the Republic of Kazakhstan's legal information system (not a full line-by-line legal audit):

| Subject | Primary document | Verified scope |
| --- | --- | --- |
| Child rights | `Z020000345_` | Article 11 about expression and participation, article 31 about the rights and participation of children with disabilities. |
| Personal data | `Z1300000094` | Article 8 consent and the 15-working-day handling of withdrawal; article 19-1 automated decisions and the need for individual lawful basis and notice. |
| Paediatric care | `V2500035745` | Amendment to original 2022 Order `ҚР ДСМ-25`; M-CHAT-R annex; first screening ages 16-30 months and the low/medium/high risk workflow. |
| Social services | `K2300000224` | Article 132 distinguishes guaranteed and above-guaranteed special social services. |
| CRPD | `Z1500000288` | Ratification law and published convention text, including statement of entry into force for Kazakhstan on 21 May 2015. |
| Inclusive policy | `P2400001143` | 2025-2030 document is a *plan*; 80% 2030 target for pre-school accessibility is not an achieved outcome. |
| Psychological practice | `Z2600000332` | Article 22 defers article 17 (certification) to 1 January 2028; article 21 creates registration transition. |
| Medical-social assessment | `V2300032922` | Order No. 260 is about medical-social expertise, not clinical diagnosis; functional limitation and procedural provisions apply. |
| Interagency standards | `V2400034117` | Correct joint-order ministries/numbers 49/54/7 and registration No. 34117. |

Official act identifiers are more stable than unverified news summaries. Some Adilet pages temporarily time out or block remote crawlers. **No claim that every provision of all 25 articles has received independent legal review is made.**

## 3. Corrected defects

1. In the Russian catalog, 25 published article reviews were incorrectly called "documents in the plan"; descriptions and Russian numerical forms were corrected.
2. Article breadcrumb and footer return links previously skipped the five categories and led straight to the general Professionals section. The category is now derived from the article's translationKey.
3. Narrow screens could overflow on long legal names and tables. Scoped responsive styles added without overriding the project's fixed typography tokens.
4. Citation metadata for original paediatric care Order `ҚР ДСМ-25` incorrectly declared publicationYear **2025**, while the official underlying order was dated **2022** (and its 2025 amendment is a separate act). Metadata corrected to 2022.

## 4. Residual verification risks

- The **2021 Kazakhstan autism clinical protocol** is reproduced by a professional secondary source (MedElement). Its current status in the **official current Ministry of Health clinical-protocol registry has not been independently confirmed**. The article prominently discloses this; do not present it as officially confirmed latest mandatory guidance.
- Specific provisions and effective dates can change. This review is not a substitute for qualified Kazakhstan legal/clinical peer review of every line in 25 documents.
- A successful automated external-link check reports that no definitive 404/410 responses were found among checked URLs; inconclusive remote-site responses remain inconclusive, not "verified active".
- No real-mobile-device or headless screenshot pass is documented here. Perform one before the production-domain switch.

## 5. Maintenance

For a new or amended act, confirm the official act identifier, current text, history, effective date and applicable audience. Revise the relevant standalone review and its `updatedAt`/`versionNote`/`reviewDueAt`, and update any quoted legal requirements. Run `npm run validate` and document significant changes in the PR.
