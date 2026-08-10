# Design and Accessibility Policy

**Project:** Central Asia Autism Hub  
**Country implementation:** Autism Hub Kazakhstan  
**Document:** 06 - Design and Accessibility Policy
**Status:** Approved for the first website version  
**Version:** 1.0  
**Decision date:** 29 July 2026

## 1. Purpose

This document defines the approved visual, interaction, multilingual, and accessibility principles for the first public version of Autism Hub Kazakhstan.

The website must support parents who may be reading under stress, on a mobile device, or with limited time. It must also remain usable by people with visual, auditory, motor, cognitive, language, learning, and neurological disabilities.

The design must prioritise:

- clear access to information;
- calm and predictable interaction;
- readable multilingual content;
- respectful representation;
- accessibility from the beginning rather than as a separate later version;
- a maintainable implementation suitable for a small static website.

## 2. Design character

The approved design direction is:

- calm;
- trustworthy;
- contemporary;
- professional;
- human and welcoming;
- suitable for adults and families;
- neither clinically cold nor visually childish.

The website must avoid:

- visual overload;
- pity-based or tragic framing;
- medical or institutional intimidation;
- infantilising language or imagery;
- stereotyped representations of autistic people and families;
- decorative elements that compete with the information;
- a generic commercial-health or technology-startup appearance.

Potentially divisive autism symbols, including puzzle-piece imagery, are not part of the initial visual identity unless a later decision provides a clear and documented reason for their use.

## 3. Visual system

### 3.1. Colour direction

The initial colour direction will use:

- a light neutral background;
- dark text;
- a calm blue-green or related primary colour;
- one restrained warm accent where useful;
- limited supporting colours for status and content categories.

Exact colour values are not fixed in this planning document. They must be selected and tested during implementation.

Colour must not be the only way to communicate:

- meaning;
- status;
- warnings;
- selected navigation;
- link state;
- evidence category.

Text, icons, labels, borders, or patterns must provide an additional cue.

Minimum contrast targets are:

- 4.5:1 for normal text;
- 3:1 for large text;
- 3:1 for meaningful non-text interface elements and focus indicators where applicable.

Higher contrast may be used where it improves readability without creating excessive glare.

### 3.2. Typography

The primary typeface must:

- be a clear sans-serif suitable for sustained screen reading;
- support Russian, Kazakh, and English characters correctly;
- distinguish letters and numerals clearly;
- remain readable on Windows, Android, iOS, and common desktop systems;
- avoid unnecessary third-party font requests where a local or system font is sufficient.

The MVP should prefer a robust system-font stack unless a tested, locally hosted font materially improves the identity and reading experience.

Typography must use:

- a comfortable base size;
- clear differences between heading levels;
- adequate line height;
- moderate line length;
- real text rather than images of text;
- emphasis used sparingly.

Long article text should generally remain within a readable single column rather than stretching across the full screen.

### 3.3. Spacing and density

Pages must use:

- visible separation between sections;
- consistent vertical rhythm;
- enough whitespace to support scanning;
- compact but distinct navigation;
- limited card density;
- no unnecessary sidebars on article pages.

Whitespace must support comprehension without forcing excessive scrolling through decorative empty space.

## 4. Page structure

The common page structure will include:

1. a skip link for keyboard users;
2. a consistent site header;
3. primary navigation;
4. a visible language switcher;
5. breadcrumbs where they provide useful context;
6. one clearly identified main content area;
7. related information where relevant;
8. a consistent footer with trust, policy, disclaimer, and contact links.

The main article layout should normally include:

- a clear page title;
- a short plain-language summary;
- the main content;
- meaningful section headings;
- the author or project responsibility statement;
- publication and latest-review dates;
- evidence or scope notes where applicable;
- references;
- related materials.

The first screen must prioritise the page purpose and useful content rather than promotional decoration.

## 5. Navigation and interaction

Navigation must be:

