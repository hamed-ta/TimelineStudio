# Handoff

## Current Goal

Improve the timeline toolbar, context menu, zoom controls, and empty timeline presentation.

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

The item editor now includes an 18-color preset palette next to the custom color input. Selecting a swatch updates the selected item color immediately, and new items start with a random palette color.

The timeline has a custom context menu for item commands. Right-clicking an item selects it and shows Copy, Paste, Duplicate, Lock Items or Unlock Items, Delete, Zoom in, Zoom out, and Fit. Copy and paste use an in-app item clipboard. Keyboard shortcuts support `Ctrl`/`Command+C`, `Ctrl`/`Command+V`, `Ctrl`/`Command+D`, `Delete`/`Backspace`, `Ctrl`/`Command+Shift+L`, `+`, and `-` when focus is not in an editor field.

The timeline toolbar uses existing `lucide-react` icons with distinct accent colors. Create, file, and export actions are visually grouped with visible group titles and separators, and item locking is a dedicated icon toggle in the toolbar header instead of a checkbox in the action row.

The editor sidebar and action toolbar collapse controls use panel-specific open/close icons instead of generic chevrons. The lock toggle and context menu lock actions use keyhole lock icons.

Zoom controls now use Lucide icons. Manual zoom-out, wheel zoom-out, Fit, and context-menu zoom-out all respect the same readable `18 px/month` minimum.

Empty timelines show a centered non-interactive empty state overlay, and the timeline SVG/grid expands to at least the visible viewport width so the empty canvas does not look pushed to one side.

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

`7ab83db feat: add timeline context menu commands`

## Work Completed This Session

