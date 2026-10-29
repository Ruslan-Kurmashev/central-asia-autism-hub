# Information Architecture and Navigation

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 03 - Information Architecture and Navigation
**Status:** Approved for the first website version  
**Version:** 1.3
**Decision date:** 28 July 2026
**Last updated:** 26 October 2026

## 1. Purpose

This document defines the approved site map, primary navigation, multilingual route structure, and content relationships for the first public version of Autism Hub Kazakhstan.

The architecture must:

- serve parents and families first;
- make reviewed information easy to browse without personalised questioning;
- clearly separate project-authored content from external resources;
- support Russian, Kazakh, and English;
- keep scientific interpretation, education, professional content, and organisational information distinct;
- remain simple enough for a static Astro website without accounts, a database, or a backend.

Owner-approved scoped extension (2026-10-28): under the parent-development article, a standalone three-language first-stage M-CHAT-R route at `/kz/{language}/tools/mchat-r/` may operate only when licensed for website and source redistribution and medically checked. The initial questionnaire's 20 answers remain in browser memory only. The only printable output is the initial score, whether Follow-Up is needed, and general next steps. The initial form must never be labelled a completed two-stage M-CHAT-R/F when Follow-Up is required.

## 2. Primary navigation

The approved primary navigation contains six sections.

| Russian | Kazakh | English |
|---|---|---|
| Родителям | Ата-аналарға | For Parents |
| Наука простыми словами | Ғылым қарапайым тілмен | Research Explained |
| Помощь в Казахстане | Қазақстандағы көмек | Help in Kazakhstan |
| Обучение | Оқу | Learning |
| Специалистам | Мамандарға | For Professionals |
| О проекте | Жоба туралы | About |

Kazakh interface wording must receive native-language review before public launch.

The language selector displays:

```text
ҚАЗ · РУС · ENG
```

The visible labels are intentionally compact. Each language link retains its full language name as an accessible label.

## 3. Approved site map

```text
Home
│
├── For Parents
│   ├── Understanding autism
│   ├── Child development
│   ├── Assessment and diagnosis
│   ├── Approaches to support
│   ├── Everyday family life
│   └── Frequently asked questions and glossary
│
├── Research Explained
│   ├── New research explainers
│   ├── How to read research
│   ├── Causes and biology
│   └── Research in Kazakhstan
│
├── Help in Kazakhstan
│   ├── Where to begin
│   ├── Assessment and ongoing support
│   ├── Kindergarten and school
│   ├── Rights and social support
│   ├── Organisations and services
│   └── How to check a service
│
├── Learning
│   ├── Autism School Kazakhstan
│   ├── Learning for parents
│   ├── Learning for professionals
│   ├── Events and webinars
│   ├── External courses
│   └── How to choose learning
│
├── For Professionals
│   ├── Guidelines and standards
│   ├── Communication with families
│   ├── Assessment context
│   ├── Evidence-informed support
│   ├── Ethics and safety
│   └── Practice tools and workflows
│
└── About
    ├── Project overview: mission, need, offers, principles, vision and collaboration
    ├── Our team
    ├── Our experts
    ├── Contact
    └── Project policies (editorial, medical boundaries, privacy, accessibility, corrections)
```

## 4. Homepage structure

The current homepage presents the platform in the following order:

1. A family-oriented hero and navigation to the core site sections.
2. **Kazakhstan events and announcements**: a distinct noticeboard for up to four editorially verified upcoming webinars, events, courses and public opportunities. An honest empty state is shown until real events have been checked.
3. **Latest on AutismHub**: six actual published articles from varied site sections, displaying category, appropriate cover, article summary and publication date.
4. The existing information-source and editorial principles block, followed by footer policy links.

The event board uses an independent structured registry with the actual organiser, primary URL, start and expiry dates, format, audience, cost and three checked language descriptions. It is NOT a register of project-authored publications. Past events are hidden on build, and browser code suppresses items which expire between site builds. A listing does not imply that AutismHub endorses the event, the provider or any services. Users can propose events via the single project contact page. No booking, personal-data collection or payment functionality is introduced.

The updates area only includes actually published content, excludes pending translations and drafts, and balances categories so one large batch does not dominate. It is not a chronological site changelog.

The primary homepage action is:

> Start with essential information

Secondary actions are:

> Resources for parents
>
> For professionals

