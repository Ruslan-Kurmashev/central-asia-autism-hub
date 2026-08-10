# Brand Architecture

**Project:** Central Asia Autism Hub  
**Document:** 01 - Brand Architecture
**Status:** Approved for the first website version  
**Version:** 1.0  
**Decision date:** 28 July 2026

## 1. Purpose

This document defines the approved brand hierarchy for the Central Asia Autism Hub initiative, its first Kazakhstan-focused implementation, and its educational programme.

The architecture must:

- remain clear for families in Kazakhstan;
- support Russian, Kazakh, and English from the first website version;
- avoid implying an official, governmental, clinical, or region-wide status that has not been established;
- allow future expansion to other Central Asian countries without renaming the Kazakhstan platform;
- keep the educational programme distinct from the wider information and navigation platform.

## 2. Approved brand hierarchy

```text
Central Asia Autism Hub
└── Autism Hub Kazakhstan
    └── Autism School Kazakhstan
```

### 2.1. Central Asia Autism Hub

**Role:** Long-term umbrella initiative and future regional framework.

Central Asia Autism Hub is the canonical name of the overall initiative. It represents the long-term intention to develop adaptable, evidence-informed autism information, family navigation, education, and resource models for Central Asia.

During the Kazakhstan-first phase, the name must not be used to imply that an operational platform, service network, or verified resource system already exists across all Central Asian countries.

### 2.2. Autism Hub Kazakhstan

**Role:** Main public-facing brand and first country implementation.

Autism Hub Kazakhstan is the primary website for the first phase. It provides information, navigation, educational materials, and practical support resources for families in Kazakhstan.

It is nationally oriented but must not be described as an official national, governmental, diagnostic, clinical, or regulatory platform unless such status is formally established and documented.

### 2.3. Autism School Kazakhstan

**Role:** Educational programme within Autism Hub Kazakhstan.

Autism School Kazakhstan provides structured educational materials, parent learning pathways, webinars, checklists, and practical guidance. It is not the name of the entire platform.

The programme does not diagnose autism, provide individual medical advice, replace professional assessment, or promise treatment outcomes.

## 3. Canonical names

Brand names remain in English in all language versions. They are not transliterated or translated.

| Level | Canonical name |
|---|---|
| Regional initiative | Central Asia Autism Hub |
| Kazakhstan platform | Autism Hub Kazakhstan |
| Educational programme | Autism School Kazakhstan |
| Repository | `central-asia-autism-hub` |

Shortened forms such as “Autism Hub” and “Autism School” may be used only after the full canonical name has appeared on the same page or within an unambiguous interface context.

## 4. Public positioning

### 4.1. Primary platform description

**Russian**

> Autism Hub Kazakhstan - информационная платформа, помогающая семьям в Казахстане находить понятные, безопасные и доказательно-информированные следующие шаги при вопросах об аутизме и развитии ребёнка.

**Kazakh**

> Autism Hub Kazakhstan - Қазақстандағы отбасыларға аутизм және баланың дамуы туралы сұрақтар туындаған кезде түсінікті, қауіпсіз және дәлелді ақпаратқа негізделген келесі қадамдарды табуға көмектесетін ақпараттық платформа.

**English**

> Autism Hub Kazakhstan is an information platform helping families in Kazakhstan find clear, safe, and evidence-informed next steps when they have questions about autism or their child’s development.

### 4.2. Short interface tagline

| Language | Tagline |
|---|---|
| Russian | Информация, навигация и поддержка семей в Казахстане |
| Kazakh | Қазақстандағы отбасыларға арналған ақпарат, бағыт-бағдар және қолдау |
| English | Information, navigation and support for families in Kazakhstan |

### 4.3. Relationship to the regional initiative

**Russian**

> Autism Hub Kazakhstan развивается как первая национальная версия инициативы Central Asia Autism Hub.

**Kazakh**

> Autism Hub Kazakhstan - Central Asia Autism Hub бастамасының Қазақстанда әзірленіп жатқан алғашқы ұлттық нұсқасы.

**English**

> Autism Hub Kazakhstan is being developed as the first country implementation of the Central Asia Autism Hub initiative.

This relationship statement belongs on the “About” page and in the extended footer. It should not displace the family-facing purpose on the homepage.

### 4.4. Relationship to Autism School Kazakhstan

**Russian**

> Autism School Kazakhstan - образовательная программа Autism Hub Kazakhstan для родителей и семей.

**Kazakh**

> Autism School Kazakhstan - ата-аналар мен отбасыларға арналған Autism Hub Kazakhstan білім беру бағдарламасы.

**English**

> Autism School Kazakhstan is the parent and family education programme within Autism Hub Kazakhstan.

