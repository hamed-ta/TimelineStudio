# Plan

## Current Goal

Continue the ADR 0009 migration by moving undo/redo history ownership into the reducer-managed editor state.

## Completed

- Added Gregorian-only, dual-calendar, and secondary-only display using one optional secondary calendar: Persian / Solar Hijri, Islamic / Umm al-Qura, Hebrew, Buddhist, Japanese, or Indian / Saka.
- Preserved Gregorian ISO storage and calculations, existing Persian JSON compatibility, and non-mutating fallback for recognized calendars unsupported by the browser.

## Next

- Establish RED reducer tests for undo, redo, selection restoration, saved-state dirty tracking, and redo invalidation after a new edit.

## Risks

- Avoid running reducer and legacy histories as competing sources of truth during the migration.

## Latest Verification

- Final calendar-feature verification is recorded in `docs/handoff.md`.