The first viewport must not contain diagnostic questions, symptom scoring, urgent marketing language, or an excessive number of competing actions.

A service map, provider catalogue, and location-based navigation are deferred until there is enough verified Kazakhstan-specific information to make them useful and maintainable.

## 5. For Parents

The For Parents landing page is the primary content-library entry point.

The current parent catalogue has five top-level topic groups on one landing page: Understanding autism, Child development, Assessment and diagnosis, Approaches to support, and Eating and feeding. Each group contains:

- a short, plain-language explanation;
- available reviewed resources;
- links to related content;
- a clear indication when additional material is in preparation.

With only 8–12 launch resources, separate category pages should not be generated merely to create empty navigation depth. Dedicated category pages may be introduced when the content volume supports them.

### 5.0. Combined assessment and diagnosis route (29 October 2026)

The former separate parent group `After assessment and diagnosis` is merged into `Assessment and diagnosis` on the same landing page. This is an information-architecture change, not a change to medical, educational, or social-care pathways.

The combined group contains the original four Russian assessment articles followed by two post-assessment articles: `after-autism-assessment-kazakhstan` and `first-30-days-after-autism-diagnosis-kazakhstan`. It now shows six Russian articles, while Kazakh and English show only their four genuinely published assessment/diagnosis articles. The order is controlled by the existing topic IDs, not publication dates. Original article URLs, metadata, translation status, publication dates, and content remain unchanged.

No empty after-diagnosis accordion should remain in RU, KK, or EN. The implementation is in `src/pages/kz/[lang]/[section]/index.astro` and the rendered group/count/order assertions are in `scripts/check-user-journeys.mjs`. See `docs/decisions/2026-10-29-parent-assessment-merge.md`.

### 5.1. Nested navigation for approaches to support (26 October 2026)

The parent topic **Approaches to support** is a single top-level expandable group, containing ten nested expandable groups on the same landing page: choosing support, communication, behaviour and learning, play and development, sensory support, daily living, movement, psychological help, family support, and other methods with their limitations.

Each published article is assigned to exactly one subgroup using its stable `translationKey`, not its language-specific slug. Nested groups expose published articles in their matching language only. No extra routing tier, duplicate cards across subgroups, automatically invented translations, or content rewrites are introduced by this navigation change.

On 29 October 2026, the owner approved one **uniform numbered article list per support subgroup**, without a separate primary/detailed links block. Each published article uses the same thumbnail, title, summary, publication date and navigation affordance, in the existing curated order. The `primaryKeys` classification remains historical editorial data only and does not change the visual hierarchy. The current image assets must be used where licensed and available; missing or reused cover images are a release QA issue, not grounds for inventing illustrations.

The initial allocation and curation are recorded in `docs/audit/parent-support-taxonomy-2026-10-26.md` and `docs/audit/parent-support-consolidation-stage1-2026-10-26.md`. The subsequent ten-article consolidation is documented in `docs/audit/parent-support-merges-2026-10-26.md`. The proposed current structure retains 45 parent support articles (36 primary, 9 supplementary) in ten subgroups. Ten source articles are preserved in Git as drafts; ten accessible static HTML route pages retain their historical URLs and point to the six destination articles. The source taxonomy for UI rendering remains `src/data/parent-support-subgroups.ts`. Before release, medical source-to-claim review, translation parity, link and redirect QA, and human editorial sign-off are required.

### 5.2. Editorial order for the autism-basics parent articles (28 October 2026)

The parent subgroup **Understanding autism: the basics** is a sequenced reading guide, not a chronological news feed. Its ten published articles are ordered by stable `translationKey`, identically in Russian, Kazakh and English, regardless of language-specific slug, `publishedAt`, `originalPublishedAt`, `displayPublishedAt` or `updatedAt`. Keep the existing multilingual glossary immediately after the opening article as an optional reference, not an eleventh substantive article.

The parent-first sequence is:
1. What is autism? (`parents-what-is-autism`).
2. Autism myths and facts (`parents-autism-myths-facts`).
3. How autistic children communicate (`parents-autism-communication-speech-gestures-echolalia`).
4. Sensory differences in autism (`parents-autism-sensory-differences`).
5. Co-occurring conditions and health (`parents-autism-co-occurring-conditions`).
6. Stimming and repetitive actions (`parents-autism-stimming-repetitive-actions`).
7. Meltdown and shutdown (`parents-autism-meltdown-shutdown`).
8. Neurodiversity and respectful language (`parents-autism-neurodiversity-language`).
9. Autism in girls (`parents-autism-in-girls`).
10. Why autism develops (`parents-autism-causes`).

