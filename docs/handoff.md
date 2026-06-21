# Handoff

## Current Goal

Add GitHub Actions CI, tag-based GitHub Pages deployment, and release creation.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

Typography now uses a dependency-free modern sans-serif stack that prefers Persian-capable fonts (`Vazirmatn`, `Noto Sans Arabic`) before system UI fallbacks. App UI and SVG timeline labels share the same font family, and UI font sizes use a small rem-based scale.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

ADR 0007 accepts Ant Design as the app UI system. The React shell now uses `antd` for app cards, buttons, inputs, and light/dark theme algorithms, plus `@ant-design/icons` for toolbar and menu iconography. Native bridge controls remain where the legacy `app.js` controller still requires exact DOM behavior, such as real `select`, `range`, and hidden compatibility inputs.

ADR 0008 accepts GitHub Pages as the first public deployment path. CI validates branch pushes and pull requests. Version tags such as `v0.2.0` build the Vite app, deploy `dist` to GitHub Pages, and create or update a GitHub Release from the matching `CHANGELOG.md` section.

The React shell now owns UI layout preferences for editor sidebar collapse and timeline toolbar collapse. These preferences are stored in browser local storage and do not affect timeline JSON.

Timeline lines can now be reordered from the editor sidebar or from the timeline label area. Items assigned to a line move with that line. Lines can be removed after confirmation; items on the removed line are deleted and lower lines shift upward.

Line rename, background color, add, and remove controls now live in the timeline label area. Right-clicking or pressing Enter on a line label opens the line editor popover. The old Rows / Lines sidebar section has been removed. The timeline has one add-line control below the last line instead of a plus control on every line.

Timeline items now include a marker type for global reference dates. Markers render as vertical lines across all visible timeline lines, use a single date, ignore lane assignment, and are available from the toolbar and item type selector.

Timeline items now include a birth type for a person's birthdate. Birth items render as prominent vertical all-line markers, place their label on the left side of the birthdate line when possible, ignore lane assignment, and can be created from the toolbar or item type selector.

The earliest birth item is used as the source date for live age calculations. Hovering the timeline updates a fixed info panel below the timeline with the hovered Gregorian date, Iranian date, and calculated age without moving the timeline viewport.

Selecting a timeline item updates the same info panel with the item type, title, date details, duration when applicable, line context, and age context when a birth item exists. Selection details are split into short rows instead of one dense metadata sentence.

The timeline viewport sizes to the rendered SVG content height for the axis, visible lines, footer spacing, and note area. It no longer stretches vertically just because the workspace has extra unused height.

Timeline month and day labels adapt to available horizontal space. Month labels stack Gregorian and Iranian names when there is room, fall back to compact Gregorian labels when space is tighter, and skip labels that would collide. Day labels are centered in their day cells and skipped when they would collide.

Fit now respects a readable zoom floor. Short timelines still fit into the viewport, while long timelines reset to the beginning at the minimum readable zoom instead of compressing every item into an unreadable view.

Lane-bound items snap to nearby same-line item edges while dragging or resizing. Range items on the same line are prevented from overlapping during those drag interactions.

The item editor and line editor use a shared dependency-free color picker with a saturation/value plane, hue slider, hex entry, and the curated preset palette. Item colors remain required `#RRGGBB` values. Line background colors are optional and save as `settings.laneColors` entries, preserving compatibility with older JSON that has no line colors.

The timeline has a custom context menu for item commands. Right-clicking the timeline shows Add, Copy, Paste, Duplicate, Lock item or Unlock item, Delete, Zoom in, Zoom out, and Fit. The Add submenu is closed by default and opens after choosing Add, then exposes Birth, Event, Marker, Note, Period, Line, and Text item types; created items use the clicked date and clicked line where applicable. Copy and paste use an in-app item clipboard. Keyboard shortcuts support `Ctrl`/`Command+C`, `Ctrl`/`Command+V`, `Ctrl`/`Command+D`, `Delete`/`Backspace`, `Ctrl`/`Command+Shift+L`, `+`, and `-` when focus is not in an editor field.

Timeline items now have an optional `locked` flag. Old JSON without this field still loads with items unlocked. The top toolbar lock icon is now labeled as read-only mode; turning it on makes item content read-only while preserving selection, copy, pan, zoom, and the ability to turn read-only off. Individual item locking keeps one item selectable and copyable but blocks editing, dragging, resizing, duplicating, and deleting for that item.

