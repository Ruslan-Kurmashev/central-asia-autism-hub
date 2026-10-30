# Support selection translations, 30 October 2026

All six Russian articles in the Choosing and evaluating support subgroup have EN and KK translation drafts in the `src/content/pages/kz/en` and `src/content/pages/kz/kk` directories.

Twelve drafts are `draft: true` and `translationStatus: pending`. They preserve original publication dates and source lists. They are not published or externally reviewed. Source and translated heading sequences were compared automatically. Before releasing, complete Kazakh and English linguistic checks, medical and Kazakhstan legal review, and browser accessibility checks. Automated validation does not establish medical correctness or native-language review.

## Publication preflight (2026-10-30)

The owner explicitly requested publication of all twelve KK/EN translations. This establishes permission to publish once editorial gates pass. It does **not**, by itself, document that a qualified language or medical review has taken place.

Read-only checks on current `main` found:
- All six RU sources and their twelve drafts are present, with the expected common translation keys and source publication dates.
- H2-H4 hierarchy and heading counts correspond across RU/KK/EN (23, 23, 33, 35, 29 and 13 per source).
- Structured source counts and external URLs match the respective Russian sources. All numeric values present in Russian were found in each translation except a nonclinical historical decade reference in the English high-risk guide.
- Internal links across the six translated draft articles were localised, but the target pages are not live while `draft: true`.
- Important source claims concerning the 2026 Kazakhstan Law on Psychological Activity were cross-checked against Adilet (https://adilet.zan.kz/rus/docs/Z2600000332). The 2026 WHO vaccine/autism evidence overview (https://www.who.int/publications/i/item/9789240123533) and FDA's March 2026 leucovorin approval for genetically confirmed FOLR1-related cerebral folate transport deficiency (https://www.fda.gov/news-events/press-announcements/fda-approves-first-treatment-patients-cerebral-folate-transport-deficiency) were checked for scope and dates.
- This does not establish source-level verification of every clinical statement, medically accurate native Kazakh terminology, or line-by-line linguistic sign-off.

**Publication remains gated.** Do not change `translationStatus: pending` to `checked`, add `publishedAt`, or set `draft: false` without a genuine documented editorial review of each translated article. In particular, the high-risk methods guide requires clinical claim checks. The content schema deliberately rejects public pending translations. The prior successful CI checked repository integrity, not the visual layout of draft pages.

Upon documented approval, assign each translation its own actual ISO 8601 publication timestamp, keep `originalPublishedAt` and `displayPublishedAt` intact, verify all translated routes and localized link destinations at mobile/desktop widths, and confirm GitHub Pages deployment.

## Owner editorial approval for publication (2026-10-30)

After the twelve drafts and their outstanding review requirements were presented, the project owner explicitly confirmed that all twelve Kazakh and English translations had been reviewed and authorised their immediate publication. This records the responsible editor's attestation, not independent external medical, legal or native-language peer review.

Release all twelve translations of the six Choosing and evaluating support articles by changing `translationStatus: pending` to `checked` and `draft: true` to `false`. Give each translation its first publication timestamp of 2026-10-30 and retain `originalPublishedAt`, `displayPublishedAt`, the source records, risk classification, translation key and image. The `versionNote` states that AI-assisted translations were reviewed by the project editor, without claiming independent review.

After this approval, verify publication by CI, three-width Chromium visual checks and a successful GitHub Pages deployment. Claim-level evidence ledger records marked `pending` must not be changed simply because translations were approved.
