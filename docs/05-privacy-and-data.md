# Privacy and Data Policy

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 05 - Privacy and Data Policy
**Status:** Approved for the first website version  
**Version:** 1.0  
**Decision date:** 29 July 2026

## 1. Purpose

This document defines the privacy and data boundaries for the first public version of Autism Hub Kazakhstan.

The website is an information and education resource. It does not need personal profiles, medical records, family case histories, or direct user submissions to fulfil its initial purpose.

The approved model distinguishes between:

- personal, contact, family, and medical data, which the project does not request or collect through the website; and
- limited aggregate website analytics, which may be used to understand and improve the resource.

## 2. Core privacy decision

Autism Hub Kazakhstan does not use the website to request, collect, or build datasets containing:

- names;
- telephone numbers;
- personal email addresses;
- home or postal addresses;
- identification numbers;
- dates of birth;
- precise location;
- diagnoses;
- medical histories or records;
- assessment reports;
- information about a child or family;
- photographs, videos, or documents submitted by visitors;
- payment or financial information.

The project must not invite parents to submit personal cases for assessment, diagnosis, treatment selection, or individual medical advice.

## 3. Functions excluded from the MVP

The first website version will not contain:

- user registration or accounts;
- personal profiles;
- contact or intake forms;
- medical questionnaires;
- screening forms;
- comments;
- discussion forums;
- file uploads;
- appointment booking;
- online payments;
- personalised recommendations;
- newsletters requiring email collection;
- surveys collecting information about parents, children, or professionals.

The website has no backend database for visitor records.

## 4. Permitted aggregate analytics

The project may use limited, privacy-focused analytics to understand whether the website is useful and which materials require improvement.

Permitted measurements include:

- total visits and page views;
- popularity of individual pages and language versions;
- general referral sources;
- approximate country-level location;
- device category;
- browser and operating-system category;
- page-loading performance;
- aggregated technical errors.

These measurements may be used for:

- prioritising new and translated content;
- identifying pages that are difficult to find;
- improving navigation;
- improving performance on mobile devices;
- detecting broken or poorly performing pages;
- assessing the overall development of the resource.

## 5. Analytics restrictions

Website analytics must not be used to:

- identify a visitor;
- create an individual visitor profile;
- follow a person across websites or devices;
- reconstruct an individual's reading history;
- infer or record a diagnosis or medical status;
- support advertising or remarketing;
- create advertising audiences;
- sell or disclose visitor profiles;
- make decisions about an individual or family.

The project must not intentionally store or expose to the project owner:

- raw IP-address lists;
- precise GPS or household-level location;
- names or contact information;
- persistent advertising identifiers;
- form contents;
- search text containing personal or medical details;
- URLs or query parameters containing personal data.

Aggregate reports must be preferred over visitor-level logs.

## 6. Approved analytics approach

If analytics is enabled for the MVP, it must be a privacy-focused service that:

- is suitable for a static GitHub Pages website;
- does not require visitor accounts;
- does not use advertising trackers;
- does not support cross-site behavioural profiling;
- does not require the project to collect names, contact details, or medical information;
- provides only the minimum metrics needed to improve the website;
- has current, publicly available documentation describing its data practices.

Cloudflare Web Analytics is the preferred initial candidate because its current documentation describes it as free, privacy-first analytics that can be added without changing the website's DNS and states that it does not collect or use visitors' personal data.

This selection must be rechecked against the provider's current documentation before implementation. Enabling a different analytics service requires a documented privacy review.

Google Analytics, Meta Pixel, advertising pixels, remarketing tags, and comparable profiling tools are not approved for the MVP.

## 7. Cookies and device storage

The MVP must not set non-essential cookies for:

- advertising;
- cross-site tracking;
- behavioural profiling;
- remarketing;
- persistent visitor identification.

The website must not store visitor profiles in browser local storage.

If a future function requires cookies or device storage, its purpose, stored values, duration, and consent requirements must be reviewed before implementation. It must not be added merely because a third-party tool enables it by default.

