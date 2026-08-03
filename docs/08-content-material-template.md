# Information Material Template

**Project:** Central Asia Autism Hub
**Country implementation:** Autism Hub Kazakhstan
**Document:** 08 — Information Material Template
**Status:** Approved for implementation
**Version:** 1.0
**Decision date:** 2 August 2026

## 1. Purpose

This document defines the standard structure, visible metadata, and minimum publication requirements for general information materials on Autism Hub Kazakhstan.

The template is designed for a one-person editorial model. Ruslan Kurmashev may be recorded as both author and editor. The website must not imply independent clinical, scientific, or language review when none occurred.

## 2. Intended use

The template applies first to:

- parent-facing information;
- general Help in Kazakhstan materials;
- professional reference materials;
- project and policy pages when an article format is appropriate.

Research explainers and external learning listings will use separate specialised templates while sharing the common publication metadata.

## 3. Reader-facing structure

A standard material contains, in this order:

1. breadcrumb navigation;
2. title and plain-language summary;
3. intended audience;
4. publication and update information;
5. key points, when useful;
6. main explanatory text;
7. a clear account of evidence limitations or uncertainty when relevant;
8. sources;
9. author and editor responsibility;
10. external reviewer information only when a real review occurred;
11. conflict-of-interest statement;
12. an informational or medical boundary notice;
13. a correction or version note when a substantive change occurred.

## 4. Writing structure

The body should normally answer:

- What is this topic?
- Why might it matter to families?
- What is reasonably established?
- What varies between people or settings?
- What remains uncertain or should not be concluded?
- What practical, general information can be given without individual advice?
- Where can the reader verify the information?

Headings should be descriptive rather than promotional. The text must not use diagnostic quizzes, cure claims, guaranteed outcomes, fear-based language, or individual treatment instructions.

## 5. Required metadata

| Field | Requirement |
|---|---|
| `title` | Public title |
| `summary` | Short plain-language introduction |
| `description` | Search and sharing description |
| `slug` | Stable localised URL segment |
| `country` | `kz` |
| `language` | `ru`, `kk`, or `en` |
| `section` | One approved primary section |
| `topic` | Topic identifier within the section |
| `audience` | One or more intended audiences |
| `translationKey` | Stable key shared by translations |
| `translationStatus` | Source version, checked translation, or pending review |
| `author` | Responsible author |
| `editor` | Responsible editor |
| `externalReviewer` | Optional and used only for a documented real review |
| `publishedAt` | Required before publication |
| `updatedAt` | Required before publication |
| `reviewDueAt` | Planned review date when applicable |
| `riskLevel` | Lower, moderate, or high editorial risk |
| `disclaimerType` | Informational or medical boundary |
| `conflictOfInterest` | Visible declaration |
| `draft` | Must be `false` to enter public routes and lists |
| `sources` | Structured references or source links |

Optional structured fields include key points, an evidence-limitations note, and a correction or version note.

## 6. Publication rules

A record cannot be treated as publishable when:

- it remains marked as a draft;
- publication or update dates are missing;
- its translation is still marked as pending review;
- required metadata is invalid;
- its medical or scientific claims have not completed the Document 04 self-review;
- its sources have not been checked.

Draft records remain available in the local content workspace but do not receive a public route, appear in section lists, or enter the generated sitemap.

## 7. Translation behaviour

Equivalent translations share one `translationKey` but may use different slugs.

The language selector opens the equivalent article only when that translation exists and is publishable. If it does not exist, the selector links to the corresponding language section instead. The article also states that not every translation is currently available.

The `source` status identifies the approved source-language version. The `checked` status identifies a translation checked against that source. A `pending` translation remains a draft.

## 8. Standard responsibility statement

When the same person performs both roles, the page states:

> Author and editor: Ruslan Kurmashev. This material is based on the sources listed below. Independent external review was not conducted.

This wording changes only when a real external reviewer is documented.

## 9. First planned material

The first planned parent-facing material is:

> What is autism?

Its scientific and medical content will be drafted only after the source set, scope, terminology, and risk classification have been discussed and approved. Creating the technical template does not approve or publish that article.

## 10. Final decision

Autism Hub Kazakhstan will publish general information through a consistent Markdown-based article template with validated metadata, visible authorship, traceable sources, explicit uncertainty, translation status, and a proportionate medical boundary. Drafts and unchecked translations remain outside public output.