Rationale: start with definition and misconception prevention, then everyday communication and sensory experience, separate medical concerns, self-regulation and overload, before advanced social, subgroup-specific and causal explanations. A reading sequence does not replace urgent professional assessment, and links to medical red flags remain in their articles. The list and comparator are implemented in `src/data/parent-autism-basics-reading-order.mjs` and verified against the rendered three-language parent lists by `npm run check:parent-basics-order`. Article dates and metadata do not change.

## 6. Research Explained

Research Explained is a separate editorial section for plain-language interpretation of scientific articles, research findings, systematic reviews, and professional guidelines.

It serves parents first while remaining useful to professionals and partners.

### 6.1. Standard research explainer structure

Each explainer should answer:

1. What question did the researchers study?
2. How was the study conducted?
3. Who participated?
4. What did the authors report?
5. What are the main limitations?
6. What might the findings mean for families or practice?
7. What does the study not demonstrate?
8. Where can the original publication be found?

### 6.2. Required source information

Each explainer must identify:

- original article title;
- authors;
- journal or issuing organisation;
- publication year;
- DOI or stable source link;
- study or document type;
- sample size and relevant population characteristics, when applicable;
- explainer author;
- scientific or clinical reviewer, when required;
- publication and last-updated dates.

Research explainers must be original summaries. They must not reproduce copyrighted abstracts or present a single study as definitive clinical guidance.

Detailed evidence and review rules will be defined in the editorial, evidence, and medical safety document.

### 6.3. Active research navigation decision (26 October 2026)

The former standalone navigation groups `Evidence about support` and `Research participation` have been removed by the project owner and must not reappear as categories, empty placeholders, or automatically generated navigation blocks. This does not forbid factual discussion of intervention evidence within an appropriate existing article. Continue using the approved current science-literacy and biology material categories without recreating the removed groups. See `docs/decisions/2026-10-26-research-navigation.md`.

## 7. Help in Kazakhstan

This section explains the general support landscape in Kazakhstan without presenting an incomplete professional directory.

It may include:

- the general roles of healthcare and assessment services;
- PMPK and educational pathways;
- preparation for consultations and educational discussions;
- verified links to authoritative public, non-governmental, and family-support resources.

Each country-specific claim or external resource must have a visible verification date where appropriate.

Comprehensive city pages, service maps, provider rankings, and professional databases remain outside the initial information architecture.

## 8. Learning: educational programmes and course directory

Learning is the only place for structured education, including **Autism School Kazakhstan**, courses for parents, courses for professionals, webinars and events, external learning opportunities, and guidance on choosing quality training.

A project-owned course is not a collection of parent-facing articles. Courses need defined learning goals, a sequence of lessons, practice tasks, named editorial or educator responsibility, and a transparent way to check learning when appropriate. Courses and external listings must not imply clinical certification or accreditation without evidence.

External course listings are restricted to verified free-to-learn offerings. Each listing records title, organiser, audience, language, format, free-access conditions, dates if relevant, destination link, last verified date, and an external-provider notice. This restriction concerns the course catalogue, not every third-party event announcement. External listings are not endorsements; do not list clinical sessions or unsupported autism “cures.”

Learning is a **process and a programme directory**, not a second professional reference library.

## 9. For Professionals: reference and practice tools

For Professionals is a **professional reference library**, not a course directory. Its subjects are:

1. Guidelines and standards.
2. Communication with families and shared decision-making.
3. Assessment, diagnostic context and tool limitations.
4. Evidence-informed methods and support.
5. Ethics, safety and confidentiality.
6. Practical workflows and checklists.

Professional reference materials must identify scope, author, source, relevant jurisdiction, revision date and important limitations. They are not training certificates, professional licences or evidence of independent accreditation.

The previous “Learning and events” professional navigation item is removed. Professional training programmes and webinars have a **single home in Learning**, with a contextual link to `/kz/{language}/learning/#professionals-learning`.

### 9.1. Avoiding duplicate content

One resource has one canonical URL and one publishing section. Link to it from other audiences where useful. For example, a parent introduction to AAC remains in Parents, the research evidence summary remains in Research Explained, an implementation checklist belongs in For Professionals and an actual sequence of AAC lessons belongs in Learning. Reusing a topic is acceptable; copying the same article body is not.

