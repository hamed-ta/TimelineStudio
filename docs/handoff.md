# Handoff

## Current Goal

Continue the React/TypeScript migration by moving shared date utilities out of legacy `app.js` and the model module.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, import/export, pan, zoom, fit, lock state, line renaming, and SVG/PNG/PDF export.

Timeline document types, default timeline creation, item normalization, and timeline normalization live in `src/timeline/model.ts`.

Shared date parsing, ISO date math, snap normalization, clamping, and numeric normalization now live in `src/timeline/dates.ts`. Both `app.js` and `src/timeline/model.ts` import those helpers instead of keeping duplicate local copies.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`62f912a feat(migration): add vite react typescript shell`

## Work Completed This Session

- Added `src/timeline/dates.ts`.
- Moved shared date parsing, ISO date math, snap normalization, clamping, and numeric normalization helpers into the typed date module.
- Updated `src/timeline/model.ts` to import date helpers from `src/timeline/dates.ts`.
- Updated `app.js` to import date helpers from `src/timeline/dates.ts`.
- Removed duplicated date helper implementations from `app.js` and `src/timeline/model.ts`.

## Files Changed

- `app.js`
- `src/timeline/dates.ts`
- `src/timeline/model.ts`
- `docs/handoff.md`
- `docs/plan.md`

## Decisions

- Keep this slice behavior-preserving; no UI changes and no Firebase work.
- Keep rendering and interaction logic in `app.js` until smaller typed boundaries are extracted.
- Keep JSON import/export as a first-class compatibility path.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: created an event, entered `2026/02/03`, applied the item form, and confirmed the date normalized to `2026-02-03`.
- Browser smoke: confirmed the SVG contained the new item.
- Browser smoke: clicked Save JSON and confirmed status changed to `JSON saved` with no console errors.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Most rendering and interaction behavior still lives in untyped legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`refactor: extract timeline date utilities`

## Next Safe Step

Manually run the Vite app, load an existing JSON file from `user-data/`, edit it, save it, and confirm the saved file restores correctly. Then extract the next small boundary, preferably JSON import/export repository behavior or SVG rendering helpers, before adding Firebase.
