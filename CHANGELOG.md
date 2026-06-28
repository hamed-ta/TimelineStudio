# Changelog

All notable project changes should be recorded here.

This project follows semantic versioning. The current package version is `0.2.1`.

## Unreleased

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

### Fixed

- Aligned the selected note outline to the balloon shape, kept sidebar balloon text visible while editing, and centered note text more evenly within the balloon body.
- Made note inline editing easier to trigger, kept note selection visible for context menu actions, and angled note balloon tips toward slanted leader lines.
- Kept `Delete` and `Backspace` available for text editing inside timeline editor fields instead of deleting the selected item.
- Committed inline note text edits when clicking outside the balloon editor.
- Removed the browser focus outline from focusable SVG timeline items so right-clicking a note does not draw a large blue box around the note leader and balloon.

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
