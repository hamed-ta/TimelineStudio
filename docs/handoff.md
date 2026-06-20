# Handoff

## Current Goal

Add direct line management so users can reorder and remove timeline lines.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`cdf7834 feat: add collapsible layout panels`

## Work Completed This Session

- Added product scenarios for reordering and removing lines.
- Added sidebar line rows with pointer-drag handles and remove buttons.
- Added draggable timeline lane-label hit areas.
- Updated line reordering so items stay attached to their line as the line moves.
- Updated line removal so it confirms before deleting the line, removes items on that line, and shifts lower lines up.
- Reduced the renderer's lane minimum to one while keeping new timelines seeded with five lines.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `app.js`
- `styles.css`

## Decisions

- Use pointer dragging for sidebar line reorder instead of browser-native HTML drag/drop because it matches the existing timeline interaction model and works more reliably across test/browser surfaces.
- Removing a line is destructive for items on that line, so it requires confirmation.
- Preserve saved JSON compatibility; line order continues to live in `settings.laneLabels`, and item lane numbers are remapped during reorders/removals.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: created a default event on Line 3.
- Browser smoke: dragged Line 3 from the sidebar to the top; labels became `Line 3`, `Line 1`, `Line 2`, `Line 4`, `Line 5`, and the event marker moved from row y=282 to y=146.
- Browser smoke: dragged Line 3 from the timeline label area to the bottom; labels became `Line 1`, `Line 2`, `Line 4`, `Line 5`, `Line 3`, and the event marker moved to row y=418.
- Browser smoke: removed a line; line count dropped from five to four and status changed to `Line removed`.
- Browser smoke: console error log was empty during reorder checks.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add line reordering and removal`

## Next Safe Step

Add vertical all-line marker items for dates that should visually distinguish events across every line.
