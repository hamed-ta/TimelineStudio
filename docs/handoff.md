# Handoff

## Current Goal

Add annotation notes with a leader arrow and text balloon.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Timeline items now include a note type for point annotations. Notes render with an anchor point, straight arrow leader, and rounded text balloon below all timeline lines, use a single date, and stay lane-bound.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`94cc43f feat: add vertical marker items`

## Work Completed This Session

- Added product concept and acceptance scenario for annotation note items.
- Added `note` to the typed timeline item model, default colors, title text, and normalization.
- Added Note to the toolbar and item type selector.
- Rendered notes as point annotations with an anchor, straight arrow leader, and rounded text balloon below all timeline lines.
- Added note export styles so SVG/PNG/PDF output keeps the note leader, anchor, and balloon styling.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `app.js`
- `src/App.tsx`
- `src/timeline/model.ts`
- `src/timeline/svgExport.ts`
- `styles.css`

## Decisions

- Use a distinct `note` type rather than overloading `event` or `text`, so annotations can have their own leader/balloon rendering.
- Notes are point-based in this slice and do not require a period. Range-attached notes should be a separate future behavior decision.
- Keep notes lane-bound so they can be reordered with timeline lines like other lane items.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: clicked Note in the toolbar.
- Browser smoke: item type became `note`, lane input stayed enabled at `2`, and the end date field was hidden.
- Browser smoke: one selected `.item-note` rendered with label `New note`.
- Browser smoke: note anchor rendered at the date point, the leader line rendered straight down with matching x coordinates, and the balloon rendered below all timeline lines at y=470 after the last lane y=452.
- Browser smoke: console error log was empty during note checks.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add annotation note items`

## Next Safe Step

Improve event marker styling with a richer beveled or glass-like appearance.
