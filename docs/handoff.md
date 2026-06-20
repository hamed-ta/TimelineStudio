# Handoff

## Current Goal

Add live age and duration context from birthdate items.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Timeline items now include a birth type for a person's birthdate. Birth items render as prominent vertical all-line markers, ignore lane assignment, and can be created from the toolbar or item type selector.

The earliest birth item is used as the source date for live age calculations. Hovering the timeline shows a floating age readout for the hovered date.

Timeline items now include a note type for point annotations. Notes render with an anchor point, straight arrow leader, and rounded text balloon below all timeline lines, use a single date, and stay lane-bound.

Event markers now use a richer visual treatment with a gradient fill, shadow, beveled edge, and small highlight so they read as distinct point events rather than flat dots.

Period bars now have a restrained color background and light shadow. The radius is moderate to avoid a fully rounded pill look.

Wide period bars can show derived labels for age at the start, age at the end, and period duration. Period label settings are saved, but the generated age and duration text is calculated live from dates.

The app now tracks a current JSON file when the browser grants a File System Access handle from loading or saving. Save and `Ctrl+S` / `Command+S` write to that handle when available. Browsers without writable file-handle access still download a JSON copy and the header labels that state as a copy.

The main header shows the current file/copy state and an unsaved changes indicator. Timeline data mutations mark the document dirty; saving or loading clears the indicator.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`f01e13a feat: add birthdate timeline items`

## Work Completed This Session

- Added product acceptance scenarios for hover age and period age/duration labels.
- Added live age hover readout from the earliest birth item.
- Added saved period display toggles for age labels and duration labels.
- Added wide-period derived labels for start age, duration, and end age.
- Kept generated age and duration text out of saved JSON; only dates and display preferences are saved.
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

- Use the earliest `birth` item as the active age source if multiple birth items exist.
- Save per-period display toggles (`showAgeLabels`, `showDurationLabel`) because they are user settings.
- Do not save generated age or duration label text; calculate it during render and hover.
- Only draw period-derived labels when the period is wide enough to avoid crowding the title.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: clicked Birth in the toolbar.
- Browser smoke: one selected `.item-birth` rendered with one `.birth-line`, label `Birthdate`, disabled lane input, dirty indicator visible, status `Birthdate added`, and no console errors.
- Browser smoke: created a birth item on `2026-01-01` and a period from `2026-01-01` to `2026-06-20`.
- Browser smoke: the selected period showed derived labels `Age 0d`, `5m 19d`, and `Age 5m 19d`.
- Browser smoke: moving over the timeline showed hover text `Age 3m 10d on Apr 11, 2026`, and no console errors were reported.

## Open Issues

- No automated browser test harness exists yet.
- Hover chip and period labels may need visual tuning after testing with a real personal timeline.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: show age and duration context`

## Next Safe Step

Review the birth/age UI with a real JSON file, then tune label thresholds or placement if needed.
