# Handoff

## Current Goal

Continue the React/TypeScript migration by moving PDF byte generation out of legacy `app.js`.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, SVG/canvas export rendering, pan, zoom, fit, lock state, and line renaming.

Timeline document types, default timeline creation, item normalization, and timeline normalization live in `src/timeline/model.ts`.

Shared date parsing, ISO date math, snap normalization, clamping, and numeric normalization live in `src/timeline/dates.ts`.

Timeline JSON parse/serialize behavior lives in `src/timeline/json.ts`.

Browser download and save-picker helpers live in `src/platform/files.ts`.

PDF byte generation now lives in `src/timeline/pdf.ts`. `app.js` still renders the timeline to canvas/JPEG and calls the typed helper to build the PDF bytes.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`65f5d93 refactor: extract browser file helpers`

## Work Completed This Session

- Added `src/timeline/pdf.ts`.
- Moved `buildPdfFromJpeg` into the typed PDF helper module.
- Updated `app.js` to import `buildPdfFromJpeg` instead of defining it locally.

## Files Changed

- `app.js`
- `src/timeline/pdf.ts`
- `docs/handoff.md`
- `docs/plan.md`

## Decisions

- Keep this slice behavior-preserving; no UI changes and no Firebase work.
- Keep SVG serialization and canvas/JPEG rendering in `app.js` for now.
- Keep JSON import/export as a first-class compatibility path.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: created an event, edited the title, applied the item form, and confirmed the SVG contained the new item.
- Browser smoke: clicked PDF export and confirmed status changed to `PDF exported` with no console errors.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Most rendering and interaction behavior still lives in untyped legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`refactor: extract pdf generation helper`

## Next Safe Step

Manually run the Vite app, load an existing JSON file from `user-data/`, edit it, save it, and confirm the saved file restores correctly. Then extract the next small boundary, preferably SVG export/rendering helpers or app controller state, before adding Firebase.
