# Learning on AutismHub: internal study pages and opt-in video player

## What changed (14 October 2026)

The existing single Learning catalogue is retained, with the same 29 resources in each of RU, KK and EN. **A course does not receive a separate AutismHub page merely to repeat the provider's description.** Course cards without real on-site content go directly to the original provider's platform as the primary action. There is no provider/owner-based segregation and no second catalogue.

The shared eligibility function `src/lib/learning.ts` permits a local page at `/kz/{language}/learning/{slug}/` only when the entry has at least one properly sourced, supported on-site YouTube video lesson. Future substantial first-party interactive content can be added deliberately to this eligibility rule, but simply filling in the original course metadata is insufficient. On-site pages include playable lessons, ordered navigation, explanatory context, provider attribution, training and credential limitations, official source links and fallback access.

At the time of this correction, the CDC course has an actual on-site video sequence, so it has three localized viewing pages. The other 28 external-only resources per language link directly to the provider and no empty intermediate pages are generated.

## Source-verified video pilot

The first configured mixed-source sequence is CDC's **Watch Me! Celebrating Milestones and Sharing Concerns**, in all three AutismHub interface languages. The educational videos themselves are **in English**, the original teaching language. It includes official links to modules 1–4 and short video excerpts embedded on those same CDC module pages:

- `pqwQ9dcTSlw`: introduction (CDC Module 1: https://www.cdc.gov/ncbddd/watchmetraining/module1.html).
- `GgBvMnPhahQ`: observing play (CDC Module 2: https://www.cdc.gov/ncbddd/watchmetraining/module2.html).
- `gQODXcS3l0Y`: active listening (CDC Module 4: https://www.cdc.gov/ncbddd/watchmetraining/module4.html).

CDC embeds are original YouTube clips; AutismHub links to their watch URLs and loads them using the official YouTube no-cookie embed endpoint **only after an explicit click**. No video bytes are copied to AutismHub, and no third-party player/thumbnail loads on page open. A fallback source link is always supplied. Embedding availability is controlled by the owner and may change. This does not copy the course module, quizzes, accessibility tools or credential process; visit the original CDC course to complete those requirements. References: CDC https://www.cdc.gov/watch-me-training/modules/index.html and the module pages above.

## Future course authoring

A new or existing Learning entry may optionally declare a `lessons` array of source-credited units:

```yaml
lessons:
  - title: "Lesson title"
    description: "Brief, verified editorial summary"
    sourceUrl: "https://www.youtube.com/watch?v=xxxxxxxxxxx"
    sourceName: "Original author / channel"
    youtubeVideoId: "xxxxxxxxxxx"
  - title: "Official exercise"
    description: "Registration or completion may be required"
    sourceUrl: "https://example.org/official-module"
    sourceName: "Official learning provider"
```

Real video IDs must be 11 characters, must match the provided source YouTube watch URL, and must be reviewed for authorship, subject, age-appropriateness and embedding restrictions. Do not invent video URLs or credit, host other owners' files, claim co-authorship or copy third-party course transcripts/materials without rights. Curated third-party video sequences must be clearly marked as editorial selections and cannot be presented as the official full course.

The same route and data model can host AutismHub-authored videos later without creating a separate catalogue. Credential/accreditation claims belong only to an actual verified provider policy, not to the mere viewing of videos.

## Privacy and QA

The static HTML contains only the user's requested video ID and a plain consent button. A user-triggered event dynamically inserts a sandbox-free standard YouTube iframe with `youtube-nocookie.com`. This **reduces third-party requests before interaction**, but is not a blanket legal/compliance guarantee; review EU cookie/consent requirements before launch.

All 87 localized **catalogue entries**, the three genuinely usable on-site CDC pages, direct official external links for the other 84 locale-specific course cards, and consent-gated videos are included in `npm run check:learning-course-pages` within full site validation. The regression also fails when a catalogue-only external resource unexpectedly gets a duplicate local page. Existing faceted filters, language switching, typography, and content safeguards remain in use. Pixel-level QA and live embedding availability require a separate manual check.
