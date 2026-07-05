# Handoff

## Current Goal

Move live timeline editor state ownership toward ADR 0009 feature and reducer boundaries without changing local JSON behavior.

## Last Completed Work

- Added capped undo/redo history for the latest 25 timeline-changing actions.
- Wired `Ctrl`/`Command+Z` and `Ctrl`/`Command+Y` to the same live history model.
- Added toolbar and context-menu undo/redo actions with disabled states driven by the actual undo/redo stacks.
- Restored the previous selection during undo and redo, and cleared `Unsaved changes` automatically when the saved snapshot is reached.
- Swapped the undo and redo icons to `UndoOutlined` and `RedoOutlined`.

## Files Changed

- `src/features/timeline-editor/history.ts`
- `src/features/timeline-editor/history.test.js`
- `src/features/timeline-editor/interactions/keyboardShortcuts.ts`
- `src/features/timeline-editor/interactions/keyboardShortcuts.test.js`
- `src/features/timeline-editor/interactions/contextMenu.ts`
- `src/features/timeline-editor/interactions/contextMenu.test.js`
- `src/features/timeline-editor/components/TimelineToolbar.tsx`
- `src/features/timeline-editor/components/TimelineContextMenu.tsx`
- `src/features/timeline-editor/legacyTimelineEditor.js`
- `docs/product.md`
- `CHANGELOG.md`

## Checks Run

- `npm test` passed with 109 tests.
- `node --check src/features/timeline-editor/legacyTimelineEditor.js`
- `npm run typecheck`
- `npm run build` passed with the existing Vite large chunk warning.
- `git diff --check`
- Browser smoke through Vite at `http://127.0.0.1:8767/`: toolbar undo/redo buttons started disabled, adding Event enabled undo, the context menu showed undo enabled and redo disabled, context-menu Undo removed the item and hid `Unsaved changes`, toolbar Redo restored the item, and browser logs had no warnings or errors.

## Known Issues

- Undo/redo history and most live interactions still live in `src/features/timeline-editor/legacyTimelineEditor.js`.
- No automated browser test harness exists yet.
- The central-axis renderer still needs more real-data smoke after future state-migration slices.

## Uncommitted Work

- `docs/plan.md`
- `docs/handoff.md`

## Suggested Commit Message

`docs: trim closeout plan and handoff`

## Next Safe Step

- Browser-smoke undo/redo against real loaded timelines, especially note and marker drag, lane reorder, and save/load boundaries.
- Then move the history-aware state boundary out of `src/features/timeline-editor/legacyTimelineEditor.js` into the ADR 0009 reducer/context path without breaking current DOM IDs.
