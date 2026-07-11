# Plan

## Current Goal

Continue the ADR 0009 migration by moving undo/redo history ownership into the reducer-managed editor state.

## Current Slice

- Add reducer-level history state and undo/redo/save actions without changing current user-visible behavior.
- Reuse the tested 25-entry history primitives from `history.ts`.
- Keep the legacy controller bridge operational until reducer history behavior is fully covered.

## Next

- Establish RED reducer tests for undo, redo, selection restoration, saved-state dirty tracking, and redo invalidation after a new edit.

## Risks

- Avoid running reducer and legacy histories as competing sources of truth during the migration.

## Latest Verification

- `npm test` passed 113 tests.
- `node --check src/features/timeline-editor/legacyTimelineEditor.js` passed.
- `npm run typecheck` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke passed for symmetric grow/shrink behavior, immediate full-height band updates, centered scrolling, directional note overflow, and console errors.
