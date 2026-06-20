# Handoff

## Current Goal

Complete the final small structural cleanup before UI polish: typed display formatting plus versioning/changelog docs.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules now own:

- timeline model and normalization: `src/timeline/model.ts`
- date math and snapping: `src/timeline/dates.ts`
- date/month/zoom display formatting: `src/timeline/formatters.ts`
- JSON parse/serialize: `src/timeline/json.ts`
- PDF byte generation: `src/timeline/pdf.ts`
- SVG export serialization: `src/timeline/svgExport.ts`
- browser file save/download helpers: `src/platform/files.ts`
- browser media helpers: `src/platform/media.ts`

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`566e406 refactor: extract svg export helper`

## Work Completed This Session

- Added `src/timeline/formatters.ts`.
- Moved Gregorian date, Iranian date, month, and zoom formatting helpers out of `app.js`.
- Added `CHANGELOG.md`.
- Added `docs/versioning.md`.
- Updated README, AGENTS, and closeup workflow docs to reference changelog/versioning rules.
- Kept `package.json` version at `0.1.0`.

## Files Changed

- `AGENTS.md`
- `CHANGELOG.md`
- `README.md`
- `app.js`
- `docs/closeup.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/versioning.md`
- `src/timeline/formatters.ts`

## Decisions

- Keep this slice behavior-preserving; no UI changes and no Firebase work.
- Do not bump `package.json` during routine migration slices.
- Use `CHANGELOG.md` `Unreleased` for notable unreleased changes.
- UI work can start next, but it must preserve the DOM IDs and data attributes that legacy `app.js` still binds to.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: created an event, entered `2026/02/03`, applied the item form, and confirmed the preview showed `Feb 3, 2026 / 14 Bahman 1404`.
- Browser smoke: confirmed the stage meta still showed Gregorian and Iranian date text.
- Browser smoke: clicked Save JSON and confirmed status changed to `JSON saved` with no console errors.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`refactor: extract timeline formatters`

## Next Safe Step

Run one manual JSON load/edit/save check with an existing file from `user-data/`. If that passes, start UI polish in small React/CSS slices while preserving the IDs and data attributes used by `app.js`.
