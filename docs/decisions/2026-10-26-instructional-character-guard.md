# Decision: explicit character reference pair and locked published examples

- Date: 2026-10-26
- Status: stage 2 visual quality protection approved for the scoped task
- Scope: character continuity and protection of instructional images

Two source image files supplied inside the AutismHub Project are distinguished by original filenames, dimensions and SHA-256 digests in `docs/visual-references/manifest.json`. They define the desired mother-and-boy instructional style, but neither original has been copied to this public repository in this change. Their embedded text must be independently checked.

Previously published owner-approved example assets within `public/images/editorial/` are protected against silent modification using exact Git blob hashes in the same manifest. These are not designated substitutes for the original source pair.

The `check:visual-references` script is a mandatory part of `npm run validate`. A failed check is resolved by recovering an approved image or recording a real new owner approval, never by automatically changing the stored expected hash. Human visual and medical review is still required.

See `docs/visual-references/README.md`, `docs/AUTISMHUB_VISUAL_STYLE.md` and the existing provenance register. No existing article image or cover is modified by this decision.
