# Changelog

All notable project changes should be recorded here.

This project follows semantic versioning once releases begin. The current package version remains `0.1.0`.

## Unreleased

### Changed

- Migrated the app shell to Vite, React, and TypeScript while preserving legacy timeline behavior.
- Extracted timeline model, date, JSON, export, file, media, PDF, SVG export, and formatting helpers into typed modules.
- Updated the app theme with system, light, and dark UI theme controls.
- Added collapsible editor sidebar and timeline toolbar layout controls with modern panel icons.
- Moved the current timeline title, date range, and Fit action into the main app header.
- Added drag reordering and removal for timeline lines from the editor and timeline canvas.
- Added marker items that draw a vertical line across all timeline lines.
- Added note items with a leader arrow and text balloon.

### Documentation

- Added versioning and changelog guidance.
- Added dependency policy guidance for justified feature and architecture dependencies.
- Documented the `lucide-react` icon dependency decision for panel controls.
