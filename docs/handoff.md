# Handoff

## Current Goal

Prepare Timeline Studio for a small-step migration to a modern account-based web app.

## Last Known State

Timeline Studio is currently a static web app with timeline pan, zoom, fit, lock state, line renaming, JSON save/load, and SVG/PNG/PDF export.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Agent workflow documents are in place and committed. `AGENTS.md` points to the detailed workflow docs instead of duplicating the full red/green/refactor process.

The accepted target stack for the next product direction is Vite, React, TypeScript, Firebase Auth, Firestore, and Firebase Hosting. The first implementation step should preserve existing local behavior before adding Firebase.

## Last Commit

`ca4bd12 docs(chore): ignore user data and update handoff`

## Work Completed This Session

- Researched and selected the target modern web app stack with the user.
- Added an ADR for the Vite, React, TypeScript, Firebase Auth, Firestore, and Firebase Hosting direction.
- Updated product notes with planned account/cloud behavior and the requirement to preserve local JSON editing during migration.
- Updated the plan for a baby-step migration path.
- Corrected stale handoff state from the previous closeup.

## Files Changed

- `docs/adr/0005-modern-web-app-stack.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`

## Decisions

- Keep personal timeline files out of default app state.
- Use `user-data/` for local user-owned data that should not be committed.
- Keep detailed red/green/refactor instructions in `docs/workflows/red-green-refactor.md`; keep `AGENTS.md` as a concise rule and pointer.
- Migrate toward Vite + React + TypeScript first, preserving current local app behavior.
- Add Firebase Auth, Firestore, and Firebase Hosting only after the local Vite app is stable.
- Keep JSON import/export as a first-class portability feature.
- Treat Google Drive as a possible later import/export or backup integration, not primary storage.

## Verification

- Documentation-only change; no runtime behavior changed.
- `git status --short`: checked before editing.

## Open Issues

- Docs are modified but not committed.
- No automated browser test harness exists yet.
- Browser smoke checks are manual until a test harness such as Playwright is added.
- Vite, React, TypeScript, and Firebase are not installed yet.
- The app is still the original static `index.html`, `styles.css`, and `app.js` implementation.

## Suggested Commit Message

`docs: plan modern web app migration`

## Next Safe Step

Review and commit the documentation changes if accepted. Then start the first implementation slice: add a minimal Vite + React + TypeScript shell while keeping the current app runnable and preserving JSON load/edit/save behavior.
