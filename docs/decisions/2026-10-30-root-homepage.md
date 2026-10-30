# 2026-10-30: Root URL renders the platform homepage

## Owner decision

Remove the preliminary language-selection screen at the project root. Visitors opening the general Autism Hub Kazakhstan URL should see the complete website immediately and choose another language using the normal navigation.

## Approved implementation

- Render the existing Russian-language homepage at `/central-asia-autism-hub/` as the default. This follows the current Russian-first content presentation and preserves the owner's existing article and navigation routes.
- Retain the independently addressable `/kz/ru/`, `/kz/kk/` and `/kz/en/` homepages and the `ҚАЗ / РУС / ENG` language switcher.
- Reuse the existing Astro homepage component without copying its article-feed or event-selection logic into another page.
- Make the root alias canonical to `/kz/ru/` to avoid competing duplicate indexed homepages. `hreflang=x-default` continues to point to the root.
- Keep the Russian Home tab active when viewing the root alias.
- Do not infer or store a visitor's language choice, and do not introduce automatic browser-language redirection or cookies.

## Verification

The pull request must pass the existing typography, `npm run validate`, and Chromium user-journey checks. The root public URL must actually render the real hero, language switcher and main content without the former Choose your language screen. Publication requires a successful Pages deploy on the merged commit and direct inspection of the public root URL.
