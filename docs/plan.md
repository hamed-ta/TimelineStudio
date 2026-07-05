# Plan

## Current Goal

Move Timeline Studio toward the ADR 0009 React architecture while preserving current local JSON behavior.

## Current Slice

Stabilize the new undo/redo workflow, then move history-aware state ownership out of `src/features/timeline-editor/legacyTimelineEditor.js`.

## Next

- Browser-smoke undo/redo with real loaded timelines, especially note and marker drag, lane reorder, and save/load boundaries.
- Extract history-aware command and state handling from the legacy runtime into feature modules or reducer/context without changing required DOM IDs.
- Continue the item-by-item rendering migration after the state boundary is cleaner, starting with note and marker heavy behavior.

## Risks

- Undo/redo currently depends on every timeline-changing mutation path recording history inside `src/features/timeline-editor/legacyTimelineEditor.js`.
- No automated browser harness exists yet, so UI regression coverage is still manual.
- The central-axis renderer and most interactive behavior still live in the legacy runtime.

## Latest Verification

- `npm test`
- `node --check src/features/timeline-editor/legacyTimelineEditor.js`
- `npm run typecheck`
- `npm run build`
- Browser smoke at `http://127.0.0.1:8767/`: toolbar/context-menu undo/redo states behaved correctly, undo removed the added event and cleared `Unsaved changes`, and redo restored it.
