# 2026-10-29: Public site counter, revised 30 October 2026

## Owner decision

The owner requested a free public counter on Autism Hub Kazakhstan, while postponing Cloudflare Web Analytics and a custom domain. The owner explicitly authorised public deployment.

## Selected implementation

- Use Hits (https://hits.sh/) as a free open-source SVG hit counter, not the earlier failing CounterAPI integration.
- Show the same count in the shared footer for RU, KK and EN. The counter key is tied to the initial website identifier, not the currently requested domain. A future domain switch keeps this key.
- Use accurate user-facing labels: page views, not unique users, family counts or reliably deduplicated visits.
- Each image request can increment the total, including repeated visits, crawlers or browser behaviour. Cache can suppress some requests. Do not claim exact human reach.
- Render with an ordinary `<img>` tag. Do not execute any vendor script or embed provider tracking code.
- Set `referrerpolicy="no-referrer"`. Do not send page URL, medical responses, query parameters, custom visitor IDs or cookies.
- Do not use browser storage or user profiles. Hide the badge on 404 pages to avoid recording those views.
- If the badge fails, the rest of the page still renders.

## Provider verification and limitations

The former CounterAPI service failed live checks with HTTP 502 and timeout. It is not approved for production.

Hits provides badge-specific privacy and service terms at https://hits.sh/privacy/ and https://hits.sh/terms/ (last updated 27 November 2025). The policy states that the badge service does not collect IP addresses, user agent strings or personal data and does not use cookies. Normal request delivery still exposes technical connection metadata to the provider. This is a provider declaration, not independent GDPR certification. The provider website separately uses Google Analytics, but this project does not embed the provider website.

The replacement SVG endpoint must pass live smoke tests on the PR's final commit, and the website must pass the normal Astro validation and browser tests before merging. After merge, confirm a successful Pages deploy and inspect the public footer. Do not confuse commit, passing CI and a verified public deployment.

## Changed implementation files

- src/components/SiteFooter.astro
- src/styles/global.css
- src/components/AboutPolicies.astro
- docs/05-privacy-and-data.md
- docs/decisions/README.md
- AGENTS.md
- scripts/check-public-counter-endpoint.mjs
- .github/workflows/counter-api-smoke.yml

No backend, site accounts, user database, medical-data collection, payment service or custom domain is introduced.