Keep stable `/kz/{language}/learning/` and `/kz/{language}/professionals/` routes for all three languages. Do not replace missing translations silently.

### 9.2. Document-only rule for Guidelines and Standards (13 October 2026)

The `Guidelines and standards` subsection is a **document reference library**, not an index of general advice articles.

- Keep `How to appraise professional autism guidelines` (`professionals-g01`) as the **first, explicit introductory exception**; its established article and URL remain unchanged.
- All following resources in this subsection must review an **identifiable document**: a named/numbered clinical guideline, Kazakhstan clinical protocol, law, order, regulation or professional standard. Show the issuing authority, identifier where one exists, scope, version/status and primary source; disclose when official currency cannot be independently verified.
- Organise international clinical guidance **by issuing country** (the United Kingdom, United States, Australia, Canada, France and New Zealand as of 13 October 2026), with a country detail page listing identifiable documents. Leave the guideline-appraisal introduction at the top of Guidelines and Standards. Existing NICE CG128, CG170 and CG142 articles belong to the UK list with their **unchanged canonical URLs**, never duplicated in the parent listing.
- A document gets an AutismHub detail link only if a published, reviewed-language article actually exists. For countries where AutismHub reviews are not yet published, link directly to the verified issuing organisation's original document and explicitly mark the AutismHub review as in preparation. Do not create empty internal review pages or imply an English-language primary source has been translated.
- Maintain **one unified five-category Kazakhstan document catalogue** containing clinical protocols, laws, orders and standards. Do not create a separate Kazakhstan clinical-protocol group or duplicate its link on the parent page. Each Kazakhstan document retains one canonical article URL.
- Do not duplicate the 25 existing Kazakhstan document reviews or change their five-category classification.
- `Multidisciplinary coordination and family referral pathways` (`professionals-g03`) is a planned **practice-tools** resource, not a standards reference. It should appear under `Workflows and tools`, with no suggestion that it is already published.
- Other general workflows, checklists and family communication guidance belong in their respective professional categories, with links to source documents rather than repeated document reviews.
- Preserve equivalent Russian, Kazakh and English navigation entries; publication is shown only where that language's content actually exists. No empty professional-standards navigation group should be created.

### 9.3. Professional family communication content programme (approved 13 October 2026)

`Working with families` is a six-article **practice-focused professional section**, separate from the official document library. The planned sequence and canonical translation keys are:

1. `professionals-c01` - Discussing screening results with families (RU published 2026-10-13).
2. `professionals-c02` - Shared decision-making and informed consent.
3. `professionals-c03` - Information sharing among families, healthcare and schools.
4. `professionals-c04` - Communicating an autism diagnosis to families.
5. `professionals-c05` - Culturally, linguistically and socially responsive communication.
6. `professionals-c06` - Addressing disagreement, distress and conflict with families.

**Required editorial contract for each article:** a precise role and scope statement, evidence and official-source links, practical step-by-step process, usable example language, common mistakes, at least one worked situation, an actionable checklist/template, explicit boundaries for Kazakhstan, privacy and consent safeguards where applicable, a distinct editorial cover, and a review date. Clearly label examples and original AutismHub workflow templates rather than attributing them verbatim to clinical guideline bodies. Cross-link legal and international source documents without reproducing their article bodies. Keep KK/EN links in preparation until checked translations are published. Develop and approve articles sequentially.

### 9.4. Professional assessment and diagnosis: practical toolkit architecture (approved 14 October 2026)

Replace the former four-item flat assessment plan with **five dedicated subgroups and twelve source-backed professional articles**. There is one assessment toolkit landing route per locale (`/kz/{locale}/professionals/assessment/`) and one route per subgroup:

1. `early-identification` (two articles: early concerns/referral; screening and follow-up).
2. `instruments` (three: choosing tools; M-CHAT-R/F; ADOS-2/ADI-R/CARS-2).
3. `comprehensive-assessment` (three: developmental history, observational evidence, integrated clinical assessment).
4. `differential-assessment` (two: differential diagnosis; co-occurring conditions).
5. `reporting-followup` (two: professional diagnostic reports; uncertainty/second opinions/reassessment).

