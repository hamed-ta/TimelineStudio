# Changelog

All notable project changes should be recorded here.

This project follows semantic versioning. The current package version is `0.3.0`.

## Unreleased

### Changed

- Configured engineering-skill guidance for GitHub Issues, default triage labels, and the single-context domain-document layout.
- Added one selectable secondary display calendar from Persian / Solar Hijri, Islamic / Umm al-Qura, Hebrew, Buddhist, Japanese, and Indian / Saka, with Gregorian-only, dual-calendar, and secondary-only timeline modes while preserving Gregorian ISO storage and calculations.
- Generalized timeline year/month boundaries, day values, grid lines, ticks, alternating bands, cursor dates, item details, previews, and exports to use the selected display calendars.
- Added defensive runtime support detection that preserves unsupported saved calendar selections while temporarily rendering Gregorian without dirtying the timeline.
- Fixed above-axis note and marker balloons being covered by the timeline cursor readout.
- Stabilized cursor-readout text in three fixed columns so changing date lengths do not recenter the full row.
- Reserved digit width in the cursor readout so single-digit values do not shift when they become double-digit values.
- Centered shorter rendered timelines vertically in the viewport and matched the default top and bottom timeline padding.
- Changed new timelines to six stable lines named `Line 1` through `Line 6` from top to bottom, kept names unchanged when lines move, fixed the clipped add-line control, and extended alternating time bands through the full visible canvas.
- Kept the timeline centered while its area grows or shrinks, rerendered alternating time bands immediately on viewport resize, and preserved one-sided canvas expansion for item callouts.
- Added capped undo/redo history for the latest 25 timeline-changing actions, including `Ctrl`/`Command+Z`, `Ctrl`/`Command+Y`, toolbar and context-menu actions, selection restoration, and automatic clearing of `Unsaved changes` when undo returns to the saved JSON state.
- Added page description, Open Graph, Twitter card, app name, and theme-color metadata so shared app links render better in chats, search, and social media.
- Allowed note balloons to be positioned above or below the central timeline with matching top or bottom tips.
- Changed marker titles into draggable callouts with leader arrows that can be moved above or below the central timeline.
- Let above-axis note balloons and marker callouts expand the scrollable timeline canvas upward instead of clamping to the top line.
- Changed marker callouts into resizable tipped balloons with dashed leaders that connect to the top or bottom end of the solid vertical marker line.
- Kept the note resize grip aligned to the balloon body when the note is positioned above the timeline.
- Replaced the bottom hover pointer details with a top timeline cursor readout and a thin full-height solid cursor guide.
- Improved marker and note balloon selection grips and made selected marker callouts use the same dashed balloon outline as notes.
- Changed the top cursor readout relative date to include years, months, and days when applicable.
- Unified note and marker balloon resize grips with the same transparent hit target and diagonal grip icon.
- Let the top cursor readout use the available timeline width so date and age details are not ellipsized when there is room.

## 0.3.0 - 2026-07-04

### Changed

