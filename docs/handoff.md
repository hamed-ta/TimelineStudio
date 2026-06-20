# Handoff

## Current Goal

Refine the sidebar and toolbar into standard collapsible panels.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`51a6453 refactor: extract timeline formatters`

## Work Completed This Session

- Added layout behavior scenarios for a collapsible editor sidebar and timeline toolbar.
- Added ADR 0006 for dependency policy.
- Updated `AGENTS.md` so future work may add justified dependencies.
- Moved timeline action buttons into a dock inside the timeline stage while preserving existing IDs and `data-add` hooks.
- Removed nonstandard sidebar side and toolbar dock controls.
- Replaced unclear panel icons with animated chevron icon buttons for sidebar and toolbar collapse/expand controls.
- Moved the current timeline title, date range, and Fit action into the main top bar.
- Added `lucide-react` for standard panel icons.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `AGENTS.md`
- `docs/adr/0006-dependency-policy.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `package-lock.json`
- `package.json`
- `src/App.tsx`
- `styles.css`

## Decisions

- Keep the layout standard: fixed left editor sidebar, top timeline toolbar, and collapse/expand only.
- Use `lucide-react` as a focused dependency for recognizable, accessible layout icons.
- Reasonable dependencies are allowed when justified by feature value, but broad/cross-cutting choices need an ADR.
- Preserve all IDs and `data-*` hooks used by legacy `app.js`; collapsed controls stay mounted so event listeners remain valid.

## Verification

- `git diff --check`: passed.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: app loaded with no console errors.
- Browser smoke: confirmed there are no sidebar move or toolbar move buttons.
- Browser smoke: confirmed the timeline title, date range, and Fit button render in the top bar above the action dock and viewport.
- Browser smoke: confirmed the old visible `Tools` label is gone and the dock uses a compact `Actions` label.
- Browser smoke: collapsed/expanded the editor sidebar and timeline toolbar with animated chevron icon states.
- Browser smoke: reloaded and confirmed collapse preferences persisted.
- Browser smoke: created an event, entered `2026-02-03`, applied the item form, and clicked Save JSON; status changed to `JSON saved`.
- Browser smoke: 390px mobile viewport had no horizontal overflow; sidebar and toolbar remained usable.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add collapsible layout panels`

## Next Safe Step

Review the new layout in the browser. If accepted, continue visual polish on control density and icons without changing legacy DOM hooks.
