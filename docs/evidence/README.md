# Scientific and Kazakhstan legal claim register

**Status:** initial scoped source cross-check records added 26 October 2026. These remain `pending` until human editorial sign-off. A valid row or passing CI is not clinical peer review.

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

## Initial recorded comparisons

Four source-level matches in two Research Explained articles were added on 2026-10-26. See [first source comparison](2026-10-26-initial-primary-source-crosscheck.md). These are AI-assisted comparisons with original paper text. No independent medical or human editorial sign-off is claimed.

### Automated integrity check

Run `npm run check:evidence-register`. It checks row structure, unique IDs, dates, content path, exact quoted frontmatter claim, referenced source metadata and status guardrails. It cannot check whether an article's scientific conclusion is valid or whether a paper has been retracted. A row can only become `verified` after documented human review by the responsible editor.

## Use

Add rows only after checking the actual source. Preserve verification history in Git and update `checked_at` when a claim is re-checked. Disputed medical or legal claims are kept out of publication or corrected before marking `verified`. Never enter personal patient data.