The timeline toolbar uses Ant Design buttons and icons with distinct accent colors. Create, file, and export actions are visually grouped with visible group titles and separators, and item locking is a dedicated icon toggle in the toolbar header instead of a checkbox in the action row.

The editor sidebar and action toolbar collapse controls use panel-specific open/close icons instead of generic chevrons. The lock toggle and context menu lock actions use keyhole lock icons.

Zoom controls now use Ant Design icons. Manual zoom-out, wheel zoom-out, Fit, and context-menu zoom-out all respect the same readable `18 px/month` minimum.

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

`c1f998b feat: adopt ant design shell`

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
- Added colored Ant Design icons to toolbar actions.
- Replaced the toolbar lock checkbox with a dedicated lock/unlock icon toggle in the toolbar header.
- Added icons to context menu actions and added context menu Zoom in, Zoom out, and Fit commands.
- Added plus and minus zoom shortcuts outside editor fields.
- Raised the global minimum zoom to the readable `18 px/month` floor.
- Added a centered empty timeline state and ensured short timeline SVGs fill the viewport width.
- Removed the beveled square treatment around toolbar and lock-toggle icons while keeping colored icon strokes.
- Replaced sidebar and toolbar collapse chevrons with panel open/close icons.
- Replaced lock/unlock icons with keyhole lock variants in the toolbar header and context menu.
- Centered toolbar, zoom, panel, lock, and context-menu SVG icons by using grid-centered icon buttons and block-level SVG layout.
- Added a Persian-capable modern sans-serif font stack without adding a font dependency.
- Added a small rem-based UI type scale and timeline SVG text scale.
- Normalized scattered UI and timeline font sizes onto those tokens.
- Standardized odd intermediate font weights to common values like 500, 600, 700, and 800.
- Applied the shared font stack to the timeline SVG labels.
- Removed the old Rows / Lines editor sidebar section.
- Added timeline-label line editing with rename, background color, add-below, and remove actions.
- Replaced per-line plus controls with one add-line control below the last line.
- Added optional `settings.laneColors` normalization for saved JSON compatibility.
- Replaced native color inputs with a shared item/line color picker using a color plane, hue slider, hex input, and preset swatches.
- Made color picker panels flip upward when there is not enough viewport space below the trigger.
- Added an Add submenu to the timeline context menu with every item type, closed by default until Add is chosen.
- Added context-menu item creation at the clicked date and clicked line.
- Added per-item lock and unlock commands.
- Added an optional `locked` item field with backwards-compatible normalization.
- Renamed the top toolbar all-items lock control to read-only mode and removed it from the context menu.
- Updated product notes, changelog, plan, and handoff docs.
- Added ADR 0007 for the Ant Design UI system decision.
- Installed `antd` and `@ant-design/icons`, and removed `lucide-react`.
- Wrapped the React app in Ant Design `ConfigProvider` with light/dark theme algorithms.
- Imported Ant Design reset CSS before the app stylesheet.
- Migrated header, timeline context controls, editor panels, toolbar buttons, file/export actions, read-only toggle, line editor actions, context menu actions, and text inputs to Ant Design components where compatible with legacy DOM bindings.
- Updated theme CSS tokens to Ant-aligned blue, neutral, and dark-mode palettes.
- Kept native bridge controls for legacy-bound selects, range inputs, checkboxes, and hidden fields.
- Updated product notes, changelog, plan, and handoff docs for the Ant Design migration.
- Added CI validation workflow for branch pushes, pull requests, and manual runs.
- Added tag-based release workflow that validates the tag against `package.json`, extracts matching changelog notes, builds the app, deploys to GitHub Pages, and creates or updates a GitHub Release with a zipped `dist` artifact.
- Added `scripts/extract-release-notes.mjs` for deterministic release notes extraction.
- Made Vite's `base` configurable through `VITE_BASE_PATH` so GitHub Pages project URLs work while local builds still use `/`.
- Documented exact version bump, changelog, tag, push, manual workflow, and first-time GitHub Pages setup commands.
- Added ADR 0008 for GitHub Pages release deployment.
- Refreshed `README.md` with project features, development, deployment, release, docs, and license sections.
- Added an MIT `LICENSE` file and package license metadata.
- Adjusted GitHub Pages documentation and verification notes for the renamed `TimelineStudio` repository.

