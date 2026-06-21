# Changelog

All notable project changes should be recorded here.

This project follows semantic versioning. The current package version is `0.2.0`.

## Unreleased

No unreleased changes yet.

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
- Made the release workflow skip an already uploaded release zip on reruns so immutable GitHub Release assets do not fail a rerun.
- Added versioning and changelog guidance.
- Added dependency policy guidance for justified feature and architecture dependencies.
- Documented the Ant Design UI system decision in ADR 0007.
- Documented the GitHub Pages release deployment decision in ADR 0008.
