# Play, development and interaction: English and Kazakh translation release QA

Date: 2026-11-21

## Scope and authorization

Eight translations of four existing Russian articles, prepared and corrected on 19 November. The project owner explicitly requested publication with remaining corrections on 21 November. This documents publication authorization, not independent expert review or human native-speaker certification.

## Checks

- Current Russian sources compared against the corrected English and Kazakh drafts. All eight preserve H2/H3 sequence, source URL list and order, core safety metadata and original displayed publication timestamp. The earlier translation audit and correction report documented key numeric claims and language corrections.
- Selected key claims cross-checked on 21 November: joint attention meta-analysis (PMID 41493690), Tiede and Walton (PMID 31018655), updated Project AIM (https://www.bmj.com/content/383/bmj-2023-076733), Crank (PMID 33480474), RIT trial (PMID 20155309), school-based peer intervention review (PMID 39467895), AAC review (PMID 38848009) and play-based meta-analysis (PMID 42287507). The 2026 Project AIM correction (https://doi.org/10.1136/bmj.s887) concerned reference details in supplementary tables, not the reported effect estimates. This is a targeted cross-check, not new independent clinical review or exhaustive retraction surveillance.
- Four original cover paths are populated by the existing licensed Pexels prebuild script. The two owner-approved WebP diagrams were visually inspected and have no embedded text. The imitation diagram captions in the translations now describe stacking rings, not blocks. No image bytes or source Russian article were altered.
- Distinct locale-specific slugs avoid previous Astro content ID collisions. Links between the eight new articles and the existing AAC, speech-language and Naturalistic Intervention translations were checked against the route inventory. Existing Naturalistic Intervention translated navigation was updated to point to the new locale-specific overview and NDBI articles. Its first-publication dates are unchanged.
- Source URLs, original displayed dates, translation keys and risk metadata have been retained. The new release timestamp is recorded separately. No independent clinical or native-speaker review was performed. No human review tracker or evidence status was upgraded.

## Release inventory

- `src/content/pages/kz/en/development-interaction-and-play.md` - 9 H2, 29 H3, 11 sources, slug `development-interaction-and-play`.
- `src/content/pages/kz/en/imitation-and-reciprocal-imitation.md` - 12 H2, 2 H3, 6 sources, slug `imitation-and-reciprocal-imitation`.
- `src/content/pages/kz/en/ndbi.md` - 11 H2, 3 H3, 9 sources, slug `naturalistic-developmental-behavioral-interventions`.
- `src/content/pages/kz/en/peer-mediated-intervention.md` - 11 H2, 4 H3, 4 sources, slug `peer-based-support`.
- `src/content/pages/kz/kk/damu-ozara-arekettesu-zhane-oiyn.md` - 9 H2, 29 H3, 11 sources, slug `damu-ozara-arekettesu-zhane-oiyn`.
- `src/content/pages/kz/kk/elikteu-zhane-ozara-elikteu.md` - 12 H2, 2 H3, 6 sources, slug `elikteu-zhane-ozara-elikteu`.
- `src/content/pages/kz/kk/kurdastar-arkyly-koldau.md` - 11 H2, 4 H3, 4 sources, slug `kurdastar-arkyly-koldau`.
- `src/content/pages/kz/kk/ndbi.md` - 11 H2, 3 H3, 9 sources, slug `ndbi-tabigi-damytushy-minez-kulyktyk-aralasular`.

## Deployment verification

Local YAML and punctuation checks were conducted on the drafts. Repository-wide validation, image acquisition and Chromium browser QA must pass in GitHub Actions. Commit creation is not proof of Pages deployment.
