# Handoff

## Current Goal

Add same-line item edge snapping.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Timeline items now include a birth type for a person's birthdate. Birth items render as prominent vertical all-line markers, place their label on the left side of the birthdate line when possible, ignore lane assignment, and can be created from the toolbar or item type selector.

The earliest birth item is used as the source date for live age calculations. Hovering the timeline updates a fixed info panel below the timeline with the hovered Gregorian date, Iranian date, and calculated age without moving the timeline viewport.

Selecting a timeline item updates the same info panel with the item type, title, date details, duration when applicable, line context, and age context when a birth item exists. Selection details are split into short rows instead of one dense metadata sentence.

The timeline viewport sizes to the rendered SVG content height for the axis, visible lines, footer spacing, and note area. It no longer stretches vertically just because the workspace has extra unused height.

Timeline month and day labels adapt to available horizontal space. Month labels stack Gregorian and Iranian names when there is room, fall back to compact Gregorian labels when space is tighter, and skip labels that would collide. Day labels are centered in their day cells and skipped when they would collide.

Fit now respects a readable zoom floor. Short timelines still fit into the viewport, while long timelines reset to the beginning at the minimum readable zoom instead of compressing every item into an unreadable view.

Lane-bound items snap to nearby same-line item edges while dragging or resizing. Range items on the same line are prevented from overlapping during those drag interactions.

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

`1396a63 fix: keep fit and axis labels readable`

## Work Completed This Session

- Moved the birth item label to the left side of the vertical line with a small left-edge clamp.
- Changed the hover age readout from a cursor-following tooltip to a fixed timeline info panel below the timeline.
- Added selected-item date, duration, line, and age context to the timeline info panel.
- Split selected item context into separate readable rows and softened the secondary text weight.
- Sized the timeline viewport to the rendered timeline content instead of unused workspace height.
- Made month and day axis labels adaptive so crowded timelines avoid overlapping date text.
- Prevented Fit from zooming out below the readable zoom floor on long timelines.
- Added same-line item edge snapping and overlap prevention for lane-bound range items.
- Updated product notes, changelog, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `app.js`

## Decisions

- Prefer left-side birth labels to avoid overlapping timeline items, which are usually to the right of the birthdate.
- Clamp the label to the canvas left edge so early birthdates stay visible.
- Keep age and selection feedback in a stable fixed-height panel so hover updates do not move the timeline viewport.
- Use separate selection rows for start date, end date, duration, and age so longer item details remain readable.
- Let the SVG's computed content height control the timeline viewport height; only notes add the extra note area.
- Keep all month and day grid lines, but only render axis label text when the measured label width fits without colliding with the previous visible label.
- Use the default zoom as the Fit readability floor, so Fit does not compress long timelines below `18 px/month`.
- Snap to same-line item start and end edges within a pixel-derived threshold, capped at `14` days.
- Treat only range items as overlap blockers so point annotations can still align with nearby edges.

## Verification

- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: clicked Birth in the toolbar.
- Browser smoke: the rendered birth label `Birthdate` was left of the birth line (`labelX` 189.29944762726132, `lineX` 275.0994476272613).
- Browser smoke: selected a period and the timeline info panel showed separate rows for `Period: New period - Line 1`, `Start: Mar 1, 2026 / 10 Esfand 1404`, `End: Apr 1, 2026 / 12 Farvardin 1405`, `Duration: 1 month`, and `Age: 0 days to 1 month`.
- Browser smoke: hovering the timeline updated the pointer panel to `Mar 18, 2026`, `27 Esfand 1404`, and `Age 17 days`.
- Browser smoke: hover updates did not move the timeline viewport and the panel stayed fixed at `132px` high with internal overflow.
- Browser smoke: the default 5-line timeline viewport matched the SVG content height (`clientHeight` 486, SVG height 486) with no vertical overflow.
- Browser smoke: adding a note increased the viewport only for the note area (`clientHeight` 562, SVG height 562) with no vertical overflow.
- Browser smoke: with range `1989-01-01` to `1990-01-01`, stacked month labels rendered 11 Gregorian and 11 Iranian labels with no measured overlaps.
- Browser smoke: at `42 px/month`, month labels rendered 10 compact labels and one stacked `Jul` / `Tir` label pair with no measured overlaps.
- Browser smoke: with range `1989-10-01` to `1990-01-25` at `300 px/month`, the axis rendered 46 day labels and 6 month labels with no measured overlaps across month or day labels.
- Browser smoke: with range `1987-01-01` to `2022-01-01`, clicking Fit set zoom to `18 px/month`, reset horizontal scroll to `0`, and showed status `Fit applied at readable zoom`.
- Browser smoke: with the default short range, clicking Fit still fit the timeline into the viewport at `110 px/month` and showed status `Fit applied`.
- Browser smoke: with day snap enabled, dragging a `Second` period close to the `First` period snapped `Second` to start on `2026-02-01`; the two periods had `0` px gap and no overlap.
- Browser smoke: dragging `Second` further into `First` kept the periods at `0` px gap with no overlap.
- Browser smoke: resizing `First` toward `Second` snapped `First` to end on `2026-03-01`; the two periods had `0` px gap and no overlap.
- Browser smoke: no console warnings or errors were reported.

## Open Issues

- No automated browser test harness exists yet.
- Timeline info panel and period labels may need visual tuning after testing with a real personal timeline.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: snap same-line item edges`

## Next Safe Step

Review same-line item edge snapping with a real JSON file, then commit if acceptable.