Keep **one canonical registry** in `src/data/professional-assessment.ts`. An article is linked only after a locale-specific, source-reviewed page with the corresponding `professionals-a01` through `professionals-a12` translation key exists. Never display a placeholder as a published article or send Kazakh/English readers silently to Russian editorial content.

Maintain ten professional downloadable resource records, initially with only **three actually released Russian resource sets**:

- an original early identification and referral flowchart (PDF);
- a source-linked comparison of instruments (PDF and editable CSV);
- a non-diagnostic developmental history interview template (editable DOCX and PDF).

Remaining templates (pre-assessment checklist, structured observation, differential diagnosis map, co-occurrence checklist, team discussion, diagnostic reporting and reassessment) must remain visibly marked as **in preparation** until file contents exist and pass review. Files are reproducibly generated by `scripts/build-professional-assessment-downloads.py` into `public/downloads/assessment/` before Astro build (six formats/files in the first three resource sets, including a comparison XLSX), and checked by `scripts/check-professional-assessment.mjs`. No registration, uploads or patient data collection.

**Clinical and copyright boundaries:** Files are editorial workflow aids, not validated screening or diagnostic scales and not replacements for mandatory Kazakhstan forms. Only link to official M-CHAT-R/F, ADOS-2, ADI-R or CARS-2 materials; never re-host copyrighted items or scoring manuals without authorisation. Assessment requires professional competence and applicable local clinical/legislative requirements. Cite primary sources, indicate revision/version and explicitly delimit what has and has not been translated, reviewed and released. Avoid overlap with the separate support/intervention `Workflows and tools` section.

### 9.4.1. Assessment library content release (14 October 2026)

The **full first Russian-language article set, A01-A12, is now authored**: early signs and referral; screening; choosing methods; M-CHAT-R/F; ADOS-2/ADI-R/CARS-2; developmental history; observational evaluation; comprehensive clinical assessment; differential diagnosis; co-occurring conditions; diagnostic report; diagnostic uncertainty, second opinion and reassessment. Each article has its own cover, sources, methodological limitations and practical checklists or tables. Kazakh and English entries remain unpublished and must not link to Russian articles as substitutes.

The downloadable library contains **ten authored Russian sets / 21 build-generated files**: referral pathway (PDF); instrument comparison (PDF, XLSX, CSV); developmental history (DOCX, PDF); pre-assessment checklist (PDF, DOCX); structured observation (PDF, DOCX); differential map (PDF, DOCX); co-occurring-conditions checklist (PDF, DOCX, 14-day sleep CSV); multidisciplinary meeting (PDF, DOCX); diagnostic report outline (PDF, DOCX); reassessment plan (PDF, DOCX). The first four sets are generated by `scripts/build-professional-assessment-downloads.py`; the remaining six by `scripts/build-professional-assessment-toolkit-v2.py` from `scripts/assessment-practical-tool-specs.json`. A separate collapsed official-resources list links to publisher-hosted Autism CRC, WHO, CDC and M-CHAT materials without rehosting or relabeling these as Kazakhstan protocols. Provenance, rights and resource boundaries: `docs/assessment-download-provenance.md`.

### 9.5. Simplified white-card assessment flow and separate resource library (approved 14 October 2026)

The assessment landing page (`/kz/{locale}/professionals/assessment/`) is a **navigation aid**, not a clinical decision tree:

- exactly five full-card links in registry order, rendered in a vertical connected flow with four downward arrows;
- white cards, one brand-blue icon family, blue border/glow for hover and keyboard focus, not five distinct section colours;
- cards display one brief localized description plus counts of **actually published articles** and **released download sets** for that locale;
- one white call-to-action underneath links to the standalone resource library, followed by one concise scope warning;
- do **not** repeat all twelve article entries, all ten planned downloads, copyright explanations and source lists on the landing page.

Five group pages preserve the stable existing routes (`/kz/{locale}/professionals/assessment/{group}/`). They display only that group's two or three article entries, its genuinely released files and short previous/next navigation. Unreleased translations remain unlinked. Only released files appear in a group's downloadable list.

The **standalone tools library** is `/kz/{locale}/professionals/assessment/tools/`, with compact released-file rows, category + title search filters and a collapsed list of forthcoming files. Current Russian release: 10 tool sets with 21 generated download files; 4 publisher-hosted original external resources are linked separately. Kazakh and English do not silently link to Russian-language downloads. Version, professional scope, official instrument permissions and links to primary sources belong here rather than on the flow homepage.

