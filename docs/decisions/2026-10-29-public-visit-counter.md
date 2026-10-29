# 2026-10-29: Public site visit counter (conditional implementation)

## Owner request

Provide a free, public-facing site visit count on Autism Hub Kazakhstan while postponing Cloudflare Web Analytics and any custom-domain purchase.

## Implementation proposal

- Show one shared number in the existing footer for RU, KK and EN.
- Label it approximate site visits, not individual people, families, readers or users.
- A visit is one browser-tab session, with a new count after 30 minutes without activity. Only a temporary last-activity timestamp is kept in sessionStorage, never an identifier or content history.
- Keep the counter independent of the site hostname, so an eventual switch to autismkz.com does not reset its namespace.
- Use the provider's numeric API directly, with no third-party code execution, no cookies, credentials, referrer, page path or URL query parameters in the counter request.
- Hide the counter on failure, during development, and on 404 pages. No invented starting count.
- Preserve Cloudflare Web Analytics as the separately approved choice for fuller analytics later.

## Privacy and QA release gate

CounterAPI (https://counterapi.com/) is the proposed interim service. Its own site states that it hashes IP and browser information and does not sell data. The exact retention periods, data location and contractual terms are not fully established from reviewed provider documentation. These are not presumed approved. The public counter cannot be merged and advertised as production-ready without a documented provider privacy resolution and live API/browser test. A vendor failure must not affect the rest of the website.

## Files in the implementation branch

- public/scripts/site-visit-counter.js
- src/components/SiteFooter.astro
- src/styles/global.css
- src/components/AboutPolicies.astro
- docs/05-privacy-and-data.md
- docs/decisions/README.md
- AGENTS.md

Only a GitHub PR and passing validation on its final commit establish a reviewed proposed implementation. A merged, successfully deployed and externally checked site is required before marking the counter published.