- Improved note balloons with shaped bubble bodies, movable tips, dotted highlighted background leaders, separate balloon and text colors, multi-line text wrapping, automatic direction alignment, automatic vertical stacking at lower zoom levels, manual drag positioning from the balloon body, resizing, inline timeline text editing, a larger sidebar text editor, hidden note title controls, derived internal note titles, and simpler selection headings.
- Tightened note balloon padding and minimum resize limits, reduced the top tip size, and replaced the selected-note corner square with a smaller diagonal resize grip.
- Documented the modular React timeline editor architecture in ADR 0009, including reducer-owned editor state, feature-oriented folders, React item components, custom interaction hooks, and pure layout modules.
- Started the modular architecture migration by extracting the editable-shortcut guard into `features/timeline-editor/interactions` and adding a focused `npm test` command.
- Extracted same-line edge-snap primitives into `features/timeline-editor/interactions` with focused unit tests.
- Extracted the axis label collision helper into `features/timeline-editor/layout` with focused unit tests.
- Extracted note stacking collision helpers into `features/timeline-editor/layout` with focused unit tests.
- Extracted note bubble SVG path geometry into `features/timeline-editor/layout` with focused unit tests.
- Extracted note text wrapping, truncation, direction, and baseline helpers into `features/timeline-editor/layout` with focused unit tests.
- Extracted age and date-span formatting helpers into `timeline/dateSpans` with focused unit tests.
- Centralized timeline color parsing, normalization, readability, adjustment, RGB, and HSV helpers in `timeline/colors` with focused unit tests.
- Added the first tested `features/timeline-editor` reducer boundary for core timeline settings, item, line, selection, and clipboard state transitions.
- Moved the React app shell under `src/app` and the legacy editor runtime under `features/timeline-editor` so the entrypoint follows the feature-first source layout.
- Split the React app wrapper, app theme provider, and timeline editor shell into `src/app/providers` and `features/timeline-editor/TimelineEditor`.
- Extracted timeline editor bridge controls, panel toggle icons, toolbar buttons, and the timeline context menu into feature component files.
- Split `TimelineEditor` into named feature components for the header, sidebar, toolbar, canvas shell, line editor popover, and info panel.
- Moved PDF and SVG export helpers under `timeline/export` to match the feature-first source layout.
- Added timeline editor action creators, selectors, and a reducer-backed hook factory with focused selector tests.
- Extracted timeline coordinate, fit-zoom, snapping, and default-duration math into `features/timeline-editor/layout`.
- Moved the timeline SVG shell into `features/timeline-editor/canvas` to match the feature-first source layout.
- Moved persistent boolean UI preference state into a shared React hook.
- Extracted note item text, title, color, and sizing rules into `features/timeline-editor/items` with focused tests.
- Extracted timeline context-menu action state rules into `features/timeline-editor/interactions` with focused tests.
- Extracted period item derived age and duration metadata into `features/timeline-editor/items` with focused tests.
- Extracted SVG text fitting, width estimation, and safe ID helpers into `features/timeline-editor/canvas` with focused tests.
- Extracted drag-range clamping and same-line overlap prevention into `features/timeline-editor/interactions` with focused tests.
- Extracted timeline info-panel pointer and selection text into a feature view-model helper with focused tests.
- Changed the timeline canvas to use a central date axis with lanes alternating above and below it, central-axis default line labels, zoom-responsive ticks, subtle alternating month bands, and a hover guide from the cursor to the axis.
- Refined the central-axis canvas so dense day/month detail is hidden until readable, note leaders terminate at the central axis, and only the timeline viewport scrolls while the toolbar and info panel stay fixed.
- Added vertical timeline controls: `Ctrl`/`Command` + `Shift` + mouse wheel resizes line spacing, and `Ctrl`/`Command` + `Alt` + mouse wheel, a compact toolbar height control, or the timeline bottom drag handle resizes the timeline area height without changing timeline JSON.
- Restored `Ctrl`/`Command` + mouse wheel as horizontal timeline zoom.
- Replaced always-visible zoom and height sliders with compact toolbar controls that show the current value and reveal fixed overlay sliders only while adjusting.
- Reduced incremental zoom steps for wheel, keyboard, context-menu, and popover zoom controls.
- Added a collapsible timeline information panel and tightened header/action-toolbar spacing to give more vertical room to the canvas.
- Fixed legacy-bound text/date fields losing their displayed values on focus under Ant Design input wrappers, and preserved normal spaces while editing the timeline title.
- Moved read-only, Fit, zoom, height, and right-aligned theme controls into the action toolbar, removed the toolbar title/collapse row, and compressed the app header into a centered metadata line.
- Added saved display-calendar settings for Gregorian, Persian / Solar Hijri, or both, while keeping all stored timeline dates as Gregorian ISO values.
- Aligned central-axis year and month ticks to Persian / Solar Hijri boundaries when Persian / Solar Hijri is the only selected display calendar.
- Improved the timeline information panel so selection lane appears as its own detail line, expanded content avoids internal scrollbars, and the collapsed toggle no longer clips into the panel border.
- Optimized Persian-only and close-zoom axis rendering by caching Persian / Solar Hijri date parts, reducing long-range day-label density, and batching dense daily grid/tick SVG output into paths.
- Changed new empty timelines to open on a fitted one-year range from the same day last year through today.

### Fixed

