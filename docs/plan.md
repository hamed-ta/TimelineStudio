# Plan

## Current Goal

Move Timeline Studio toward a modern account-based web app while preserving the current local timeline editor behavior.

## Current Slice

Refine the sidebar and toolbar into standard collapsible panels.

## Now

- Keep the layout update behavior-preserving: the app should still run locally, edit timelines, save JSON, and preserve all legacy DOM IDs and data hooks.
- Keep the editor sidebar fixed on the left and the toolbar fixed near the top of the timeline stage.
- Keep the current timeline title, date range, and Fit action in the main app header.
- Remember sidebar and toolbar collapse preferences in browser storage.
- Use clear chevron-style `lucide-react` icons for collapse/expand state instead of character buttons.
- Keep personal timeline JSON files in ignored `user-data/`.

## Next

- Start small UI polish slices in React while preserving the element IDs and behavior expected by `app.js`.
- Verify local JSON load, edit, save, pan, zoom, fit, and export before adding Firebase.
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
- Committed the modern web app migration plan in `4f95f80`.
- Committed the minimal Vite, React, and TypeScript shell in `62f912a`.
- Extracted timeline document types, default timeline creation, item normalization, and timeline normalization into `src/timeline/model.ts`.
- Extracted shared date parsing, date math, snapping, clamping, and numeric normalization helpers into `src/timeline/dates.ts`.
- Extracted timeline JSON parse and serialize behavior into `src/timeline/json.ts`.
- Extracted browser download and save-picker helpers into `src/platform/files.ts`.
- Extracted PDF byte generation into `src/timeline/pdf.ts`.
- Extracted image loading and canvas-to-blob helpers into `src/platform/media.ts`.
- Extracted SVG export serialization and export CSS into `src/timeline/svgExport.ts`.
- Extracted display date, Iranian date, month, and zoom formatting into `src/timeline/formatters.ts`.
- Added `CHANGELOG.md` and `docs/versioning.md` without bumping the package version.
- Added system light/dark theme tokens, component styling, and a theme switcher.
- Added dependency policy guidance in ADR 0006 and agent docs.
- Added collapsible sidebar and toolbar controls with `lucide-react` icons.
- Moved the timeline title, date range, and Fit action into the main top bar.

## Risks

- Browser file picker support varies.
- Export behavior may differ across browsers.
- Manual testing is still doing work that automated browser tests should eventually cover.
- Workflow docs can drift if `/closeup` is not used consistently.
- Personal JSON files should stay in ignored `user-data/`.
- The framework migration can accidentally change timeline behavior if it is done as a rewrite instead of small preservation steps.
- UI changes must preserve the DOM IDs and data attributes that legacy `app.js` still binds to until the controller is migrated.
- Version changes should be intentional and documented in `CHANGELOG.md`; do not bump `package.json` during routine migration slices.
- Firebase read/write patterns can create avoidable cost if autosave and realtime listeners are not scoped carefully.
- Dependencies can increase bundle size, audit noise, and maintenance cost if they are not scoped to real feature value.
- `lucide-react` is justified only for focused iconography; avoid expanding it into a full design-system dependency.

## Verification Checklist

During the current legacy-app phase:

- `node --check app.js`
- `npm run typecheck`
- `npm run build`
- App loads at `http://127.0.0.1:8765/`
- Create event
- Create period
- Rename line
- Pan by dragging
- Zoom in/out
- Fit timeline
- Save JSON
- Load JSON
- Export SVG/PNG/PDF

- Existing local JSON can be loaded, edited, and saved
