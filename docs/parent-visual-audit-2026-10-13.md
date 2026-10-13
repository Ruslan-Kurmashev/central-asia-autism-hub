# Parent article visual audit, 13 October 2026

**Scope:** the published Russian-language *Parents* section on Autism Hub Kazakhstan. Read-only editorial review against the `main` version that passed PR #111. The full `npm run audit:parent-visuals` command checks built HTML and is retained as a repeatable QA instrument. This is not a claim that every photograph was pixel-inspected at mobile/browser dimensions.

## Summary

- **82** published Russian parent Markdown records (including **3 duplicate slug pairs**, so 79 distinct published URLs).
- **36** distinct primary featured-image URLs across the 82 source records.
- **22** individual image URLs reused for at least two separate source records; **68** article-image assignments use a reused image.
- **9** adjacent same-image pairs in the displayed Parents article lists; another **4** same-image pairs with one article card between them.
- Images shown on a list card and in that same article's hero are *intentionally the same*: they define the article's visual identity, and this alone is not a defect.
- The featured image and alt text exist for the published pages. Original photographs downloaded by `scripts/sync-editorial-photos.mjs` during CI are not committed to Git; self-hosted originals are stored within `public/images/editorial/`.
- The current audit flagged the route duplications below as a separate issue; do not call the section visually approved until they are resolved.

## P0: duplicated published URLs

| Published source files | Shared public article slug | Images assigned |
| --- | --- | --- |
| `autism-myths-facts.md` + `mify-i-fakty-ob-autizme.md` | `mify-i-fakty-ob-autizme` | `parent-child-conversation.jpg` and `family-reading.jpg` |
| `autism-sensory-differences.md` + `sensornye-osobennosti-pri-autizme.md` | `sensornye-osobennosti-pri-autizme` | both `sensory-hands.jpg` |
| `why-autism-happens.md` + `pochemu-voznikaet-autizm.md` | `pochemu-voznikaet-autizm` | both `research-lab.jpg` |

These are published content collisions, not necessarily identical manuscripts. Determine the editorial canonical version for each pair and its translation key before unpublishing, redirecting or changing routes. The myths pair has a list/article image mismatch resulting from the collision.

## P1: nine immediately repeated covers in live list order

| Section | Consecutive articles | Shared photograph |
| --- | --- | --- |
| Child development | Developmental milestones; when to discuss development | `rubi-wooden-blocks.jpg` |
| Support | Toilet skills; everyday living skills | `parent-toileting-bathroom.jpg` |
| Support | Everyday participation; occupational therapy | `parent-hygiene-tools.jpg` |
| Support | Movement and physical activity; therapeutic exercise | `parent-movement-equipment.jpg` |
| Support | Therapeutic exercise; physiotherapy | `parent-movement-equipment.jpg` |
| Support | Ayres sensory integration; sensory adaptations | `sensory-hands.jpg` |
| Support | Task analysis; self-management | `parent-schedule-planner.jpg` |
| Feeding | Behavioural feeding approaches; dietitian and nutrition | `parent-food-ingredients.jpg` |
| Feeding | Sensory feeding approaches; ARFID | `parent-food-plate.jpg` |

A further four pairs repeat within two rows, including activity/exercise, listening-programs/sensory diet, differential reinforcement/reinforcement, and play/naturalistic teaching.

## P2: semantic suitability review

**Strong or reasonable topic match:** exercise equipment for physical activity, bathroom for toileting, hygiene tools for daily living, Kazakhstan dombra for creative approaches, actual family shared reading for joint attention, child development toys for general development, food imagery for general nutrition topics.

**Weak differentiation or only illustrative topic match; prioritise replacement from an existing licensed source or a genuinely distinct commissioned editorial visual:**

1. `rubi-wooden-blocks.jpg` across eight unrelated or only partly related guides, including behaviour analysis, reinforcement and parent training. Simple toy blocks do not explain these techniques.
2. `sensory-hands.jpg` across six guides, including Ayres integration, sensory environment and stimming. One tactile scene does not distinguish distinct principles.
3. `adapted-cbt-notebook.jpg` across adapted CBT, functional assessment, neuropsychological correction and screening: a notebook conveys paperwork, not the methods.
4. `parent-food-plate.jpg` used for ARFID and different feeding strategies. Avoid implying that ARFID is merely a vegetable-selection issue.
5. `psychological-support-room.jpg` used for broader co-occurring conditions and sensory overload; an empty room is not a clear explanation.
6. Blank cards for PECS and AAC modelling are **not real PECS or AAC materials**. Their alt labels correctly disclaim this, but the image should not imply intervention fidelity.
7. `parent-sensory-headphones.jpg` for auditory integration and sensory diet represents general objects, **not** a clinically validated intervention.

**Do not automatically swap pictures:** choose distinct, properly licensed source images whose actual visible content agrees with the article, or purpose-built neutral editorial illustrations. Do not make unsupported claims about anyone pictured, diagnoses, origin, clinical effectiveness or legal status.

## Next steps

1. Resolve the three duplicated URLs after confirming which substantive article revision is canonical; keep any useful unique information before withdrawing or redirecting the other.
2. Replace at least one image in each of the nine adjacent repeated pairs, starting with the three-article physical-activity run and the duplicated developmental cards.
3. Prioritise the overused toy-blocks, sensory-hands, generic notebook and blank-card covers.
4. Compare *actual image pixels*, not just filenames, in a browser/contact sheet at 360px, 768px and 1440px (also check image cropping, low-resolution derivatives and 200% zoom); record visual sign-off. The connector cannot perform this device-level verification.
5. Re-run `npm run audit:parent-visuals -- --strict` once existing route collisions and list-image mismatches are resolved; then consider fail-on-adjacency as a release gate.

No existing article images, content, slugs, public routes, or publication states were changed by this audit.