- Moved the birth item label to the left side of the vertical line with a small left-edge clamp.
- Changed the hover age readout from a cursor-following tooltip to a fixed timeline info panel below the timeline.
- Added selected-item date, duration, line, and age context to the timeline info panel.
- Split selected item context into separate readable rows and softened the secondary text weight.
- Sized the timeline viewport to the rendered timeline content instead of unused workspace height.
- Made month and day axis labels adaptive so crowded timelines avoid overlapping date text.
- Prevented Fit from zooming out below the readable zoom floor on long timelines.
- Added same-line item edge snapping and overlap prevention for lane-bound range items.
- Added a curated item color palette beside the custom color input.
- Changed new item creation to use a random palette color instead of a fixed type color.
- Added a custom context menu for selected timeline item commands.
- Added an in-app item clipboard for copy and paste.
- Added keyboard shortcuts for copy, paste, duplicate, delete, and lock/unlock.
- Expanded the preset item color palette from 10 to 18 colors.
- Reordered and grouped toolbar actions into create, file, and export groups with visible titles and separators.
- Added colored Lucide icons to toolbar actions.
- Replaced the toolbar lock checkbox with a dedicated lock/unlock icon toggle in the toolbar header.
- Added icons to context menu actions and added context menu Zoom in, Zoom out, and Fit commands.
- Added plus and minus zoom shortcuts outside editor fields.
- Raised the global minimum zoom to the readable `18 px/month` floor.
- Added a centered empty timeline state and ensured short timeline SVGs fill the viewport width.
- Removed the beveled square treatment around toolbar and lock-toggle icons while keeping colored icon strokes.
- Replaced sidebar and toolbar collapse chevrons with panel open/close icons.
- Replaced lock/unlock icons with keyhole lock variants in the toolbar header and context menu.
- Centered toolbar, zoom, panel, lock, and context-menu SVG icons by using grid-centered icon buttons and block-level SVG layout.
- Updated product notes, changelog, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `app.js`
- `src/App.tsx`
- `src/timeline/model.ts`
- `styles.css`

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
- Keep the color picker dependency-free with native color input plus curated swatches.
- Use modern Tailwind-style saturated hues for the first palette: red, orange, amber, green, teal, sky, blue, indigo, violet, and pink.
- Keep context-menu copy/paste in-app for now rather than using the OS clipboard, avoiding browser permissions and preserving full item structure.
- Treat Lock Items and Unlock Items as commands for the existing global item-lock setting, not as per-item lock state.
- Ignore item command shortcuts while focus is in editor inputs, selects, textareas, or editable content.
- Reuse `lucide-react` for toolbar iconography instead of adding Font Awesome or another icon dependency.
- Use colored Lucide icons instead of adding a multicolor icon dependency.
- Use panel-specific Lucide icons for panel collapse and expand controls so the icon communicates the affected area.
- Use keyhole lock icons for item lock state so the toolbar and context menu share the same lock metaphor.
- Keep create-item actions first, followed by file actions, then export actions.
- Keep the hidden lock checkbox only as a compatibility bridge for existing legacy `app.js` state syncing.
- Keep `18 px/month` as both the Fit readability floor and the global manual zoom minimum.
- Keep the empty-state overlay non-interactive so it does not block panning, context menus, or item creation.

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
- RED: the previous item editor only had a native color input, no preset palette group, and new items used the fixed `TYPE_COLORS[type]` default.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: palette rendered 10 preset swatches, all disabled before an item was selected.
- Browser smoke: adding a new event assigned `#8b5cf6` from the palette and activated its matching swatch.
- Browser smoke: clicking the blue swatch changed the selected item color to `#3b82f6`, activated that swatch, marked the document dirty, and showed `Item color updated`.
- Browser smoke: entering custom color `#111827` kept the custom color value and left no preset swatch active.
- Browser smoke: adding a new period assigned `#ec4899` from the palette and activated its matching swatch.
- Browser smoke: no console warnings or errors were reported for color palette interactions.
- RED: the previous app had no custom `contextmenu` handler or menu DOM, and shortcuts only covered save plus timeline-focused delete.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: right-clicking an event selected it and opened the context menu.
- Browser smoke: menu state showed Copy, Duplicate, Lock Items, and Delete enabled; Paste disabled before copying; Unlock Items hidden while items were unlocked.
- Browser smoke: menu Copy set status `Item copied`; menu Paste added a copy with a new item ID and selected `Event: New event copy - Line 3`.
- Browser smoke: `Ctrl`/`Command+C` copied the selected item and `Ctrl`/`Command+V` pasted a copy with a new item ID.
- Browser smoke: menu Lock Items set `itemsLocked` true and applied the locked viewport class; reopening the menu showed Unlock Items instead of Lock Items.
- Browser smoke: menu Unlock Items restored `itemsLocked` false and removed the locked viewport class.
- Browser smoke: `Ctrl`/`Command+D` duplicated the selected item with a new item ID.
- Browser smoke: `Ctrl`/`Command+Shift+L` toggled item locking on and off.
- Browser smoke: `Delete` removed the selected test item; browser automation did not expose the confirm dialog before handling it.
- Browser smoke: no console warnings or errors were reported for context menu interactions.
- RED: the previous toolbar used text-only buttons in one row, mixed the lock checkbox into the action buttons, and the palette had only 10 presets.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: toolbar rendered three groups with visible titles `Create`, `File`, and `Export`.
- Browser smoke: Create and File groups showed `1px` right separators, and the final Export group had no trailing separator.
- Browser smoke: every visible toolbar action rendered one Lucide SVG icon.
- Browser smoke: item lock is now an icon button in the toolbar header; the legacy checkbox is hidden.
- Browser smoke: clicking the lock icon set `itemsLocked` true, updated `aria-pressed` to `true`, changed the title to `Unlock items`, and applied the locked viewport class.
- Browser smoke: clicking the lock icon again restored `itemsLocked` false, `aria-pressed` false, title `Lock items`, and removed the locked viewport class.
- Browser smoke: the item color palette rendered 18 preset colors, including warm, cool, accent, and neutral choices.
- Browser smoke: adding an event from the icon toolbar worked, and choosing the Slate preset set the selected item color to `#64748b`.
- Browser smoke: no console warnings or errors were reported for toolbar and palette interactions.
- RED: the previous manual zoom range still allowed `0.5 px/month`, zoom controls used text characters, the context menu had no zoom commands or icons, and empty timelines rendered as an unbalanced short SVG in a wide viewport.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: empty timeline rendered with the empty state visible, no timeline items, SVG width `911`, and viewport width `911`.
- Browser smoke: the empty-state panel was centered in the viewport (`dx` 0, `dy` 0).
- Browser smoke: toolbar action buttons rendered 12 colored icons for event, period, note, marker, birth, line, text, save, load, SVG, PNG, and PDF.
- Browser smoke: Fit, Zoom in, and Zoom out controls each rendered Lucide SVG icons.
- Browser smoke: repeated header Zoom out stopped at `18 px/month` and showed `Minimum readable zoom reached`.
- Browser smoke: the context menu exposed Zoom in, Zoom out, and Fit actions, each with one SVG icon.
- Browser smoke: context-menu Zoom out at the minimum stayed at `18 px/month`, and context-menu Zoom in moved to `38 px/month`.
- Browser smoke: pressing `-` zoomed out to `18 px/month`, and pressing `+` zoomed back to `38 px/month` when focus was not in an editor field.
- Browser smoke: opening the context menu on an empty timeline disabled copy, paste, duplicate, and delete while keeping zoom and lock commands available.
- Browser smoke: adding an event from the toolbar hid the empty state and removed the `is-empty` viewport class.
- Browser smoke: the live tab was reset to the empty state at `18 px/month`, and no console warnings or errors were reported.
- Polish check: toolbar and lock-toggle icons now render as colored strokes without internal beveled square backgrounds.
- `git diff --check`: passed after removing icon chip styling.
- `npm run build`: passed after removing icon chip styling.
- Polish check: icon-only buttons now grid-center their contents, and SVG icons render as block elements to avoid baseline offset.
- Browser smoke: Zoom out, Zoom in, sidebar collapse, lock, and toolbar collapse icon-only buttons measured centered (`dx` 0, `dy` 0).
- Browser smoke: every toolbar icon+label group measured centered in its button (`groupDx` 0, `groupDy` 0).

## Open Issues

- No automated browser test harness exists yet.
- Timeline info panel and period labels may need visual tuning after testing with a real personal timeline.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: improve timeline controls and empty state`

## Next Safe Step

Review the toolbar icons, context menu zoom actions, readable zoom floor, and empty timeline state in the real UI, then commit if acceptable.