- Restored the missing timeline date comparison import so the legacy renderer draws the timeline grid and loaded files again.
- Made timeline load errors distinguish invalid JSON from render failures after a valid parse.
- Aligned the selected note outline to the balloon shape, kept sidebar balloon text visible while editing, and centered note text more evenly within the balloon body.
- Made note inline editing easier to trigger, kept note selection visible for context menu actions, and angled note balloon tips toward slanted leader lines.
- Kept `Delete` and `Backspace` available for text editing inside timeline editor fields instead of deleting the selected item.
- Committed inline note text edits when clicking outside the balloon editor.
- Removed the browser focus outline from focusable SVG timeline items so right-clicking a note does not draw a large blue box around the note leader and balloon.
- Fixed central-axis line reordering so swapping below-axis lines does not move or reassign the above-axis line at the same visual boundary.

## 0.2.2 - 2026-06-27
- Improved note balloon layout and editing.

## 0.2.1 - 2026-06-21

### Fixed

- Removed the tracked macOS `.DS_Store` file from the repository; `.DS_Store` remains ignored.
- Made the release workflow skip an already uploaded release zip on reruns so immutable GitHub Release assets do not fail a rerun.
- Updated manual release dispatch so it can rebuild the selected main commit and replace the same-version release asset.

### Changed

- Added a compact footer that shows the app name and package version.

## 0.2.0 - 2026-06-21

### Changed

- Added GitHub Actions CI for branch validation and tag-based GitHub Pages release deployment.
- Added MIT license metadata and refreshed README project, development, deployment, release, and license documentation.
- Migrated the app shell to Vite, React, and TypeScript while preserving legacy timeline behavior.
- Extracted timeline model, date, JSON, export, file, media, PDF, SVG export, and formatting helpers into typed modules.
- Updated the app theme with system, light, and dark UI theme controls.
- Added collapsible editor sidebar and timeline toolbar layout controls with modern panel icons.
- Moved the current timeline title, date range, and Fit action into the main app header.
- Added drag reordering and removal for timeline lines from the editor and timeline canvas.
- Added marker items that draw a vertical line across all timeline lines.
- Added birth items that draw a prominent vertical birthdate line across all timeline lines.
- Added note items with a leader arrow and text balloon.
- Updated event markers with a beveled, glass-like visual treatment.
- Previewed softer period bar backgrounds with restrained color depth and light shadow.
- Added current-file save behavior where supported, an unsaved-changes indicator, and `Ctrl`/`Command` + `S` JSON saving.
- Added live age hover readouts and optional period age/duration labels derived from birth items.
- Moved birth item labels to the left side of the birthdate line to reduce overlap with later items.
- Changed the hover age readout from a cursor tooltip to a fixed timeline info panel with Gregorian date, Iranian date, and age context.
- Added selected-item details to the timeline info panel, including dates, duration, line, and age context where available.
- Simplified selected-item details into separate readable rows in the timeline info panel.
- Sized the timeline viewport to the rendered timeline content instead of stretching it to fill unused workspace height.
- Made timeline month and day labels adaptive so crowded zoom levels stack, simplify, or skip labels instead of overlapping.
- Prevented Fit from zooming out below a readable minimum on long timelines.
- Added same-line item edge snapping while dragging or resizing, with range overlap prevention.
- Added a curated item color palette with random palette colors for newly created items.
- Added a timeline context menu and keyboard shortcuts for item copy, paste, duplicate, delete, and item locking.
- Expanded the item color palette and reorganized the timeline toolbar with colored icons, action groups, and a lock toggle.
- Added colored context menu icons, context menu zoom commands, a readable manual zoom-out minimum, and an empty timeline state.
- Normalized app typography with a Persian-capable modern font stack and rem-based type scale.
- Moved line rename, background color, add, and remove controls into the timeline label area and replaced native color inputs with a shared item/line color picker.
- Added context-menu item creation and individual item locking alongside toolbar read-only mode.
- Adopted Ant Design for the React app shell, including Ant cards, buttons, inputs, icons, theme algorithms, and Ant-aligned light/dark color tokens.

### Documentation

- Documented the release and GitHub Pages deployment flow.
- Added contributing, security, and code of conduct documents for open source project readiness.
- Added versioning and changelog guidance.
- Added dependency policy guidance for justified feature and architecture dependencies.
- Documented the Ant Design UI system decision in ADR 0007.
- Documented the GitHub Pages release deployment decision in ADR 0008.