- consistent across pages;
- predictable across all three languages;
- fully operable with a keyboard;
- usable by touch;
- understandable without relying on icons alone;
- visually clear on both small and large screens.

Interactive elements must:

- have visible labels;
- use familiar behaviour;
- show a clear hover state where relevant;
- show a strong visible keyboard-focus state;
- avoid obscuring the focused element;
- have adequate pointer target size and spacing;
- remain usable without dragging movements;
- not trigger unexpected navigation merely from receiving focus.

Links must be recognisable in context. Generic labels such as “click here” should be avoided.

The MVP must not use:

- rotating carousels;
- automatic slideshows;
- content that moves without a user request;
- modal pop-ups on page load;
- navigation that appears only on hover;
- scroll-jacking;
- essential interactions based only on complex gestures.

## 6. Cognitive and sensory accessibility

The project adopts the following additional design principles because technical conformance alone does not address every cognitive, language, learning, sensory, or neurological need:

- keep layouts predictable;
- use the same component for the same purpose;
- present one primary purpose per page;
- use plain and direct language;
- explain necessary technical and medical terms;
- divide long content into meaningful sections;
- keep instructions short and sequential;
- make important warnings specific and calm;
- avoid urgency cues unless urgency is genuine;
- avoid flashing content;
- avoid autoplaying audio or video;
- minimise non-essential animation;
- respect the user's reduced-motion preference;
- do not use background audio;
- allow visitors to read without time limits.

The website must not claim to meet every autistic person's sensory or cognitive preferences. User needs vary, and the design should remain adaptable and open to correction.

## 7. Multilingual accessibility

The public website supports:

- Russian;
- Kazakh;
- English.

The language switcher must display language names as:

- Русский;
- Қазақша;
- English.

Flags must not be used as the primary language selector because a language is not equivalent to a country or nationality.

Each page must:

- declare its main language in the HTML document;
- mark passages in another language where technically necessary;
- use the correct page title and navigation labels for that language;
- provide a route to the equivalent translated page where it exists.

When an equivalent translation is unavailable:

- the interface must say so clearly;
- the visitor must not be silently redirected to an unrelated page;
- the available alternative language versions may be offered explicitly.

The three language versions must preserve the same information hierarchy and safety meaning. Their wording may be adapted for clarity rather than copied literally.

## 8. Images, icons, and media

Images must have a clear informational or human purpose. Decorative imagery must remain limited.

The website must:

- provide useful alternative text for meaningful images;
- use empty alternative text for purely decorative images;
- avoid placing essential information only inside an image;
- provide captions where context is not otherwise clear;
- avoid stereotyped, distressing, or pity-based depictions;
- represent people respectfully and with appropriate permission or licensing;
- avoid icons without text when their meaning may be unclear.

For project-produced prerecorded video or audio, accessibility planning should include:

- accurate captions;
- a transcript;
- clear controls;
- no autoplay.

External videos and courses must be labelled as external resources. Their accessibility may be described where known, but the project must not imply that it controls third-party accessibility.

## 9. Accessibility target

The implementation target is **Web Content Accessibility Guidelines (WCAG) 2.2, Level AA**.

This target provides an accepted technical baseline for:

- perceivable content;
- operable interaction;
- understandable structure;
- robust compatibility with browsers and assistive technology.

The target does not justify an unverified statement that the website is fully accessible or formally WCAG-conformant.

The project must not publish claims such as:

- “fully accessible”;
- “100% accessible”;
- “WCAG 2.2 certified”;
- “accessible to everyone”;

unless the claim is supported by an appropriate documented assessment.

The preferred public wording before such an assessment is:

> We are working towards WCAG 2.2 Level AA and welcome reports of accessibility barriers.

## 10. Minimum technical requirements

The initial implementation must support:

