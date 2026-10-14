# Learning catalogue visual audit (14 October 2026)

## Scope and observations

Audited the Learning catalogue component, 29 course-source files in each of the RU, KK and EN site-language collections (87 localized editorial records at audit time), the entry metadata, and existing learning search, language-filter and interaction checks.

The published Learning catalogue is intentionally a **text-first course directory**, unlike the Parents and Research article catalogues. It currently displays **no provider logos or course cover photographs** on cards. Therefore there are no duplicated card images to replace. The `provider` field is a textual attribution, and the external link leads to the original organiser's website. We must not copy third-party brand marks, course previews or certificates, imply affiliation, or fabricate course-specific imagery for visual variety.

## Improvement

Moved the original **teaching language** from a low-priority paragraph under the description to a clear first badge above the course title. Badges use the page's localized labels (Russian, Kazakh and English) and preserve all teaching-language options for multilingual resources. Other existing course type and audience labels remain. The language field is still used by the combinable filters and searchable metadata, but it no longer repeats needlessly in the lower card metadata. Official provider names, access instructions, outcomes and external links remain unchanged.

## New regression checks

The learning HTML validation now checks that, on all three site language versions:

- Every course card has one visible original-teaching-language badge per recorded course language, in the correct order and page language.
- Badges appear before the title, so users can identify the course language before reading long descriptions.
- No externally sourced provider logo, photo or decorative SVG has been added without verified provenance and explicit editorial approval.
- Existing combinable search, course language, audience and topic filters continue to work as before.

Automated HTML and source-code QA is **not** a pixel-level visual or mobile screenshot review. Logo or image use can be reconsidered only where source, licence, correct course match and permission/terms have been verified, not by attaching a generic image to every course.
