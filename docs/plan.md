# Plan

## Current Goal

Move Timeline Studio toward a modern account-based web app while preserving the current local timeline editor behavior.

## Current Slice

Document the migration direction before changing runtime code.

## Now

- Record the stack decision: Vite, React, TypeScript, Firebase Auth, Firestore, and Firebase Hosting.
- Keep the first implementation slice behavior-preserving: the app should still run locally, load JSON, edit timelines, and save JSON.
- Keep personal timeline JSON files in ignored `user-data/`.

## Next

- Add a minimal Vite + React + TypeScript shell without changing user-visible behavior.
- Move the existing app behavior into the new shell in small testable steps.
- Verify local JSON load, edit, save, pan, zoom, fit, and export before adding backend features.
- Add Firebase only after the local app migration is stable.

## Later

- Add Firebase Auth with Google and email/password sign-in.
- Add Firestore-backed per-user timeline storage behind a repository abstraction.
- Add Firebase Hosting deployment.
- Add optional Google Drive import/export as a user-owned backup path.
- Add a lightweight automated browser test harness when the user wants true test-first red/green UI checks.
- Add validation for malformed imported JSON.
- Add a visible unsaved-change indicator.
- Add keyboard shortcuts.
- Add item color controls.
- Add richer PDF export options.
- Add Playwright tests for save/load, pan, zoom, lock, fit, and export flows.

## Done Recently

- Removed default sample data.
- Added save picker with download fallback.
- Added fit button.
- Added lock state.
- Added Iranian date labels in English words and numbers.
- Fixed `AGENTS.md` so it is complete and parseable.
- Added missing workflow files referenced by `AGENTS.md`.
- Turned `docs/handoff.md` into a real current-state handoff.
- Added initial ADRs for decisions already made.
- Committed the agentic workflow docs in `e3ef60b`.
- Added `.gitignore` rules for `user-data/` and `.DS_Store`.
- Committed ignored user data and handoff cleanup in `ca4bd12`.

## Risks

- Browser file picker support varies.
- Export behavior may differ across browsers.
- Manual testing is still doing work that automated browser tests should eventually cover.
- Workflow docs can drift if `/closeup` is not used consistently.
- Personal JSON files should stay in ignored `user-data/`.
- The framework migration can accidentally change timeline behavior if it is done as a rewrite instead of small preservation steps.
- Firebase read/write patterns can create avoidable cost if autosave and realtime listeners are not scoped carefully.

## Verification Checklist

During the current static-app phase:

- `node --check app.js`
- App loads at `http://127.0.0.1:8765/index.html`
- Create event
- Create period
- Rename line
- Pan by dragging
- Zoom in/out
- Fit timeline
- Save JSON
- Load JSON
- Export SVG/PNG/PDF

After the Vite migration starts:

- `npm run typecheck`
- `npm run build`
- App loads from the Vite dev server
- Existing local JSON can be loaded, edited, and saved
