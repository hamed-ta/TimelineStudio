# Timeline Studio logo exploration

Status: user selected A, **Gentle turn**, then approved palette 03 **Sage + amber** on 2026-10-25 and requested website integration, commit, and push. Production artwork is in `public/brand/`; `docs/brand/usage.md` owns usage guidance. This directory preserves the exploration, including the earlier Blue hour recommendation.

## Brief

Create an identity for an app that lets people make different kinds of personal timelines. It should feel calm, safe, personal, and unhurried. Interpret safety as a welcoming tone; the artwork must not imply a security certification or a product privacy guarantee.

Assumptions: Timeline Studio is the requested brand; the quoted Kiln and asset-conversion examples are not separate briefs. Use lowercase in the exploratory lockups to soften the name. Follow the existing midnight/daylight world in `DESIGN.md`, without copying AuthKit or WorkOS branding. Primary uses are the editor header, browser tab, app tile, and exported brand material.

## Current identity critique

Source review: `TimelineHeader.tsx` pairs a CSS `brand-mark` square with the app name; `styles.css` gives the square a shaded blue ground and a thin vertical highlight. This conveys the app's atmosphere, but the silhouette is a generic tile. The highlight depends on contrast and scale, and offers little independent recognition in one colour. Retain the restrained mood and replace the decorative square with a recognizable flat shape.

## Strategy and exploration

Word map: personal → moments, chapters, own pace; timeline → thread, interval, continuity; calm/safe → soft endings, stable horizontal forms, room to breathe.

Avoid stock clocks, calendars, progress arrows, locks, and shields. The first three add urgency or literal tool imagery; the last two suggest unsupported assurances. Avoid relying on a gradient, glow, or fine connecting lines for recognition.

Exploration longlist, scored informally out of 25 for clarity, distinction, simplicity, relevance, and small-size strength:

| Idea | Type | Score | Decision |
| --- | --- | --- | --- |
| Gentle turn: a rounded t gives one separate moment room beside it | Letterform + wordmark | 21 | Build A |
| Open chapters: two page-like shapes share a quiet horizontal interval | Abstract + wordmark | 20 | Build B |
| At your pace: a line and a moment echo the wordmark's pill-shaped i dots | Wordmark-led | 19 | Build C |
| Bookends: brackets hold a moment between them | Abstract | 16 | Too much scan-tool resemblance |
| Sheltered horizon: an open arch protects a time axis | Pictorial | 15 | Too close to an eye or surveillance reading |
| Chapter ribbon: a single folded S crosses an axis | Letterform | 15 | Too many turns at favicon scale |
| Margin note: a page corner opens into a time marker | Pictorial | 14 | Generic document-editor territory |
| Shared path: parallel lines gently come together | Abstract | 14 | Implies collaboration beyond this brief |
| Stitched time: short dashes make a continuous thread | Abstract | 13 | Fine details disappear at small sizes |
| TS ligature: the initials share a rounded spine | Monogram | 13 | More decoding than this calm identity needs |

Category research used the logo-design skill's bundled productivity/collaboration library. Subject/technique searches and a shelf comparison informed construction; no reference artwork is included in the concepts. This is a visual reference check, not trademark clearance.

## Three directions

- **A — Gentle turn, recommended.** A custom filled lowercase t with 32-unit strokes, round terminals, a soft lower turn, and a detached 32-unit moment. Most direct connection to the name; compact enough for an app tile. Risk: lowercase t marks are familiar, so preserve the crossbar/dot relationship and refine the wordmark further if selected.
- **B — Open chapters.** Two opposing curved page shapes, with a 32-unit open interval between them. More abstract and reflective; no single kind of personal timeline is depicted. Risk: it can also read as leaves or a stacked S, so the name will matter during introduction.
- **C — At your pace.** A horizontal capsule and a separate moment support a wordmark with custom pill-shaped i dots. The quietest choice. Risk: the symbol alone is generic and occupies little vertical space; this is the weakest direction for a favicon.

`concepts.png` is the review image; `concepts.svg` is its editable presentation source. The current artwork is `a/b/c-symbol-v2.svg` and `a/b/c-lockup-v2.svg`. Version 1 files retain the first exploration. The presentation labels use live text; all six current logo drawings have outlined type and closed filled geometry, without fonts, strokes, raster content, or effects.

Typography starts from locally bundled Space Grotesk, at weight 500 for A and 450 for B/C, with optical spacing adjustments. C customizes the i dots. The source font is licensed under SIL OFL 1.1; the project includes its notice at `public/licenses/fonts/space-grotesk.txt`. No new runtime dependency was added.

## Verification

- Round 1: rendered and visually reviewed the overview; ran `svg_audit.py` on all six v1 drawings. Found excess coordinate precision, a tiny descriptor tittle, an overly scan-like B, and a visually undersized C.
- Round 2: shortened A's lower terminal, replaced B's frame with page-like shapes, enlarged C's capsule/dot from 32/40 to 48/48 units, enlarged the studio descriptor, and rounded type coordinates to two decimals. Rendered and inspected `concepts.png`.
- Final structural audit: no FAIL or WARN findings in any v2 drawing. Symbol scores were 99/100, 100/100, and 99/100; lockups were 99/100. These are heuristic scores, not approval or production certification. Informational findings concern A's intentionally raised optical centre, C's wide proportions, and the outlined wordmarks' point count.
- Rendered and visually inspected a separate 1440×1150 verification sheet: symbols at 64/32/24/16 px, lockups at 160 px wide, black on white, ice on midnight, mirrored and rotated shapes, 64 px tile/circular contexts, and a same-size reference shelf. A's separate dot remains visible at 16 px; B's interval remains open. C survives as punctuation but has less presence. The v2 lockups remain readable at the provisional 160 px width.
- Local visual evidence: ignored `.impeccable/review/logo-concepts-2026-10-25-qa.png` and its SVG. Shelf references are Tumblr, Zendesk, Trello, and Basecamp, used only for study.
- An HTML review sheet was generated in `/private/tmp`; the headless Chrome screenshot attempt produced no file. Visual conclusions above come from `rsvg-convert` renders inspected as images, not from browser or device validation.
- Final SVG/XML and whitespace checks passed. App tests/build were not rerun for this design-only change. No product behavior changed, so no BDD scenario was added.

## Next checkpoint

A and Sage + amber are approved. The app header/footer, browser/home-screen icons, and social card use that identity. `a-colour/colour-studies.png` and the versioned SVGs remain historical proposals; use `public/brand/` and `docs/brand/usage.md` for production artwork and guidance. Trademark clearance was not performed.
