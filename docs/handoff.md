# Handoff

## Current Goal

Add vertical all-line marker items for global reference dates.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`02a14e9 feat: add line reordering and removal`

## Work Completed This Session

- Added product concept and acceptance scenario for all-line marker items.
- Added `marker` to the typed timeline item model, default colors, title text, and normalization.
- Added Marker to the toolbar and item type selector.
- Rendered markers as dashed vertical lines across the full lane area, with marker export styles.
- Updated the item form so marker items hide end date controls and disable lane editing.
- Kept marker drag behavior date-only by pinning marker lane to zero.
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

- Use a distinct `marker` type rather than overloading `event`, so saved JSON and future UI can reason about all-line reference dates explicitly.
- Markers have no end date and are not lane-bound; lane is normalized to zero and the lane input is disabled in the form.
- Draw markers behind normal items so they act as timeline reference guides without hiding item content.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: clicked Marker in the toolbar.
- Browser smoke: item type became `marker`, lane input was disabled at `0`, and the end date field was hidden.
- Browser smoke: one selected `.item-marker` rendered with label `New marker`.
- Browser smoke: marker line rendered from y=112 to y=452 across all five rows, with transparent hit line and marker color `#0f766e`.
- Browser smoke: console error log was empty during marker checks.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add vertical marker items`

## Next Safe Step

Review the marker interaction in the browser, then continue UI polish or JSON load/save smoke testing before Firebase work.
