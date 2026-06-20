# Handoff

## Current Goal

Finish the current behavior-preserving export helper extraction and prepare for UI polish.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Timeline document types, default timeline creation, item normalization, and timeline normalization live in `src/timeline/model.ts`.

Shared date parsing, ISO date math, snap normalization, clamping, and numeric normalization live in `src/timeline/dates.ts`.

Timeline JSON parse/serialize behavior lives in `src/timeline/json.ts`.

Browser download and save-picker helpers live in `src/platform/files.ts`.

PDF byte generation lives in `src/timeline/pdf.ts`.

Image loading and canvas-to-blob conversion live in `src/platform/media.ts`.

SVG export serialization and export CSS now live in `src/timeline/svgExport.ts`. `app.js` still owns live SVG rendering and timeline-to-canvas orchestration.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`efd50e4 refactor: extract browser media helpers`

## Work Completed This Session

- Added `src/timeline/svgExport.ts`.
- Moved SVG export CSS into the typed SVG export helper module.
- Moved export SVG clone cleanup and serialization into the typed SVG export helper module.
- Updated `app.js` to call `serializeTimelineSvg(dom.timelineSvg)` for SVG, PNG, and PDF export paths.

## Files Changed

- `app.js`
- `src/timeline/svgExport.ts`
- `docs/handoff.md`
- `docs/plan.md`

## Decisions

- Keep this slice behavior-preserving; no UI changes and no Firebase work.
- Keep live SVG rendering and timeline-to-canvas orchestration in `app.js` for now.
- UI work can start next, but it must preserve the DOM IDs and data attributes that legacy `app.js` still binds to.
- Keep JSON import/export as a first-class compatibility path.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: created an event, edited the title, applied the item form, and confirmed the SVG contained the new item.
- Browser smoke: clicked SVG export and confirmed status changed to `SVG exported` with no console errors.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`refactor: extract svg export helper`

## Next Safe Step

Run one manual JSON load/edit/save check with an existing file from `user-data/`. If that passes, start UI polish in small React/CSS slices while preserving the IDs and data attributes used by `app.js`.
