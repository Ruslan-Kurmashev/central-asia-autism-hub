# Mother-and-child references and protected examples

## Source pair supplied with this Project

The owner supplied two PNG images labelled `Референсы мамы и ребенка 1.png` and `Референсы мамы и ребенка 2.png` (both 1448 x 1086). They are **style references**, not a source of verified educational text. Their source SHA-256 values are recorded in `manifest.json` to prevent confusion between similarly named files. They were **not** copied to this public Git repository in this change. Consult the actual Project attachments when available. If unavailable, do not pretend to have reviewed their appearance.

- Reference 1: four table-setting scenes. The same adult and child sit at a table. Blue mat, cup, spoon, calm facial expressions. Some embedded wording is inaccurate or distorted, and must never be copied without editorial correction.
- Reference 2: four dressing scenes. Mother guides a boy in an orange shirt with a yellow stripe. Demonstration goes from supported dressing to a child doing more steps independently. Panel captions are a layout example, not a substitute for checked instructions.
- Character continuity: long dark-chestnut/brown hair tied back for the mother, blue long-sleeved top, rounded clean features. The boy has short brown hair, an orange top with yellow band, and, where visible, dark teal trousers.
- Graphic continuity: soft flat-shaded cartoon figures, rounded white cards with pale blue borders, pale blue oval backdrop, restrained warm highlights, clearly drawn real actions, navy Cyrillic title style. Layout is generally two-by-two panels with comfortable margins.
- Color values below are descriptions rather than approved exact CSS tokens. Do not infer a new site-level design palette from raster image samples.

## Protected existing GitHub examples

The `lockedRepositoryExamples` entries in `manifest.json` identify previously approved and published images. Their Git blob hashes are checked automatically. These are **examples**, not a claim that any one of them replaces the two attached source reference PNGs.

To intentionally replace a protected example, first obtain explicit owner approval for the exact replacement, update the image provenance entry, update its hash and size in the manifest, and review the resulting rendered article. Do not blindly regenerate an approved image to make it pass the checker.

## Required editorial review for newly generated practical graphics

1. Identify the exact article and exercise. Copy the actual approved step sequence, without additions.
2. Match approved character appearance and action order. Each frame must visibly show its named task.
3. Verify all words in the RU, KK or EN version manually, because generated image text can contain errors. Do not rely on OCR alone.
4. Ensure essential instructions remain accessible as ordinary text, with informative alt or caption. Avoid redundant adjacent step lists where the owner approved removal, but retain an accessible text equivalent.
5. Reject implausible action sequences, object duplicates, misplaced hands, different character clothes, illegible labels and overlapping cards.
6. Check rights and origin, including stock-photo licenses separately from original instructional illustrations.
7. Check 360, 768 and 1440 px renderings and confirm the **actual changed article** loads the intended file.
8. Record explicit approval for the finished artifact. A stylistically similar new graphic is not approved automatically.

## What automated checks do and do not establish

`npm run check:visual-references` confirms that locked repository example files still exist, retain expected bytes, and have unchanged Git blob IDs. The check cannot establish artistic similarity, educational correctness, copyright permissions or medical efficacy. These require deliberate human review.

If the two owner-supplied original PNG files are later transferred into the repository, replace `storageStatus` with a verifiable repository path and introduce exact SHA-256 verification. Do not claim they were uploaded merely because the manifest names them.
