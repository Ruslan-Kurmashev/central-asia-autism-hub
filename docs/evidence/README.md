# Scientific and Kazakhstan legal claim register

**Status:** register template introduced 26 October 2026. No claims have been independently validated merely by creating this directory.

The register `claims-register.csv` supplements structured sources already stored in published Markdown frontmatter. The individual article remains the canonical location for public citations.

## When to log a claim

Prioritize claims that can change medical decisions or perception, including ASD prevalence, causes, intervention effectiveness, screening or assessment accuracy, health and developmental guidance, and Kazakhstan-specific service eligibility, regulations, fees and deadlines.

For each substantive claim record:
- unique claim ID and stable article path or `translationKey`
- exact claim wording and its type
- source title and DOI or authoritative URL
- study or issuing authority, source date and current version
- population, location and important limitations
- whether the cited source actually supports the complete claim
- date checked, named checker, next review due, and status

Allowed status values: `pending`, `verified`, `needs_revision`, `withdrawn`. Do not set `verified` based on an AI-generated summary or a citation appearing plausible.

Cochrane Library: https://www.cochranelibrary.com/  
PubMed: https://pubmed.ncbi.nlm.nih.gov/  
NICE: https://www.nice.org.uk/guidance  
WHO: https://www.who.int/  
Kazakhstan: current authoritative documents at https://adilet.zan.kz/ and official ministry sources.

A source list does not guarantee appropriate interpretation. Check study design, population, bias, publication and corrections/retractions. Do not extrapolate an international legal claim to Kazakhstan. A blank registry is not proof that existing articles are source-verified.

## Use

Add rows only after checking the actual source. Preserve verification history in Git and update `checked_at` when a claim is re-checked. Disputed medical or legal claims are kept out of publication or corrected before marking `verified`. Never enter personal patient data.
