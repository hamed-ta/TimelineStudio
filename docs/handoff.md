# Handoff

## Current Goal

Complete the first behavior-preserving Vite, React, and TypeScript migration slice.

## Last Known State

Timeline Studio now has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine is still responsible for timeline pan, zoom, fit, lock state, line renaming, JSON save/load, and SVG/PNG/PDF export.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Agent workflow documents are in place and committed. `AGENTS.md` points to the detailed workflow docs instead of duplicating the full red/green/refactor process.

The accepted target stack for the next product direction is Vite, React, TypeScript, Firebase Auth, Firestore, and Firebase Hosting. The first implementation step should preserve existing local behavior before adding Firebase.

## Last Commit

`4f95f80 docs: plan modern web app migration`

## Work Completed This Session

- Established RED with `npm run build`, which failed because `package.json` did not exist.
- Added `package.json`, `package-lock.json`, `tsconfig.json`, and `vite.config.ts`.
- Replaced `index.html` with the Vite entry shell.
- Added `src/App.tsx` to render the existing app DOM through React.
- Added `src/main.tsx` to mount React and then load the existing `app.js` timeline engine.
- Marked `app.js` as an ES module for Vite import.
- Kept JSON download fallback working when the file picker is unavailable or blocked.
- Added `node_modules/` and `dist/` to `.gitignore`.
- Updated README, AGENTS, browser smoke, plan, and handoff docs for the Vite workflow.

## Files Changed

- `.gitignore`
- `AGENTS.md`
- `README.md`
- `app.js`
- `index.html`
- `package-lock.json`
- `package.json`
- `src/App.tsx`
- `src/main.tsx`
- `tsconfig.json`
- `vite.config.ts`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/workflows/browser-smoke.md`

## Decisions

- Keep personal timeline files out of default app state.
- Use `user-data/` for local user-owned data that should not be committed.
- Keep detailed red/green/refactor instructions in `docs/workflows/red-green-refactor.md`; keep `AGENTS.md` as a concise rule and pointer.
- Use React first as a DOM shell while leaving legacy timeline behavior in `app.js`.
- Add Firebase Auth, Firestore, and Firebase Hosting only after the local Vite app is stable.
- Keep JSON import/export as a first-class portability feature.
- Treat Google Drive as a possible later import/export or backup integration, not primary storage.
- Do not force an `esbuild` transitive override for the low-severity Windows-only dev-server advisory because Vite declares `esbuild ^0.27.0` and the patched version is `0.28.1`.

## Verification

- RED: `npm run build` failed before migration because `package.json` was missing.
- `npm install`: passed.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: created an event, edited the title, applied the item form, and confirmed the SVG contained the new item.
- Browser smoke: clicked Save JSON and confirmed status changed to `JSON saved` with no console errors.
- `npm audit --json`: reports one low-severity transitive `esbuild` advisory affecting Windows dev server use.

## Open Issues

- No automated browser test harness exists yet.
- Browser smoke checks are manual until a test harness such as Playwright is added.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Most timeline behavior still lives in untyped legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add vite react typescript shell`

## Next Safe Step

Manually run the Vite app, load an existing JSON file from `user-data/`, edit it, save it, and confirm the saved file still restores correctly. Then continue extracting legacy timeline behavior into typed modules before adding Firebase.