## 5. Language architecture

Russian, Kazakh, and English are supported from the first website version.

| Code | Language | Primary audience |
|---|---|---|
| `ru` | Russian | Families, professionals, and organisations in Kazakhstan |
| `kk` | Kazakh | Families, professionals, and organisations in Kazakhstan |
| `en` | English | English-speaking families, international partners, funders, researchers, and professional audiences |

Russian and Kazakh have equal priority for parent-facing national content. English is a complete website language, not a single promotional page.

At minimum, the following pages must be available in all three languages before public launch:

- homepage;
- where to start;
- what to do after an assessment or diagnosis;
- Autism School Kazakhstan;
- evidence and safety principles;
- editorial policy;
- medical and informational disclaimer;
- about the project;
- contact page.

Articles, city pages, and downloadable resources may be translated progressively. A page must never silently display content from another language as if it were a translation. If a translation is unavailable, the interface must state this clearly and link to available language versions.

## 6. Website route structure

The approved country-and-language structure is:

```text
/kz/ru/
/kz/kk/
/kz/en/
```

Examples:

```text
/kz/ru/start/
/kz/kk/start/
/kz/en/start/

/kz/ru/school/
/kz/kk/school/
/kz/en/school/

/kz/ru/cities/
/kz/kk/cities/
/kz/en/cities/
```

The website root should provide a clear language choice and links to all three Kazakhstan versions. It must not depend on collecting personal data.

Future country versions may follow the same pattern:

```text
/kg/ru/
/kg/ky/
/uz/ru/
/uz/uz/
```

These future routes must not be published until country-specific content, language review, editorial responsibility, and local resource verification are in place.

## 7. Naming rules in the interface

- The main website header uses **Autism Hub Kazakhstan**.
- **Central Asia Autism Hub** appears on the About page, governance pages, partnership materials, and extended footer.
- **Autism School Kazakhstan** appears only for the educational programme and related materials.
- A language switcher must display `Русский`, `Қазақша`, and `English`.
- Country and language selection must be distinct concepts in the information architecture.
- Page titles and metadata must use the full canonical platform name where context would otherwise be unclear.

## 8. Approved and restricted claims

### Approved

- “An information platform for families in Kazakhstan.”
- “A nationally oriented platform.”
- “Evidence-informed information and navigation.”
- “The first country implementation of the Central Asia Autism Hub initiative.”
- “Autism School Kazakhstan is an educational programme within Autism Hub Kazakhstan.”
- “The platform does not diagnose autism or replace professional assessment.”

### Restricted unless independently verified and formally authorised

- “The official autism platform of Kazakhstan.”
- “The national government platform.”
- “The leading autism platform in Kazakhstan.”
- “The first autism platform in Central Asia.”
- “Operating across Central Asia.”
- “Clinically validated platform.”
- “Diagnostic platform.”
- “The platform diagnoses, treats, prevents, or cures autism.”
- Any claim of guaranteed benefit, treatment response, or clinical outcome.

## 9. Repository, address, and domain

The approved repository name is:

```text
central-asia-autism-hub
```

The planned temporary GitHub Pages address is:

```text
https://ruslan-kurmashev.github.io/central-asia-autism-hub/
```

The repository name reflects the long-term initiative. The public website header still uses **Autism Hub Kazakhstan** during the first country phase.

The name or address `autism.kz` must not be presented as an owned project domain until ownership, access rights, and permission to use it have been confirmed.

## 10. Conditions for regional expansion

A new country version may be presented as part of Central Asia Autism Hub only when:

1. country-specific routes and content have been prepared;
2. local laws, services, terminology, and referral pathways have been reviewed;
3. local organisations and resources have been verified;
4. each published language has an accountable reviewer;
5. editorial, privacy, conflict-of-interest, and update responsibilities are assigned;
6. the website does not imply clinical, governmental, or regulatory endorsement without documented authorisation.

## 11. Implementation implications

The future Astro implementation should:

- treat country and language as separate structured fields;
- connect translations through a stable translation key;
- store review status and last-updated dates with content;
- prevent silent language fallbacks;
- generate language-specific metadata and navigation;
- keep Autism School content identifiable as a programme within the wider platform;
- preserve the approved hierarchy in page titles, headers, breadcrumbs, and structured data.

## 12. Final decision

The approved architecture for the first website version is:

> **Central Asia Autism Hub** is the umbrella initiative.  
> **Autism Hub Kazakhstan** is the main public-facing brand and first country implementation.  
> **Autism School Kazakhstan** is the educational programme within Autism Hub Kazakhstan.  
> The website supports **Russian, Kazakh, and English** from its first public version.
