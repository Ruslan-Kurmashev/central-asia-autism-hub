# Information Architecture and Navigation

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 03 — Information Architecture and Navigation  
**Status:** Approved for the first website version  
**Version:** 1.0  
**Decision date:** 28 July 2026

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
Русский · Қазақша · English
```

## 3. Approved site map

```text
Home
│
├── For Parents
│   ├── Understanding autism
│   ├── Child development and early questions
│   ├── Assessment and diagnosis
│   ├── After an assessment or diagnosis
│   ├── Everyday support
│   ├── Kindergarten, school, and inclusion
│   ├── Interventions, evidence, and safety
│   └── Parent and family wellbeing
│
├── Research Explained
│   ├── New research
│   ├── Assessment and development
│   ├── Genetics and biology
│   ├── Communication and behaviour
│   ├── Support and interventions
│   ├── Education and inclusion
│   └── Reviews and guidelines
│
├── Help in Kazakhstan
│   ├── Overview of the support pathway
│   ├── Healthcare and assessment
│   ├── PMPK and educational pathways
│   └── Verified external resources
│
├── Learning
│   ├── Autism School Kazakhstan
│   ├── Courses for parents
│   ├── Courses for professionals
│   ├── Webinars and lectures
│   └── Archive
│
├── For Professionals
│   ├── Professional resources
│   ├── Communication with families
│   └── Education and events
│
└── About
    ├── Mission and principles
    ├── Team and roles
    ├── Editorial policy
    ├── Evidence and medical safety
    ├── Privacy
    ├── Disclaimer
    └── Contact
```

## 4. Homepage structure

The homepage should present the platform in the following order:

1. platform name, purpose, and primary parent-facing action;
2. key information topics for parents;
3. selected reviewed resources;
4. Research Explained;
5. Help in Kazakhstan;
6. Learning, including a prominent Autism School Kazakhstan block;
7. trust information: sources, review, authorship, and update dates;
8. a smaller section for professionals;
9. confirmed information about the project, team, and partners.

The primary homepage action is:

> View resources for parents

Secondary actions are:

> Help in Kazakhstan  
> Autism School Kazakhstan

The first viewport must not contain diagnostic questions, symptom scoring, urgent marketing language, or an excessive number of competing actions.

## 5. For Parents

The For Parents landing page is the primary content-library entry point.

During the initial launch, the eight parent topics should appear as sections on one landing page. Each section contains:

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

## 8. Learning

Learning brings together project-owned education and curated external learning opportunities.

### 8.1. Autism School Kazakhstan

Autism School Kazakhstan is clearly identified as the project’s own educational programme.

Its pages may present:

- programme purpose and audience;
- educational principles;
- planned or available topics;
- reviewed learning materials;
- confirmed webinars, lectures, or future cohorts.

It must not be confused with the external resource listings.

### 8.2. External courses and learning opportunities

External listings may include:

- educational courses;
- lectures;
- webinars;
- workshops;
- seminars;
- parent education;
- professional education.

The initial directory should not list individual therapy sessions for children or function as a marketplace for clinical services.

### 8.3. Required listing information

Each external listing should identify:

- title;
- organiser;
- intended audience;
- language;
- online or in-person format;
- free or paid status;
- dates, when applicable;
- country or region;
- short neutral description;
- external destination link;
- date the information or link was last checked;
- status such as open, ongoing, completed, or archived.

Paid resources must be visibly labelled. Affiliate or financial relationships must be disclosed. The MVP should not use affiliate links.

### 8.4. External-resource disclaimer

Each external-learning page must clearly state:

> Autism Hub Kazakhstan does not organise or control this external course unless explicitly stated. The listing is provided for information and does not constitute automatic endorsement. Users should review the programme, organiser qualifications, cost, evidence claims, and participation terms before registering.

Listings must not include organisers that promote autism “cures”, guaranteed outcomes, unsupported medical protocols, or misleading professional qualifications.

## 9. For Professionals

This is a secondary section and must not dominate the homepage or parent navigation.

It may include:

- professional reference materials;
- evidence-informed communication with families;
- ethical and safety principles;
- selected guidelines and external resources;
- confirmed education and events.

Professional material must be clearly labelled and must not imply accreditation, certification, or regulatory endorsement.

## 10. About and trust pages

The About area contains:

- mission and principles;
- relationship between Central Asia Autism Hub, Autism Hub Kazakhstan, and Autism School Kazakhstan;
- team members and clearly defined roles;
- confirmed partnerships;
- editorial process;
- evidence and medical safety policy;
- privacy information;
- informational and medical disclaimer;
- contact information.

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
- Footer navigation includes trust, privacy, disclaimer, and contact pages.
- Search is not required for the MVP.
- A country selector is not required until another country version is prepared.
- Navigation must be usable with a keyboard and must not depend on hover alone.

## 14. Final decision

The approved information architecture is:

> Autism Hub Kazakhstan uses six primary sections: For Parents, Research Explained, Help in Kazakhstan, Learning, For Professionals, and About. Autism School Kazakhstan is the project-owned programme within Learning. External courses and events are listed separately, clearly labelled, and subject to inclusion and verification rules. Russian, Kazakh, and English use the same structural hierarchy.