- semantic HTML landmarks and elements;
- a logical heading hierarchy;
- a meaningful document title;
- keyboard access to all controls and links;
- logical focus order;
- visible focus;
- a skip link;
- correct labels and accessible names;
- correct language attributes;
- meaningful alternative text;
- responsive layouts;
- text resizing without loss of content or function;
- reflow on narrow screens without unnecessary two-dimensional scrolling;
- sufficient text and interface contrast;
- reduced-motion preferences;
- touch-friendly controls;
- clear current-page and current-language states;
- useful error handling if an interactive function is later added.

Native HTML controls should be preferred over custom scripted controls where they fulfil the required purpose.

Accessibility must not depend on JavaScript when ordinary HTML can provide the same content or navigation.

## 11. Responsive design

The site must be designed mobile-first and remain usable on:

- small mobile screens;
- larger mobile screens;
- tablets;
- laptops;
- desktop monitors.

The mobile version must not be a reduced or incomplete information experience.

Responsive behaviour must preserve:

- reading order;
- heading hierarchy;
- language selection;
- navigation access;
- visible focus;
- source and disclaimer information;
- access to footer policy links.

Horizontal scrolling must not be required for ordinary text content. Tables and unusually wide source material require a deliberate accessible treatment.

## 12. Features excluded from the MVP

The first version does not require:

- a separate “version for visually impaired users”;
- custom text-size controls;
- a dark theme;
- automatic text-to-speech;
- extensive interface-personalisation settings;
- animated introductions;
- decorative loading sequences;
- accessibility overlays or widgets that claim to repair the site automatically.

The project will instead build accessibility into the main website.

Browser zoom, operating-system preferences, and assistive technologies must not be blocked.

These excluded features may be reconsidered only when a demonstrated user need justifies their complexity.

## 13. Validation procedure

Accessibility validation must combine automated and manual checks.

The minimum pre-launch procedure is:

1. validate page structure and HTML output;
2. run an automated accessibility scan on representative pages;
3. test the complete navigation by keyboard;
4. inspect focus order and focus visibility;
5. check text and interface contrast;
6. test mobile and narrow-screen layouts;
7. test browser zoom and text resizing;
8. check headings, landmarks, labels, and alternative text manually;
9. test reduced-motion behaviour;
10. perform a basic screen-reader check on representative navigation and article pages where practical;
11. review every language template, not only the Russian version;
12. record unresolved limitations before launch.

Automated tools can identify only part of the accessibility problems. Passing an automated scan is not sufficient evidence of WCAG conformance.

The website should provide a practical way to report an accessibility barrier without inviting medical or personal case submissions.

## 14. Maintenance

Accessibility requirements apply to:

- shared layouts;
- new components;
- new articles;
- translations;
- images;
- videos;
- external-resource descriptions;
- design revisions.

When a new content type or interface component is introduced, it must be checked before becoming a reusable pattern.

Accessibility issues that prevent access to core information should receive priority over decorative improvements.

## 15. Reference framework

This policy uses the following W3C resources as its primary technical framework:

- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*:  
  <https://www.w3.org/TR/WCAG22/>
- W3C, *How to Meet WCAG 2.2 - Quick Reference*:
  <https://www.w3.org/WAI/WCAG22/quickref/>
- W3C, *What's New in WCAG 2.2*:  
  <https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/>
- W3C, *Making Content Usable for People with Cognitive and Learning Disabilities*:  
  <https://www.w3.org/TR/coga-usable/>

These sources provide a technical and usability framework. They do not show that the website conforms until the implemented site and its content have been tested.

## 16. Final decision

The approved MVP design and accessibility model is:

1. A calm, professional, adult, family-friendly visual identity.
2. A readable single-column content experience with limited visual noise.
3. One accessible website rather than a separate accessibility version.
4. WCAG 2.2 Level AA as the implementation target, without premature conformance claims.
5. Predictable navigation and cognitively clear presentation.
6. Equivalent and accessible Russian, Kazakh, and English interfaces.
7. No autoplay, flashing content, carousels, intrusive pop-ups, or unnecessary motion.
8. Automated and manual accessibility checks before public launch.