## Files Changed

- `CHANGELOG.md`
- `LICENSE`
- `README.md`
- `docs/adr/0007-ant-design-ui-system.md`
- `docs/adr/0008-github-pages-release-deployment.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `docs/versioning.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `package.json`
- `package-lock.json`
- `scripts/extract-release-notes.mjs`
- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`
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
- Keep the color picker dependency-free for now, but use a custom shared picker instead of the weak native color input UI.
- Store line background colors as an optional `laneColors` array parallel to `laneLabels`, padding or truncating it during normalization for older saved JSON.
- Use one add-line control below the last visible line, not one control per line.
- Use modern Tailwind-style saturated hues for the first palette: red, orange, amber, green, teal, sky, blue, indigo, violet, and pink.
- Keep context-menu copy/paste in-app for now rather than using the OS clipboard, avoiding browser permissions and preserving full item structure.
- Keep read-only mode as a top toolbar icon, not a context-menu command.
- Treat Lock item and Unlock item as per-item protection; locked items remain selectable and copyable.
- Ignore item command shortcuts while focus is in editor inputs, selects, textareas, or editable content.
- Use Ant Design as the shared UI system instead of mixing MUI, Ant, Lucide, and other unrelated UI libraries.
- Use `@ant-design/icons` for toolbar and context-menu iconography.
- Keep native bridge controls only where the legacy controller requires native element value, checked, or change-event behavior.
- Keep the custom SVG timeline, color picker, and context menu controller for now; migrate those to Ant popover/menu controls only after the interaction state is React-owned.
- Use keyhole lock icons for item lock state so the toolbar and context menu share the same lock metaphor.
- Keep create-item actions first, followed by file actions, then export actions.
- Keep the hidden lock checkbox only as a compatibility bridge for existing legacy `app.js` state syncing.
- Keep `18 px/month` as both the Fit readability floor and the global manual zoom minimum.
- Keep the empty-state overlay non-interactive so it does not block panning, context menus, or item creation.
- Keep typography dependency-free for now; prefer locally available Persian-capable fonts and system fallbacks instead of adding a web font package or CDN font.
- Put `Vazirmatn` and `Noto Sans Arabic` first in the font stack because they support Persian text better than Latin-first UI fonts.
- Use rem-based UI size tokens for controls, labels, panels, context menus, and info text.
- Use normal branch CI for validation only; deploy and create GitHub Releases only from explicit semver tags.
- Require release tags to match `package.json` version and a matching `CHANGELOG.md` version section.
- Keep GitHub Pages as the first hosting target; revisit Firebase Hosting when Firebase Auth and Firestore are added.

## Verification

- RED/documented: versioning docs now require tag-based releases, matching changelog headings, GitHub Pages setup, and manual workflow support.
- `node --check app.js`: passed.
- `node --check scripts/extract-release-notes.mjs`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed. Vite still reports the expected Ant Design chunk-size warning.
- `VITE_BASE_PATH=/TimelineStudio/ npm run build`: passed, verifying the GitHub Pages project base path build for the renamed repository.
- RED/documented: product scenario now requires the app shell to use Ant Design components, icons, theme tokens, and light/dark styling while preserving legacy DOM IDs and timeline behavior.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed. Vite reported a chunk-size warning after adding Ant Design; this is expected for the first design-system slice and should be reviewed later.
- Browser smoke through Vite at `http://127.0.0.1:8767/`: initial DOM had 2 Ant cards, 46 Ant buttons, 12 Ant toolbar buttons, 11 Ant inputs, and all required legacy IDs including save/load/export, fit, zoom, read-only, timeline viewport, context menu, and native bridge selects.
- Browser smoke: theme button switched from System to Light and then to Dark, updating `data-theme` and `data-resolved-theme` without changing timeline data.
- Browser smoke: Add Event from the Ant toolbar created `New event`, selected it, and kept the selected item editor as an Ant input with the original `itemTitleInput` ID.
- Browser smoke: the Ant read-only button toggled `aria-pressed`, disabled item editing and duplicate controls, applied the locked viewport class, and toggled back off.
- Browser smoke: context menu opened with Ant buttons, Add submenu was closed by default, old Lock all / Unlock all actions were absent, opening Add showed Birth/Event/Marker/Note/Period/Line/Text, and choosing Period created `New period`.
- Browser smoke: no console warnings or errors were reported for the Ant shell checks.
- RED/documented: product scenarios now require context-menu Add submenu creation, individual item locking, and toolbar-only read-only mode.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: right-clicking the timeline showed Add with the submenu closed by default (`display: none`, `aria-expanded=false`), with no Lock all or Unlock all context-menu actions.
- Browser smoke: clicking Add opened the submenu (`display: block`, `aria-expanded=true`), and choosing Event created `New event` at the clicked date on Line 2.
- Browser smoke: locking the selected period set the SVG group class to `item item-period locked selected`, changed the selection label to `Locked - Period: New period - Line 2`, and disabled sidebar title, duplicate, and delete controls.
- Browser smoke: reopening the context menu on the locked period hid Lock item, showed Unlock item, kept Copy enabled, and disabled Duplicate and Delete.
- Browser smoke: unlocking the selected period restored normal selection text, removed the locked class, and re-enabled item editing, duplicate, and delete controls.
- Browser smoke: the top toolbar Read only icon turned read-only on, updated title/label to `Turn off read only`, disabled Add submenu items, Paste, Duplicate, Delete, and item form editing, kept Copy enabled, and kept Lock all / Unlock all out of the context menu.
- Browser smoke: clicking the top toolbar icon again turned read-only off, restored title/label to `Read only`, removed the locked viewport class, and restored item editing, duplicate, and delete controls.
- Browser smoke: no console warnings or errors were reported for context-menu add and lock flows.
- RED/documented: product scenarios now require line editing from timeline labels, one add-line control below the last line, and a shared item/line color picker with presets, hue/saturation controls, and hex entry.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: initial DOM had exactly one `[data-timeline-lane-add]`, no per-line add controls, no Rows / Lines sidebar panel, and both picker panels hidden.
- Browser smoke: adding an event and choosing the Pink preset from the item picker set `#itemColorInput` to `#ec4899`, showed `#EC4899`, activated one swatch, marked the document dirty, and showed `Item color updated`.
- Browser smoke: right-clicking the first line label opened the line editor; opening its color picker flipped the panel upward within the viewport and choosing Teal set `#lineColorInput` to `#14b8a6`, activated one swatch, rendered one `.lane-background`, and showed `Line color updated`.
- Browser smoke: Clear color emptied `#lineColorInput`, showed `No color`, removed lane backgrounds, and showed `Line color cleared`.
- Browser smoke: with the line editor closed, the single add-line control appended `Line 6` while keeping one add-line control and no per-line add controls.
- Browser smoke in a fresh local tab: app loaded with one item picker trigger, one line picker trigger, one add-line control, no Rows / Lines sidebar panel, and no console warnings or errors.
- Browser smoke: opening the item color picker in the left sidebar rendered it as a fixed overlay fully inside the viewport (`left 29`, `right 333`, viewport width `1280`) while extending past the sidebar boundary instead of being clipped.
- Browser smoke: clicking the Teal swatch after the fixed-overlay change set the item color to `#14b8a6`, activated one swatch, showed `Item color updated`, and produced no console warnings or errors.
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
- Browser smoke: every visible toolbar action rendered one icon.
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
- Browser smoke: Fit, Zoom in, and Zoom out controls each rendered recognizable icons.
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
- RED: the previous typography used an Inter-first stack without Persian-capable fonts up front and scattered one-off font sizes.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8766/`: body computed the Persian-capable stack `Vazirmatn, Noto Sans Arabic, Noto Sans, ...`.
- Browser smoke: body text computed to `14px` with `21px` line height, toolbar buttons to `14px`, labels and the info panel to `12px`.
- Browser smoke: `#timelineSvg` inherited the same Persian-capable font stack.
- Browser smoke: timeline SVG axis labels rendered with normalized sizes (`13px` year label, `12px` Iranian/lane labels).
- Browser smoke: a temporary Persian SVG label `تست فارسی` rendered with the same font stack and `13px` timeline label size, then the tab was reset to empty.
- Browser smoke: no console warnings or errors were reported for typography verification.

## Open Issues

- No automated browser test harness exists yet.
- Timeline info panel and period labels may need visual tuning after testing with a real personal timeline.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`feat: add context menu creation and item locks`

## Next Safe Step

Review the context-menu Add submenu and item/global lock behavior in the real UI, then commit if acceptable.
