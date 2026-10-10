# Research Explained: editorial QA for the first ten articles

Date: 2026-10-10. Scope: all ten published Russian-language articles in the `research` collection. Repository: `Ruslan-Kurmashev/central-asia-autism-hub`.

## Scope and verification method

1. Compared study titles, journals, DOI identifiers, participant numbers and central conclusions with primary articles, PubMed records or journal landing pages. Reviewed limitations to distinguish association from causation.
2. Reviewed all ten article manuscripts for explicit study boundaries, no unsupported clinical conclusions, and original research references at the end. Source metadata is retained internally rather than duplicated in visible opening blocks.
3. Checked each image attribution against the journal's original figure or Wikimedia Commons file description, including author and CC/PD status. Wikimedia file URL hash and source filename are enforced by a new automated check. External host HTTP delivery and a live deployed browser render were not verified in this QA environment.
4. Added `scripts/check-research-editorial.mjs` to `npm run validate` to catch missing DOI, attribution, licence, mismatched Wikimedia file path, and uncredited images on future releases.
5. All changes must pass Astro/TypeScript, typography, internal-link, English, Kazakh and Kazakhstan-help translation checks before merging into `main`.

## Article-level editorial findings

| No. | Research source | QA action |
| --- | --- | --- |
| 1 | [Litman et al. 2025, Nature Genetics](https://doi.org/10.1038/s41588-025-02224-z) | Clarified exact sizes of the four phenotypic clusters (1,860; 1,976; 1,002; 554). The original Fig. 1 credit and CC BY 4.0 remain. |
| 2 | [Satterstrom et al. 2020, Cell](https://doi.org/10.1016/j.cell.2019.12.036) | Added FDR threshold 0.1 for the 102 associated genes and made clear that it does not establish 102 individual causes. Verified NHGRI public-domain photo credit. |
| 3 | [Velmeshev et al. 2019, Science](https://doi.org/10.1126/science.aav8130) | Clarified that 104,559 nuclei from 31 donors are not 104,559 independent participants. Preserved nonhuman-microscopy origin and CC BY-SA 3.0 credit. |
| 4 | [Kirby et al. 2022, Autism Research](https://doi.org/10.1002/aur.2670) | Added 95% CI (73.5% to 74.5%) for 74% documented sensory features, not a universal estimate. Verified Wikimedia fidget-object photo attribution. |
| 5 | [Crompton et al. 2025, Nature Human Behaviour](https://doi.org/10.1038/s41562-025-02163-z) | Distinguished 324 recruited from 311 who attended across 54 chains. Maintained original Fig. 3 credit and no significant information-accuracy difference. |
| 6 | [McQuaid et al. 2024, Autism](https://doi.org/10.1177/13623613241243117) | Clarified that 1,987 is the sum of three samples, not necessarily the denominator for every sex/gender comparison. Verified Commons photo and CC BY 4.0. |
| 7 | [Fountain et al. 2023, Pediatrics](https://doi.org/10.1542/peds.2022-058674) | Distinguished total sample 71,285 from communication (71,222) and social interaction (71,184) trajectory datasets; preserved non-predictive interpretation. |
| 8 | [Jones et al. 2023, JAMA](https://doi.org/10.1001/jama.2023.13295) | Clarified that the uncertain-diagnosis subgroup (140) must not be conflated with the full 475-child sample. Verified 71.0%/80.7% full-sample accuracy metrics and equipment photo CC BY-SA 4.0. |
| 9 | [Whitehouse et al. 2021, JAMA Pediatrics](https://doi.org/10.1001/jamapediatrics.2021.3298) | Clarified missing outcome observations at age three (89 followed up) versus initial 104 randomized and 103 eligible, without making prevention claims. Verified baby-toys photo CC0. |
| 10 | [Hviid et al. 2019, Annals of Internal Medicine](https://doi.org/10.7326/M18-2101) | Clarified that the cited [Cochrane 2021 review](https://doi.org/10.1002/14651858.CD004407.pub5) updates its 2020 edition. Checked WHO [December 2025 statement](https://www.who.int/news/item/11-12-2025-statement-gacvs-vaccines-autism) and the MMR photo attribution. |

## Verification boundaries

- Successful static build validates page generation and internal links, not response codes or licensing at remote photo hosts.
- Journal articles and Wikimedia Commons source pages were checked against publicly available metadata; photos are not newly generated, and images are not claimed to portray study participants unless the original source says so.
- Direct rendered-page checks on GitHub Pages, image load in browsers, accessibility checks with screen readers and real-device layout tests require a separately accessible live browsing environment.