Keep the canonical data registry `src/data/professional-assessment.ts` and localized UI copy `src/data/professional-assessment-ui.ts`; components are `ProfessionalAssessmentHome.astro`, `ProfessionalAssessmentGroup.astro`, `ProfessionalAssessmentTools.astro`, with shared `ProfessionalAssessmentShell.astro`. QA `scripts/check-professional-assessment.mjs` verifies all locales, route links, separated interfaces, focus behaviour and real download files.

The visible 01–05 sequence is an educational navigation order. Differential and co-occurrence assessment can occur simultaneously with other clinical steps.

## 10. About and trust pages

The main About page is a concise public overview with the mission, the need addressed, five content areas, editorial principles, a regional vision and ways to contribute. A results/impact report is not part of the main About page. Do not imply unverified results or confirmed partnerships.

Dedicated localized pages provide team profiles, confirmed expert profiles, contact routes, and the full project policies.

The experts page is a single catalog at `/kz/{language}/about/experts/` with accessible expandable cards, no standalone per-expert routes. Profiles can be listed only after participation is confirmed and the person consents to public display. Identify authorship, subject-matter consultation and independent review separately; reviewing one resource never implies a review of the whole site. An open participation invitation links to the existing contact channel without collecting personal data on the site. The policy page retains the existing anchored editorial, evidence-safety, privacy, accessibility and corrections sections.

The localized contact page is a single five-part public communication hub: one shared project inbox (shown only after its address exists), verified public social links (LinkedIn, Telegram, personal Instagram as outreach, and GitHub), expert and partnership collaboration, non-financial support with an explicit statement that donations/payments are not accepted yet, and links to transparency and safety policies. The existing public GitHub issues channel is the temporary fallback with a prominent privacy warning. No contact form, payment collection, individual team-member details, or fictional email/social links are added. Registration of a prospective Kazakhstan organisation and payment integration are future decisions.

Editorial policy, privacy, disclaimer, and contact links must also be accessible from the site footer.

Unconfirmed partnerships, unofficial roles, or unsupported status claims must not appear.

## 11. Route structure

The approved country and language roots are:

```text
/kz/ru/
/kz/kk/
/kz/en/
```

Primary section routes use stable structural segments:

```text
/kz/{language}/parents/
/kz/{language}/research/
/kz/{language}/help-kazakhstan/
/kz/{language}/learning/
/kz/{language}/learning/autism-school/
/kz/{language}/learning/parents/
/kz/{language}/learning/professionals/
/kz/{language}/professionals/
/kz/{language}/about/
/kz/{language}/about/team/
/kz/{language}/about/experts/
/kz/{language}/about/contact/
/kz/{language}/about/policies/
```

Individual article and research-explainer slugs may be localised for each language. Translations must be connected through a stable internal translation key.

The website root provides an explicit choice between Russian, Kazakh, and English. Automatic redirection is not required for the MVP.

## 12. Language switching

- The logo returns to the homepage in the current language.
- When an equivalent translation exists, switching language opens the equivalent page.
- Missing translations must never be replaced silently by content in another language.
- If a non-core translation is unavailable, the interface states that it is not yet available and offers the selected-language section landing page.
- Core pages must be available in all three languages before public launch.
- Country and language are treated as separate information fields even though Kazakhstan is the only active country in the MVP.

## 13. Navigation behaviour

- Desktop navigation shows the six approved primary sections and the language selector.
- Mobile navigation preserves the same hierarchy.
- Internal pages use breadcrumbs.
- Articles and explainers provide related-content links.
- External links are visually identified and do not appear to be internal project content.
- Footer navigation includes links to the dedicated policies page (editorial, privacy and accessibility) and to the contact page. The About dropdown contains the project overview, team, experts and contact.
- Search is not required for the MVP.
- A country selector is not required until another country version is prepared.
- Navigation must be usable with a keyboard and must not depend on hover alone.

## 14. Final decision

The approved information architecture is:

> Autism Hub Kazakhstan uses six primary sections: For Parents, Research Explained, Help in Kazakhstan, Learning, For Professionals, and About. Autism School Kazakhstan is the project-owned programme within Learning. External courses and events are listed separately, clearly labelled, and subject to inclusion and verification rules. Russian, Kazakh, and English use the same structural hierarchy.
