# Information Architecture and Navigation

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 03 - Information Architecture and Navigation
**Status:** Approved for the first website version  
**Version:** 1.2
**Decision date:** 28 July 2026
**Last updated:** 11 October 2026

## 1. Purpose

This document defines the approved site map, primary navigation, multilingual route structure, and content relationships for the first public version of Autism Hub Kazakhstan.

The architecture must:

- serve parents and families first;
- make reviewed information easy to browse without personalised questioning;
- clearly separate project-authored content from external resources;
- support Russian, Kazakh, and English;
- keep scientific interpretation, education, professional content, and organisational information distinct;
- remain simple enough for a static Astro website without accounts, a database, or a backend.

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
│   ├── Evidence about support
│   ├── Research in Kazakhstan
│   └── Research participation (future phase)
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

The homepage presents the platform in the following order:

1. a compact beta-status strip;
2. the platform purpose, a concise content boundary, and focused entry actions;
3. six permanent primary sections presented with visual hierarchy: For Parents and Help in Kazakhstan are prominent, Research Explained and Learning are secondary, and For Professionals and About are compact;
4. trust principles: plain language, verifiable sources, visible update dates, Kazakhstan context, and clear medical boundaries;
5. footer access to editorial, privacy, accessibility, and contact information.

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

During the initial launch, the six parent topics appear as sections on one landing page. Each section contains:

- a short, plain-language explanation;
- available reviewed resources;
- links to related content;
- a clear indication when additional material is in preparation.

With only 8–12 launch resources, separate category pages should not be generated merely to create empty navigation depth. Dedicated category pages may be introduced when the content volume supports them.

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

External opportunities include title, organiser, audience, language, format, cost, dates if relevant, destination link, last verified date, and a clear external-provider notice. External listings are not endorsements; do not list clinical sessions or unsupported autism “cures.”

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

## 10. About and trust pages

The main About page is a concise public overview with the mission, the need addressed, five content areas, editorial principles, a regional vision and ways to contribute. A results/impact report is not part of the main About page. Do not imply unverified results or confirmed partnerships.

Dedicated localized pages provide team profiles, confirmed expert profiles, contact routes, and the full project policies.

The experts page is a single catalog at `/kz/{language}/about/experts/` with accessible expandable cards, no standalone per-expert routes. Profiles can be listed only after participation is confirmed and the person consents to public display. Identify authorship, subject-matter consultation and independent review separately; reviewing one resource never implies a review of the whole site. An open participation invitation links to the existing contact channel without collecting personal data on the site. The policy page retains the existing anchored editorial, evidence-safety, privacy, accessibility and corrections sections.

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
