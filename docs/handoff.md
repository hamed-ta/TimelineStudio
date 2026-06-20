# Handoff

## Current Goal

Add birthdate timeline support and live age/duration context.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Timeline items now include a birth type for a person's birthdate. Birth items render as prominent vertical all-line markers, ignore lane assignment, and can be created from the toolbar or item type selector.

Timeline items now include a note type for point annotations. Notes render with an anchor point, straight arrow leader, and rounded text balloon below all timeline lines, use a single date, and stay lane-bound.

Event markers now use a richer visual treatment with a gradient fill, shadow, beveled edge, and small highlight so they read as distinct point events rather than flat dots.

Period bars now have a restrained color background and light shadow. The radius is moderate to avoid a fully rounded pill look.

The app now tracks a current JSON file when the browser grants a File System Access handle from loading or saving. Save and `Ctrl+S` / `Command+S` write to that handle when available. Browsers without writable file-handle access still download a JSON copy and the header labels that state as a copy.

The main header shows the current file/copy state and an unsaved changes indicator. Timeline data mutations mark the document dirty; saving or loading clears the indicator.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`d921249 feat: improve local JSON save workflow`

## Work Completed This Session

- Added product acceptance scenario for birthdate items.
- Added saved `birth` item type to the timeline model.
- Added legacy `settings.birthDate` / `birthYear` migration into a birth item.
- Added Birth toolbar and item type options.
- Rendered birth items as prominent vertical all-line markers with export styles.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `app.js`
- `src/App.tsx`
- `src/timeline/model.ts`
- `src/timeline/svgExport.ts`
- `styles.css`

## Decisions

- Store the birthdate as a normal item (`type: "birth"`) instead of a timeline setting.
- Keep `birth` lane-independent like `marker`, with `lane` normalized to `0`.
- Migrate legacy `settings.birthDate` or `settings.birthYear` into one birth item when no birth item already exists.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: clicked Birth in the toolbar.
- Browser smoke: one selected `.item-birth` rendered with one `.birth-line`, label `Birthdate`, disabled lane input, dirty indicator visible, status `Birthdate added`, and no console errors.

## Open Issues

- No automated browser test harness exists yet.
- Live hover age readout and period-derived age/duration labels are still pending.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add birthdate timeline items`

## Next Safe Step

Add live age readout from the birth item and optional age/duration labels on period bars.