## 8. Contact and correspondence

The website may display a direct project email address for:

- corrections;
- broken-link reports;
- source suggestions;
- partnership enquiries;
- general questions about the project.

The contact page must not request a person's name, telephone number, diagnosis, medical record, or information about a child.

It must include a clear warning:

> Please do not send medical records, assessment results, diagnoses, photographs, identifying information about a child, or requests for individual medical advice.

The project must not create a parent, patient, family, or marketing database from incoming correspondence. Email communication is handled by the relevant email provider outside the website and is not part of website analytics.

## 9. External websites and embedded content

Links to courses, videos, organisations, research articles, and other resources may lead to external services with their own data practices.

The website must:

- identify external links clearly where practical;
- avoid implying that the project's privacy policy governs external services;
- prefer ordinary links over embedded third-party content in the MVP;
- review any future embedded player, map, form, or widget before adding it.

An external service may process data when a visitor chooses to open it. This processing is governed by that service's terms and privacy policy.

## 10. Hosting-related technical data

The website is planned for GitHub Pages. GitHub states that when a GitHub Pages site is visited, the visitor's IP address is logged and stored by GitHub for security purposes.

This hosting-level processing:

- is performed by GitHub under its own privacy documentation;
- is distinct from the project's optional aggregate analytics;
- must be disclosed on the public privacy page;
- must not be described as data collected by Autism Hub Kazakhstan for medical, marketing, or profiling purposes.

The public policy must not make the inaccurate claim that no technical processing occurs anywhere when the hosting provider documents such processing.

## 11. Public transparency

The public privacy page must be available in:

- Russian;
- Kazakh;
- English.

All three versions must communicate the same substantive policy.

The page must explain:

- which personal and medical data the project does not collect;
- which aggregate analytics may be measured;
- why the analytics is used;
- which analytics practices are prohibited;
- the role of GitHub Pages as the hosting provider;
- the status of external links;
- the warning against sending personal or medical information by email;
- the date of the latest policy update.

Analytics must not be described as anonymous unless the selected implementation and its current documentation support that statement. The safer default wording is:

> We use limited aggregate website statistics that are not intended to identify or profile individual visitors.

## 12. Future changes

The following additions require a new privacy review before implementation:

- contact, feedback, or registration forms;
- newsletters;
- surveys;
- comments or community functions;
- accounts;
- event registration;
- course enrolment;
- payments;
- screening or assessment tools;
- personalised recommendations;
- uploads;
- embedded third-party forms, maps, or media;
- any new analytics, advertising, or tracking provider.

The review must identify:

- exactly what data would be processed;
- why it is necessary;
- who would receive it;
- where it would be stored;
- how long it would be retained;
- how it would be secured;
- what information and choices visitors would require.

No such feature is approved merely by being listed as a possible future development.

## 13. Reference documentation

Implementation decisions in this policy are based on the following provider documentation as available on the decision date:

- GitHub Docs, *What is GitHub Pages?*, including the section on data collection:  
  <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
- GitHub General Privacy Statement:  
  <https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement>
- Cloudflare Web Analytics documentation, *About*:  
  <https://developers.cloudflare.com/web-analytics/about/>
- Google Analytics Help, *Data collection*:  
  <https://support.google.com/analytics/answer/11593727>

These sources describe provider behaviour and do not constitute legal advice or a general certification of compliance. Relevant requirements and provider practices must be checked again before public launch and after material technical changes.

## 14. Final decision

The approved MVP privacy model is:

1. No collection of names, contact details, diagnoses, medical records, child information, or other personal case data through the website.
2. No accounts, forms, uploads, individual advice, advertising trackers, or visitor profiling.
3. Limited aggregate analytics may be used solely to improve the information resource.
4. Cloudflare Web Analytics is the preferred initial analytics candidate, subject to implementation-time verification.
5. GitHub Pages hosting-level processing and external-service boundaries must be disclosed transparently.
6. Any future feature involving personal, medical, or user-submitted data requires a separate decision and privacy review before implementation.
