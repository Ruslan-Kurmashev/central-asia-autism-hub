# Editorial and evidence review: 12 foundational autism biology articles

**Review date:** 2026-10-16  
**Scope:** 12 Russian-language educational articles in `src/content/pages/kz/ru/`, topic `causes-and-biology`.  
**Editorial standard:** substantive readability, non-template Russian phrasing, accurate distinction between association and causation, non-stigmatizing wording, safe medical messages, transparent interpretation of research cohorts, original illustration and frontmatter integrity.

This review does **not** constitute a newly performed systematic review, individual clinical assessment, or independent reanalysis of datasets. Primary-source metadata and key numerators, denominators, and limitations were cross-checked for high-consequence claims; automated CI separately checks references and build links. Not every claim is supported by a causal human study and the text retains those qualifications.

| # | Article source | Scientific verification and substantive editing focus |
| --- | --- | --- |
| 1 | `autism-biology-overview.md` | Population heritability versus individual causation; review-level boundaries of genetics and candidate markers; reduced generic introductory and conclusion phrasing. |
| 2 | `autism-genetics-inheritance.md` | Distinguished ~80% population heritability from 20.2% sibling recurrence within the selected 2024 cohort of 1,605 children; clarified limitations of familial estimates. |
| 3 | `genes-control-brain-development.md` | Corrected switch-like representation of expression; highlighted transcript abundance versus functional protein; retained cell- and developmental-stage specificity. |
| 4 | `prenatal-brain-development-and-autism.md` | Verified Stoner et al. (NEJM 2014) focal patches in 10/11 autism and 1/11 comparison postmortem samples; explicitly noted small sampled brain regions and non-prenatal observation. Standardized irregular Markdown spacing. |
| 5 | `neurons-synapses-how-brain-cells-connect.md` | Clarified excitation/inhibition terms, context-dependent GABA actions, receptor and developmental conditions; avoided universal synaptic imbalance claims. |
| 6 | `how-brain-processes-information-neural-networks.md` | Added interpretation safeguards for resting-state fMRI: motion artifacts, recording conditions, protocol harmonization, and reproducibility across sites. |
| 7 | `autism-sensory-sound-light-touch.md` | Checked contrasting 2026 Ayres Sensory Integration reviews: Piller et al. (12 studies; 4 RCTs) found encouraging goal-attainment evidence, whereas Kishida et al. (10 studies; 4 with low risk of bias) found limited and inconsistent higher-quality evidence. Clarified that results concern selected participation outcomes, not treating core autism or all sensory therapies. |
| 8 | `why-autism-differs-between-people.md` | Clarified 2025 Litman et al. cluster findings: algorithm-derived statistical groups are neither four fixed biological subtypes nor separate clinical diagnoses. |
| 9 | `genetics-environment-autism-risk-evidence.md` | Verified 2013 valproate study: n=655,615, exposed n=508, estimated 14-year absolute risk 4.42% (95% CI 2.59-7.46%) versus 1.53% (1.47-1.58%) in full cohort. Retained strong warnings against stopping treatment without medical care and distinguished this from vaccines and observational exposures. |
| 10 | `microglia-immune-system-and-autism.md` | Compared conflicting Suzuki, Zürcher and Simpson TSPO-PET findings; made lack of cell-type specificity explicit and avoided extrapolation from animal or iPSC findings to all autistic people. |
| 11 | `gut-microbiome-and-autism-evidence.md` | Checked Yap et al. 2021 diet confounding (n=247), 2024 probiotics RCT synthesis (12 trials, n=630), and 2023 GI symptom estimates (55% overall, 37% constipation) with very high between-study heterogeneity. Explained AUC as discrimination rather than clinical positive predictive value. |
| 12 | `can-mri-blood-genetics-diagnose-autism.md` | Verified FDA device records K243558 and EarliPoint K253442 decision of March 5, 2026; differentiated specific authorized clinical decision aids from universal biological tests; retained NICE, AAP and ACMG indications for additional workup. |

## Verified cornerstone sources

- Bai et al., 2019: https://doi.org/10.1001/jamapsychiatry.2019.1411
- Ozonoff et al., familial recurrence, 2024: https://doi.org/10.1542/peds.2023-065297
- Stoner et al., cortical patches, 2014: https://doi.org/10.1056/NEJMoa1307491
- King et al., functional connectivity replicability, 2019: https://pubmed.ncbi.nlm.nih.gov/31285817/
- Piller et al., Ayres Sensory Integration review, 2026: https://pubmed.ncbi.nlm.nih.gov/41324442/
- Kishida et al., contrasting Ayres Sensory Integration review, 2026: https://doi.org/10.1007/s10803-026-07283-7
- Litman et al., autism heterogeneity clusters, 2025: https://doi.org/10.1038/s41588-025-02224-z
- Christensen et al., valproate, 2013: https://pubmed.ncbi.nlm.nih.gov/23613074/
- Paolicelli et al., mouse synaptic pruning, 2011: https://pubmed.ncbi.nlm.nih.gov/21778362/
- Suzuki et al., TSPO PET, 2013: https://pubmed.ncbi.nlm.nih.gov/23404112/
- Yap et al., microbiome and diet, 2021: https://pubmed.ncbi.nlm.nih.gov/34767757/
- Gan et al., GI symptoms, 2023: https://doi.org/10.3389/fped.2023.1120728
- Kotowska et al., probiotics RCT meta-analysis, 2024: https://pubmed.ncbi.nlm.nih.gov/39173907/
- WHO vaccine evidence review, September 2026: https://www.who.int/publications/i/item/9789240123533
- FDA Canvas Dx clearance, 2025: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm?ID=K243558
- FDA EarliPoint clearance, March 2026: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K253442

## Layout and workflow checks

- All 12 retain their original routes, translation keys, source lists, cover-image paths, author attribution and medical disclaimers.
- Standardized dated editorial updates to 2026-10-16.
- Removed over-repeated generic section labels and conversational filler; made numerical caveats more prominent where supported.
- Preserved factual separation of group research, individual diagnosis, treatment claims and clinical advice.
- Kept existing original non-AI SVG illustrations intact; no new patient photographs or third-party imagery.
- Pull-request CI: typography/type-scale, scientific content schema, link targets, route stability, image provenance and HTML accessibility.
